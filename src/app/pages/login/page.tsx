"use client";

import { LoginForm } from "@/components/login-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (email: string, password: string) => {
    try {
      // קריאה ל-API route שיבדוק את המשתמש
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return { success: false, message: data.message };
      }

      // שמירת המשתמש ב-localStorage או sessionStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // הפניה לדף הבית או דשבורד
      router.push("/"); // שנה לנתיב הרצוי

      return { success: true, user: data.user };
    } catch (err) {
      const message = "שגיאה בהתחברות";
      setError(message);
      return { success: false, message };
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onLogin={handleLogin} error={error} />
      </div>
    </div>
  );
}
