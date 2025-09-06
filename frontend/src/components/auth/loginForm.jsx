import React, { useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import Button from "../ui/Button";
import Input from "../ui/Input";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Signing in...");
    const result = await login(formData.email, formData.password);
    toast.dismiss(loadingToast);
    if (!result.success) {
      toast.error(result.error || "Failed to sign in");
    } else {
      toast.success("Welcome back!");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleChange("email", e.target.value)}
        placeholder="Enter your email"
      />
      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => handleChange("password", e.target.value)}
        placeholder="Enter your password"
      />
      <Button
        variant="orange"
        size="lg"
        className="w-full cursor-pointer"
        onClick={handleSubmit}
      >
        Login
      </Button>
      {/* <div className="text-center text-sm text-gray-600 mt-4">
        Demo: demo@restaurant.com / demo123
      </div> */}
    </div>
  );
};
export default LoginForm;
