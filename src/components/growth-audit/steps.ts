import {
  LayoutDashboard,
  Search,
  Target,
  ClipboardCheck,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

export type AuditStep = {
  n: string;
  icon: LucideIcon;
  title: string;
  desc: string;
};

export const AUDIT_STEPS: AuditStep[] = [
  {
    n: "01",
    icon: LayoutDashboard,
    title: "We review your entire account.",
    desc: "Advertising, listings, conversion, inventory, and operations.",
  },
  {
    n: "02",
    icon: Search,
    title: "We identify what's actually limiting growth.",
    desc: "Find the real constraint holding the account back right now.",
  },
  {
    n: "03",
    icon: Target,
    title: "We prioritize what matters most.",
    desc: "Focus on the opportunities with the biggest potential impact.",
  },
  {
    n: "04",
    icon: ClipboardCheck,
    title: "We build a straightforward action plan.",
    desc: "Clear priorities, practical actions, no unnecessary complexity.",
  },
  {
    n: "05",
    icon: MessageCircle,
    title: "We walk you through it.",
    desc: "No pitch deck. No generic report.",
  },
];
