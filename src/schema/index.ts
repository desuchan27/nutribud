import * as z from "zod";

export const registerUserSchema = z
  .object({
    email: z.string().email({
      message: "Email is required",
    }),
    firstName: z.string().min(1, {
      message: "First Name is required",
    }),
    lastName: z.string().min(1, {
      message: "Last Name is required",
    }),
    username: z
      .string()
      .min(6, {
        message: "Username must be at least 6 characters",
      })
      .max(20, {
        message: "Username must be at most 20 characters",
      }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string().min(1, {
      message: "Enter the same password",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Set the path of the error to 'confirmPassword'
  });

export const loginUserSchema = z.object({
  email: z.string().email({
    message: "Invalid Email/Doesn't exist",
  }),
  password: z.string().min(6, {
    message: "Wrong Password",
  }),
});

export const userInfoSchema = z.object({
  birthDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid Date",
    })
    .transform((val) => new Date(val)), // Ensure it converts to a Date object
  height: z.coerce.number().min(140, {
    message: "Height must be greater than 140 cm",
  }),
  weight: z.coerce.number().min(40, {
    message: "Weight must be greater than 40 kg",
  }),
});

export const userBioSchema = z.object({
  bio: z.string().max(500, {
    message: "Bio must be less than 500 characters",
  }),
});

export const userProfileImageSchema = z.object({
  imageUrl: z.string() 
})