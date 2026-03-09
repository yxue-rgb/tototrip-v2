import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to toto to save your travel plans, chat history, and favorite locations for your China adventure.",
  openGraph: {
    title: "Sign In | toto",
    description:
      "Sign in to save your China travel plans and chat history.",
  },
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/auth",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
