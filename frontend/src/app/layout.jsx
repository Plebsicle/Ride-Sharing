import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RideShare - Your Journey, Our Priority",
  description: "A modern ride-sharing platform connecting passengers with verified drivers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'var(--font-geist-sans)',
          margin: 0,
          padding: 0,
          backgroundColor: '#f8fafc',
          color: '#1e293b',
          lineHeight: 1.5,
        }}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
