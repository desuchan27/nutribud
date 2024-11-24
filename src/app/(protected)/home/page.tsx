import db from "@/lib/db";
// import { PageContainer } from "@/components/containers/PageContainer";
import RecipeList from "@/components/RecipeList";
import { SectionContainerStart } from "@/components/containers/SectionContainer";
import { validateRequest } from "@/auth";

export default async function Home() {

  const session = await validateRequest();

  const username = session.user?.username as string;

  const recipes = await db.recipe.findMany({
    orderBy: {
      createdAt: "desc", // Sort by latest post
    },
    include: {
      recipeImage: true, // Include the images relation
      user: true, // Include the user relation
    },
  });

  const mappedRecipes = recipes.map((recipe) => ({
    ...recipe,
    user: {
      username: recipe.user.username,
      image: recipe.user.profileImage || "", // Use profileImage as image
    },
  }));

  return (
      <div>
        <SectionContainerStart>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl text-left">Welcome to Nutribud! <span className="text-primary font-bold">{username}</span></h1>
            <p className="text-left text-sm">Here are some of the latest healthy recipes from our community</p>
          </div>
        </SectionContainerStart>
        <RecipeList recipes={mappedRecipes} />
      </div>
  );
}