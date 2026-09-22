export type GrowthStat = {
  brand: string;
  value: number;
  label: string;
};

// Order matches the supplied "Growth Since Working With Us" list — do not reorder or invent figures.
export const GROWTH_STATS: GrowthStat[] = [
  { brand: "Mina Morocco", value: 57, label: "Revenue Growth" },
  { brand: "Darsa Organics", value: 42, label: "Revenue Growth" },
  { brand: "CLn Skincare", value: 34, label: "Revenue Growth" },
  { brand: "Herb to Body", value: 118, label: "Revenue Growth" },
];

export type RevenueGraphSlide = {
  brand: string;
  category: string;
  headline: string;
  problem: string;
  change: string;
  visual: "revenue-graph";
  revenue: number;
  revenueLabel: string;
  yoy: number;
};

export type InventoryFlowSlide = {
  brand: string;
  category: string;
  headline: string;
  problem: string;
  change: string;
  visual: "inventory-flow";
  resultValue: string;
  resultLabel: string;
  flow: string[];
};

export type OptimizationFlowSlide = {
  brand: string;
  category: string;
  headline: string;
  problem: string;
  change: string;
  visual: "optimization-flow";
  resultValue: string;
  resultLabel: string;
  inputs: string[];
};

export type CaseStudySlideData =
  | RevenueGraphSlide
  | InventoryFlowSlide
  | OptimizationFlowSlide;

// Content verbatim from the source brief — no invented figures, dates, or quotes.
export const CASE_STUDY_SLIDES: CaseStudySlideData[] = [
  {
    brand: "CLn Skincare",
    category: "Dermatologist Skincare",
    headline: "Breaking through the growth ceiling.",
    problem:
      "A well-established, well-reviewed skincare brand had a revenue ceiling nobody had been able to explain. The account looked healthy on every individual metric, but growth had stalled.",
    change:
      "Markidly reviewed advertising, listings, and pricing together instead of in isolation, and found the ceiling wasn't in any one lever. It was in how they were interacting.",
    visual: "revenue-graph",
    revenue: 858772,
    revenueLabel: "Monthly Revenue",
    yoy: 45.9,
  },
  {
    brand: "Herb to Body",
    category: "Health & Wellness",
    headline: "Revenue growth through disruption.",
    problem:
      "A warehouse flood put months of inventory at risk mid-growth, threatening to strand the account's rank and momentum right when it mattered most.",
    change:
      "Markidly restructured inventory and advertising in tandem to protect visibility while stock was rebuilt, instead of letting the ad account run blind to what was actually available to sell.",
    visual: "inventory-flow",
    resultValue: "+93%",
    resultLabel: "Revenue Growth Through Disruption",
    flow: ["Inventory", "Supply Disruption", "Advertising Adjusted", "+93% Growth"],
  },
  {
    brand: "Mina Morocco",
    category: "Grocery & Gourmet Foods",
    headline: "Fixing the problem beyond advertising.",
    problem:
      "Advertising spend was climbing, but revenue growth had flattened, a sign that ads were compensating for a problem somewhere else in the account rather than solving it.",
    change:
      "Markidly looked past the ad account to listings, catalog health, and operations, and fixed what advertising alone couldn't reach.",
    visual: "optimization-flow",
    resultValue: "+57%",
    resultLabel: "Revenue Growth",
    inputs: ["Advertising", "Listings", "Catalog", "Operations"],
  },
];
