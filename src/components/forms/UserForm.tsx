"use client";

import * as z from "zod";
import { userBioSchema } from "@/schema";
import { FaCamera, FaEdit, FaPlus } from "react-icons/fa";
import { useModal } from "@/components/UseModal"; // Adjust the import path as needed
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useState } from "react";
import { useSession } from "@/lib/auth/SessionContext";
import { submitUserBio } from "@/actions/user.actions";

interface UserBioFormProps {
  bio?: string;
  onBioUpdate: (newBio: string) => void;
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
          <span className="flex flex-row items-center gap-2">
            <FaEdit /> Edit Bio
          </span>
        ) : (
          <span className="flex flex-row items-center gap-2">
            <FaPlus /> Add Bio
          </span>
        )}
      </button>

      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-1/2 max-h-1/2 h-fit flex flex-col bg-gray-100 p-4 gap-4 rounded-tr-xl rounded-bl-[3rem]"
          >
            <h2>{bioHeader}</h2>
            <textarea
              {...form.register("bio")}
              className="w-full p-2 border rounded-md"
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

export function UserProfileForm() {
  const { modal, handleOpenModal, handleCloseModal } = useModal();

  return (
    <>
      <button
        className="absolute bottom-5 right-0 px-4 py-4 aspect-square rounded-full bg-zinc-700"
        onClick={handleOpenModal}
      >
        <FaCamera className="w-7 h-7 text-gray-100" />
      </button>

      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-gray-100 p-4 rounded-lg h-1/2 w-1/2">
            <h2>Add Profile</h2>
            <input
              className="w-full p-2 border rounded-md"
              placeholder="Enter your profile info..."
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 rounded-md mr-2"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function UserPostForm() {
  const { modal, handleOpenModal, handleCloseModal } = useModal();

  return (
    <>
      <button
        className="flex flex-row items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white"
        onClick={handleOpenModal}
      >
        <FaPlus /> Add Post
      </button>

      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-gray-100 p-4 rounded-lg h-1/2 w-1/2">
            <h2>Add Post</h2>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={4}
              placeholder="Enter your post..."
            ></textarea>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 rounded-md mr-2"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
