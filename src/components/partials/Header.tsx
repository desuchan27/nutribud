import { validateRequest } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import UserButton from "../buttons/UserButton";
import db from "@/lib/db";
import { FaCog, FaSignOutAlt } from "react-icons/fa";
import { LogoutButton } from "../buttons/LogoutButton";
import LinkUrl from "@/components/LinkUrl";

export default async function Header() {
  const session = await validateRequest();

  const user = await db.user.findFirst({
    where: {
      id: session.user?.id,
    },
  });

  const sessionId = session.user?.id ?? "";

  const userFirstName = user?.firstName ?? "";
  const userLastName = user?.lastName ?? "";
  const userUsername = user?.username ?? "";
  const userEmail = user?.email ?? "";
  const userProfileImage = user?.profileImage ?? "";

  return (
    <header className="w-full sticky top-0 left-0 bg-white rounded-bl-[2rem] outline outline-b-[0.1rem] outline-zinc-200 z-50">
      <div className="max-w-7xl flex flex-row px-5 sm:px-8 xl:px-0 py-4 mx-auto justify-between items-center">
        <div className="flex flex-row gap-4 items-center">
            <Link 
            className="relative w-24 h-auto md:w-32"
            href="/"
            >
              <Image
                src="/icons/nutribud-icon.svg"
                width={126}
                height={44}
                alt="NutriBud Logo"
                className="cursor-pointer"
              />
            </Link>
        </div>
        <div>
          <nav>
            <ul className="flex flex-row gap-4 items-center">
              <li>
                <UserButton
                  id={sessionId}
                  firstName={userFirstName}
                  lastName={userLastName}
                  userName={userUsername}
                  email={userEmail}
                  profileImage={userProfileImage}
                />
              </li>
              <li className="relative group">
                <Link href="/settings">
                  <FaCog className="h-6 w-6 text-zinc-700 hover:text-zinc-700/75 transition-colors duration-200" />
                  <span className="absolute hidden text-xs bg-gray-100/75 rounded-xl group-hover:block px-2 py-2 transition duration-200">
                    Settings
                  </span>
                </Link>
              </li>
              <li className="relative group">
                <LogoutButton>
                  <FaSignOutAlt className="h-6 w-6 text-zinc-700 hover:text-red-500 transition-colors duration-200" />
                  <span className="absolute hidden text-xs bg-gray-100/75 rounded-xl group-hover:block px-2 py-2 transition duration-200">
                    Logout
                  </span>
                </LogoutButton>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
