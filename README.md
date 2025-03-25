# Wealth CompanionAI

A GenAI-Powered Financial Assistant for Better Investing Decisions

## 🎯 Problem Statement

Financial literacy remains a significant challenge in India, with 76% of adults lacking basic financial knowledge (Standard & Poor's Survey). This creates several barriers:

- **Information Overload**: New investors struggle with complex financial jargon and overwhelming resources
- **Scalability Gap**: Human financial advisors cannot serve millions of first-time investors
- **Scam Vulnerability**: Lack of financial literacy makes people susceptible to investment scams
- **Access Barriers**: Traditional financial advice is often expensive and inaccessible to the masses

## 💡 Solution

Wealth CompanionAI is an AI-powered financial assistant that provides personalized investment guidance and education through natural conversations. Our solution:

- **Democratizes Financial Advice**: Makes expert financial guidance accessible to everyone
- **Simplifies Complex Concepts**: Uses plain language and analogies to explain financial terms
- **Personalizes Recommendations**: Tailors advice based on user profiles and goals
- **Prevents Scams**: Helps users identify and avoid suspicious investment opportunities

## 🚀 Core Features

### 1. Conversational Interface
- **Natural Language Processing**: Users can ask questions in plain language
- **Voice Support**: 
  - Speech-to-text for voice input
  - Text-to-speech for responses
  - Multi-language support (English, Hindi)
- **Contextual Understanding**: AI maintains conversation context for follow-up questions
- **Interactive Format**: Responses include expandable sections for detailed information

### 2. Personalized Financial Guidance
- **Goal-Based Planning**:
  - Calculate required monthly investments for specific goals
  - Track progress towards financial objectives
  - Adjust recommendations based on changing circumstances
- **Risk Profiling**:
  - Interactive risk assessment
  - Personalized investment recommendations
  - Regular risk tolerance updates

### 3. Educational Features
- **Scheme Explainer**:
  - Break down complex financial terms
  - Provide real-world analogies
  - Include examples and scenarios
- **Investment Basics**:
  - Explain fundamental concepts
  - Share best practices
  - Highlight common mistakes to avoid

### 4. Security & Trust
- **Scam Detection**:
  - Flag suspicious investment opportunities
  - Verify information against reliable sources
  - Provide warning signs and red flags
- **Data Privacy**:
  - Secure user data storage
  - Transparent data usage policies
  - User consent management

## 🛠️ Technical Stack

### Frontend
- **Next.js 14**
  - Server-side rendering for better SEO
  - App Router for improved performance
  - Server components for reduced client-side JavaScript
- **React**
  - Component-based architecture
  - Hooks for state management
  - Context API for global state
- **Tailwind CSS**
  - Utility-first styling
  - Responsive design
  - Dark mode support
- **Shadcn/ui**
  - Pre-built accessible components
  - Consistent design system
  - Customizable components

### Backend
- **Google Cloud Platform**
  - Gemini Pro API for AI responses
  - Vertex AI for model fine-tuning
  - Cloud SQL for data storage
- **Firebase**
  - Firestore for real-time data
  - Authentication via Clerk
  - Hosting and deployment
- **Clerk**
  - User authentication
  - Profile management
  - Session handling

### AI & Machine Learning
- **Gemini Pro**
  - Natural language understanding
  - Context-aware responses
  - Multi-language support
- **Vertex AI**
  - Custom model training
  - Financial data analysis
  - Risk assessment models

## 🔧 Implementation Details

### 1. User Authentication
- Secure signup/login with Clerk
- Profile creation and management
- Session handling and security

### 2. Chat Interface
- Real-time message updates
- Message history persistence
- Voice input/output support
- Message formatting and styling

### 3. AI Integration
- Context-aware responses
- Personalized recommendations
- Multi-language support
- Error handling and fallbacks

### 4. Data Management
- User profile storage
- Chat history persistence
- Financial data security
- Privacy compliance

## 🎯 Future Enhancements

1. **Advanced Features**
   - Portfolio tracking
   - Investment recommendations
   - Market analysis
   - Tax planning

2. **Integration Opportunities**
   - Banking APIs
   - Investment platforms
   - Tax filing systems
   - Educational resources

3. **Platform Expansion**
   - Mobile app development
   - WhatsApp integration
   - Browser extensions
   - API marketplace

## 📈 Impact & Benefits

1. **For Users**
   - Access to expert financial advice
   - Improved financial literacy
   - Better investment decisions
   - Protection from scams

2. **For Society**
   - Increased financial inclusion
   - Reduced wealth inequality
   - Economic empowerment
   - Sustainable development

3. **For Financial Industry**
   - Wider customer base
   - Reduced customer acquisition costs
   - Better customer education
   - Trust building

## 🚀 Getting Started

1. **Prerequisites**
   ```bash
   Node.js 18+
   npm or yarn
   Google Cloud account
   Clerk account
   ```

2. **Installation**
   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/wealth-companion-ai.git

   # Install dependencies
   npm install

   # Set up environment variables
   cp .env.example .env.local

   # Start the development server
   npm run dev
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Google Cloud
   GEMINI_API_KEY=your_gemini_api_key
   GOOGLE_ACCESS_TOKEN=your_google_access_token

   # Database
   DATABASE_URL=your_database_url
   ```

   > ⚠️ **Security Note**: Never commit your `.env` files or expose your API keys. The `.env.local` file is already included in `.gitignore` to prevent accidental commits.

   To get your API keys:
   1. Create a Clerk account at https://clerk.dev
   2. Set up a Google Cloud project and enable the Gemini API
   3. Generate API keys from your Google Cloud Console
   4. Store these keys securely and never share them publicly

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Cloud Platform
- Clerk Authentication
- Next.js Team
- All contributors and supporters

---

Built with ❤️ for better financial literacy in India 