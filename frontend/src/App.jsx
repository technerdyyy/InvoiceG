import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import Dashboard from "./components/Dashboard";
import AuthPage from "./components/auth/AuthPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
