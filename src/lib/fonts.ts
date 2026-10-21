import { Inter } from "next/font/google";

/**
 * Общий шрифт для обоих root layout — публичного сайта и админки.
 */
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
