"use server"

import { validateRequest } from "@/auth"
import db from "@/lib/db"

export const getUserInfo = (id: string) => {
    const user = db.user.findFirst({
        where: {
            id: id,
        },
    })

    return (user)
}

export const submitUserBio = async (id: string, bio: string) => {

    const session = await validateRequest();

    if (session.user?.id === undefined) {
        throw new Error("User ID is required")
    }

    if (session.user?.id !== id) {
        throw new Error("User ID does not match the session user ID")
    }

    const user = db.user.update({
        where: {
            id: id,
        },
        data: {
            bio: bio,
        },
    })

    return (user)
}