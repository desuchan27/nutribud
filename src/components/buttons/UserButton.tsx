"use client";

import Image from "next/image";
import { UserProps } from "@/types";
import { FaUser } from "react-icons/fa";
import Link from "next/link";

export default function UserButton({
  userName,
  email,
  profileImage,
}: UserProps) {
  return (
    <Link 
        href={`/${userName}`}
        className="flex flex-row gap-4 items-center justify-center md:px-4 md:py-2 rounded-lg md:hover:bg-gray-200/75 transition-hover duration-200"
    >
      <div className="hidden sm:flex flex-col gap-1 text-right">
          <p className="text-zinc-800 font-semibold">{userName}</p>
          <p className="text-xs text-zinc-600">{email}</p>
      </div>
      <div className="h-9 w-9 relative aspect-square rounded-full flex items-center justify-center overflow-hidden bg-primary">
        {profileImage ? (
          <Image src={profileImage} alt={userName as string} fill />
        ) : (
          <FaUser className="h-5 w-5 text-white" />
        )}
      </div>
    </Link>
  );
}
