import "./App.css";
import AuthProvider from "./context/AuthContext";
import useAuth from "./hooks/useAuth";
import Dashboard from "../src/components/Dashboard"; // adjust path as needed
import AuthPage from "../src/components/auth/AuthPage"; // adjust path as needed

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

// 🔁 Move this inside the same file
function AppRouter() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Dashboard /> : <AuthPage />;
}

export default App;
