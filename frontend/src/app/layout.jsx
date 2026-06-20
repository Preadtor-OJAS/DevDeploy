import { Inter } from 'next/font/google';
import './globals.css';
import NextTopLoader from 'nextjs-toploader';
import { ClientLayout } from '@/components/client-layout';
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexClientProvider } from '@/components/ConvexClientProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'DevDeploy Platform',
  description: 'Deploy applications straight from GitHub to Kubernetes',
};

import { ThemeProvider } from '@/components/theme-provider';
import { Chatbot } from '@/components/chatbot';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <ConvexClientProvider>
              <NextTopLoader color="#3b82f6" showSpinner={false} />
              <ClientLayout>
                {children}
              </ClientLayout>
              <Chatbot />
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}