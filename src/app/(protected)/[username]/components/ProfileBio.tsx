"use client";

import { useState } from "react";
import { UserBioForm, UserProfileForm } from "@/components/forms/UserForm";
import { useSession } from "@/lib/auth/SessionContext";
import Image from "next/image";
import { Recipe, User } from "@prisma/client";
import { UserRecipeForm } from "@/components/forms/RecipeForm";
// import { SectionContainerStart } from "@/components/containers/SectionContainer";

interface ProfileBioProps {
	userData: User | null;
	recipeData: Recipe[];
}

export default function ProfileBio({ userData, recipeData }: ProfileBioProps) {
	const username = userData?.username as string;
	const bio = userData?.bio as string;
	const image = userData?.profileImage as string;
	const firstName = userData?.firstName as string;
	const lastName = userData?.lastName as string;
	// const userRecipeLength = userData?.reci
	const userRecipeLength = recipeData.length;

	const session = useSession();
	const [userBio, setUserBio] = useState(bio);
	const [userImage, setUserImage] = useState(image);

	const userUsername = username as string;

	const currentUser = session?.user?.username === username;

	const handleBioUpdate = (newBio: string) => {
		setUserBio(newBio);
	};

	const handleProfileUpdate = (newProfile: string) => {
		setUserImage(newProfile);
	};

	console.log("profile image:", userImage);

	return (
		<>
			{/* tablet and desktop view */}
			{/* <SectionContainerStart> */}
			<div className="hidden md:flex flex-col md:flex-row gap-10 px-4 py-8 w-full max-w-5xl mx-auto">
				<div className="w-full md:w-1/6 flex flex-col gap-4">
					<div className="aspect-square relative">
						{userImage ? (
							<Image src={userImage as string} alt={userUsername} className="object-cover w-full h-full rounded-full" fill />
						) : (
							<div className="w-full h-full bg-zinc-200 rounded-full">
								<div className="w-full h-full flex justify-center items-center">
									<p className="text-zinc-600 text-7xl font-semibold">{username?.charAt(0).toUpperCase()}</p>
								</div>
							</div>
						)}
					</div>
					{currentUser && <UserProfileForm image={userImage} onProfileUpdate={handleProfileUpdate} />}
				</div>
				<div className="w-full md:w-5/6 flex flex-col justify-between text-zinc-700 gap-10">
					<div className="w-full h-fit flex flex-col gap-4">
						<div className="flex flex-col gap-1">
							<h1 className="text-2xl font-semibold">{username}</h1>
							<h2 className="!text-zinc-600">
								{firstName} {lastName}
							</h2>
						</div>
						<div className="flex flex-row gap-4">
							<p className="text-lg">
								100 <span className="text-sm">followers</span>
							</p>
							<p className="text-lg">
								0 <span className="text-sm">following</span>
							</p>
							<p className="text-lg">
								{userRecipeLength} <span className="text-sm">Recipies</span>
							</p>
						</div>
						<p className="whitespace-pre-wrap">{userBio}</p>
					</div>
					{currentUser && (
						<div className="flex flex-row justify-end gap-4">
							<UserBioForm bio={userBio} onBioUpdate={handleBioUpdate} />
							<UserRecipeForm />
						</div>
					)}
				</div>
			</div>
			{/* </SectionContainerStart> */}

			<div className="md:hidden flex flex-col md:flex-row gap-5 px-4 py-4 max-w-5xl mx-auto text-sm sm:text-base">
				<div className="flex flex-row gap-5 h-full items-center justify-start">
					<div className="flex flex-col gap-4 w-fit">
						<div className="aspect-square relative h-32 w-32">
							{image ? (
								<Image src={userImage as string} alt={userUsername} className="object-cover w-full h-full rounded-full" fill />
							) : (
								<div className="w-24 h-24 sm:h-32 sm:w-32 aspect-square bg-zinc-200 rounded-full flex items-center justify-center">
									<p className="text-zinc-600 text-4xl font-semibold">{username?.charAt(0).toUpperCase()}</p>
								</div>
							)}
						</div>
					</div>
					<div className="w-fit flex flex-col gap-1 items-start">
						<h1 className="text-2xl font-semibold">{username}</h1>
						<h2 className="!text-zinc-600">
							{firstName} {lastName}
						</h2>
					</div>
				</div>
				<div className="flex flex-col gap-5 sm:px-8">
					<p className="whitespace-pre-wrap">{userBio}</p>
					{currentUser && (
						<div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-5">
							<div className="flex flex-row gap-5 justify-end">
								<UserProfileForm image={userImage} onProfileUpdate={handleProfileUpdate} />
								<UserBioForm bio={userBio} onBioUpdate={handleBioUpdate} />
							</div>
							<UserRecipeForm />
						</div>
					)}
				</div>
			</div>
		</>
	);
}
