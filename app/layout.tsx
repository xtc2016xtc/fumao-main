import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';
import './globals.css';
import { auth } from '@/auth';
import { ApolloWrapper } from './ApolloWrapper';
import localFont from 'next/font/local'
import cn from 'classnames'
 
// Font files can be colocated inside of `app`
// const myFont = localFont({
//   src: './AlibabaHealthFont2.0CN-45R.ttf',
//   variable: '--font-my',
// })


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next Shadcn',
  description: 'Basic dashboard with Next.js and Shadcn'
};
// className={`${inter.className} overflow-hidden`}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning >
      <body >
        <NextTopLoader />
        <Providers session={session}>
          <Toaster />
            <ApolloWrapper>{children}</ApolloWrapper>
        </Providers>
      </body>
    </html>
  );
}
