import db from "@/lib/db";
import ProfileBio from "./components/ProfileBio";

interface ProfileProps {
  params: {
    username: string;
  };
}

export default async function Profile({ params }: ProfileProps) {
  const { username } = params;

  console.log("Received username:", username);

  const user = await db.user.findUnique({
    where: {
      username: username,
    },
  });

  const getUserFirstName = user?.firstName as string;
  const getUserLastName = user?.lastName as string;
  const getUserName = user?.username as string;
  const getUserBio = user?.bio as string || undefined;

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
      <ProfileBio username={getUserName} firstName={getUserFirstName} lastName={getUserLastName} bio={getUserBio}/>
      <div className="border-b-2 pt-2"/>
    </div>
  );
}