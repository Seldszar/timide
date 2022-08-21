const Emittery = require('emittery');

class Timer extends Emittery {
	get running() {
		return this.state[0];
	}

	get time() {
		return this.getDelta(this.running);
	}

	constructor(options = {}) {
		super();

		this.direction = options.direction || 'up';
		this.state = options.state || [false, 0, 0];
		this.now = options.now || (() => Date.now());
	}

	update(state) {
		this.emit('state', (this.state = state));
	}

	start(resume) {
		this.update([true, this.now(), this.getDelta(resume)]);
	}

	stop() {
		this.update([false, this.now(), this.getDelta(true)]);
	}

	reset() {
		this.update([false, 0, 0]);
	}

	seek(time) {
		this.update([this.state[0], this.now(), time]);
	}

	getOrigin() {
		switch (this.direction) {
			case 'down':
				return this.state[1] - this.now();

			case 'up':
				return this.now() - this.state[1];

			default:
				return 0;
		}
	}

	getDelta(absolute) {
		return (absolute ? this.getOrigin() : 0) + this.state[2];
	}
}

module.exports = {Timer};
