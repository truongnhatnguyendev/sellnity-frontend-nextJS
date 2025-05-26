import "./globals.css";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import LayoutComponent from "@/layouts";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Shop Management | Sellnity Admin",
  description:
    "Manage your connected shops and synchronize products across platforms like Shopee, Lazada, Shopify, and your personal website using Sellnity Admin.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <LayoutComponent>{children}</LayoutComponent>
        </AntdRegistry>
      </body>
    </html>
  );
}
