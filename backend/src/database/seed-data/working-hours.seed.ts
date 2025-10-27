import { DayOfWeek } from '../../working-hours/entities/working-hours.entity';

export interface WorkingHoursSeedData {
	specialistName: string;
	dayOfWeek: DayOfWeek;
	startTime: string;
	endTime: string;
	isActive: boolean;
}

export const workingHoursSeedData: WorkingHoursSeedData[] = [
	// Sarah Johnson - Full time Monday-Friday
	{
		specialistName: 'Sarah Johnson',
		dayOfWeek: DayOfWeek.MONDAY,
		startTime: '09:00',
		endTime: '17:00',
		isActive: true,
	},
	{
		specialistName: 'Sarah Johnson',
		dayOfWeek: DayOfWeek.TUESDAY,
		startTime: '09:00',
		endTime: '17:00',
		isActive: true,
	},
	{
		specialistName: 'Sarah Johnson',
		dayOfWeek: DayOfWeek.WEDNESDAY,
		startTime: '09:00',
		endTime: '17:00',
		isActive: true,
	},
	{
		specialistName: 'Sarah Johnson',
		dayOfWeek: DayOfWeek.THURSDAY,
		startTime: '09:00',
		endTime: '17:00',
		isActive: true,
	},
	{
		specialistName: 'Sarah Johnson',
		dayOfWeek: DayOfWeek.FRIDAY,
		startTime: '09:00',
		endTime: '17:00',
		isActive: true,
	},
	{
		specialistName: 'Sarah Johnson',
		dayOfWeek: DayOfWeek.SATURDAY,
		startTime: '10:00',
		endTime: '15:00',
		isActive: true,
	},

	// Michael Chen - Tuesday-Saturday
	{
		specialistName: 'Michael Chen',
		dayOfWeek: DayOfWeek.TUESDAY,
		startTime: '10:00',
		endTime: '18:00',
		isActive: true,
	},
	{
		specialistName: 'Michael Chen',
		dayOfWeek: DayOfWeek.WEDNESDAY,
		startTime: '10:00',
		endTime: '18:00',
		isActive: true,
	},
	{
		specialistName: 'Michael Chen',
		dayOfWeek: DayOfWeek.THURSDAY,
		startTime: '10:00',
		endTime: '18:00',
		isActive: true,
	},
	{
		specialistName: 'Michael Chen',
		dayOfWeek: DayOfWeek.FRIDAY,
		startTime: '10:00',
		endTime: '18:00',
		isActive: true,
	},
	{
		specialistName: 'Michael Chen',
		dayOfWeek: DayOfWeek.SATURDAY,
		startTime: '09:00',
		endTime: '16:00',
		isActive: true,
	},

	// Emily Rodriguez - Monday, Wednesday, Friday, Saturday
	{
		specialistName: 'Emily Rodriguez',
		dayOfWeek: DayOfWeek.MONDAY,
		startTime: '08:00',
		endTime: '16:00',
		isActive: true,
	},
	{
		specialistName: 'Emily Rodriguez',
		dayOfWeek: DayOfWeek.WEDNESDAY,
		startTime: '08:00',
		endTime: '16:00',
		isActive: true,
	},
	{
		specialistName: 'Emily Rodriguez',
		dayOfWeek: DayOfWeek.FRIDAY,
		startTime: '08:00',
		endTime: '16:00',
		isActive: true,
	},
	{
		specialistName: 'Emily Rodriguez',
		dayOfWeek: DayOfWeek.SATURDAY,
		startTime: '09:00',
		endTime: '15:00',
		isActive: true,
	},

	// David Thompson - Full time Monday-Friday
	{
		specialistName: 'David Thompson',
		dayOfWeek: DayOfWeek.MONDAY,
		startTime: '09:00',
		endTime: '17:00',
		isActive: true,
	},
	{
		specialistName: 'David Thompson',
		dayOfWeek: DayOfWeek.TUESDAY,
		startTime: '09:00',
		endTime: '17:00',
		isActive: true,
	},
	{
		specialistName: 'David Thompson',
		dayOfWeek: DayOfWeek.WEDNESDAY,
		startTime: '09:00',
		endTime: '17:00',
		isActive: true,
	},
	{
		specialistName: 'David Thompson',
		dayOfWeek: DayOfWeek.THURSDAY,
		startTime: '09:00',
		endTime: '17:00',
		isActive: true,
	},
	{
		specialistName: 'David Thompson',
		dayOfWeek: DayOfWeek.FRIDAY,
		startTime: '09:00',
		endTime: '17:00',
		isActive: true,
	},

	// Lisa Wang - Tuesday-Saturday (Wedding specialist)
	{
		specialistName: 'Lisa Wang',
		dayOfWeek: DayOfWeek.TUESDAY,
		startTime: '10:00',
		endTime: '18:00',
		isActive: true,
	},
	{
		specialistName: 'Lisa Wang',
		dayOfWeek: DayOfWeek.WEDNESDAY,
		startTime: '10:00',
		endTime: '18:00',
		isActive: true,
	},
	{
		specialistName: 'Lisa Wang',
		dayOfWeek: DayOfWeek.THURSDAY,
		startTime: '10:00',
		endTime: '18:00',
		isActive: true,
	},
	{
		specialistName: 'Lisa Wang',
		dayOfWeek: DayOfWeek.FRIDAY,
		startTime: '10:00',
		endTime: '18:00',
		isActive: true,
	},
	{
		specialistName: 'Lisa Wang',
		dayOfWeek: DayOfWeek.SATURDAY,
		startTime: '08:00',
		endTime: '16:00',
		isActive: true,
	},

	// James Wilson - Monday-Friday
	{
		specialistName: 'James Wilson',
		dayOfWeek: DayOfWeek.MONDAY,
		startTime: '08:00',
		endTime: '16:00',
		isActive: true,
	},
	{
		specialistName: 'James Wilson',
		dayOfWeek: DayOfWeek.TUESDAY,
		startTime: '08:00',
		endTime: '16:00',
		isActive: true,
	},
	{
		specialistName: 'James Wilson',
		dayOfWeek: DayOfWeek.WEDNESDAY,
		startTime: '08:00',
		endTime: '16:00',
		isActive: true,
	},
	{
		specialistName: 'James Wilson',
		dayOfWeek: DayOfWeek.THURSDAY,
		startTime: '08:00',
		endTime: '16:00',
		isActive: true,
	},
	{
		specialistName: 'James Wilson',
		dayOfWeek: DayOfWeek.FRIDAY,
		startTime: '08:00',
		endTime: '16:00',
		isActive: true,
	},

	// Maria Garcia - Monday, Wednesday, Friday
	{
		specialistName: 'Maria Garcia',
		dayOfWeek: DayOfWeek.MONDAY,
		startTime: '09:00',
		endTime: '17:00',
		isActive: true,
	},
	{
		specialistName: 'Maria Garcia',
		dayOfWeek: DayOfWeek.WEDNESDAY,
		startTime: '09:00',
		endTime: '17:00',
		isActive: true,
	},
	{
		specialistName: 'Maria Garcia',
		dayOfWeek: DayOfWeek.FRIDAY,
		startTime: '09:00',
		endTime: '17:00',
		isActive: true,
	},

	// Robert Brown - Tuesday-Saturday
	{
		specialistName: 'Robert Brown',
		dayOfWeek: DayOfWeek.TUESDAY,
		startTime: '10:00',
		endTime: '18:00',
		isActive: true,
	},
	{
		specialistName: 'Robert Brown',
		dayOfWeek: DayOfWeek.WEDNESDAY,
		startTime: '10:00',
		endTime: '18:00',
		isActive: true,
	},
	{
		specialistName: 'Robert Brown',
		dayOfWeek: DayOfWeek.THURSDAY,
		startTime: '10:00',
		endTime: '18:00',
		isActive: true,
	},
	{
		specialistName: 'Robert Brown',
		dayOfWeek: DayOfWeek.FRIDAY,
		startTime: '10:00',
		endTime: '18:00',
		isActive: true,
	},
	{
		specialistName: 'Robert Brown',
		dayOfWeek: DayOfWeek.SATURDAY,
		startTime: '09:00',
		endTime: '15:00',
		isActive: true,
	},

	// Jennifer Davis - Monday, Wednesday, Friday, Saturday
	{
		specialistName: 'Jennifer Davis',
		dayOfWeek: DayOfWeek.MONDAY,
		startTime: '10:00',
		endTime: '18:00',
		isActive: true,
	},
	{
		specialistName: 'Jennifer Davis',
		dayOfWeek: DayOfWeek.WEDNESDAY,
		startTime: '10:00',
		endTime: '18:00',
		isActive: true,
	},
	{
		specialistName: 'Jennifer Davis',
		dayOfWeek: DayOfWeek.FRIDAY,
		startTime: '10:00',
		endTime: '18:00',
		isActive: true,
	},
	{
		specialistName: 'Jennifer Davis',
		dayOfWeek: DayOfWeek.SATURDAY,
		startTime: '09:00',
		endTime: '16:00',
		isActive: true,
	},

	// Christopher Lee - Monday-Friday
	{
		specialistName: 'Christopher Lee',
		dayOfWeek: DayOfWeek.MONDAY,
		startTime: '08:00',
		endTime: '16:00',
		isActive: true,
	},
	{
		specialistName: 'Christopher Lee',
		dayOfWeek: DayOfWeek.TUESDAY,
		startTime: '08:00',
		endTime: '16:00',
		isActive: true,
	},
	{
		specialistName: 'Christopher Lee',
		dayOfWeek: DayOfWeek.WEDNESDAY,
		startTime: '08:00',
		endTime: '16:00',
		isActive: true,
	},
	{
		specialistName: 'Christopher Lee',
		dayOfWeek: DayOfWeek.THURSDAY,
		startTime: '08:00',
		endTime: '16:00',
		isActive: true,
	},
	{
		specialistName: 'Christopher Lee',
		dayOfWeek: DayOfWeek.FRIDAY,
		startTime: '08:00',
		endTime: '16:00',
		isActive: true,
	},
];
