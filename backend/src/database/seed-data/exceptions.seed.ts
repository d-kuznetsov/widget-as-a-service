export interface ExceptionSeedData {
	date: string; // YYYY-MM-DD format
	startTime: string; // HH:MM format
	endTime: string; // HH:MM format
	reason: string;
	specialistName: string;
}

export const exceptionsSeedData: ExceptionSeedData[] = [
	// Sarah Johnson exceptions
	{
		date: '2024-01-10',
		startTime: '09:00',
		endTime: '12:00',
		reason: 'Doctor appointment - annual checkup',
		specialistName: 'Sarah Johnson',
	},
	{
		date: '2024-01-25',
		startTime: '14:00',
		endTime: '17:00',
		reason: 'Personal appointment - dentist',
		specialistName: 'Sarah Johnson',
	},
	{
		date: '2024-02-14',
		startTime: '09:00',
		endTime: '17:00',
		reason: "Vacation day - Valentine's Day",
		specialistName: 'Sarah Johnson',
	},

	// Michael Chen exceptions
	{
		date: '2024-01-12',
		startTime: '10:00',
		endTime: '11:00',
		reason: 'Medical appointment - eye exam',
		specialistName: 'Michael Chen',
	},
	{
		date: '2024-01-30',
		startTime: '08:00',
		endTime: '16:00',
		reason: 'Sick day - flu symptoms',
		specialistName: 'Michael Chen',
	},
	{
		date: '2024-02-20',
		startTime: '09:00',
		endTime: '17:00',
		reason: 'Personal day - family event',
		specialistName: 'Michael Chen',
	},

	// Emily Rodriguez exceptions
	{
		date: '2024-01-15',
		startTime: '13:00',
		endTime: '15:00',
		reason: 'Training session - new color techniques',
		specialistName: 'Emily Rodriguez',
	},
	{
		date: '2024-02-05',
		startTime: '09:00',
		endTime: '17:00',
		reason: 'Conference attendance - hair color trends',
		specialistName: 'Emily Rodriguez',
	},
	{
		date: '2024-02-18',
		startTime: '11:00',
		endTime: '12:00',
		reason: 'Medical appointment - dermatology',
		specialistName: 'Emily Rodriguez',
	},

	// David Thompson exceptions
	{
		date: '2024-01-18',
		startTime: '08:00',
		endTime: '10:00',
		reason: 'Personal appointment - car service',
		specialistName: 'David Thompson',
	},
	{
		date: '2024-02-08',
		startTime: '09:00',
		endTime: '17:00',
		reason: 'Vacation day - long weekend',
		specialistName: 'David Thompson',
	},
	{
		date: '2024-02-25',
		startTime: '14:00',
		endTime: '16:00',
		reason: 'Training - advanced cutting techniques',
		specialistName: 'David Thompson',
	},

	// Lisa Wang exceptions
	{
		date: '2024-01-22',
		startTime: '10:00',
		endTime: '11:30',
		reason: 'Wedding consultation - venue visit',
		specialistName: 'Lisa Wang',
	},
	{
		date: '2024-02-12',
		startTime: '09:00',
		endTime: '17:00',
		reason: 'Sick day - migraine',
		specialistName: 'Lisa Wang',
	},
	{
		date: '2024-02-28',
		startTime: '13:00',
		endTime: '15:00',
		reason: 'Personal appointment - bank meeting',
		specialistName: 'Lisa Wang',
	},

	// James Wilson exceptions
	{
		date: '2024-01-08',
		startTime: '08:00',
		endTime: '09:00',
		reason: 'Medical appointment - blood pressure check',
		specialistName: 'James Wilson',
	},
	{
		date: '2024-01-28',
		startTime: '09:00',
		endTime: '17:00',
		reason: 'Personal day - home maintenance',
		specialistName: 'James Wilson',
	},
	{
		date: '2024-02-15',
		startTime: '12:00',
		endTime: '13:00',
		reason: 'Lunch meeting - supplier discussion',
		specialistName: 'James Wilson',
	},

	// Maria Garcia exceptions
	{
		date: '2024-01-20',
		startTime: '09:00',
		endTime: '11:00',
		reason: 'Training - new hair treatment products',
		specialistName: 'Maria Garcia',
	},
	{
		date: '2024-02-02',
		startTime: '09:00',
		endTime: '17:00',
		reason: 'Vacation day - personal time',
		specialistName: 'Maria Garcia',
	},
	{
		date: '2024-02-22',
		startTime: '14:00',
		endTime: '15:30',
		reason: 'Medical appointment - allergy testing',
		specialistName: 'Maria Garcia',
	},

	// Robert Brown exceptions
	{
		date: '2024-01-14',
		startTime: '10:00',
		endTime: '12:00',
		reason: 'Personal appointment - DMV visit',
		specialistName: 'Robert Brown',
	},
	{
		date: '2024-02-06',
		startTime: '09:00',
		endTime: '17:00',
		reason: 'Sick day - cold symptoms',
		specialistName: 'Robert Brown',
	},
	{
		date: '2024-02-26',
		startTime: '11:00',
		endTime: '12:00',
		reason: 'Quick personal errand - pharmacy',
		specialistName: 'Robert Brown',
	},

	// Jennifer Davis exceptions
	{
		date: '2024-01-16',
		startTime: '13:00',
		endTime: '14:30',
		reason: 'Training - fantasy color techniques',
		specialistName: 'Jennifer Davis',
	},
	{
		date: '2024-02-10',
		startTime: '09:00',
		endTime: '17:00',
		reason: 'Personal day - moving assistance',
		specialistName: 'Jennifer Davis',
	},
	{
		date: '2024-02-24',
		startTime: '15:00',
		endTime: '16:00',
		reason: 'Medical appointment - routine checkup',
		specialistName: 'Jennifer Davis',
	},

	// Christopher Lee exceptions
	{
		date: '2024-01-11',
		startTime: '08:00',
		endTime: '09:00',
		reason: 'Personal appointment - passport renewal',
		specialistName: 'Christopher Lee',
	},
	{
		date: '2024-01-31',
		startTime: '09:00',
		endTime: '17:00',
		reason: 'Vacation day - family gathering',
		specialistName: 'Christopher Lee',
	},
	{
		date: '2024-02-16',
		startTime: '12:00',
		endTime: '13:00',
		reason: 'Lunch meeting - industry networking',
		specialistName: 'Christopher Lee',
	},

	// Amanda Taylor exceptions
	{
		date: '2024-01-19',
		startTime: '10:00',
		endTime: '11:00',
		reason: 'Medical appointment - dermatology follow-up',
		specialistName: 'Amanda Taylor',
	},
	{
		date: '2024-02-07',
		startTime: '09:00',
		endTime: '17:00',
		reason: 'Sick day - stomach flu',
		specialistName: 'Amanda Taylor',
	},
	{
		date: '2024-02-21',
		startTime: '14:00',
		endTime: '15:30',
		reason: 'Personal appointment - insurance meeting',
		specialistName: 'Amanda Taylor',
	},

	// Kevin Martinez exceptions
	{
		date: '2024-01-13',
		startTime: '11:00',
		endTime: '12:00',
		reason: 'Quick personal errand - post office',
		specialistName: 'Kevin Martinez',
	},
	{
		date: '2024-02-03',
		startTime: '09:00',
		endTime: '17:00',
		reason: 'Personal day - home improvement',
		specialistName: 'Kevin Martinez',
	},
	{
		date: '2024-02-19',
		startTime: '13:00',
		endTime: '14:00',
		reason: 'Medical appointment - annual physical',
		specialistName: 'Kevin Martinez',
	},

	// Nicole Anderson exceptions
	{
		date: '2024-01-17',
		startTime: '09:00',
		endTime: '10:30',
		reason: 'Training - color correction techniques',
		specialistName: 'Nicole Anderson',
	},
	{
		date: '2024-02-09',
		startTime: '09:00',
		endTime: '17:00',
		reason: 'Vacation day - mental health day',
		specialistName: 'Nicole Anderson',
	},
	{
		date: '2024-02-23',
		startTime: '15:00',
		endTime: '16:00',
		reason: 'Personal appointment - tax preparation',
		specialistName: 'Nicole Anderson',
	},

	// Daniel White exceptions
	{
		date: '2024-01-21',
		startTime: '08:00',
		endTime: '09:00',
		reason: 'Personal appointment - car inspection',
		specialistName: 'Daniel White',
	},
	{
		date: '2024-02-11',
		startTime: '09:00',
		endTime: '17:00',
		reason: 'Sick day - back pain',
		specialistName: 'Daniel White',
	},
	{
		date: '2024-02-27',
		startTime: '12:00',
		endTime: '13:00',
		reason: 'Lunch meeting - equipment supplier',
		specialistName: 'Daniel White',
	},

	// Rachel Green exceptions
	{
		date: '2024-01-23',
		startTime: '10:00',
		endTime: '11:30',
		reason: 'Wedding consultation - trial run',
		specialistName: 'Rachel Green',
	},
	{
		date: '2024-02-13',
		startTime: '09:00',
		endTime: '17:00',
		reason: 'Personal day - wedding planning',
		specialistName: 'Rachel Green',
	},
	{
		date: '2024-02-29',
		startTime: '14:00',
		endTime: '15:00',
		reason: 'Medical appointment - routine checkup',
		specialistName: 'Rachel Green',
	},
];
