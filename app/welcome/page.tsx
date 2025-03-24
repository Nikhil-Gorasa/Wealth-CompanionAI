import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { WelcomeForm } from '@/components/welcome-form';
import { db } from '@/lib/db';

export default async function WelcomePage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // Check if user data already exists
  try {
    const userProfile = await db.query(
      'SELECT * FROM user_profiles WHERE clerk_id = ?',
      [userId]
    );

    if (userProfile && Array.isArray(userProfile) && userProfile.length > 0) {
      redirect('/dashboard');
    }
  } catch (error) {
    console.error('Error checking user profile:', error);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <WelcomeForm />
        </div>
      </div>
    </div>
  );
} 