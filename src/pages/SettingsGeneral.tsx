import { useSettingsForm } from "@/hooks/useSettingsForm";
import { GeneralSettingsForm } from "@/components/settings/GeneralSettingsForm";
import PageLayout from "@/components/layout/PageLayout";

export default function SettingsGeneral() {
  const { form, isLoading } = useSettingsForm();

  if (isLoading) {
    return (
      <PageLayout title="General Settings">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="General Settings" 
      description="Manage your application preferences."
    >
      <GeneralSettingsForm form={form} />
    </PageLayout>
  );
}