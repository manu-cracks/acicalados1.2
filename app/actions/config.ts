"use server";

import { updateConfig } from "@/lib/googleSheetsService";
import { SystemConfig } from "@/types";
import { revalidatePath } from "next/cache";

export async function saveConfig(config: Partial<SystemConfig>) {
  await updateConfig(config);
  revalidatePath('/dashboard/configuracion');
}
