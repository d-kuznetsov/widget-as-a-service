export {
	type AppointmentCreateFields,
	type AppointmentRepository,
	type AppointmentUpdateFields,
	createAppointmentRepository,
} from './appointment.repository';
export type {
	AppointmentCreateInput,
	AppointmentUpdateInput,
} from './appointment.schema';
export {
	type AppointmentService,
	type AppointmentServiceDeps,
	createAppointmentService,
} from './appointment.service';
