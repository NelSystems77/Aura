import { getSettings } from "@/lib/repo/settings";
import { SettingsForm } from "./SettingsForm";
import { PasswordForm } from "./PasswordForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-12">
      <div>
        <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl font-bold">
          Ajustes del sitio
        </h1>
        <SettingsForm settings={settings} />
      </div>

      <div>
        <h2 className="mb-6 font-[family-name:var(--font-display)] text-xl font-bold">
          Seguridad
        </h2>
        <PasswordForm />
      </div>
    </div>
  );
}
