import { getEmpleados, getAusenciasPlanificadas } from "@/lib/googleSheetsService";
import AusenciasClient from "./AusenciasClient";

export default async function AusenciasPage() {
  const [empleados, ausencias] = await Promise.all([
    getEmpleados(),
    getAusenciasPlanificadas()
  ]);
  
  return <AusenciasClient empleados={empleados} initialAusencias={ausencias} />;
}
