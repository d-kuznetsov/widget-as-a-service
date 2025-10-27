import { AppointmentStatus } from '../../appointments/entities/appointment.entity';

export interface AppointmentSeedData {
	startTime: string; // ISO string format
	endTime: string; // ISO string format
	status: AppointmentStatus;
	comment?: string;
	userEmail: string;
	specialistName: string;
	serviceName: string;
}

export const appointmentsSeedData: AppointmentSeedData[] = [
	// Past appointments (completed)
	{
		startTime: '2024-01-15T10:00:00Z',
		endTime: '2024-01-15T10:30:00Z',
		status: AppointmentStatus.COMPLETED,
		comment: 'Great haircut, very satisfied',
		userEmail: 'john.doe@example.com',
		specialistName: 'Sarah Johnson',
		serviceName: 'Haircut',
	},
	{
		startTime: '2024-01-16T14:00:00Z',
		endTime: '2024-01-16T15:30:00Z',
		status: AppointmentStatus.COMPLETED,
		comment: 'Excellent coloring service',
		userEmail: 'alice.smith@example.com',
		specialistName: 'Emily Rodriguez',
		serviceName: 'Hair Coloring',
	},
	{
		startTime: '2024-01-17T11:00:00Z',
		endTime: '2024-01-17T11:15:00Z',
		status: AppointmentStatus.COMPLETED,
		userEmail: 'bob.wilson@example.com',
		specialistName: 'Michael Chen',
		serviceName: 'Beard Trim',
	},
	{
		startTime: '2024-01-18T09:00:00Z',
		endTime: '2024-01-18T10:30:00Z',
		status: AppointmentStatus.COMPLETED,
		comment: 'Perfect styling for the event',
		userEmail: 'carol.davis@example.com',
		specialistName: 'Lisa Wang',
		serviceName: 'Wedding Hair',
	},
	{
		startTime: '2024-01-19T15:00:00Z',
		endTime: '2024-01-19T15:30:00Z',
		status: AppointmentStatus.COMPLETED,
		userEmail: 'david.brown@example.com',
		specialistName: 'David Thompson',
		serviceName: 'Haircut',
	},

	// Current appointments (booked)
	{
		startTime: '2024-01-22T10:00:00Z',
		endTime: '2024-01-22T10:30:00Z',
		status: AppointmentStatus.BOOKED,
		comment: 'Regular monthly haircut',
		userEmail: 'john.doe@example.com',
		specialistName: 'Sarah Johnson',
		serviceName: 'Haircut',
	},
	{
		startTime: '2024-01-22T14:00:00Z',
		endTime: '2024-01-22T15:30:00Z',
		status: AppointmentStatus.BOOKED,
		comment: 'Want to try balayage highlights',
		userEmail: 'emma.jones@example.com',
		specialistName: 'Emily Rodriguez',
		serviceName: 'Highlights',
	},
	{
		startTime: '2024-01-23T11:00:00Z',
		endTime: '2024-01-23T11:45:00Z',
		status: AppointmentStatus.BOOKED,
		userEmail: 'frank.miller@example.com',
		specialistName: 'Michael Chen',
		serviceName: 'Haircut & Styling',
	},
	{
		startTime: '2024-01-23T16:00:00Z',
		endTime: '2024-01-23T17:00:00Z',
		status: AppointmentStatus.BOOKED,
		comment: 'Bridal trial for wedding next month',
		userEmail: 'grace.taylor@example.com',
		specialistName: 'Lisa Wang',
		serviceName: 'Wedding Hair',
	},
	{
		startTime: '2024-01-24T09:00:00Z',
		endTime: '2024-01-24T10:00:00Z',
		status: AppointmentStatus.BOOKED,
		userEmail: 'henry.anderson@example.com',
		specialistName: 'James Wilson',
		serviceName: "Men's Haircut & Shave",
	},
	{
		startTime: '2024-01-24T13:00:00Z',
		endTime: '2024-01-24T14:00:00Z',
		status: AppointmentStatus.BOOKED,
		comment: 'Deep conditioning treatment',
		userEmail: 'iris.thomas@example.com',
		specialistName: 'Maria Garcia',
		serviceName: 'Deep Conditioning Treatment',
	},
	{
		startTime: '2024-01-25T10:00:00Z',
		endTime: '2024-01-25T10:30:00Z',
		status: AppointmentStatus.BOOKED,
		userEmail: 'jack.garcia@example.com',
		specialistName: 'Robert Brown',
		serviceName: 'Haircut',
	},
	{
		startTime: '2024-01-25T15:00:00Z',
		endTime: '2024-01-25T16:30:00Z',
		status: AppointmentStatus.BOOKED,
		comment: 'Fantasy color consultation',
		userEmail: 'karen.martinez@example.com',
		specialistName: 'Jennifer Davis',
		serviceName: 'Consultation',
	},
	{
		startTime: '2024-01-26T11:00:00Z',
		endTime: '2024-01-26T11:20:00Z',
		status: AppointmentStatus.BOOKED,
		userEmail: 'leo.rodriguez@example.com',
		specialistName: 'Christopher Lee',
		serviceName: 'Kids Haircut',
	},
	{
		startTime: '2024-01-26T14:00:00Z',
		endTime: '2024-01-26T15:00:00Z',
		status: AppointmentStatus.BOOKED,
		comment: 'Special event styling',
		userEmail: 'mary.lee@example.com',
		specialistName: 'Lisa Wang',
		serviceName: 'Updo Styling',
	},

	// Future appointments
	{
		startTime: '2024-01-29T10:00:00Z',
		endTime: '2024-01-29T11:30:00Z',
		status: AppointmentStatus.BOOKED,
		comment: 'Keratin treatment for damaged hair',
		userEmail: 'nick.perez@example.com',
		specialistName: 'Maria Garcia',
		serviceName: 'Keratin Treatment',
	},
	{
		startTime: '2024-01-30T09:00:00Z',
		endTime: '2024-01-30T10:00:00Z',
		status: AppointmentStatus.BOOKED,
		userEmail: 'olivia.white@example.com',
		specialistName: 'Sarah Johnson',
		serviceName: 'Haircut & Styling',
	},
	{
		startTime: '2024-01-31T13:00:00Z',
		endTime: '2024-01-31T13:30:00Z',
		status: AppointmentStatus.BOOKED,
		userEmail: 'paul.harris@example.com',
		specialistName: 'Michael Chen',
		serviceName: 'Beard Trim & Mustache',
	},
	{
		startTime: '2024-02-01T10:00:00Z',
		endTime: '2024-02-01T11:00:00Z',
		status: AppointmentStatus.BOOKED,
		comment: 'Facial treatment for better skin',
		userEmail: 'quinn.clark@example.com',
		specialistName: 'David Thompson',
		serviceName: 'Facial Treatment',
	},

	// Cancelled appointments
	{
		startTime: '2024-01-20T10:00:00Z',
		endTime: '2024-01-20T10:30:00Z',
		status: AppointmentStatus.CANCELED,
		comment: 'Client cancelled due to illness',
		userEmail: 'alice.smith@example.com',
		specialistName: 'Sarah Johnson',
		serviceName: 'Haircut',
	},
	{
		startTime: '2024-01-21T14:00:00Z',
		endTime: '2024-01-21T15:30:00Z',
		status: AppointmentStatus.CANCELED,
		comment: "No-show, client didn't arrive",
		userEmail: 'bob.wilson@example.com',
		specialistName: 'Emily Rodriguez',
		serviceName: 'Hair Coloring',
	},
];
