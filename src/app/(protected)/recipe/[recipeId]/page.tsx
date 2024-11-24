import RecipeDetail from "@/components/RecipeDetail";
import db from "@/lib/db";

interface RecipeProps {
  params: {
    recipeId: string;
  };
}

export default async function Recipe({ params }: RecipeProps) {
  const { recipeId } = params;

  console.log("Received recipeId:", recipeId);

  const recipe = await db.recipe.findUnique({
    where: {
      id: recipeId,
    },
    include: {
      recipeImage: true, // Include the images relation
      user: true, // Include the user relation
    },
  });

  if (!recipe) {
    console.log("Recipe not found");
    return (
      <div>
        <h1>Recipe not found</h1>
      </div>
    );
  }

  return (
    <div className="w-full">
      <RecipeDetail recipe={recipe} />
    </div>
  );
}