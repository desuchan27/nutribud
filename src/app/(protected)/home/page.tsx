import db from "@/lib/db";
import { SectionContainerStart } from "@/components/containers/SectionContainer";
import { validateRequest } from "@/auth";
import RecipeFilter from "@/components/RecipeFilter";
import RecipeList from "@/components/RecipeList";
import { Prisma } from "@prisma/client";
import RecipePagination from "@/components/RecipePagination";
import SideProfile from "@/components/partials/SideProfile";
import SideRecipe from "@/components/partials/SideRecipe";

const NUTRIENTS = [
	"Calories",
	"Protein",
	"Calcium",
	"Carbs",
	"Fat",
	"Fiber",
	"Iron",
	"Potassium",
	"Sodium",
	"Sugar",
	"VitaminA",
	"VitaminC",
] as const;

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
	const session = await validateRequest();
	const username = session.user?.username as string;

	// pagination
	const page = parseInt(searchParams.page || "1", 10); // Default to page 1 if not provided
	const limit = 3; // Items per page
	const offset = (page - 1) * limit;

	const { where, isFiltered } = filterRecipe(searchParams);

	const recipes = await db.recipe.findMany({
		skip: offset,
		take: limit,
		orderBy: {
			createdAt: "desc",
		},
		where,
		include: {
			ingredients: true,
			recipeImage: true,
			user: true,
		},
	});

	// pagination
	const totalRecipes = await db.recipe.count({
		where,
	});
	const totalPages = Math.ceil(totalRecipes / limit);

	const mappedRecipes = recipes.map((recipe) => ({
		...recipe,
		user: {
			username: recipe.user.username,
			image: recipe.user.profileImage || "", // Use profileImage as image
		},
	}));

	const uniqueIngredients = await db.ingredients.findMany({
		distinct: ["name"], // Field to make distinct
		select: {
			name: true, // Only select the name field
		},
	});

	return (
		<div>
			<SectionContainerStart>
				<div className="flex flex-col gap-1">
					<h1 className="text-xl text-left">
						Welcome to Nutribud! <span className="text-primary font-bold">{username}</span>
					</h1>
					<p className="text-left text-sm">Here are some of the latest healthy recipes from our community</p>
				</div>
			</SectionContainerStart>
			<div className="bg-gray-100 w-full">
				<div className="flex gap-x-4 container mx-auto">
					<div className="w-full hidden lg:block bg-white mt-4">
						<SideProfile />
					</div>
					<div className="lg:min-w-[56rem] w-full">
						<RecipeFilter uniqueIngredients={uniqueIngredients} isFiltered={isFiltered} />
						<RecipeList recipes={mappedRecipes} isFiltered={isFiltered} />
						<RecipePagination page={page} totalPages={totalPages} />
					</div>
					<div className="w-full hidden lg:block bg-white mt-4">
						<SideRecipe />
					</div>
				</div>
			</div>
		</div>
	);
}

function filterRecipe(searchParams: { [key: string]: string | undefined }) {
	const title = searchParams["title"];
	const budget = searchParams["budget"] ?? null;
	const highToLow = searchParams["high-to-low"] ?? false;
	const ingredients = searchParams["ingredients"]?.split(",");
	const nutrients = NUTRIENTS.map((nutrient) => {
		const paramValue = searchParams[nutrient];
		if (!paramValue) return null;
		return {
			name: nutrient,
			value: paramValue,
		};
	}).filter((nut) => !!nut);

	const isFiltered = !!title || !!budget || !!ingredients || nutrients.length > 0;

	let where: Prisma.RecipeWhereInput = {};
	if (title) {
		where.title = {
			contains: title,
			mode: "insensitive",
		};
	}

	if (budget && Number(budget)) {
		if (!highToLow) {
			where.totalSrp = { lte: Number(budget) };
		} else {
			where.totalSrp = { gte: Number(budget) };
		}
	}

	if (ingredients) {
		where.ingredients = {
			some: {
				name: { in: ingredients },
			},
		};
	}

	if (nutrients.length > 0) {
		nutrients.forEach(({ name, value }) => {
			if (!!Number(value)) {
				where[name] = {
					lte: Number(value),
				};
			}
		});
	}
	return { where, isFiltered };
}
