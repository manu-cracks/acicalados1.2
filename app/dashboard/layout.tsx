import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#eaddc5] flex flex-col md:flex-row">
      <aside className="w-full md:w-64 vintage-box border-r-0 md:min-h-screen flex flex-col">
        <div className="p-6 border-b border-vintage-border/50 flex flex-col items-center text-center">
          <Image src="/logo.webp" alt="Logo" width={80} height={80} className="rounded-full mb-4 border border-vintage-border" />
          <h2 className="font-display text-xl uppercase tracking-widest text-vintage-dark">Panel de Control</h2>
          <span className="text-xs font-bold text-vintage-teal uppercase mt-1">Administración</span>
        </div>
        <nav className="p-4 flex flex-col gap-2 flex-grow">
          <Link href="/dashboard" className="vintage-button text-sm bg-[#dfcdb1]">Resumen General</Link>
          <Link href="/dashboard/empleados" className="vintage-button text-sm">Empleados</Link>
          <Link href="/dashboard/ausencias" className="vintage-button text-sm">Ausencias</Link>
          <Link href="/dashboard/configuracion" className="vintage-button text-sm">Configuración</Link>
          <Link href="/checkin" className="vintage-button text-sm">Escaner QR</Link>
          <form action="/api/logout" method="POST" className="mt-auto">
            <button type="submit" className="vintage-button w-full text-sm text-vintage-red hover:bg-red-100">
              Cerrar Sesión
            </button>
          </form>
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
