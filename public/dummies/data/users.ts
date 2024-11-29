import { Prisma } from "@prisma/client";

// ----------------------------------------------------------------------

export const users: Prisma.UserCreateInput[] = [
	{
		email: "admin@email.com",
		username: "admin",
		password: "123123",
		profileImage: null,
		bio: "Loves cooking and outdoor adventures.",
		firstName: "Admin",
		lastName: "User",
		userInfo: {
			create: {
				birthDate: new Date("1990-01-15"),
				weight: 75.5,
				height: 180.3,
				monthyBudget: 600.0,
				allergies: {
					create: [{ name: "Peanuts" }, { name: "Shellfish" }],
				},
			},
		},
	},
	{
		email: "johndoe@example.com",
		username: "johndoe",
		password: "hashed_password_123",
		profileImage: null,
		bio: "Loves cooking and outdoor adventures.",
		firstName: "John",
		lastName: "Doe",
		userInfo: {
			create: {
				birthDate: new Date("1990-01-15"),
				weight: 75.5,
				height: 180.3,
				monthyBudget: 600.0,
				allergies: {
					create: [{ name: "Peanuts" }, { name: "Shellfish" }],
				},
			},
		},
	},
	{
		email: "janedoe@example.com",
		username: "janedoe",
		password: "hashed_password_456",
		profileImage: null,
		bio: "Passionate about fitness and healthy eating.",
		firstName: "Jane",
		lastName: "Doe",
		userInfo: {
			create: {
				birthDate: new Date("1995-05-20"),
				weight: 65.2,
				height: 165.5,
				monthyBudget: 500.0,
				allergies: {
					create: [{ name: "Dairy" }],
				},
			},
		},
	},
	{
		email: "alexsmith@example.com",
		username: "alexsmith",
		password: "hashed_password_789",
		profileImage: null,
		bio: "Tech enthusiast and weekend chef.",
		firstName: "Alex",
		lastName: "Smith",
		userInfo: {
			create: {
				birthDate: new Date("1988-11-03"),
				weight: 80.0,
				height: 175.0,
				monthyBudget: 800.0,
				allergies: {
					create: [],
				},
			},
		},
	},
	{
		email: "emilybrown@example.com",
		username: "emilybrown",
		password: "hashed_password_101",
		profileImage: null,
		bio: "Enjoys experimenting with new recipes.",
		firstName: "Emily",
		lastName: "Brown",
		userInfo: {
			create: {
				birthDate: new Date("1992-09-18"),
				weight: 68.4,
				height: 160.0,
				monthyBudget: 700.0,
				allergies: {
					create: [{ name: "Gluten" }],
				},
			},
		},
	},
	{
		email: "michaeljohnson@example.com",
		username: "michaeljohnson",
		password: "hashed_password_112",
		profileImage: null,
		bio: "Fitness coach and meal prep expert.",
		firstName: "Michael",
		lastName: "Johnson",
		userInfo: {
			create: {
				birthDate: new Date("1985-04-10"),
				weight: 85.0,
				height: 185.0,
				monthyBudget: 1000.0,
				allergies: {
					create: [{ name: "Soy" }, { name: "Eggs" }],
				},
			},
		},
	},
];
