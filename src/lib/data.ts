import {
  Bell,
  BookOpen,
  Clock,
  Crown,
  Gamepad2,
  Home,
  LayoutGrid,
  Medal,
  Percent,
  Play,
  Settings,
  Shield,
  Sparkles,
  Star,
  Swords,
  Target,
  TrendingUp,
  Trophy,
  User,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
};

export type PlatformStat = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export type UserStat = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export type LiveMatch = {
  id: string;
  white: { name: string; rating: number; avatar: string };
  black: { name: string; rating: number; avatar: string };
};

export type Tournament = {
  id: string;
  name: string;
  prize: string;
  datetime: string;
  icon: "trophy" | "zap" | "clock";
};

export type ActivityItem = {
  id: string;
  message: string;
  time: string;
  icon: LucideIcon;
  highlight?: string;
};

export type FeatureItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const user = {
  name: "Arjun",
  rating: 1842,
  avatar: "A",
  badge: "Diamond II",
  badgeRange: "1801 – 2000",
};

export const navItems: NavItem[] = [
  { label: "Home", href: "#", icon: Home, active: true },
  { label: "Play", href: "#play", icon: Play },
  { label: "Tournaments", href: "#tournaments", icon: Trophy },
  { label: "Leaderboard", href: "#leaderboard", icon: Medal },
  { label: "Learn", href: "#learn", icon: BookOpen },
  { label: "Profile", href: "#profile", icon: User },
  { label: "Settings", href: "#settings", icon: Settings },
];

export const platformStats: PlatformStat[] = [
  { label: "Players", value: "1.2M+", icon: User },
  { label: "Online Now", value: "50K+", icon: Zap },
  { label: "Games Played", value: "2.5M+", icon: Gamepad2 },
];

export const userStats: UserStat[] = [
  { label: "Rating", value: "1842", icon: TrendingUp },
  { label: "Games", value: "342", icon: Gamepad2 },
  { label: "Wins", value: "180", icon: Trophy },
  { label: "Win Rate", value: "57.8%", icon: Percent },
  { label: "Best Rating", value: "1987", icon: Star },
];

export const liveMatches: LiveMatch[] = [
  {
    id: "1",
    white: { name: "GM Magnus Carlsen", rating: 2830, avatar: "MC" },
    black: { name: "GM Hikaru", rating: 2780, avatar: "HN" },
  },
  {
    id: "2",
    white: { name: "IM Anna Muzychuk", rating: 2520, avatar: "AM" },
    black: { name: "FM Alex Smith", rating: 2410, avatar: "AS" },
  },
  {
    id: "3",
    white: { name: "ChessMaster123", rating: 1842, avatar: "C1" },
    black: { name: "KnightRider99", rating: 1820, avatar: "KR" },
  },
];

export const tournaments: Tournament[] = [
  {
    id: "1",
    name: "ChessQ Championship",
    prize: "$20,000 Prize Pool",
    datetime: "Sat, 8:00 PM UTC",
    icon: "trophy",
  },
  {
    id: "2",
    name: "Blitz Battle Arena",
    prize: "$5,000 Prize Pool",
    datetime: "Sun, 6:00 PM UTC",
    icon: "zap",
  },
  {
    id: "3",
    name: "Weekly Rapid Open",
    prize: "$1,500 Prize Pool",
    datetime: "Fri, 7:30 PM UTC",
    icon: "clock",
  },
];

export const recentActivity: ActivityItem[] = [
  {
    id: "1",
    message: "You won against ChessMaster123",
    time: "3 min ago",
    icon: Swords,
    highlight: "won",
  },
  {
    id: "2",
    message: "Your rating increased +12 points",
    time: "15 min ago",
    icon: TrendingUp,
    highlight: "+12",
  },
  {
    id: "3",
    message: "You completed Daily Challenge",
    time: "1 hour ago",
    icon: Target,
  },
  {
    id: "4",
    message: "Tournament registered: Blitz Battle Arena",
    time: "2 hours ago",
    icon: Trophy,
    highlight: "Blitz Battle Arena",
  },
];

export const features: FeatureItem[] = [
  {
    title: "Smart Matchmaking",
    description: "Play with players of your level.",
    icon: LayoutGrid,
  },
  {
    title: "Advanced Analytics",
    description: "Analyze your games and improve.",
    icon: TrendingUp,
  },
  {
    title: "Learn & Improve",
    description: "Puzzles, lessons and training modules.",
    icon: BookOpen,
  },
  {
    title: "Secure & Fair",
    description: "Anti-cheat protection for fair play.",
    icon: Shield,
  },
];

export const tournamentIcons = {
  trophy: Trophy,
  zap: Zap,
  clock: Clock,
} as const;

export const premiumIcon = Crown;
export const logoIcon = Sparkles;
export const notificationIcon = Bell;
