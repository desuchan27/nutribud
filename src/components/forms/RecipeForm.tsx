import Image from "next/image";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useModal } from "../UseModal";
import { UploadButton } from "@/utils/uploadthing";
import { type Control, type FieldError, type FieldErrorsImpl, type Merge, useFieldArray, useForm, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userRecipeSchema } from "@/schema";
import { submitUserRecipe } from "@/actions/user.actions";
import { z } from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import HookFormInput from "../hook-form/input";
import FormProvider from "../hook-form/form";
import HookFormTextarea from "../hook-form/textarea";
import { cn } from "@/lib/utils";

interface UploadResponse {
	url: string;
}

type TRecipeSchema = z.infer<typeof userRecipeSchema>;

const nutrients = [
	"Calories",
	"Protein",
	"Carbs",
	"Fat",
	"Fiber",
	"Sugar",
	"Sodium",
	"Potassium",
	"VitaminC",
	"VitaminA",
	"Calcium",
	"Iron",
] as const;

export function UserRecipeForm() {
	const { modal, handleOpenModal, handleCloseModal } = useModal();
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);
	const router = useRouter();

	const form = useForm<TRecipeSchema>({
		resolver: zodResolver(userRecipeSchema),
		defaultValues: {
			title: "",
			ingredients: [
				{
					name: "",
					srp: 0,
				},
				{
					name: "",
					srp: 0,
				},
			],
			procedure: "",
			image: [],
			Calories: 0.0,
			Protein: 0.0,
			Carbs: 0.0,
			Fat: 0.0,
			Fiber: 0.0,
			Sugar: 0.0,
			Sodium: 0.0,
			Potassium: 0.0,
			VitaminC: 0.0,
			VitaminA: 0.0,
			Calcium: 0.0,
			Iron: 0.0,
		},
	});

	const onSubmit = async (values: TRecipeSchema) => {
		try {
			await submitUserRecipe({ ...values, image: uploadedImages });
			toast.success("Recipe posted successfully!");
			handleCloseModal();

			router.refresh();
		} catch (error) {
			console.error("Error submitting recipe:", error);
			toast.error("An unknown error occurred");
		}
	};

	const handleUploadComplete = (res: UploadResponse[]) => {
		if (res && res.length > 0) {
			const uploadedUrls = res.map((file) => file.url);
			setUploadedImages((prev) => [...prev, ...uploadedUrls]);
			form.setValue("image", [...uploadedImages, ...uploadedUrls]);
			form.clearErrors("image");
			alert("Upload Completed");
		} else {
			alert("No files uploaded.");
		}
	};

	const ingredients = form.watch("ingredients");
	const totalSrp = ingredients.reduce((acc, curr) => acc + curr.srp, 0);
	return (
		<>
			<button
				className="flex flex-row items-center justify-center gap-2 px-2 py-2 md:px-4 md:py-2 rounded-lg bg-primary text-white text-sm md:text-base"
				onClick={handleOpenModal}>
				<FaPlus /> Upload Recipe
			</button>

			{modal && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/50 px-4 md:px-0 z-50 text-zinc-700">
					<FormProvider
						{...form}
						onSubmit={onSubmit}
						className="w-full h-3/4 md:w-1/2 md:max-h-1/2 md:h-fit flex flex-col justify-between bg-gray-100 p-4 gap-5 rounded-tr-xl rounded-bl-[3rem] overflow-auto  max-h-[95svh]">
						<h2 className="font-semibold text-lg text-zinc-600 mb-2">Share Your Recipe</h2>

						<div>
							<UploadButton
								className={cn(
									"mt-4 ut-button:bg-primary hover:ut-button:bg-primary/75 ut-button:ut-readying:bg-primary/50",
									!!form.formState.errors.image?.message &&
										"[&>div]:text-red-600 [&>label]:border [&>label]:border-red-600 [&>label]:text-red-400 [&>label]:font-semibold",
								)}
								endpoint="imageUploader"
								onClientUploadComplete={handleUploadComplete}
								onUploadError={(error: Error) => {
									alert(`ERROR! ${error.message}`);
								}}
							/>
							{!!form.formState.errors.image?.message && (
								<p className="text-xs pl-1.5 text-red-600 text-center">{form.formState.errors.image.message}</p>
							)}
						</div>

						<div className="flex flex-row gap-2 overflow-x-auto">
							{uploadedImages.map((url, index) => (
								<div key={index} className="relative w-[150px] h-[150px] lg:w-[300px] lg:h-[300px]">
									<Image src={url} alt={`Uploaded ${index}`} fill className="object-cover rounded-md" />
								</div>
							))}
						</div>

						<HookFormInput<TRecipeSchema>
							name="title"
							label="Recipe Title"
							placeholder="No Meat Vegetarian Burger (100% Guaranteed)"
						/>

						<span className="flex flex-col gap-2">
							<RecipeIngredientsForm
								control={form.control}
								register={form.register}
								errors={form.formState.errors.ingredients}
								totalSrp={totalSrp}
							/>
						</span>

						<div className="grid md:grid-cols-4 grid-cols-1 gap-y-2 md:gap-x-4">
							{nutrients.map((nutrient) => (
								<span
									key={nutrient}
									className={cn(
										"flex flex-col gap-2",
										!!form.formState.errors[nutrient]?.message && "[&>label]:text-red-600 [&>input]:border-red-600",
									)}>
									<label className="text-sm text-zinc-700" htmlFor={nutrient}>
										{nutrient}:
									</label>
									<input
										type="number"
										id={nutrient}
										className={"w-full px-2 py-0.5 border rounded-md"}
										{...form.register(nutrient, { valueAsNumber: true })}
									/>
									{!!form.formState.errors[nutrient]?.message && (
										<p className="text-xs pl-1.5 text-red-600">{form.formState.errors[nutrient].message}</p>
									)}
								</span>
							))}
						</div>

						<HookFormTextarea<TRecipeSchema> name="procedure" label="Procedures" rows={4} placeholder="List your procedures..." />

						<div className="flex justify-end mt-4">
							<button
								onClick={handleCloseModal}
								className="px-4 py-2 bg-gray-300 text-zinc-700 hover:bg-gray-300/75 transition-bg duration-200 rounded-md mr-2">
								Cancel
							</button>
							<button
								type="submit"
								className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/75 transition-bg duration-200">
								Publish Recipe
							</button>
						</div>
					</FormProvider>
				</div>
			)}
		</>
	);
}

const ingredientPlaceholders = ["1/4 cup olive oil", "half an onion", "3 carrots", "3 ribs celery", "1 teaspoon coarse kosher salt"];

type IngredientErrors =
	| Merge<
			FieldError,
			(
				| Merge<
						FieldError,
						FieldErrorsImpl<{
							name: string;
							srp: 0;
						}>
				  >
				| undefined
			)[]
	  >
	| undefined;

function RecipeIngredientsForm({
	control,
	register,
	errors,
	totalSrp,
}: {
	control: Control<TRecipeSchema>;
	register: UseFormRegister<TRecipeSchema>;
	errors: IngredientErrors;
	totalSrp: number;
}) {
	const { fields, append, remove } = useFieldArray({
		control,
		name: "ingredients",
	});

	return (
		<div className="flex flex-col gap-2">
			{fields.map((field, index) => (
				<div key={field.id} className="grid md:grid-cols-2 grid-cols-1 items-start gap-2">
					<div className={cn(!!errors && !!errors?.[index]?.name?.message && "text-red-600 [&>input]:border-red-600")}>
						<label className="text-sm text-zinc-700">Ingredient</label>
						<input
							className="w-full p-2 border rounded-md"
							placeholder={ingredientPlaceholders[Math.floor(Math.random() * 5)]}
							{...register(`ingredients.${index}.name`)}
						/>
						{!!errors && !!errors?.[index]?.name?.message && (
							<p className="text-xs pl-1.5 text-red-600">{errors[index].name.message}</p>
						)}
					</div>
					<div className={cn(!!errors && !!errors?.[index]?.srp?.message && "[&>label]:text-red-600 [&_input]:border-red-600")}>
						<label className="text-sm text-zinc-700">SRP</label>
						<div className="w-full flex items-center gap-x-2">
							<div className="w-full">
								<input
									className="w-full p-2 border rounded-md"
									type="number"
									{...register(`ingredients.${index}.srp`, { valueAsNumber: true })}
								/>
							</div>
							<button
								className="text-xs text-white bg-red-400 p-1.5 rounded-md"
								type="button"
								onClick={() => {
									remove(index);
								}}>
								Remove
							</button>
						</div>
						{!!errors && !!errors?.[index]?.srp?.message && (
							<p className="text-xs pl-1.5 text-red-600">{errors[index].srp.message}</p>
						)}
					</div>
				</div>
			))}
			{!!totalSrp && (
				<p className="text-sm text-right text-zinc-700 font-semibold">
					total SRP: {totalSrp.toLocaleString("en-US", { maximumFractionDigits: 2 })}
				</p>
			)}
			<div className="mt-0.5 pt-1.5 border-t flex justify-end">
				<button
					className="inline-flex items-center gap-1.5 text-sm text-white p-2 rounded-md bg-primary hover:bg-primary/75"
					type="button"
					onClick={() => {
						append({
							name: "",
							srp: 0,
						});
					}}>
					<FaPlus /> Add More
				</button>
			</div>
		</div>
	);
}
