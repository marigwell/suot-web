"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { registerUser } from "@/lib/api";
import {
  registerSchema,
  type RegisterFormData,
} from "@/schemas/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    setServerError(null);

    try {
      await registerUser(data);
      router.push("/login");
    } catch {
      setServerError("Unable to create account.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-semibold">Create account</h1>

        <p className="mb-8 text-neutral-500">
          Start building your digital closet.
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
            <label className="mb-2 block text-sm">Username</label>

            <input
              {...register("username")}
              className="w-full border border-neutral-700 bg-transparent px-4 py-3 outline-none"
            />

            {errors.username && (
              <p className="mt-1 text-sm text-red-400">
                {errors.username.message}
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
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </main>
  );
}