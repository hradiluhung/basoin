import { Home, CheckCircle, Globe, User, List, Send } from "react-feather"

export const userMenu = [
  {
    title: "Dashboard",
    href: "/",
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
  {
    title: "Kirim Feedback",
    href: "/feedback",
    icon: Send,
  },
]

export const adminMenu = [
  {
    title: "Dashboard",
    href: "/admin",
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
    icon: Send,
  },
]
