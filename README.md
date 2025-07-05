📅 Schedulrr - Simplify Your Scheduling

![Schedulrr Banner](https://scheduler-gilt-phi.vercel.app/_next/image?url=%2Fposter.png&w=3840&q=75)

A modern, full-featured scheduling application built with Next.js that helps you manage your time effectively. Create events, set your availability, and let others book time with you seamlessly.

🚀 Live Demo

[Try Schedulrr Live](https://scheduler-gilt-phi.vercel.app/)

✨ Features

🎯 Core Functionality
- Event Management: Create and customize different types of events/meetings
- Availability Control: Define your working hours and available time slots
- Custom Booking Links: Share personalized scheduling links with clients and colleagues
- Automated Scheduling: Real-time availability checking and booking confirmation

🔗 Integrations
- Google Calendar Sync: All scheduled meetings automatically appear in your Google Calendar
- Email Notifications: Automatic email invitations sent to both organizer and attendees
- Calendar Invites: Professional calendar invitations with meeting details

💼 Professional Features
- Multiple Event Types: Set up different meeting types (1-on-1, team meetings, consultations)
- Buffer Time: Add buffer time between meetings
- Meeting Preferences: Set meeting duration, location, and description
- Booking Confirmations: Instant confirmations for all parties involved

🎨 User Experience
- Responsive Design: Works perfectly on desktop, tablet, and mobile devices
- Intuitive Interface: Clean, modern UI that's easy to navigate
- Real-time Updates: Live availability updates and booking status
- Professional Branding: Customizable booking pages that reflect your brand

🛠️ Tech Stack

- Frontend: Next.js 14 (App Router)
- Styling: Tailwind CSS
- Authentication: NextAuth.js
- Database: PostgreSQL with Prisma ORM
- Email Service: Resend/SendGrid
- Calendar Integration: Google Calendar API
- Deployment: Vercel
- Font: Geist (Vercel's font family)

📦 Installation

Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- PostgreSQL database
- Google Calendar API credentials

Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/schedulrr.git
   cd schedulrr
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Environment Variables
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="your-postgresql-connection-string"
   
   # NextAuth
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Google OAuth & Calendar
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Email Service
   RESEND_API_KEY="your-resend-api-key"
   ```

4. Database Setup
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. Open your browser
   Navigate to [http://localhost:3000](http://localhost:3000)

🎥 Demo Video

[Watch the complete demo]( https://drive.google.com/file/d/1phW37i9qXHML-ZPBUBWZ4xnj2HSRYANR/view?usp=sharing  ) - See all features in action including:
- Creating and managing events
- Setting availability
- Booking process from client perspective
- Google Calendar integration
- Email notifications

📱 How It Works

For Event Organizers:
1. Sign Up: Create your free Schedulrr account
2. Set Availability: Define when you're available for meetings
3. Create Events: Set up different types of meetings with custom durations
4. Share Your Link: Send your personalized scheduling link to clients
5. Get Booked: Receive automatic confirmations and calendar invites

For Attendees:
1. Visit Booking Link: Click on the shared scheduling link
2. Choose Event Type: Select the type of meeting needed
3. Pick Time Slot: Choose from available time slots
4. Enter Details: Provide name, email, and any additional information
5. Confirm Booking: Receive instant confirmation and calendar invite

🔧 Configuration

Google Calendar Integration
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add your credentials to environment variables

Email Setup
Configure your preferred email service:
- Resend: Add your API key to `RESEND_API_KEY`
- SendGrid: Alternative email service configuration

📊 What Users Say

> "Schedulrr has transformed how I manage my team's meetings. It's intuitive and saves us hours every week!"
> 
> *Sarah Johnson, Marketing Manager*

> "As a freelancer, Schedulrr helps me stay organized and professional. My clients love how easy it is to book time with me."
> 
> *David Lee, Freelance Designer*

> "The Google Calendar integration is seamless. I never miss a meeting, and my clients always receive proper invitations."
> 
> *Emily Chen, Startup Founder*

🚀 Deployment

Deploy on Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy - Vercel will automatically build and deploy your app

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

Manual Deployment

```bash
npm run build
npm run start
```

📝 API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/events/*` - Event management
- `/api/availability/*` - Availability settings
- `/api/bookings/*` - Booking management
- `/api/calendar/*` - Calendar integration

🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

🆘 Support

If you encounter any issues or have questions:
- Create an issue on GitHub
- Check the [documentation](https://nextjs.org/docs)
- Contact: [your-email@example.com]

Made with ❤️ using Next.js

Schedulrr - Because your time matters
