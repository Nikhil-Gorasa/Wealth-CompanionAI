import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Chat } from '@/components/chat';
import { db } from '@/lib/db';
import { Card } from '@/components/ui/card';
import { LineChart, Wallet, TrendingUp, PiggyBank, DollarSign, Percent } from 'lucide-react';
import { RowDataPacket } from 'mysql2';
import { DashboardCharts } from '@/components/dashboard-charts';

interface UserProfile extends RowDataPacket {
  monthly_income: number | null;
  monthly_expenses: number | null;
  existing_investments: string | null;
  preferred_investment_types: string | null;
}

interface FinancialData extends UserProfile {
  total_savings: number;
  investment_value: number;
}

// Sample data for the investment graph
const investmentData = [
  { month: 'Jan', value: 100000 },
  { month: 'Feb', value: 105000 },
  { month: 'Mar', value: 108000 },
  { month: 'Apr', value: 112000 },
  { month: 'May', value: 115000 },
  { month: 'Jun', value: 120000 },
];

// Sample data for the income vs expenses graph
const incomeExpenseData = [
  { month: 'Jan', income: 50000, expenses: 30000 },
  { month: 'Feb', income: 52000, expenses: 31000 },
  { month: 'Mar', income: 51000, expenses: 32000 },
  { month: 'Apr', income: 53000, expenses: 29000 },
  { month: 'May', income: 54000, expenses: 33000 },
  { month: 'Jun', income: 55000, expenses: 34000 },
];

async function getUserFinancialData(userId: string): Promise<FinancialData | null> {
  try {
    const result = await db.query<UserProfile[]>(
      'SELECT monthly_income, monthly_expenses, existing_investments, preferred_investment_types FROM user_profiles WHERE clerk_id = ?',
      [userId]
    );
    
    if (Array.isArray(result) && result.length > 0) {
      const data = result[0];
      const totalSavings = data.monthly_income ? data.monthly_income - (data.monthly_expenses || 0) : 0;
      const investmentValue = data.monthly_income ? data.monthly_income * 0.3 : 0;

      return {
        ...data,
        total_savings: totalSavings,
        investment_value: investmentValue
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user financial data:', error);
    return null;
  }
}

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const financialData = await getUserFinancialData(userId);

  return (
    <div className="container mx-auto h-[calc(100vh-4rem)] py-6 px-4">
      <div className="grid h-full grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-h-0 overflow-hidden">
          <Chat />
        </div>
        <div className="space-y-6 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border/50">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <LineChart className="h-6 w-6 text-primary" />
              Your Financial Overview
            </h2>
            <div className="grid gap-4">
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-full">
                      <Wallet className="h-5 w-5 text-blue-500" />
                    </div>
                    <span className="text-muted-foreground">Total Savings</span>
                  </div>
                  <span className="font-medium">
                    ₹{financialData?.total_savings?.toLocaleString() ?? 'N/A'}
                  </span>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-full">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="text-muted-foreground">Monthly Income</span>
                  </div>
                  <span className="font-medium">
                    ₹{financialData?.monthly_income?.toLocaleString() ?? 'N/A'}
                  </span>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-full">
                      <PiggyBank className="h-5 w-5 text-red-500" />
                    </div>
                    <span className="text-muted-foreground">Monthly Expenses</span>
                  </div>
                  <span className="font-medium">
                    ₹{financialData?.monthly_expenses?.toLocaleString() ?? 'N/A'}
                  </span>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-full">
                      <LineChart className="h-5 w-5 text-purple-500" />
                    </div>
                    <span className="text-muted-foreground">Investment Value</span>
                  </div>
                  <span className="font-medium">
                    ₹{financialData?.investment_value?.toLocaleString() ?? 'N/A'}
                  </span>
                </div>
              </Card>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm border border-border/50">
            <h2 className="text-2xl font-semibold mb-6">Market Indicators</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-full">
                      <DollarSign className="h-5 w-5 text-yellow-500" />
                    </div>
                    <span className="text-muted-foreground">USD/INR Rate</span>
                  </div>
                  <span className="font-medium">₹83.25</span>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-full">
                      <Percent className="h-5 w-5 text-orange-500" />
              </div>
                    <span className="text-muted-foreground">Inflation Rate</span>
              </div>
                  <span className="font-medium">5.02%</span>
              </div>
              </Card>
            </div>
          </div>

          <DashboardCharts />
        </div>
      </div>
    </div>
  );
} 