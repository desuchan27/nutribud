"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { CommentSection, ReactionSection } from "./CommentSection";

interface RecipeCardProps {
	recipe: {
		id: string;
		title: string;
		ingredients: { id: string; name: string; srp: number }[];
		procedure: string;
		recipeImage: { id: string; img: string }[];
		user: {
			username: string;
			image: string;
		};
	};
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isIngredientExpanded, setIsIngredientExpanded] = useState(false);
	const [isProcedureExpanded, setIsProcedureExpanded] = useState(false);

	const moreThanOneImage = recipe.recipeImage.length > 1;

	const handleNextImage = () => {
		setCurrentImageIndex((prevIndex) => (prevIndex === recipe.recipeImage.length - 1 ? 0 : prevIndex + 1));
	};

	const handlePrevImage = () => {
		setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? recipe.recipeImage.length - 1 : prevIndex - 1));
	};

	return (
		<div
			className="flex flex-col gap-5 px-5 py-5 bg-white rounded-bl-[2rem] rounded-tr-[2rem] shadow-lg outline-none hover:outline hover:outline-secondary transition-all ease-linear duration-200"
			key={recipe.id}>
			<Link className="flex flex-row items-center gap-4 w-fit group" href={`/${recipe.user.username}`}>
				<Image
					src={recipe.user.image}
					alt={recipe.user.username}
					width={32}
					height={32}
					className="rounded-full object-cover aspect-square"
				/>
				<p className="text-sm font-semibold group-hover:underline">{recipe.user.username}</p>
			</Link>
			<Link className="w-fit hover:underline hover:text-primary transition-all ease-linear duration-200" href={`recipe/${recipe?.id}`}>
				<h1 className="text-base md:text-xl font-semibold">{recipe.title}</h1>
			</Link>

			<div className="relative w-full aspect-square sm:aspect-video">
				<Image src={recipe.recipeImage[currentImageIndex].img} alt={recipe.title} fill className="rounded-lg object-cover" />
				{moreThanOneImage && (
					<>
						<button
							onClick={handlePrevImage}
							className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 flex items-center justify-center rounded-full">
							<FaChevronLeft />
						</button>
						<button
							onClick={handleNextImage}
							className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 flex items-center justify-center rounded-full">
							<FaChevronRight />
						</button>
					</>
				)}
				<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
					{recipe.recipeImage.map((_, index) => (
						<div key={index} className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-gray-400"}`}></div>
					))}
				</div>
			</div>
			<ReactionSection />
			<div className="flex flex-col gap-5 text-sm md:text-base">
				<div className="flex flex-col gap-2">
					<h2 className="text-base font-semibold">Ingredients:</h2>
					{recipe.ingredients.map((ingredient) => (
						<p key={ingredient.id} className="whitespace-pre-wrap">
							{ingredient.name} - {ingredient.srp.toFixed(2)} srp
						</p>
					))}
				</div>
				<div className="flex flex-col gap-2">
					<h2 className="text-base font-semibold">Procedures:</h2>
					<p className="whitespace-pre-wrap">{recipe.procedure}</p>
				</div>
			</div>
			<CommentSection />
		</div>
	);
}
