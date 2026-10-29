"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Briefcase,
  CalendarCheck,
  CaretLeft,
  CaretRight,
  Certificate,
  ChartBar,
  Check,
  Code,
  Copy,
  DownloadSimple,
  EnvelopeSimple,
  Eye,
  Flask,
  GithubLogo,
  Globe,
  GraduationCap,
  IconContext,
  InstagramLogo,
  LinkedinLogo,
  List,
  Monitor,
  Moon,
  PenNib,
  PencilSimpleLine,
  Plus,
  Stack,
  Sun,
  Trophy,
  UserPlus,
  UsersThree,
  WhatsappLogo,
  Wrench,
  X,
} from "@phosphor-icons/react";
import type { ReactNode } from "react";

/**
 * The single client boundary for icons.
 *
 * Why this file exists: Phosphor v2's IconBase calls useContext, so importing
 * @phosphor-icons/react from a Server Component throws. Routing every icon
 * through this one "use client" module keeps exactly one client boundary and
 * lets Server Components render icons safely.
 *
 * Spec 2.13: one family, one stroke weight (regular), 24px by default, 20px
 * inline, currentColor. This table is the whole allowed set.
 */
const icons = {
  GraduationCap,
  CalendarCheck,
  Stack,
  UserPlus,
  Eye,
  Code,
  ChartBar,
  Flask,
  PenNib,
  PencilSimpleLine,
  Briefcase,
  UsersThree,
  Trophy,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  DownloadSimple,
  CaretLeft,
  CaretRight,
  Certificate,
  Check,
  Copy,
  Plus,
  Monitor,
  Sun,
  Moon,
  EnvelopeSimple,
  LinkedinLogo,
  GithubLogo,
  InstagramLogo,
  WhatsappLogo,
  Globe,
  List,
  Wrench,
  X,
} as const;

export type IconName = keyof typeof icons;

export type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
  /**
   * Defaults to decorative. Pass a title for the rare icon that carries meaning
   * on its own, such as an icon-only button.
   */
  title?: string;
};

export function Icon({ name, size = 24, className, title }: IconProps) {
  const Component = icons[name];
  return (
    <Component
      size={size}
      weight="regular"
      className={className}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      role={title ? "img" : undefined}
    />
  );
}

/** Spec 2.13: the family and stroke weight are set once, globally. */
export function IconProvider({ children }: { children: ReactNode }) {
  return (
    <IconContext.Provider value={{ weight: "regular", size: 24, mirrored: false }}>
      {children}
    </IconContext.Provider>
  );
}
