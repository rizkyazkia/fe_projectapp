import React from "react";
import { useAuth } from "../../../hooks/auth/useAuth";

const Index = () => {
  const { accessToken } = useAuth();
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

export default Index;
