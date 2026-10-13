import {
  BarChart3,
  ShoppingCart,
  Coins,
  TrendingUp,
  ShoppingBasket,
  Sparkles,
  HeartPulse,
  Pill,
  House,
  Boxes,
  Wallet,
  ShoppingBag,
  Megaphone,
  type LucideIcon,
} from "lucide-react";

export type Metric = {
  value: number;
  decimals: number;
  prefix: string;
  suffix: string;
  label: string;
  icon: LucideIcon;
};

// Verified figures only — same Proof Bar values as the rest of the site.
export const METRICS: Metric[] = [
  { value: 30, decimals: 0, prefix: "$", suffix: "M+", label: "Revenue Managed", icon: BarChart3 },
  { value: 11, decimals: 0, prefix: "$", suffix: "M+", label: "Amazon Ad Sales Generated", icon: ShoppingCart },
  { value: 1.8, decimals: 1, prefix: "$", suffix: "M+", label: "Advertising Spend Optimized", icon: Coins },
  { value: 6, decimals: 0, prefix: "", suffix: "x", label: "Weighted ROAS Delivered", icon: TrendingUp },
];

export type DashboardStat = {
  label: string;
  value: string;
  delta: string;
  direction: "up" | "down";
  icon: LucideIcon;
};

export const DASHBOARD_STATS: DashboardStat[] = [
  { label: "Total Revenue", value: "$30,482,781", delta: "28.6%", direction: "up", icon: Wallet },
  { label: "Ad Sales", value: "$11,246,320", delta: "34.2%", direction: "up", icon: ShoppingBag },
  { label: "Ad Spend", value: "$1,812,540", delta: "18.7%", direction: "down", icon: Megaphone },
  { label: "ROAS", value: "6.0x", delta: "41.3%", direction: "up", icon: TrendingUp },
];

export const CHART_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Normalized 0–100 (higher = more revenue/sales), hand-authored to trend
// upward with realistic month-to-month texture — not plotted from real
// account data. Revenue stays the dominant series throughout.
export const REVENUE_SERIES = [22, 27, 25, 33, 38, 42, 48, 52, 58, 68, 74, 86];
export const AD_SALES_SERIES = [12, 15, 14, 19, 22, 25, 29, 33, 37, 44, 49, 58];

export type Category = {
  label: string;
  icon: LucideIcon;
};

export const CATEGORIES: Category[] = [
  { label: "Grocery & Gourmet Food", icon: ShoppingBasket },
  { label: "Skincare & Beauty", icon: Sparkles },
  { label: "Health & Wellness", icon: HeartPulse },
  { label: "Supplements", icon: Pill },
  { label: "Home Goods", icon: House },
  { label: "Specialty Consumer Products", icon: Boxes },
];

export const GROWTH_RESULTS = [
  "Higher revenue",
  "More efficient ad spend",
  "Improved ROAS",
  "Scalable growth",
];
