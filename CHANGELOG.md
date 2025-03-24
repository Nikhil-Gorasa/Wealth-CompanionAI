# Changelog - Wealth CompanionAI

## [2024-03-24]

### Added
- Initial project setup with Next.js 15.2.3
- Clerk authentication integration
- Welcome page with user onboarding form
- Dashboard with chat interface
- Voice input/output features using Google Cloud Speech-to-Text and Text-to-Speech
- Gemini AI integration for financial advice
- MySQL database integration for user profiles
- Google Cloud credentials setup
- Settings page for profile updates
- Profile update functionality in welcome form
- API routes for creating and updating user profiles

### Changed
- Updated application name from "Wealth CompanionAI" to "Wealth CompanionAI"
- Fixed speech-to-text API configuration
- Updated welcome page layout and messaging
- Removed duplicate welcome header from page.tsx (kept in WelcomeForm component)
- Modified welcome page to redirect to dashboard if user profile exists
- Enhanced WelcomeForm component to handle both initial setup and updates

### Fixed
- Authentication flow issues
- Speech-to-text API type errors
- Port conflicts in development server
- Invalid next.config.js options
- Duplicate welcome headers in the welcome page
- Redundant profile creation for existing users

### Technical Details
- Next.js version: 15.2.3
- Database: MySQL
- AI Services: Google Cloud Speech-to-Text, Text-to-Speech, Gemini AI
- Authentication: Clerk
- Development Port: 3004 (auto-selected due to port conflicts)

### Database Schema Updates
- Added created_at and updated_at timestamps to user_profiles table
- Standardized column names (full_name, monthly_income, etc.)
- Added clerk_id as primary identifier for user profiles 