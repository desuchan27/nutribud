import { AuthContainer } from "@/components/auth/AuthContainer";
import Link from "next/link";

export default function LoginPage() {
  return (
    <AuthContainer>
      <form className="flex flex-col gap-y-4 w-full">
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
        <a href="#" className="text-right font-semibold hover:text-underline hover:text-primary transition-hover duration-200">
          Forgot your password?
        </a>
        <button
          type="submit"
          className="w-full px-8 py-4 rounded-lg bg-primary text-white hover:bg-opacity-90 transition-hover duration-200"
        >
          Login
        </button>
        <p className="place-self-center">
          Don&apos;t have an account?
          <Link
            href="/register"
            className="ml-2 font-semibold hover:text-underline hover:text-primary transition-hover duration-200"
          >
            Sign-up
          </Link>
        </p>
      </form>
    </AuthContainer>
  );
}
