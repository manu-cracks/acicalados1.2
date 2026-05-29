"use server";

import { addEmpleado, updateEmpleado } from "@/lib/googleSheetsService";
import { Empleado } from "@/types";
import { revalidatePath } from "next/cache";

export async function saveEmpleado(empleado: Empleado, isNew: boolean) {
  if (isNew) {
    await addEmpleado(empleado);
  } else {
    await updateEmpleado(empleado);
  }
  revalidatePath('/dashboard/empleados');
}

export async function fetchEmpleadosAction() {
  const { getEmpleados } = await import("@/lib/googleSheetsService");
  return await getEmpleados();
}
