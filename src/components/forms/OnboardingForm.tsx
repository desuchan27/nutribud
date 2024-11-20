"use client";

import Image from "next/image";

import * as z from "zod";

import { LogoutButton } from "../buttons/LogoutButton";
import { PageContainer } from "../containers/PageContainer";
import { SectionContainerCenter } from "../containers/SectionContainer";
import { userInfoSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { submitUserInfo } from "@/actions/onboarding.actions";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

interface OnboardingFormProps {
  id: string;
  firstName: string | undefined;
  lastName: string | undefined;
  birthday: Date | undefined;
  height: number | undefined;
  weight: number | undefined;
}

export default function OnboardingForm({
  id,
  firstName,
  lastName,
  birthday,
  height,
  weight,
}: OnboardingFormProps) {
  const form = useForm<z.infer<typeof userInfoSchema>>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      birthDate: birthday, // Convert Date to string (yyyy-mm-dd),
      height: height,
      weight: weight,
    },
  });

  const errorBirthDate = form.formState.errors.birthDate;
  const errorHeight = form.formState.errors.height;
  const errorWeight = form.formState.errors.weight;

  const errorMessage = "text-sm text-red-500 font-semibold text-right";
  const normalMessage = "text-sm text-zinc-700";

  const router = useRouter();

  const onSubmit = (values: z.infer<typeof userInfoSchema>) => {
    startTransition(() => {
      console.log("Height:", height, "Weight:", weight);
      submitUserInfo(id, values).then((data) => {
        console.log(values);
        if (data?.error) {
          form.reset();
          console.log(data.error);
        } else {
          toast.success("Success!");
          router.push("/home");
        }
      });
    });
  };

  return (
    <PageContainer>
      <SectionContainerCenter>
        <Image
          src="/icons/nutribud-icon.svg"
          alt="NutriBud Logo"
          width={200}
          height={88}
        />
        <h1 className="text-2xl text-center">
          Welcome to nutribud! <span className="text-primary font-bold">{firstName} {lastName}</span>
        </h1>
        <p>Palihug ko pabutang ug kaning subheader diri nga something welcoming </p>
      </SectionContainerCenter>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-xl flex flex-col gap-4"
      >
        <span className="flex flex-col gap-2">
          <label htmlFor="name" className={normalMessage}>
            {errorBirthDate ? (
              <span className={errorMessage}>{errorBirthDate.message}</span>
            ) : (
              <span>Enter your birthdate</span>
            )}
          </label>
          <input
            className="w-full px-8 py-4 rounded-md bg-gray-200/75"
            type="date"
            placeholder="kg"
            {...form.register("birthDate")}
          />
        </span>
        <span className="flex flex-col gap-2">
          <label htmlFor="height" className={normalMessage}>
            {errorHeight ? (
              <span className={errorMessage}>{errorHeight.message}</span>
            ) : (
              <span>Height</span>
            )}
          </label>
          <input
            className="w-full px-8 py-4 rounded-md bg-gray-200/75"
            type="number"
            placeholder="cm"
            {...form.register("height")}
          />
        </span>

        <span className="flex flex-col gap-2">
          <label htmlFor="weight" className={normalMessage}>
            {errorWeight ? (
              <span className={errorMessage}>{errorWeight.message}</span>
            ) : (
              <span>Weight:</span>
            )}
          </label>
          <input
            className="w-full px-8 py-4 rounded-md bg-gray-200/75"
            type="number"
            placeholder="kg"
            {...form.register("weight")}
          />
        </span>

        <button type="submit" className="w-full px-8 py-4 rounded-lg bg-primary text-white hover:bg-opacity-90 transition-hover duration-200">
          submit
        </button>
      </form>
      <LogoutButton>Logout</LogoutButton>
    </PageContainer>
  );
}
