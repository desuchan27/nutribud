"use client";

import { useForm } from "react-hook-form";

import Image from "next/image";

import { User, UserInfo } from "@prisma/client";

import * as z from "zod";
import { startTransition, useState } from "react";
import { userSettingsSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SectionContainerStart } from "../containers/SectionContainer";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/utils/uploadthing";
import { updateUserSettings } from "@/actions/settings.actions";
import toast from "react-hot-toast";

interface UserSettingsFormProps {
  userData: User | null;
}

interface UserInfoSettingsFormProps {
  userInfoData: UserInfo | null;
}

export function UserSettingsForm({ userData }: UserSettingsFormProps) {
  //   const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  //   const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

//   const router = useRouter();

  const form = useForm<z.infer<typeof userSettingsSchema>>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: userData
      ? {
          image: userData?.profileImage || "",
          email: userData?.email || "",
          firstName: userData?.firstName || "",
          lastName: userData?.lastName || "",
          username: userData?.username || "",
          bio: userData?.bio || "",
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        }
      : {
          image: "",
          email: "",
          firstName: "",
          lastName: "",
          username: "",
          bio: "",
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        },
  });

  const errorFirstName = form.formState.errors.firstName;
  const errorLastName = form.formState.errors.lastName;
  const errorEmail = form.formState.errors.email;
  const errorUsername = form.formState.errors.username;
  const errorBio = form.formState.errors.bio;
  const errorCurrentPassword = form.formState.errors.currentPassword;
  const errorNewPassword = form.formState.errors.newPassword;
  const errorConfirmNewPassword = form.formState.errors.confirmNewPassword;

  const errorMessage = "text-sm text-red-500 font-semibold text-right";
  const normalMessage = "text-sm text-zinc-700";

  const onSubmit = (values: z.infer<typeof userSettingsSchema>) => {
    console.log(values);

    startTransition(() => {
      updateUserSettings(values).then((data) => {
        if(data?.error) {
            form.reset();
            console.log(data.error);
        } else {
            toast.success("Settings updated successfully!");
            // router.refresh();
        }
      })
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full md:w-1/2">
      <SectionContainerStart>
        {/* Title */}
        <h2 className="text-xl font-semibold pb-5">User Info</h2>
        {/* Form */}
        <div className="w-full flex flex-col gap-10">
          {/* Profile Image */}
          <div className="w-full flex flex-col gap-5 items-center">
            <h3 className="font-semibold text-left w-full">Profile Image</h3>
            <div className="aspect-square w-[300px] h-[300px] overflow-hidden relative">
              <Image
                src={uploadedImageUrl || userData?.profileImage || ""}
                alt="Uploaded Image"
                fill
                objectFit="cover"
                className="rounded-full"
              />
            </div>
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
                  form.setValue("image", uploadedUrl);
                  const fileName = uploadedFile.name;
                  setUploadedFileName(fileName);
                  form.handleSubmit(onSubmit)();
                //   toast.success("Image uploaded successfully!");
                //   alert(`Upload Completed. File name: ${fileName}`);
                } else {
                  alert("No files uploaded.");
                }
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />
          </div>

          {/* Full Name */}
          <div className="w-full flex flex-col gap-5">
            <h3 className="font-semibold">Full Name</h3>
            {/* First Name */}
            <span className="w-full flex flex-col md:flex-row gap-2 ">
              <span className="w-full md:w-1/2 flex flex-col gap-2">
                <label htmlFor="name" className={normalMessage}>
                  {errorFirstName ? (
                    <span className={errorMessage}>
                      {errorFirstName.message}
                    </span>
                  ) : (
                    <span>First Name</span>
                  )}
                </label>
                <input
                  {...form.register("firstName")}
                  className="w-full px-8 py-4 rounded-md bg-gray-200/75"
                />
              </span>
              {/* Last Name */}
              <span className="w-full md:w-1/2 flex flex-col gap-2">
                <label htmlFor="name" className={normalMessage}>
                  {errorLastName ? (
                    <span className={errorMessage}>
                      {errorLastName.message}
                    </span>
                  ) : (
                    <span>Last Name</span>
                  )}
                </label>
                <input
                  {...form.register("lastName")}
                  className="w-full px-8 py-4 rounded-md bg-gray-200/75"
                />
              </span>
            </span>
          </div>

          {/* Email and username */}
          <div className="w-full flex flex-col gap-5">
            <h3 className="font-semibold">Email and Username</h3>
            {/* Email */}
            <span className="w-full flex flex-col md:flex-row gap-2">
              <span className="w-full md:w-1/2 flex flex-col gap-2">
                <label htmlFor="email" className={normalMessage}>
                  {errorEmail ? (
                    <span className={errorMessage}>{errorEmail.message}</span>
                  ) : (
                    <span>Email</span>
                  )}
                </label>
                <input
                  {...form.register("email")}
                  type="email"
                  className="w-full px-8 py-4 rounded-md bg-gray-200/75"
                />
              </span>

              {/* Username */}

              <span className="w-full md:w-1/2 flex flex-col gap-2">
                <label htmlFor="username" className={normalMessage}>
                  {errorUsername ? (
                    <span className={errorMessage}>
                      {errorUsername.message}
                    </span>
                  ) : (
                    <span>Username</span>
                  )}
                </label>
                <input
                  {...form.register("username")}
                  className="w-full px-8 py-4 rounded-md bg-gray-200/75"
                />
              </span>
            </span>
          </div>

          {/* Bio */}

          <span className="w-full flex flex-col gap-2">
            <label htmlFor="bio" className={normalMessage}>
              {errorBio ? (
                <span className={errorMessage}>{errorBio.message}</span>
              ) : (
                <span>Bio</span>
              )}
            </label>
            <textarea
              {...form.register("bio")}
              className="w-full px-8 py-4 rounded-md bg-gray-200/75"
            />
          </span>

          {/* Password */}
          <div className="w-full flex flex-col gap-5">
            <h3 className="font-semibold">Password</h3>

            <span className="w-full flex flex-col gap-4">
              {/* current password */}
              <span className="w-full flex flex-col gap-2">
                <label htmlFor="currentPassword" className={normalMessage}>
                  {errorCurrentPassword ? (
                    <span className={errorMessage}>
                      {errorCurrentPassword.message}
                    </span>
                  ) : (
                    <span>Current Password</span>
                  )}
                </label>
                <input
                  {...form.register("currentPassword")}
                  type="password"
                  className="w-full px-8 py-4 rounded-md bg-gray-200/75"
                />
              </span>
              <span className="w-full flex flex-col md:flex-row gap-2">
                {/* new password */}
                <span className="w-full md:w-1/2 flex flex-col gap-2">
                  <label htmlFor="newPassword" className={normalMessage}>
                    {errorNewPassword ? (
                      <span className={errorMessage}>
                        {errorNewPassword.message}
                      </span>
                    ) : (
                      <span>New Password</span>
                    )}
                  </label>
                  <input
                    {...form.register("newPassword")}
                    type="password"
                    className="w-full px-8 py-4 rounded-md bg-gray-200/75"
                  />
                </span>

                {/* confirm new password */}
                <span className="w-full md:w-1/2 flex flex-col gap-2">
                  <label htmlFor="confirmNewPassword" className={normalMessage}>
                    {errorConfirmNewPassword ? (
                      <span className={errorMessage}>
                        {errorConfirmNewPassword.message}
                      </span>
                    ) : (
                      <span>Confirm New Password</span>
                    )}
                  </label>
                  <input
                    {...form.register("confirmNewPassword")}
                    type="password"
                    className="w-full px-8 py-4 rounded-md bg-gray-200/75"
                  />
                </span>
              </span>
            </span>
          </div>

          <button
            type="submit"
            className="w-full px-8 py-4 rounded-lg bg-primary text-white hover:bg-opacity-90 transition-hover duration-200"
          >
            Save Changes
          </button>
        </div>
      </SectionContainerStart>
    </form>
  );
}

export function UserInfoSettingsForm({
  userInfoData,
}: UserInfoSettingsFormProps) {
  return (
    <form className="w-full md:w-1/2">
      <SectionContainerStart>
        <h2 className="text-xl font-semibold">Nutritional Info</h2>
      </SectionContainerStart>
    </form>
  );
}
