import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ContactButtons from "@/components/ContactButtons";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Phu Nguyen Land - Giải pháp Bất động sản Toàn diện",
  description: "Chúng tôi cung cấp các dịch vụ tư vấn, môi giới và đầu tư bất động sản chuyên nghiệp, giúp bạn đưa ra quyết định thông minh trong lĩnh vực bất động sản.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <ContactButtons />
      </body>
    </html>
  );
}
