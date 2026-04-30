import { createBrowserRouter } from "react-router-dom";

import { dashboardRoutes } from "@/features/dashboard/routes/dashboardRoutes";
import LoginPage from "@/features/auth/pages/LoginPage";
import NotFound from "@/shared/pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  dashboardRoutes,
  {
    path:"*",
    element: <NotFound/>,
  },
]);

export { router };