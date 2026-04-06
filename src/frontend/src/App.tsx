import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { useActor } from "./hooks/useActor";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BillingPage from "./pages/dashboard/BillingPage";
import CustomersPage from "./pages/dashboard/CustomersPage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import ProfilePage from "./pages/dashboard/ProfilePage";
import SeedCatalogPage from "./pages/dashboard/SeedCatalogPage";
import StockPage from "./pages/dashboard/StockPage";
import SuppliersPage from "./pages/dashboard/SuppliersPage";

// Wrapper that gets the actor from the hook and passes it to DataProvider
function DataProviderWithActor({ children }: { children: React.ReactNode }) {
  const { actor } = useActor();
  return <DataProvider actor={actor}>{children}</DataProvider>;
}

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <AuthProvider>
      <DataProviderWithActor>
        <Toaster richColors position="top-right" />
        <Outlet />
      </DataProviderWithActor>
    </AuthProvider>
  ),
});

// Landing
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

// Login
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

// Signup
const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupPage,
});

// Dashboard parent
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardLayout,
});

const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/",
  component: DashboardOverview,
});

const customersRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/customers",
  component: CustomersPage,
});

const suppliersRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/suppliers",
  component: SuppliersPage,
});

const stockRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/stock",
  component: StockPage,
});

const billingRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/billing",
  component: BillingPage,
});

const seedsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/seeds",
  component: SeedCatalogPage,
});

const profileRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/profile",
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  signupRoute,
  dashboardRoute.addChildren([
    dashboardIndexRoute,
    customersRoute,
    suppliersRoute,
    stockRoute,
    billingRoute,
    seedsRoute,
    profileRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export { router };

export default function App() {
  return <RouterProvider router={router} />;
}
