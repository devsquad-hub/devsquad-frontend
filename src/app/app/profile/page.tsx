import { PageHeading } from "@/components/page-heading";
import { ProfileForm } from "@/components/profile-form";
import { backendFetch } from "@/lib/api";
import type { Account } from "@/lib/api-types";

export default async function ProfilePage() {
  const account = await backendFetch<Account>("/api/v1/me", {
    authenticated: true,
  });
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
