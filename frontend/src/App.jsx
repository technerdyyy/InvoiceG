import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import Dashboard from "./components/Dashboard";
import AuthPage from "./components/auth/AuthPage";
import Profile from "./components/Profile";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/profile",
    element: <Profile />,
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
