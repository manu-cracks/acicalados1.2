import { getEmpleados } from "@/lib/googleSheetsService";
import EmpleadosClient from "./EmpleadosClient";

export default async function EmpleadosPage() {
  const empleados = await getEmpleados();
  return <EmpleadosClient initialEmpleados={empleados} />;
}
