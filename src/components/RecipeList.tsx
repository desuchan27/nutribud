"use client";

// import { PageContainer, PageContainerGray } from "@/components/containers/PageContainer";
import RecipeCard from "@/components/RecipeCard";

interface RecipeListProps {
	recipes: {
		id: string;
		title: string;
		ingredients: { id: string; name: string; srp: number }[];
		procedure: string;
		recipeImage: { id: string; img: string }[];
		user: {
			username: string;
			image: string;
		};
	}[];
}

export default function RecipeList({ recipes }: RecipeListProps) {
	return (
		<div className="bg-gray-100">
			<div className="min-h-dvh max-w-4xl flex flex-col mx-auto px-4 py-8 gap-6">
				{recipes.map((recipe) => (
					<RecipeCard key={recipe.id} recipe={recipe} />
				))}
			</div>
		</div>
	);
}
