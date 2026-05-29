import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

export function getCurrentDateTime(timezone: string = 'America/Lima') {
  const now = new Date();
  const zonedDate = toZonedTime(now, timezone);
  const fecha = formatInTimeZone(now, timezone, 'yyyy-MM-dd');
  const hora = formatInTimeZone(now, timezone, 'HH:mm');
  const diaSemana = zonedDate.getDay(); // 0 is Sunday, 1 is Monday, etc.
  
  return { fecha, hora, diaSemana, zonedDate };
}

export function differenceInMinutes(timeStart: string, timeEnd: string): number {
  if (!timeStart || !timeEnd) return 0;
  const [h1, m1] = timeStart.split(':').map(Number);
  const [h2, m2] = timeEnd.split(':').map(Number);
  return (h2 * 60 + m2) - (h1 * 60 + m1);
}

export function parseMinutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.floor(totalMinutes % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function getExpectedTime(config: any, diaSemana: number, isEntrada: boolean): string {
  // Lunes a Sabado = 1 to 6
  if (diaSemana >= 1 && diaSemana <= 6) {
    return isEntrada ? config.HORA_EN_LUN_SAB : config.HORA_SA_LUN_SAB;
  }
  // Domingo = 0
  return isEntrada ? config.HORA_EN_DOM : config.HORA_SA_DOM;
}
