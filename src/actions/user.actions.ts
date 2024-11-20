import db from "@/lib/db"

export const getUserInfo = (id: string) => {
    const user = db.user.findFirst({
        where: {
            id: id,
        },
    })

    return (user)
}