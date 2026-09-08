import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CategoryBar from "@/components/CategoryBar";
import AiFab from "@/components/AiFab";
import { prisma } from "@/lib/prisma";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "קמא פארם — בית המרקחת המקוון שלך",
  description:
    "קמא פארם — בית מרקחת אונליין: תרופות ללא מרשם, ויטמינים, טיפוח, תינוקות ועוד. משלוח עד הבית ותשלום מאובטח בכרטיס אשראי.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { name: true, slug: true, icon: true },
  });

  return (
    <html lang="he" dir="rtl" className={`${rubik.variable}`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Header />
          <CategoryBar categories={categories} />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <AiFab />
        </CartProvider>
      </body>
    </html>
  );
}
