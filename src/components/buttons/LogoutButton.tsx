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
        <div onClick={onClick} className='cursor-pointer'>
            {children}
        </div>
    )
}