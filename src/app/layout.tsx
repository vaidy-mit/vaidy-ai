import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vaidy.ai"),
  title: {
    default: "Vaidy | AI Foundations Team Lead @ Meta Reality Labs",
    template: "%s | vaidy.ai"
  },
  description: "Building the future of developer AI for the Metaverse. AI Foundations Team Lead at Meta Reality Labs, creating intelligent tools for 20K+ developers.",
  keywords: [
    "Vaidyanathan",
    "Vaidy",
    "AI Engineer",
    "Meta Reality Labs",
    "Machine Learning",
    "LLMs",
    "Knowledge Graphs",
    "Agentic AI",
    "Software Engineer",
    "Seattle"
  ],
  authors: [{ name: "Vaidyanathan P K" }],
  creator: "Vaidyanathan P K",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vaidy.ai",
    siteName: "vaidy.ai",
    title: "Vaidy | AI Foundations Team Lead @ Meta Reality Labs",
    description: "Building the future of developer AI for the Metaverse. 5 US Patents, Meta Connect 2025 Speaker, ACM ICPC Finalist.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Vaidy - AI Foundations Team Lead"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaidy | AI Foundations Team Lead @ Meta Reality Labs",
    description: "Building the future of developer AI for the Metaverse.",
    images: ["/og-image.svg"]
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} antialiased bg-[var(--bg-primary)]`}>
        <Navigation />
        <main>{children}</main>
        <footer className="border-t border-[var(--border-color)] mt-auto">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
              <p>
                Built with{" "}
                <span className="text-[var(--text-primary)]">Next.js</span> +{" "}
                <span className="text-[var(--accent-purple)]">D3.js</span> +{" "}
                <span className="text-[var(--accent-pink)]">Tailwind</span>
              </p>
              <p>
                &copy; {new Date().getFullYear()} Vaidyanathan P K
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
