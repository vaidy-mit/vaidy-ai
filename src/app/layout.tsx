import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vaidy.ai"),
  title: {
    default: "Vaidy | Lead AI Engineer @ Meta",
    template: "%s | vaidy.ai"
  },
  description: "Building production-grade Agentic AI systems at Meta. Lead AI Engineer designing autonomous multi-agent architectures, 5 US Patents, Meta Connect 2025 Speaker.",
  keywords: [
    "Vaidyanathan",
    "Vaidy",
    "AI Engineer",
    "Meta",
    "Agentic AI",
    "Multi-Agent Systems",
    "Autonomous AI",
    "Machine Learning",
    "LLMs",
    "Knowledge Graphs",
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
    title: "Vaidy | Lead AI Engineer @ Meta",
    description: "Building production-grade Agentic AI systems at Meta. 5 US Patents, Meta Connect 2025 Speaker, ACM ICPC Finalist.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Vaidy - Lead AI Engineer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaidy | Lead AI Engineer @ Meta",
    description: "Building production-grade Agentic AI systems at Meta.",
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
      <body className={`${jetbrainsMono.variable} ${spaceGrotesk.variable} antialiased bg-[var(--bg-primary)]`}>
        <Navigation />
        <main>{children}</main>
        <footer className="border-t border-[var(--border-color)] mt-auto print:hidden">
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
