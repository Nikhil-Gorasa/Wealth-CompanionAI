'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface WelcomeFormProps {
  initialData?: {
    full_name: string;
    age: number;
    monthly_income: number;
    financial_goal: string;
    risk_tolerance: string;
    occupation: string;
    investment_experience: string;
    existing_investments: string;
    monthly_expenses: number;
    dependents: number;
    preferred_investment_types: string;
  };
  isUpdate?: boolean;
}

interface FormData {
  full_name: string;
  age: string | number;
  monthly_income: string | number;
  financial_goal: string;
  risk_tolerance: string;
  occupation: string;
  investment_experience: string;
  existing_investments: string;
  monthly_expenses: string | number;
  dependents: string | number;
  preferred_investment_types: string;
  [key: string]: string | number; // Add index signature
}

export function WelcomeForm({ initialData, isUpdate = false }: WelcomeFormProps) {
  const router = useRouter();
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    full_name: initialData?.full_name || '',
    age: initialData?.age || '',
    monthly_income: initialData?.monthly_income || '',
    financial_goal: initialData?.financial_goal || '',
    risk_tolerance: initialData?.risk_tolerance || '',
    occupation: initialData?.occupation || '',
    investment_experience: initialData?.investment_experience || '',
    existing_investments: initialData?.existing_investments || '',
    monthly_expenses: initialData?.monthly_expenses || '',
    dependents: initialData?.dependents || '',
    preferred_investment_types: initialData?.preferred_investment_types || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      const requiredFields = ['full_name', 'age', 'monthly_income', 'financial_goal', 'risk_tolerance', 'occupation'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setIsLoading(false);
        return;
      }

      // Format numeric values
      const formattedData = {
        ...formData,
        age: formData.age ? parseInt(String(formData.age)) : null,
        monthly_income: formData.monthly_income ? parseFloat(String(formData.monthly_income)) : null,
        monthly_expenses: formData.monthly_expenses ? parseFloat(String(formData.monthly_expenses)) : null,
        dependents: formData.dependents ? parseInt(String(formData.dependents)) : null,
      };

      const response = await fetch('/api/user-profile', {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerk_id: userId,
          ...formattedData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to save profile');
      }

      toast.success(
        isUpdate ? 'Profile updated successfully' : 'Welcome to WealthCompanion AI!'
      );

      if (!isUpdate) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold">
              {isUpdate ? 'Update Your Profile' : 'Welcome to WealthCompanion AI'}
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              {isUpdate 
                ? 'Update your preferences anytime'
                : "Let's personalize your financial journey"
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <Input
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Age *</label>
                <Input
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                  placeholder="25"
                  min="18"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Occupation *</label>
                <Input
                  name="occupation"
                  type="text"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                  placeholder="Software Engineer"
                />
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Financial Information</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">Monthly Income (₹) *</label>
                <Input
                  name="monthly_income"
                  type="number"
                  value={formData.monthly_income}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                  placeholder="50000"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Monthly Expenses (₹)</label>
                <Input
                  name="monthly_expenses"
                  type="number"
                  value={formData.monthly_expenses}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="30000"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Number of Dependents</label>
                <Input
                  name="dependents"
                  type="number"
                  value={formData.dependents}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {/* Investment Profile */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Investment Profile</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">Financial Goal *</label>
                <Select
                  value={formData.financial_goal}
                  onValueChange={(value) => handleSelectChange('financial_goal', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your financial goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retirement_planning">Retirement Planning</SelectItem>
                    <SelectItem value="investment_growth">Investment Growth</SelectItem>
                    <SelectItem value="emergency_savings">Emergency Savings</SelectItem>
                    <SelectItem value="debt_management">Debt Management</SelectItem>
                    <SelectItem value="education_funding">Education Funding</SelectItem>
                    <SelectItem value="home_purchase">Home Purchase</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Risk Tolerance *</label>
                <Select
                  value={formData.risk_tolerance}
                  onValueChange={(value) => handleSelectChange('risk_tolerance', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your risk tolerance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Investment Experience</label>
                <Select
                  value={formData.investment_experience}
                  onValueChange={(value) => handleSelectChange('investment_experience', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your investment experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Experience</SelectItem>
                    <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                    <SelectItem value="experienced">Experienced (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">Existing Investments</label>
                <Select
                  value={formData.existing_investments}
                  onValueChange={(value) => handleSelectChange('existing_investments', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your existing investments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Investments</SelectItem>
                    <SelectItem value="stocks">Stocks</SelectItem>
                    <SelectItem value="mutual_funds">Mutual Funds</SelectItem>
                    <SelectItem value="fixed_deposits">Fixed Deposits</SelectItem>
                    <SelectItem value="real_estate">Real Estate</SelectItem>
                    <SelectItem value="multiple">Multiple Types</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Preferred Investment Types</label>
                <Select
                  value={formData.preferred_investment_types}
                  onValueChange={(value) => handleSelectChange('preferred_investment_types', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your preferred investments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stocks">Stocks</SelectItem>
                    <SelectItem value="mutual_funds">Mutual Funds</SelectItem>
                    <SelectItem value="fixed_income">Fixed Income</SelectItem>
                    <SelectItem value="real_estate">Real Estate</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    <SelectItem value="mixed">Mixed Portfolio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button type="submit" size="lg" className="min-w-[200px]" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUpdate ? 'Update Profile' : 'Start Your Journey'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 