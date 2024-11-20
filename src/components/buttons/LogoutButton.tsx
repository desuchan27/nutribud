"use client"

import { logout } from '@/actions/auth.actions'
import { FC } from 'react'

interface LogoutButtonProps {
    children: React.ReactNode
}

export const LogoutButton: FC<LogoutButtonProps> = ({
    children
}: LogoutButtonProps) => {
    const onClick = () => {
        logout()
    }

    return (
        <div onClick={onClick} className="px-8 py-4 rounded-lg bg-red-500 text-white hover:bg-opacity-90 transition-hover duration-200 cursor-pointer">
            {children}
        </div>
    )
}