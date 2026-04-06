import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Link,
  Outlet,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import {
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  Package,
  Receipt,
  Sprout,
  Truck,
  User,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const GREEN = "oklch(0.22 0.06 148)";
const GOLD = "oklch(0.72 0.13 80)";
const SIDEBAR_ACTIVE = "oklch(0.28 0.065 148)";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/customers", label: "Customers", icon: Users },
  { to: "/dashboard/suppliers", label: "Suppliers", icon: Truck },
  { to: "/dashboard/stock", label: "Stock / Inventory", icon: Package },
  { to: "/dashboard/billing", label: "Billing", icon: Receipt },
  { to: "/dashboard/seeds", label: "Seed Catalog", icon: Leaf },
  { to: "/dashboard/profile", label: "My Profile", icon: User },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.navigate({ to: "/" });
  };

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "U";

  const isActive = (to: string) => {
    if (to === "/dashboard")
      return currentPath === "/dashboard" || currentPath === "/dashboard/";
    return currentPath.startsWith(to);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div
        className="px-5 py-5 border-b"
        style={{ borderColor: "oklch(0.3 0.05 148)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "oklch(0.28 0.065 148)" }}
          >
            <Sprout className="w-5 h-5" style={{ color: GOLD }} />
          </div>
          <div>
            <p
              className="text-xs font-semibold leading-tight"
              style={{ color: GOLD }}
            >
              Laxmi Beej Bhandar
            </p>
            <p className="text-xs" style={{ color: "oklch(0.6 0.03 148)" }}>
              {user?.storeName}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              data-ocid={`sidebar.${label.toLowerCase().replace(/[^a-z0-9]/g, "_")}.link`}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: active ? SIDEBAR_ACTIVE : "transparent",
                color: active ? GOLD : "oklch(0.75 0.03 148)",
                fontWeight: active ? 600 : 400,
              }}
            >
              <Icon
                className="w-4 h-4 shrink-0"
                style={{ color: active ? GOLD : "oklch(0.65 0.05 148)" }}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div
        className="px-3 py-4 border-t"
        style={{ borderColor: "oklch(0.3 0.05 148)" }}
      >
        <button
          type="button"
          onClick={handleLogout}
          data-ocid="sidebar.logout.button"
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{ color: "oklch(0.65 0.08 33)" }}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "oklch(0.94 0.035 85)" }}
    >
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col w-56 shrink-0"
        style={{ background: GREEN }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -224 }}
              animate={{ x: 0 }}
              exit={{ x: -224 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-56 z-50 md:hidden flex flex-col"
              style={{ background: GREEN }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header
          className="flex items-center justify-between px-5 py-3 shrink-0"
          style={{
            background: "white",
            borderBottom: "1px solid oklch(0.88 0.03 85)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="md:hidden p-1.5 rounded-lg"
              onClick={() => setSidebarOpen(true)}
              style={{ color: GREEN }}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p
                className="text-sm font-bold font-display"
                style={{ color: GREEN }}
              >
                {user?.storeName ?? "My Store"}
              </p>
              <p className="text-xs" style={{ color: "oklch(0.55 0.02 85)" }}>
                Seed Shop Management
              </p>
            </div>
          </div>
          <Link to="/dashboard/profile" data-ocid="topbar.profile.link">
            <div className="flex items-center gap-2 cursor-pointer">
              <span
                className="text-sm font-medium hidden sm:block"
                style={{ color: "oklch(0.35 0.03 148)" }}
              >
                {user?.firstName} {user?.lastName}
              </span>
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.profilePhoto} />
                <AvatarFallback style={{ background: GREEN, color: GOLD }}>
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-6">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
