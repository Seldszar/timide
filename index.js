const Emittery = require('emittery');

const intervals = new WeakMap();

function getOrigin(instance) {
	switch (instance.direction) {
		case 'down':
			return instance.state[1] - Date.now();

		case 'up':
			return Date.now() - instance.state[1];

		default:
			return 0;
	}
}

function getDelta(instance, absolute) {
	return (absolute ? getOrigin(instance) : 0) + instance.state[2];
}

function sameState(left, right) {
	return left.every((value, index) => value === right[index]);
}

function updateState(instance, state) {
	if (sameState(instance.state, state)) {
		return;
	}

	instance.state = state;

	dispatchState(instance);
	dispatchRunning(instance);
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

function dispatchRunning(instance) {
	instance.emit('running', instance.running);
}

function dispatchTime(instance) {
	instance.emit('time', instance.time);
}

class Timer extends Emittery {
	get running() {
		return this.state[0];
	}

	get time() {
		return getDelta(this, this.running);
	}

	constructor(options = {}) {
		super();

		this.direction = options.direction || 'up';
		this.state = options.state || [false, 0, 0];
		this.interval = options.interval || 100;

		if (this.running) {
			startTicker(this);
		}
	}

	start(resume) {
		this.replaceState([true, Date.now(), getDelta(this, resume)]);
	}

	stop() {
		this.replaceState([false, Date.now(), getDelta(this, true)]);
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
