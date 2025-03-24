import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import db from '@/lib/db';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // Fetch user profile
  let userProfile = null;
  try {
    const result = await db.query(
      'SELECT * FROM user_profiles WHERE clerk_id = ?',
      [userId]
    );
    
    if (Array.isArray(result) && result.length > 0) {
      userProfile = result[0];
    } else {
      // If no profile exists, redirect to welcome page
      redirect('/welcome');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // On error, redirect to welcome page
    redirect('/welcome');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Welcome back, {userProfile.full_name}</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Your personal financial assistant is ready to help
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions Card */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded-md hover:bg-accent">
                💬 Start a Chat
              </button>
              <button className="w-full text-left px-4 py-2 rounded-md hover:bg-accent">
                📊 View Portfolio
              </button>
              <button className="w-full text-left px-4 py-2 rounded-md hover:bg-accent">
                ⚙️ Settings
              </button>
            </div>
          </div>

          {/* Financial Overview Card */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Income</p>
                <p className="text-2xl font-bold">₹{userProfile.monthly_income.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Financial Goal</p>
                <p className="text-lg">{userProfile.financial_goal}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Risk Tolerance</p>
                <p className="text-lg">{userProfile.risk_tolerance}</p>
              </div>
            </div>
          </div>

          {/* AI Assistant Card */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
            <p className="text-muted-foreground mb-4">
              Ask me anything about your finances, investments, or financial planning.
            </p>
            <div className="flex gap-2">
              <button className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                Start Chat
              </button>
              <button className="flex-1 bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90">
                Voice Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 