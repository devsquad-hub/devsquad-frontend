import { PageHeading } from "@/components/page-heading";
import { ProfileForm } from "@/components/profile-form";
import { currentAccount } from "@/lib/api";

export default async function ProfilePage() {
  const account = await currentAccount();
  return (
    <div className="content-width">
      <PageHeading
        title="Perfil"
        description="Estas informações aparecem para a comunidade."
      />
      <ProfileForm account={account} />
    </div>
  );
}
