import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ChartColumnStacked,
  UserRoundCog,
  FileQuestion,
  Building,
} from "lucide-react";

const SidebarItemAdmin = [
  {
    id: 1,
    name: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    path: "/admin/dashboard",
  },
  {
    id: 2,
    name: "Manajemen Pengguna",
    icon: <UserRoundCog className="w-4 h-4" />,
    path: "/admin/management-users",
  },
  {
    id: 3,
    name: "Daftar Instansi",
    icon: <Building className="w-4 h-4" />,
    path: "/admin/institution",
  },
  {
    id: 4,
    name: "Daftar Kategori",
    icon: <ChartColumnStacked className="w-4 h-4" />,
    path: "/admin/category",
  },
  {
    id: 5,
    name: "Daftar Pertanyaan",
    icon: <FileQuestion className="w-4 h-4" />,
    path: "/admin/question",
  },
];

const SidebarItemSchool = [
  {
    id: 1,
    name: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    path: "/school/dashboard",
  },
  {
    id: 2,
    name: "Pertanyaan",
    icon: <FileQuestion className="w-4 h-4" />,
    path: "/school/quesioner",
  },
  {
    id: 3,
    name: "Manajemen Guru",
    icon: <UserRoundCog className="w-4 h-4" />,
    path: "/school/management-teachers",
  },
];

const Sidebar = () => {
  const location = useLocation();

  let sidebarItems;
  switch (true) {
    case location.pathname.startsWith("/admin"):
      sidebarItems = SidebarItemAdmin;
      break;
    case location.pathname.startsWith("/school"):
      sidebarItems = SidebarItemSchool;
      break;
    default:
      sidebarItems = [];
      break;
  }

  return (
    <div
      id="hs-application-sidebar"
      className="hs-overlay  [--auto-close:lg]
        hs-overlay-open:translate-x-0
        -translate-x-full transition-all duration-300 transform
        w-65 h-full
        hidden
        fixed inset-y-0 start-0 z-60
        bg-blue-800 border-e border-obito-grey
        lg:block lg:translate-x-0 lg:end-auto lg:bottom-0
      "
      tabIndex="-1"
      aria-label="Sidebar"
    >
      <div className="relative flex flex-col h-full max-h-full">
        <div className="px-6 pt-6 flex items-center">
          {/* Logo */}
          <a className="flex items-center gap-2" href="/" aria-label="logo">
            <div className="aspect-square w-6 h-6">
              <img src="/logo.png" alt="logo" className="w-6 h-6" />
            </div>
            <div className="flex flex-col space-y-3 text-white">
              <h1 className="text-sm font-bold leading-0">Jalinan</h1>
              <p className="text-xs leading-0">Anak Sehat</p>
            </div>
          </a>
          {/* End Logo */}

          <div className="hidden lg:block ms-2"></div>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
          <nav
            className="hs-accordion-group px-3 py-6 w-full flex flex-col flex-wrap"
            data-hs-accordion-always-open
          >
            <ul className="flex flex-col space-y-1">
              {sidebarItems.map((item) => (
                <li key={item.id} className="text-white">
                  <NavLink
                    to={item.path}
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-2 p-3 rounded-xl ${
                        isActive
                          ? "after:content[' '] after:absolute after:bg-obito-background after:w-3 after:h-5 after:-right-2"
                          : null
                      }`
                    }
                  >
                    {item.icon}
                    <span className="text-sm">{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {/* End Content */}
      </div>
    </div>
  );
};

export default Sidebar;
