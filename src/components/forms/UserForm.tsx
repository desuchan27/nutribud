"use client";

import * as z from "zod";
import Image from "next/image";
import {
  userBioSchema,
  userProfileImageSchema,
  userRecipeSchema,
} from "@/schema";
import { FaCamera, FaEdit, FaPlus } from "react-icons/fa";
import { useModal } from "@/components/UseModal"; // Adjust the import path as needed
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useState } from "react";
import { useSession } from "@/lib/auth/SessionContext";
import {
  submitUserBio,
  submitUserRecipe,
  uploadProfileImage,
} from "@/actions/user.actions";
import toast from "react-hot-toast";
import { UploadButton } from "@/utils/uploadthing";

interface UserBioFormProps {
  bio?: string;
  onBioUpdate: (newBio: string) => void;
}

interface UserProfileFormProps {
  image?: string;
  onProfileUpdate: (newProfile: string) => void;
}

// interface RecipeFormProps {
//   id: string;
//   title: string;
//   ingredients: string;
//   procedure: string;
//   image: string[];
// }

interface UploadResponse {
  url: string;
}

export function UserBioForm({ bio, onBioUpdate }: UserBioFormProps) {
  const { modal, handleOpenModal, handleCloseModal } = useModal();
  const [charCount, setCharCount] = useState(bio?.length || 0);

  const bioExists = bio;

  const bioHeader = bioExists ? "Edit Bio" : "Add Bio";

  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(event.target.value.length);
  };

  const form = useForm<z.infer<typeof userBioSchema>>({
    resolver: zodResolver(userBioSchema),
    defaultValues: {
      bio: bio || "",
    },
  });

  const bioLimit = charCount > 500;
  const bioLimitError = form.formState.errors.bio;

  const errorMessage = "text-sm text-red-500 font-semibold text-right";
  const normalMessage = "text-sm text-zinc-700 text-right";

  const session = useSession();
  const userId = session?.user?.id;

  const onSubmit = async (values: z.infer<typeof userBioSchema>) => {
    console.log(values);
    startTransition(async () => {
      try {
        await submitUserBio(userId!, values.bio);
        onBioUpdate(values.bio);
        toast.success("Bio updated successfully");
        handleCloseModal();
      } catch (error) {
        console.error(error);
        form.reset();
      }
    });
  };

  return (
    <>
      <button onClick={handleOpenModal}>
        {bioExists ? (
          <span className="text-sm sm:text-base text-zinc-700 flex flex-row items-center gap-2">
            <FaEdit className="w-5 h-5" /> Edit Bio
          </span>
        ) : (
          <span className="text-sm sm:text-base text-zinc-700 flex flex-row items-center gap-2">
            <FaPlus className="w-5 h-5" /> Add Bio
          </span>
        )}
      </button>

      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 px-4 md:px-0 z-50 text-zinc-700">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full h-3/4 md:w-1/2 md:max-h-1/2 md:h-fit flex flex-col bg-gray-100 p-4 gap-4 rounded-tr-xl rounded-bl-[3rem]"
          >
            <h2 className="font-semibold text-lg text-zinc-600 mb-2">
              {bioHeader}
            </h2>
            <textarea
              {...form.register("bio")}
              className="w-full p-2 border rounded-md h-full"
              rows={4}
              placeholder="Enter your bio..."
              onChange={handleBioChange}
            />
            <div className="flex flex-col gap-0">
              <p className={bioLimit ? `${errorMessage}` : `${normalMessage}`}>
                {charCount} characters
              </p>
              {<p className={errorMessage}>{bioLimitError?.message}</p>}
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-300/75 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/75 transition"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export function UserProfileForm({
  image,
  onProfileUpdate,
}: UserProfileFormProps) {
  const { modal, handleOpenModal, handleCloseModal } = useModal();

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const form = useForm<z.infer<typeof userProfileImageSchema>>({
    resolver: zodResolver(userProfileImageSchema),
    defaultValues: {
      imageUrl: image || "",
    },
  });

  const session = useSession();
  const userId = session?.user?.id;

  // const onSubmit = (values: z.infer<typeof userProfileImageSchema>) => {
  //   startTransition(() => {
  //     uploadProfileImage(userId!, values.imageUrl)
  //       .then((data) => {
  //         if (data?.error) {
  //           form.reset();
  //           toast.error(data.error);
  //           console.log(data.error);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   });
  // };

  const onSubmit = async (values: { imageUrl: string }) => {
    try {
      const data = await uploadProfileImage(userId!, values.imageUrl);
      if (data.success) {
        setUploadedImageUrl(values.imageUrl);
        onProfileUpdate(values.imageUrl); // Trigger the update in ProfileBio
        toast.success("Profile image updated successfully");
      } else if (data.error) {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  const close = () => {
    handleCloseModal();
  };

  return (
    <>
      <button
        className="flex flex-row items-center justify-center text-sm sm:text-base text-zinc-700 text-nowrap text-zinc-700 gap-2"
        onClick={handleOpenModal}
      >
        <FaCamera className="w-5 h-5" />
        update profile
      </button>

      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 px-4 md:px-0 z-50 text-zinc-700">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full h-3/4 md:w-1/2 md:max-h-1/2 md:h-fit flex flex-col justify-between bg-gray-100 p-4 gap-5 rounded-tr-xl rounded-bl-[3rem] overflow-auto"
          >
            <h2 className="font-semibold text-lg text-zinc-600 mb-2">
              Add Profile
            </h2>
            <div className="flex flex-col items-center justify-center">
              {uploadedFileName && (
                <div className="mt-4 w-full flex flex-col items-center justify-center space-y-2">
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="aspect-square w-[300px] h-[300px] overflow-hidden relative">
                      <Image
                        src={uploadedImageUrl || "defaultImageUrl"}
                        alt="Uploaded Image"
                        fill
                        objectFit="cover"
                        className="rounded-full"
                      />
                    </div>
                  </div>
                  <p className="text-xs">Uploaded file: {uploadedFileName}</p>
                </div>
              )}
              <UploadButton
                className="mt-4 ut-button:bg-primary hover:ut-button:bg-primary/75 ut-button:ut-readying:bg-primary/50"
                // appearance={{
                //   button({ ready, isUploading }) {
                //     return `custom-button ${
                //       ready ? "custom-button-ready" : "custom-button-not-ready"
                //     } ${isUploading ? "custom-button-uploading" : ""}`;
                //   },
                //   container: "custom-container",
                //   allowedContent: "custom-allowed-content",
                // }}
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res.length > 0) {
                    const uploadedFile = res[0];
                    const uploadedUrl = uploadedFile.url;
                    setUploadedImageUrl(uploadedUrl);
                    form.setValue("imageUrl", uploadedUrl);
                    const fileName = uploadedFile.name;
                    setUploadedFileName(fileName);
                    form.handleSubmit(onSubmit)();
                    alert(`Upload Completed. File name: ${fileName}`);
                  } else {
                    alert("No files uploaded.");
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={close}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/75 transition-bg duration-200"
              >
                Done
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export function UserRecipeForm() {
//   {
//   id,
//   title,
//   ingredients,
//   procedure,
//   image,
// }: RecipeFormProps
  const { modal, handleOpenModal, handleCloseModal } = useModal();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // const form = useForm<z.infer<typeof userRecipeSchema>>({
  //   resolver: zodResolver(userRecipeSchema),
  //   defaultValues: {
  //     title: title || "",
  //     ingredients: ingredients || "",
  //     procedure: procedure || "",
  //     image: image || [],
  //   },
  // });

  const form = useForm<z.infer<typeof userRecipeSchema>>({
    resolver: zodResolver(userRecipeSchema),
    defaultValues: {
      title: "",
      ingredients: "",
      procedure: "",
      image: [],
    },
  });

  // const session = useSession();
  // const userId = session?.user?.id;

  const onSubmit = async (values: z.infer<typeof userRecipeSchema>) => {
    try {
      await submitUserRecipe({ ...values, image: uploadedImages });
      toast.success("Recipe posted successfully!");
      handleCloseModal();
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
      alert("Upload Completed");
    } else {
      alert("No files uploaded.");
    }
  };

  return (
    <>
      <button
        className="flex flex-row items-center justify-center gap-2 px-2 py-2 md:px-4 md:py-2 rounded-lg bg-primary text-white text-sm md:text-base"
        onClick={handleOpenModal}
      >
        <FaPlus /> Upload Recipe
      </button>

      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 px-4 md:px-0 z-50 text-zinc-700">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full h-3/4 md:w-1/2 md:max-h-1/2 md:h-fit flex flex-col justify-between bg-gray-100 p-4 gap-5 rounded-tr-xl rounded-bl-[3rem] overflow-auto"
          >
            <h2 className="font-semibold text-lg text-zinc-600 mb-2">
              Share Your Recipe
            </h2>

            <UploadButton
              className="mt-4 ut-button:bg-primary hover:ut-button:bg-primary/75 ut-button:ut-readying:bg-primary/50"
              endpoint="imageUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />

            <div className="flex flex-row gap-2 overflow-x-auto">
              {uploadedImages.map((url, index) => (
                <div
                  key={index}
                  className="relative w-[150px] h-[150px] lg:w-[300px] lg:h-[300px]"
                >
                  <Image
                    src={url}
                    alt={`Uploaded ${index}`}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              ))}
            </div>

            <span className="flex flex-col gap-2">
              <label className="text-sm text-zinc-700">Recipe Title</label>
              <input
                {...form.register("title")}
                className="w-full p-2 border rounded-md"
                placeholder="No Meat Vegetarian Burger (100% Guaranteed)"
              />
            </span>

            <span className="flex flex-col gap-2">
              <label className="text-sm text-zinc-700">Ingredients</label>
              <textarea
                {...form.register("ingredients")}
                className="w-full p-2 border rounded-md h-full"
                rows={4}
                placeholder="List your ingredients..."
              />
            </span>

            <span className="flex flex-col gap-2">
              <label className="text-sm text-zinc-700">Procedures</label>
              <textarea
                {...form.register("procedure")}
                className="w-full p-2 border rounded-md h-full"
                rows={4}
                placeholder="List your procedures..."
              />
            </span>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 text-zinc-700 hover:bg-gray-300/75 transition-bg duration-200 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/75 transition-bg duration-200"
              >
                Publish Recipe
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
