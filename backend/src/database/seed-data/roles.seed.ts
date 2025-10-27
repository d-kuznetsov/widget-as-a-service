export const rolesSeedData = [
	{
		name: 'super_admin',
		description:
			'Super administrator with full system access across all tenants',
	},
	{
		name: 'tenant_admin',
		description: 'Tenant administrator with full access within their tenant',
	},
	{
		name: 'specialist',
		description: 'Specialist with access to manage appointments and services',
	},
	{
		name: 'client',
		description: 'Client with basic access to book appointments',
	},
];
