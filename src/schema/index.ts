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
