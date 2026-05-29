import { getAllAsistencias, getEmpleados } from "@/lib/googleSheetsService";
import DashboardClient from "./DashboardClient";

// Server Component fetching data for the dashboard
export default async function DashboardPage() {
  const asistencias = await getAllAsistencias();
  const empleados = await getEmpleados();

  return (
    <div>
      <div className="flex justify-between items-end mb-8 border-b-2 border-vintage-dark/20 pb-4">
        <div>
          <h1 className="text-3xl font-display uppercase tracking-widest text-vintage-dark">Reporte de Asistencia</h1>
          <p className="text-sm font-bold text-vintage-teal">Estadísticas y registros del personal</p>
        </div>
      </div>

      <DashboardClient initialAsistencias={asistencias} empleados={empleados} />
    </div>
  );
}

export const revalidate = 0; // Disable caching for the dashboard to always show fresh data
