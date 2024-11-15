import { AuthContainer } from "@/components/auth/AuthContainer";
import Link from "next/link";

export default function RegistrationPage() {
  return (
    <AuthContainer>
      <form className="flex flex-col gap-y-4 w-full">
        <input
          type="name"
          placeholder="Full Name"
          className="w-full px-8 py-4 rounded-md bg-gray-200/75"
        />
        <p className="text-sm text-right pr-2 text-zinc-700">
          First name <span className="text-red-600 font-semibold">*</span>, Last
          name *, Middle Initial.
        </p>
        <input
          type="email"
          placeholder="Email"
          className="w-full px-8 py-4 rounded-md bg-gray-200/75"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-8 py-4 rounded-md bg-gray-200/75"
        />
        <p className="text-sm text-right pr-2 text-zinc-700">
          Must be 6+ characters, and at least 1 uppercase letter
        </p>
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full px-8 py-4 rounded-md bg-gray-200/75"
        />
        <button
          type="submit"
          className="w-full px-8 py-4 rounded-lg bg-primary text-white hover:bg-opacity-90 transition-hover duration-200"
        >
          Login
        </button>
        <p className="place-self-center">
          Already have an account?
          <Link
            href="/login"
            className="ml-2 font-semibold hover:text-underline hover:text-primary transition-hover duration-200"
          >
            Log-in
          </Link>
        </p>
      </form>
    </AuthContainer>
  );
}
