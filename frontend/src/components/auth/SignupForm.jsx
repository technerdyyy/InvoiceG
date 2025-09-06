import React, { useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import Input from "../ui/Input";
import Button from "../ui/Button";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Creating account...");
    const result = await signup(formData);
    toast.dismiss(loadingToast);
    if (!result.success) {
      toast.error(result.error || "Failed to create account");
    } else {
      toast.success("Account created successfully!");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <Input
        label="Business Name"
        value={formData.businessName}
        onChange={(e) => handleChange("businessName", e.target.value)}
        placeholder="Enter your business name"
      />
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
      <Input
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => handleChange("confirmPassword", e.target.value)}
        placeholder="Confirm your password"
      />
      <Button
        variant="orange"
        size="lg"
        className="w-full cursor-pointer"
        onClick={handleSubmit}
      >
        Sign Up
      </Button>
    </div>
  );
};

export default SignupForm;
