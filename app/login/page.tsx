"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al iniciar sesión");
      }

      const { role } = await res.json();
      if (role === "OWNER") {
        router.push("/dashboard");
      } else {
        router.push("/checkin");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md vintage-box p-8 bg-[#eaddc5]">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.webp"
            alt="Acicalados Logo"
            width={120}
            height={120}
            className="rounded-full shadow-md mb-4 border-2 border-vintage-border"
          />
          <h1 className="text-3xl text-center text-vintage-dark uppercase tracking-widest">
            Acceso Autorizado
          </h1>
          <div className="w-16 h-1 bg-vintage-red mt-2 mb-2"></div>
          <span className="text-sm font-bold tracking-widest text-vintage-teal uppercase">Spa & Barbería</span>
        </div>

        {error && (
          <div className="bg-red-200 border border-vintage-red text-vintage-red px-4 py-2 mb-6 text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-vintage-dark tracking-wider mb-1">
              Identificador
            </label>
            <input
              type="text"
              className="vintage-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Ingrese su usuario..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-vintage-dark tracking-wider mb-1">
              Clave de Seguridad
            </label>
            <input
              type="password"
              className="vintage-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ingrese su contraseña..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full vintage-button mt-4"
          >
            {loading ? "Verificando..." : "Entrar al Sistema"}
          </button>
        </form>
      </div>
    </div>
  );
}
