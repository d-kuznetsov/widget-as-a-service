import { Temporal } from '@js-temporal/polyfill';

export function addDurationToTime(timeString: string, durationMinutes: number) {
	const time = Temporal.PlainTime.from(timeString);
	const newTime = time.add({ minutes: durationMinutes });
	return newTime.toString({ smallestUnit: 'minute' });
}
