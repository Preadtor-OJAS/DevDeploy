import { UserProfile } from '@clerk/nextjs';

export default function SettingsPage() {
  return (
    <div className="flex w-full justify-center py-8">
      <UserProfile routing="hash" />
    </div>
  );
}
