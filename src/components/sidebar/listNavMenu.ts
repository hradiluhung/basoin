import {
  Home,
  CheckCircle,
  Globe,
  User,
  List,
  MessageCircle,
} from "react-feather";

export const userMenu = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Diikuti",
    href: "/following",
    icon: CheckCircle,
  },
  {
    title: "Temukan Matkul",
    href: "/browse",
    icon: Globe,
  },
  {
    title: "Profil",
    href: "/profile",
    icon: User,
  },
];

export const adminMenu = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Matkul",
    href: "/admin/subject",
    icon: List,
  },
  {
    title: "User",
    href: "/admin/users",
    icon: User,
  },
  {
    title: "Feedback",
    href: "/admin/feedbacks",
    icon: MessageCircle,
  },
];
