"use server"

import { validateRequest } from "@/auth";
import db from "@/lib/db";
import { userSettingsSchema } from "@/schema";
import { Argon2id } from "oslo/password";
import * as z from "zod";

export const updateUserSettings = async (values: z.infer<typeof userSettingsSchema>) => {
  const { firstName, lastName, username, image, email, bio, currentPassword, newPassword, confirmNewPassword } = values;

  const session = await validateRequest();
  const sessionId = session.user?.id;

  const existingUser = await db.user.findFirst({
    where: {
      id: sessionId,
    },
  });

  if (!existingUser) {
    return {
      error: "Unauthorized",
    };
  } else {
    const updatedData: {
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      profileImage: string;
      bio: string;
      password?: string;
    } = {
      firstName,
      lastName,
      username,
      email,
      profileImage: image,
      bio,
    };

    if (newPassword && confirmNewPassword) {
      if (newPassword !== confirmNewPassword) {
        return {
          error: "Passwords do not match",
        };
      } else {
        const validPassword = await new Argon2id().verify(existingUser.password, currentPassword as string);

        if (validPassword) {
          const hashedPassword = await new Argon2id().hash(newPassword);
          updatedData.password = hashedPassword;
        } else {
          return {
            error: "Incorrect current password",
          };
        }
      }
    }

    await db.user.update({
      where: {
        id: sessionId,
      },
      data: updatedData,
    });

    return {
      success: "User settings updated successfully",
    };
  }
};