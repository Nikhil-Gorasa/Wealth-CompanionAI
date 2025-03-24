'use client';

import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart as RechartsLineChart } from 'recharts';

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

export function DashboardCharts() {
  return (
    <>
      <div className="bg-card rounded-lg p-6 shadow-sm border border-border/50">
        <h2 className="text-2xl font-semibold mb-6">Investment Performance</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={investmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 shadow-sm border border-border/50">
        <h2 className="text-2xl font-semibold mb-6">Income vs Expenses</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeExpenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#4ade80" />
              <Bar dataKey="expenses" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
} 