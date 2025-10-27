export interface SpecialistSeedData {
	name: string;
	description: string;
	username?: string; // Optional username to link to existing user
}

export const specialistsSeedData: SpecialistSeedData[] = [
	{
		name: 'Sarah Johnson',
		description:
			'Master stylist with 10+ years of experience in cutting, coloring, and styling. Specializes in modern cuts and balayage techniques.',
		username: 'alice_smith', // Link to Alice Smith user
	},
	{
		name: 'Michael Chen',
		description:
			"Expert barber specializing in classic and modern men's cuts, beard grooming, and traditional wet shaves.",
		username: 'bob_wilson', // Link to Bob Wilson user
	},
	{
		name: 'Emily Rodriguez',
		description:
			'Color specialist with expertise in highlights, ombre, and creative color techniques. Certified in multiple color systems.',
		username: 'carol_davis', // Link to Carol Davis user
	},
	{
		name: 'David Thompson',
		description:
			'Senior stylist focusing on precision cuts and styling for all hair types. Experienced with curly and textured hair.',
		username: 'david_brown', // Link to David Brown user
	},
	{
		name: 'Lisa Wang',
		description:
			'Wedding and special event hair specialist. Creates beautiful updos, braids, and elegant styles for any occasion.',
		// No username - specialist without user account
	},
	{
		name: 'James Wilson',
		description:
			'Master barber with traditional techniques and modern styling. Expert in beard shaping and mustache grooming.',
		username: 'frank_miller', // Link to Frank Miller user
	},
	{
		name: 'Maria Garcia',
		description:
			'Hair treatment specialist offering keratin treatments, deep conditioning, and hair restoration services.',
		username: 'grace_taylor', // Link to Grace Taylor user
	},
	{
		name: 'Robert Brown',
		description:
			"Stylist specializing in men's grooming and contemporary hairstyles. Skilled in fade cuts and modern styling.",
		// No username - specialist without user account
	},
	{
		name: 'Jennifer Davis',
		description:
			'Creative colorist and stylist with expertise in fantasy colors, pastels, and unique hair transformations.',
		username: 'henry_anderson', // Link to Henry Anderson user
	},
	{
		name: 'Christopher Lee',
		description:
			'Senior barber with expertise in classic cuts, hot towel shaves, and traditional grooming services.',
		username: 'iris_thomas', // Link to Iris Thomas user
	},
	{
		name: 'Amanda Taylor',
		description:
			'Stylist specializing in curly hair care, natural hair styling, and protective hairstyles.',
		// No username - specialist without user account
	},
	{
		name: 'Kevin Martinez',
		description:
			'Master stylist with experience in precision cuts, styling, and hair care consultation for all ages.',
		username: 'jack_garcia', // Link to Jack Garcia user
	},
	{
		name: 'Nicole Anderson',
		description:
			'Color specialist and stylist focusing on natural-looking highlights, lowlights, and color correction.',
		// No username - specialist without user account
	},
	{
		name: 'Daniel White',
		description:
			"Barber specializing in modern cuts, beard styling, and men's grooming services.",
		username: 'karen_martinez', // Link to Karen Martinez user
	},
	{
		name: 'Rachel Green',
		description:
			'Stylist with expertise in bridal hair, special event styling, and elegant updos for formal occasions.',
		username: 'leo_rodriguez', // Link to Leo Rodriguez user
	},
];
