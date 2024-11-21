"use client";

import { useState } from "react";
import { UserBioForm, UserPostForm, UserProfileForm } from "@/components/forms/UserForm";
import { useSession } from "@/lib/auth/SessionContext";
import Image from "next/image";

export default function ProfileBio({
  username,
  firstName,
  lastName,
  bio,
  image,
}: {
  username: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  bio?: string | undefined;
  image?: string | undefined;
}) {
  const session = useSession();
  const [userBio, setUserBio] = useState(bio);

  const userUsername = username as string;

  const currentUser = session?.user?.username === username;

  const handleBioUpdate = (newBio: string) => {
    setUserBio(newBio);
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 md:gap-20 px-4 py-4 max-w-5xl mx-auto">
      <div className="w-full md:w-1/4">
        <div className="aspect-square relative">
          {image ? (
            <Image
              src={image}
              alt={userUsername}
              className="object-cover w-full h-full rounded-full"
            />
          ) : (
            <div className="w-full h-full bg-zinc-200 rounded-full">
              <div className="w-full h-full flex justify-center items-center">
                <p className="text-zinc-600 text-7xl font-semibold">
                  {username?.charAt(0).toUpperCase()}
                </p>
              </div>
              <UserProfileForm />
            </div>
          )}
        </div>
      </div>
      <div className="w-full md:w-3/4 flex flex-col justify-between text-zinc-700 gap-10">
        <div className="w-full h-fit flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">{username}</h1>
            <h2 className="!text-zinc-600">
              {firstName} {lastName}
            </h2>
          </div>
          <p className="whitespace-pre-wrap">{userBio}</p>
        </div>
        <div className="flex flex-row justify-end gap-4">
          {currentUser && <UserBioForm bio={userBio} onBioUpdate={handleBioUpdate} />}
          {currentUser && <UserPostForm />}
        </div>
      </div>
    </div>
  );
}