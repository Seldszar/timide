import Emittery from 'emittery';

export type TimerDirection = 'down' | 'up';
export type TimerState = [boolean, number, number];

export interface TimerOptions {
	/**
	 * Indicates if the timer must increment or decrement time.
	 * @default 'up'
	 */
	direction?: TimerDirection;

	/**
	 * The initial state value for resuming execution.
	 * @default [false, 0, 0]
	 */
	state?: TimerState;

	/**
	 * The interval between each `time` events.
	 * Passing `Infinity` will disable the ticker.
	 * @default 100
	 */
	interval?: number;
}

interface TimerEventData {
	state: TimerState;
	running: boolean;
	time: number;
}

export class Timer extends Emittery<TimerEventData> {
	/**
	 * The current direction.
	 */
	readonly direction: TimerDirection;

	/**
	 * The current state.
	 */
	readonly state: TimerState;

	/**
	 * The tick interval, in milliseconds.
	 */
	readonly interval: number;

	/**
	 * Indicates if the timer is running.
	 */
	readonly running: boolean;

	/**
	 * The current time.
	 */
	readonly time: number;

	/**
	 * Creates a new timer.
	 * @param options the timer options
	 */
	constructor(options?: TimerOptions);

	/**
	 * Starts the timer.
	 * @param resume indicates if it must resume from the last state change
	 */
	start(resume?: boolean): void;

	/**
	 * Stops the timer.
	 */
	stop(): void;

	/**
	 * Resets the timer.
	 */
	reset(): void;

	/**
	 * Updates the current time.
	 * @param time the new time, in milliseconds
	 */
	seek(time: number): void;

	/**
	 * Replaces the current state.
	 * @param state the new state
	 */
	replaceState(state: TimerState): void;
}
