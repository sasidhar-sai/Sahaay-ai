import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sahaay AI | Discover Relevant Social Welfare & Government Schemes',
  description: 'AI-assisted social-impact web application helping Indian citizens discover verified government welfare schemes based on deterministic rules and Google Gemini AI.',
  keywords: ['government schemes', 'social welfare', 'scholarships', 'farmers', 'PM-KISAN', 'Ayushman Bharat', 'Sahaay AI', 'social impact']
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-govblue-100 selection:text-govblue-900">
        {children}
      </body>
    </html>
  );
}
