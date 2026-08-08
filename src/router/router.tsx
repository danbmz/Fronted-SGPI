import { createBrowserRouter } from "react-router-dom";

import { dashboardRoutes } from "@/features/dashboard/routes/dashboardRoutes";
import LoginPage from "@/features/auth/pages/LoginPage";
import NotFound from "@/shared/pages/NotFound";
import { RaizApp } from "@/shared/components/RaizApp";

const router = createBrowserRouter([
  {
    element: <RaizApp />,       // ← nuevo padre común
    children: [
      {
        path: "/",
        element: <LoginPage />,
      },
      ...dashboardRoutes,
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export { router };