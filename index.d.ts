import Emittery from 'emittery';

export type TimerDirection = 'down' | 'up';
export type TimerState = [running: boolean, date: number, offset: number];

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
	 * Returns the current epoch.
	 */
	now?(): number;
}

interface EventData {
	state: TimerState;
}

export class Timer extends Emittery<EventData> {
	/**
	 * The current direction.
	 */
	readonly direction: TimerDirection;

	/**
	 * The current state.
	 */
	readonly state: TimerState;

	/**
	 * Returns the current epoch.
	 */
	now: () => number;

	/**
	 * Indicates if the timer is running.
	 */
	get running(): boolean;

	/**
	 * The current time.
	 */
	get time(): number;

	/**
	 * Creates a new timer.
	 * @param options the timer options
	 */
	constructor(options?: TimerOptions);

	/**
	 * Updates the current state.
	 * @param state the new state
	 */
	update(state: TimerState): void;

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
}
