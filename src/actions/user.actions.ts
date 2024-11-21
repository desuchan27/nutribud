"use server";

import { validateRequest } from "@/auth";
import db from "@/lib/db";

export const getUserInfo = (id: string) => {
  const user = db.user.findFirst({
    where: {
      id: id,
    },
  });

  return user;
};

export const submitUserBio = async (id: string, bio: string) => {
  const session = await validateRequest();

  if (session.user?.id === undefined) {
    throw new Error("User ID is required");
  }

  if (session.user?.id !== id) {
    throw new Error("User ID does not match the session user ID");
  }

  const user = db.user.update({
    where: {
      id: id,
    },
    data: {
      bio: bio,
    },
  });

  return user;
};

export const uploadProfileImage = async (id: string, image:string
) => {

  console.log("Received imageUrl:", image); // Log received imageUrl

  try {
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
      await db.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          profileImage: image,
        },
      });
      console.log("Profile updated successfully");
      return {
        success: "Profile updated successfully",
      };
    }
  } catch (error) {
    console.error("Error updating avatar:", error); // Log any errors
    return {
      error: "An error occurred while updating the profile image",
    };
  }
};
