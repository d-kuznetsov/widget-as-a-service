export interface TenantSeedData {
	name: string;
	address: string;
	ownerUsername: string;
}

export const tenantsSeedData: TenantSeedData[] = [
	{
		name: 'Downtown Medical Center',
		address: '123 Main Street, Downtown, City 12345',
		ownerUsername: 'tenant_admin',
	},
	{
		name: 'Westside Dental Clinic',
		address: '456 Oak Avenue, Westside, City 12345',
		ownerUsername: 'dr_smith',
	},
	{
		name: 'Eastside Family Practice',
		address: '789 Pine Street, Eastside, City 12345',
		ownerUsername: 'dr_johnson',
	},
	{
		name: 'Northside Wellness Center',
		address: '321 Elm Drive, Northside, City 12345',
		ownerUsername: 'john_doe',
	},
	{
		name: 'Southside Physical Therapy',
		address: '654 Maple Lane, Southside, City 12345',
		ownerUsername: 'alice_smith',
	},
	{
		name: 'Central Health Services',
		address: '987 Cedar Road, Central, City 12345',
		ownerUsername: 'bob_wilson',
	},
	{
		name: 'Metro Urgent Care',
		address: '147 Birch Street, Metro, City 12345',
		ownerUsername: 'carol_davis',
	},
	{
		name: 'Community Health Center',
		address: '258 Spruce Avenue, Community, City 12345',
		ownerUsername: 'david_brown',
	},
	{
		name: 'Professional Medical Group',
		address: '369 Willow Way, Professional, City 12345',
		ownerUsername: 'emma_jones',
	},
	{
		name: 'Advanced Care Clinic',
		address: '741 Poplar Place, Advanced, City 12345',
		ownerUsername: 'frank_miller',
	},
];
