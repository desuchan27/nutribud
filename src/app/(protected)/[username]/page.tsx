import db from "@/lib/db";
import ProfileBio from "./components/ProfileBio";
import RecipeList from "@/components/RecipeList";
// import Image from "next/image";
// import { SectionContainerStart } from "@/components/containers/SectionContainer";
// import { PageContainer } from "@/components/containers/PageContainer";
// import { UserRecipeForm } from "@/components/forms/UserForm";
// import { validateRequest } from "@/auth";

interface ProfileProps {
  params: {
    username: string;
  };
}

export default async function Profile({ params }: ProfileProps) {
  const { username } = params;

  // const session = await validateRequest();

  console.log("Received username:", username);

  const user = await db.user.findUnique({
    where: {
      username: username,
    },
  });

  const recipes = await db.recipe.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      recipeImage: true, // Include the images relation
      user: true,
    },
  });

  const mappedRecipes = recipes.map((recipe) => ({
    ...recipe,
    user: {
      username: recipe.user.username,
      image: recipe.user.profileImage || "", // Use profileImage as image
    },
  }));

  // const recipe = await db.recipe.findFirst({
  //   where: {
  //     userId: user?.id,
  //   },
  //   include: {
  //     recipeImage: true, // Include the images relation
  //   },
  // });

  const getUserFirstName = user?.firstName as string;
  const getUserLastName = user?.lastName as string;
  const getUserName = user?.username as string;
  const getUserBio = (user?.bio as string) || undefined;
  const getUserImage = (user?.profileImage as string) || undefined;

  // const getRecipleId = recipe?.id as string;
  // const getRecipeTitle = recipe?.title as string;
  // const getRecipeImages = recipe?.recipeImage.map((img) => img.img) || [];
  // const getRecipeIngredients = recipe?.ingredients as string;
  // const getRecipeProcedure = recipe?.procedure as string;

  console.log("user", getUserName);

  if (!username) {
    console.log("Username is undefined");
    return (
      <div>
        <h1>Invalid username</h1>
      </div>
    );
  }

  if (!user) {
    console.log("User not found");
    return (
      <div>
        <h1>User doesn&apos;t exist</h1>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ProfileBio
        username={getUserName}
        firstName={getUserFirstName}
        lastName={getUserLastName}
        bio={getUserBio}
        image={getUserImage}
      />
      <div className="border-b-2" />
      <RecipeList recipes={mappedRecipes} />
    </div>
  );
}
