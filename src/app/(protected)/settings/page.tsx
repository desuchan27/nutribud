import { validateRequest } from "@/auth";
import { PageContainer } from "@/components/containers/PageContainer";
import { UserInfoSettingsForm, UserSettingsForm } from "@/components/forms/UserSettingsForm";
import db from "@/lib/db";

export default async function Settings() {
  const session = await validateRequest();

  const getUserData = await db.user.findUnique({
    where: {
      id: session.user?.id,
    },
  });

  const getUserInfoData = await db.userInfo.findUnique({
    where: {
      userId: session.user?.id,
    },
  });

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row">
        <UserSettingsForm userData={getUserData} />
        <UserInfoSettingsForm userInfoData={getUserInfoData} />
      </div>
    </PageContainer>
  );
}
