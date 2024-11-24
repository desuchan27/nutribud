"use client";

import Image from "next/image";

interface RecipeDetailProps {
  recipe: {
    id: string;
    title: string;
    ingredients: string;
    procedure: string;
    recipeImage: { id: string; img: string }[];
    user: {
      username: string;
      profileImage: string | null;
    };
  };
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  return (
    <div className="flex flex-col gap-5 px-5 py-5 bg-white rounded-bl-[2rem] rounded-tr-[2rem] shadow-lg">
      <div className="flex flex-row items-center gap-4">
        <Image
          src={recipe.user.profileImage || "/default-profile.png"}
          alt={recipe.user.username}
          width={50}
          height={50}
          className="rounded-full"
        />
        <p className="text-lg font-semibold">{recipe.user.username}</p>
      </div>
      <h1 className="text-2xl font-bold">{recipe.title}</h1>
      <div className="flex flex-row overflow-x-auto gap-4">
        {recipe.recipeImage.map((img) => (
          <div key={img.id} className="w-[300px] h-[300px] relative aspect-square">
            <Image
              src={img.img}
              alt={recipe.title}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Ingredients</h2>
        <p className="whitespace-pre-wrap">{recipe.ingredients}</p>
        <h2 className="text-xl font-semibold">Procedure</h2>
        <p className="whitespace-pre-wrap">{recipe.procedure}</p>
      </div>
    </div>
  );
}