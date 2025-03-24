import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { WelcomeForm } from '@/components/welcome-form';
import { db } from '@/lib/db';

export default async function SettingsPage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // Fetch existing user data
  let userData = null;
  try {
    const result = await db.query(
      'SELECT * FROM user_profiles WHERE clerk_id = ?',
      [userId]
    );
    
    if (result.length > 0) {
      userData = result[0];
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Update your profile and preferences
        </p>
      </div>

      <div className="grid gap-8">
        <div className="rounded-lg border bg-card p-8">
          <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>
          <WelcomeForm initialData={userData} isUpdate={true} />
        </div>
      </div>
    </div>
  );
} 