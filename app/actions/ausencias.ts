"use server";

import { addAusenciaPlanificada } from "@/lib/googleSheetsService";
import { AusenciaPlanificada } from "@/types";
import { revalidatePath } from "next/cache";

export async function saveAusencia(ausencia: Omit<AusenciaPlanificada, "ID">) {
  await addAusenciaPlanificada(ausencia);
  revalidatePath('/dashboard/ausencias');
}
