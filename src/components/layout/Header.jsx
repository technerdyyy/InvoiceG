import useAuth from "../../hooks/useAuth";
import Button from "../ui/Button";
import React from "react";
import { LogOut } from "lucide-react";

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">
              Invoice Generator
            </h1>
            <span className="text-sm text-gray-500">
              ({currentUser?.businessName})
            </span>
          </div>
          <Button variant="danger" className="cursor-pointer" onClick={logout}>
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
export default Header;
