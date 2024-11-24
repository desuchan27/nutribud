"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    ingredients: string;
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

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === recipe.recipeImage.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? recipe.recipeImage.length - 1 : prevIndex - 1
    );
  };

  return (
    <div
      className="flex flex-col gap-5 px-5 py-5 bg-white rounded-bl-[2rem] rounded-tr-[2rem] shadow-lg"
      key={recipe.id}
    >

        <Link className="flex flex-row items-end gap-4 w-fit group" href={`/${recipe.user.username}`}>
          <Image src={recipe.user.image} alt={recipe.user.username} width={32} height={32} className="rounded-full" />
            <p className="text-sm font-semibold group-hover:underline">{recipe.user.username}</p>
        </Link>

      <div className="relative w-full aspect-video">
        <Image
          src={recipe.recipeImage[currentImageIndex].img}
          alt={recipe.title}
          fill
          className="rounded-lg object-cover"
        />
        <button
          onClick={handlePrevImage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        >
          &lt;
        </button>
        <button
          onClick={handleNextImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        >
          &gt;
        </button>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          {recipe.recipeImage.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentImageIndex ? "bg-white" : "bg-gray-400"
              }`}
            ></div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">{recipe.title}</h1>
        <p className="whitespace-pre-wrap">{recipe.ingredients}</p>
        <p>{recipe.procedure}</p>
      </div>
    </div>
  );
}