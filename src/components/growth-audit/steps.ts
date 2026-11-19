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
  /** Shown as the wheel panel's background while this step is front and
      center. Optional — steps without one leave the shared gradient in
      place. Fill these in as the rest arrive. */
  image?: string;
};

export const AUDIT_STEPS: AuditStep[] = [
  {
    n: "01",
    icon: LayoutDashboard,
    title: "We review your entire account.",
    desc: "Advertising, listings, conversion, inventory, and operations.",
    image: "/images/growth-audit/step-01-account-review.jpg",
  },
  {
    n: "02",
    icon: Search,
    title: "We identify what's actually limiting growth.",
    desc: "Find the real constraint holding the account back right now.",
    image: "/images/growth-audit/step-02-identify-constraint.jpg",
  },
  {
    n: "03",
    icon: Target,
    title: "We prioritize what matters most.",
    desc: "Focus on the opportunities with the biggest potential impact.",
    image: "/images/growth-audit/step-03-prioritize.jpg",
  },
  {
    n: "04",
    icon: ClipboardCheck,
    title: "We build a straightforward action plan.",
    desc: "Clear priorities, practical actions, no unnecessary complexity.",
    image: "/images/growth-audit/step-04-action-plan.jpg",
  },
  {
    n: "05",
    icon: MessageCircle,
    title: "We walk you through it.",
    desc: "No pitch deck. No generic report.",
    image: "/images/growth-audit/step-05-walkthrough.jpg",
  },
];
