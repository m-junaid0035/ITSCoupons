# ITSCoupons

A modern, full-stack coupons website built with Next.js, featuring an admin dashboard for managing coupons, stores, and users. The application provides a seamless experience for browsing and redeeming coupons, with powerful backend tools for content management and analytics.

## Features

- **User Authentication**: Secure login and registration using NextAuth
- **Admin Dashboard**: Comprehensive dashboard with analytics, charts, and management tools
- **Coupon Management**: Create, edit, and manage coupons with rich text descriptions
- **Store Management**: Add and manage partner stores
- **Analytics**: Track user engagement, coupon usage, and store performance
- **Rich Text Editor**: CKEditor integration for detailed coupon descriptions
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Database**: MongoDB with Mongoose for robust data management
- **Charts and Visualizations**: Interactive charts using Chart.js

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Backend**: Next.js API routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Rich Text**: CKEditor 5
- **Charts**: Chart.js with react-chartjs-2
- **State Management**: Zustand
- **Icons**: Lucide React, React Icons
- **Other**: Framer Motion for animations, Zod for validation

## Prerequisites

- Node.js (version 18 or higher)
- MongoDB database
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ITSCoupons
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   # Add other required environment variables as needed
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Users
- Browse available coupons on the homepage
- Register/Login to access personalized features
- Redeem coupons at partner stores

### For Admins
- Access the admin dashboard at `/admin`
- Manage coupons, stores, and users
- View analytics and reports
- Create rich content using the built-in editor

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks
- `npm run registry:build` - Build the component registry

## Project Structure

```
ITSCoupons/
├── src/
│   ├── app/          # Next.js app router pages
│   ├── components/   # Reusable React components
│   ├── lib/          # Utility functions and configurations
│   ├── models/       # MongoDB models
│   ├── types/        # TypeScript type definitions
│   └── actions/      # Server actions
├── public/           # Static assets
├── registry/         # Component registry
└── scripts/          # Build scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/) and [React Icons](https://react-icons.github.io/react-icons/)
