const test = require('ava');
const sinon = require('sinon');

const {Timer} = require('.');

let clock;

test.beforeEach(() => {
	clock = sinon.useFakeTimers();
});

test.afterEach(() => {
	clock.restore();
});

test.serial('should create a timer', t => {
	const timer = new Timer();

	t.is(timer.running, false);
	t.is(timer.time, 0);
});

test.serial('should emit `state` when state updates', async t => {
	const timer = new Timer({
		state: [true, 0, 0],
	});

	const statePromise = new Promise(resolve => {
		timer.on('state', resolve);
	});

	timer.update([false, 0, 1000]);

	t.is(await statePromise, timer.state);
});

test.serial('should emit `state` when started', async t => {
	const timer = new Timer({
		interval: Number.POSITIVE_INFINITY,
	});

	const promise = new Promise(resolve => {
		timer.on('state', resolve);
	});

	timer.start();

	t.is(await promise, timer.state);
});

test.serial('should emit `state` when stopped', async t => {
	const timer = new Timer({
		state: [true, 0, 0],
	});

	const statePromise = new Promise(resolve => {
		timer.on('state', resolve);
	});

	timer.stop();

	t.is(await statePromise, timer.state);
});

test.serial('should increment by 1 second', t => {
	const timer = new Timer({
		state: [true, 0, 0],
	});

	clock.tick(1000);

	t.is(timer.running, true);
	t.is(timer.time, 1000);
});

test.serial('should decrement by 1 second', t => {
	const timer = new Timer({
		state: [true, 0, 0],
		direction: 'down',
	});

	clock.tick(1000);

	t.is(timer.running, true);
	t.is(timer.time, -1000);
});

test.serial('should seek to 3 seconds', t => {
	const timer = new Timer({
		state: [false, 0, 0],
	});

	timer.seek(3000);

	t.is(timer.running, false);
	t.is(timer.time, 3000);
});

test.serial('should resume the timer', t => {
	const timer = new Timer({
		state: [false, 0, 0],
	});

	timer.start(true);

	t.is(timer.running, true);
	t.is(timer.time, Date.now());
});

test.serial('should reset the timer', t => {
	const timer = new Timer({
		state: [false, 0, 1000],
	});

	timer.reset();

	t.is(timer.running, false);
	t.is(timer.time, 0);
});
