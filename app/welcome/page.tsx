import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { WelcomeForm } from '@/components/welcome-form';
import db from '@/lib/db';

export default async function WelcomePage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // Check if user data already exists
  try {
    const userProfile = await db.query(
      'SELECT * FROM user_profiles WHERE clerk_id = ?',
      [userId]
    );

    // If user profile exists, redirect to dashboard
    if (Array.isArray(userProfile) && userProfile.length > 0) {
      redirect('/dashboard');
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error; // Let Next.js handle the redirect
    }
    console.error('Error checking user profile:', error);
    // Continue to show the welcome form even if there's a DB error
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