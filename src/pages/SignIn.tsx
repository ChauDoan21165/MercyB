// src/pages/SignIn.tsx
// LEGACY / INACTIVE
// Live sign-in route uses: src/pages/LoginPage.tsx
// Kept temporarily to avoid confusion during cleanup.

import React from "react";
import { Navigate } from "react-router-dom";

export default function SignIn() {
  return <Navigate to="/signin" replace />;
}