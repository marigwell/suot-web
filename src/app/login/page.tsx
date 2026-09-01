"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { loginUser } from "@/lib/api";
import { loginSchema, type LoginFormData } from "@/schemas/auth";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError(null);

    try {
      const token = await loginUser(data);

      localStorage.setItem("access_token", token.access_token);

      router.push("/closet");
    } catch {
      setServerError("Invalid email or password.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-semibold">Sign in</h1>

        <p className="mb-8 text-neutral-500">
          Access your wardrobe.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm">Email</label>

            <input
              {...register("email")}
              type="email"
              className="w-full border border-neutral-700 bg-transparent px-4 py-3 outline-none"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm">Password</label>

            <input
              {...register("password")}
              type="password"
              className="w-full border border-neutral-700 bg-transparent px-4 py-3 outline-none"
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-red-400">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full border border-white px-4 py-3 disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}