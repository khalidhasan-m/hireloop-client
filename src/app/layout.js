import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HireLoop",
  description: "Find your dream job with HireLoop.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#030305] text-white">
        <main className="flex-1">{children}</main>

        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3500,
            style: {
              background: "#111116",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              fontSize: "13px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
            },
            success: {
              duration: 3500,
            },
            error: {
              duration: 4000,
            },
          }}
        />
      </body>
    </html>
  );
}
