import { getConfig } from "@/lib/googleSheetsService";
import ConfiguracionClient from "./ConfiguracionClient";

export default async function ConfiguracionPage() {
  const config = await getConfig();
  return <ConfiguracionClient initialConfig={config} />;
}
