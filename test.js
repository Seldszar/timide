const test = require('ava');
const sinon = require('sinon');

const {Timer} = require('.');

let clock;

test.before(() => {
	clock = sinon.useFakeTimers();
});

test.after(() => {
	clock.restore();
});

test('should create a timer', t => {
	const timer = new Timer();

	t.is(timer.running, false);
	t.is(timer.time, 0);
});

test('should advance by 1 second', t => {
	const timer = new Timer();

	timer.start();

	clock.tick(1000);

	t.is(timer.running, true);
	t.is(timer.time, 1000);
});

test('should emit `time` event', async t => {
	const timer = new Timer({
		state: [true, 0, 0]
	});

	const promise = new Promise(resolve => {
		timer.on('time', resolve);
	});

	clock.tick(timer.interval);

	t.is(await promise, Date.now());
});

test('should emit `state` event', async t => {
	const timer = new Timer({
		interval: Infinity
	});

	const promise = new Promise(resolve => {
		timer.on('state', resolve);
	});

	timer.start();

	t.is(await promise, timer.state);
});

test('should emit `state` and `time` when stopped', async t => {
	const timer = new Timer({
		state: [true, 0, 0]
	});

	const statePromise = new Promise(resolve => {
		timer.on('state', resolve);
	});

	const timePromise = new Promise(resolve => {
		timer.on('time', resolve);
	});

	timer.stop();

	t.pass(await statePromise);
	t.pass(await timePromise);
});

test('should reset the timer', t => {
	const timer = new Timer({
		state: [false, 0, 1000]
	});

	timer.reset();

	t.is(timer.running, false);
	t.is(timer.time, 0);
});

test('should resume the timer', t => {
	const timer = new Timer({
		state: [false, 0, 0]
	});

	timer.start(true);

	t.is(timer.running, true);
	t.is(timer.time, Date.now());
});

test('should seek to 3 seconds', t => {
	const timer = new Timer({
		state: [false, 0, 0]
	});

	timer.seek(3000);

	t.is(timer.running, false);
	t.is(timer.time, 3000);
});
