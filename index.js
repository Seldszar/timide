const Emittery = require('emittery');

const intervals = new WeakMap();

function getTime(instance, absolute) {
	return (absolute ? Date.now() - instance.state[1] : 0) + instance.state[2];
}

function updateState(instance, state) {
	instance.state = state;

	dispatchState(instance);
	dispatchTime(instance);
}

function startTicker(instance) {
	if (instance.interval === Number.POSITIVE_INFINITY || intervals.has(instance)) {
		return;
	}

	const interval = setInterval(dispatchTime, instance.interval, instance);

	if (typeof interval === 'object') {
		interval.unref();
	}

	intervals.set(instance, interval);
}

function stopTicker(instance) {
	const interval = intervals.get(instance);

	if (interval) {
		clearInterval(interval);
	}

	intervals.delete(instance);
}

function toggleTicker(instance, state) {
	if (state[0] === instance.state[0]) {
		return;
	}

	(state[0] ? startTicker : stopTicker)(instance);
}

function dispatchState(instance) {
	instance.emit('state', instance.state);
}

function dispatchTime(instance) {
	instance.emit('time', instance.time);
}

class Timer extends Emittery {
	get running() {
		return this.state[0];
	}

	get time() {
		return getTime(this, this.running);
	}

	constructor(options = {}) {
		super();

		this.state = options.state || [false, 0, 0];
		this.interval = options.interval || 100;

		if (this.running) {
			startTicker(this);
		}
	}

	start(resume) {
		this.replaceState([true, Date.now(), getTime(this, resume)]);
	}

	stop() {
		this.replaceState([false, Date.now(), getTime(this, true)]);
	}

	reset() {
		this.replaceState([false, 0, 0]);
	}

	seek(time) {
		this.replaceState([this.running, Date.now(), time]);
	}

	replaceState(state) {
		toggleTicker(this, state);
		updateState(this, state);
	}
}

exports.Timer = Timer;
