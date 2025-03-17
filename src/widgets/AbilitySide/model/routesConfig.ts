import { FiBook, FiUpload, FiSearch } from "react-icons/fi";
import { GoHistory } from "react-icons/go";

const routesConfig = [
  {
    path: "/",
    icon: FiBook,
    label: "Home",
    isActive: (pathname: string) => pathname === "/",
  },
  {
    path: "/upload",
    icon: FiUpload,
    label: "Upload",
    isActive: (pathname: string) => pathname.startsWith("/upload"),
  },
  {
    path: "/search",
    icon: FiSearch,
    label: "Search",
    isActive: (pathname: string) => pathname.startsWith("/search"),
  },
  {
    path: "/history",
    icon: GoHistory,
    label: "History",
    isActive: (pathname: string) => pathname.startsWith("/history"),
  },
];

export default routesConfig;
