import { validateRequest } from "@/auth";
import { SessionProvider } from "@/lib/auth/SessionContext";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await validateRequest();

  if (!session.user) {
    redirect("/login");
  }
  
  return (
    <SessionProvider value={session}>
      <div className="flex flex-col min-h-dvh">{children}</div>
    </SessionProvider>
  );
}
