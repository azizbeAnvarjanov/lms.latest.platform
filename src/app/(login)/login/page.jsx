"use client";
import { Input } from "@/components/ui/input";
import { login, signup } from "./actions";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        redirect('/')
      }
    }

    checkUser()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // har yangi urinishda xatolikni tozalaymiz

    const formData = new FormData(e.target);
    const result = await login(formData);

    if (result?.error) {
      setLoading(false);
      setError(result.error);
      return;
    }

    setLoading(false);
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Tizimga kirish</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <label htmlFor="email">Email:</label>
        <Input className="" id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <Input id="password" name="password" type="password" required />
        <Button
          disabled={loading}
          className="flex w-full mt-4 bg-blue-600"
          type="submit"
        >
          Log in
          {loading && (
            <LoaderCircleIcon
              className="animate-spin"
              size={16}
              aria-hidden="true"
            />
          )}
        </Button>
        {/* <Button formAction={signup}>Sign up</Button> */}
      </form>
    </div>
  );
}
