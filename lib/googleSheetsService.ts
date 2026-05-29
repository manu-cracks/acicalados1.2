import { getGoogleSheets, SPREADSHEET_ID } from './googleSheets';
import { Empleado, Asistencia, AusenciaPlanificada, SystemConfig } from '@/types';

export async function getEmpleados(): Promise<Empleado[]> {
  const sheets = await getGoogleSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Empleados!A2:I',
  });
  
  const rows = response.data.values || [];
  return rows.map(row => ({
    ID_EMP: row[0] || '',
    NOMBRE: row[1] || '',
    APELLIDO: row[2] || '',
    RUBRO: row[3] || '',
    HORA_EN_LUN_SAB: row[4] || '',
    HORA_SA_LUN_SAB: row[5] || '',
    HORA_EN_DOM: row[6] || '',
    HORA_SA_DOM: row[7] || '',
    ESTADO: row[8] || '',
  }));
}

export async function addEmpleado(empleado: Empleado): Promise<void> {
  const sheets = await getGoogleSheets();
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Empleados!A:A',
  });
  const values = response.data.values || [];
  let nextRow = values.length + 1;
  for (let i = 0; i < values.length; i++) {
    if (!values[i] || !values[i][0] || values[i][0].trim() === '') {
      nextRow = i + 1;
      break;
    }
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Empleados!A${nextRow}:I${nextRow}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        empleado.ID_EMP,
        empleado.NOMBRE,
        empleado.APELLIDO,
        empleado.RUBRO,
        empleado.HORA_EN_LUN_SAB || "",
        empleado.HORA_SA_LUN_SAB || "",
        empleado.HORA_EN_DOM || "",
        empleado.HORA_SA_DOM || "",
        empleado.ESTADO || "Activo"
      ]]
    }
  });
}

export async function updateEmpleado(empleado: Empleado): Promise<void> {
  const sheets = await getGoogleSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Empleados!A:I',
  });
  
  const rows = response.data.values || [];
  let rowIndex = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] === empleado.ID_EMP) {
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex === -1) {
    throw new Error('Empleado no encontrado');
  }
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Empleados!A${rowIndex}:I${rowIndex}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        empleado.ID_EMP,
        empleado.NOMBRE,
        empleado.APELLIDO,
        empleado.RUBRO,
        empleado.HORA_EN_LUN_SAB,
        empleado.HORA_SA_LUN_SAB,
        empleado.HORA_EN_DOM,
        empleado.HORA_SA_DOM,
        empleado.ESTADO
      ]]
    }
  });
}

export async function getAsistenciasPorFecha(fecha: string): Promise<Asistencia[]> {
  const sheets = await getGoogleSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Asistencia!A2:G',
  });
  
  const rows = response.data.values || [];
  return rows
    .map(row => ({
      FECHA: row[0] || '',
      ID_EMP: row[1] || '',
      HORA_EN_REAL: row[2] || '',
      ESTADO_EN: row[3] || '',
      HORA_SA_REAL: row[4] || '',
      ESTADO_SA: row[5] || '',
      OBSERVACIONES: row[6] || '',
    }))
    .filter(a => a.FECHA === fecha);
}

export async function getAllAsistencias(): Promise<Asistencia[]> {
  const sheets = await getGoogleSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Asistencia!A2:G',
  });
  
  const rows = response.data.values || [];
  return rows.map(row => ({
    FECHA: row[0] || '',
    ID_EMP: row[1] || '',
    HORA_EN_REAL: row[2] || '',
    ESTADO_EN: row[3] || '',
    HORA_SA_REAL: row[4] || '',
    ESTADO_SA: row[5] || '',
    OBSERVACIONES: row[6] || '',
  }));
}

export async function getAusenciasPlanificadas(fecha?: string): Promise<AusenciaPlanificada[]> {
  const sheets = await getGoogleSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Ausencias_Planificadas!A2:E',
  });
  
  const rows = response.data.values || [];
  const ausencias = rows.map(row => ({
    ID: row[0] || '',
    ID_EMP: row[1] || '',
    FECHA: row[2] || '',
    MOTIVO: row[3] || '',
    CREADO_POR: row[4] || '',
  }));
  
  if (fecha) {
    return ausencias.filter(a => a.FECHA === fecha);
  }
  return ausencias;
}

export async function addAusenciaPlanificada(ausencia: Omit<AusenciaPlanificada, 'ID'>): Promise<void> {
  const sheets = await getGoogleSheets();
  const id = crypto.randomUUID();
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Ausencias_Planificadas!A:A',
  });
  const values = response.data.values || [];
  let nextRow = values.length + 1;
  for (let i = 0; i < values.length; i++) {
    if (!values[i] || !values[i][0] || values[i][0].trim() === '') {
      nextRow = i + 1;
      break;
    }
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Ausencias_Planificadas!A${nextRow}:E${nextRow}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        id,
        ausencia.ID_EMP,
        ausencia.FECHA,
        ausencia.MOTIVO,
        ausencia.CREADO_POR
      ]]
    }
  });
}

export async function getConfig(): Promise<SystemConfig> {
  const sheets = await getGoogleSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Config!A2:I2',
  });
  
  const row = response.data.values?.[0] || [];
  return {
    TOLERANCIA_ENTRADA_MIN: parseInt(row[0] || '3', 10),
    TOLERANCIA_SALIDA_MIN: parseInt(row[1] || '20', 10),
    UMBRAL_FALTA_MIN: parseInt(row[2] || '60', 10),
    ZONA_HORARIA: row[3] || 'America/Lima',
    MODO_MANTENIMIENTO: row[4] || 'false',
    HORA_EN_LUN_SAB: row[5] || '09:00',
    HORA_SA_LUN_SAB: row[6] || '18:00',
    HORA_EN_DOM: row[7] || '10:00',
    HORA_SA_DOM: row[8] || '16:00',
  };
}

export async function registrarEntrada(
  fecha: string,
  idEmp: string,
  horaEnReal: string,
  estadoEn: string
): Promise<void> {
  const sheets = await getGoogleSheets();
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Asistencia!A:A',
  });
  const values = response.data.values || [];
  let nextRow = values.length + 1;
  for (let i = 0; i < values.length; i++) {
    if (!values[i] || !values[i][0] || values[i][0].trim() === '') {
      nextRow = i + 1;
      break;
    }
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Asistencia!A${nextRow}:G${nextRow}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        fecha,
        idEmp,
        horaEnReal,
        estadoEn,
        '',
        '',
        ''
      ]]
    }
  });
}

export async function registrarSalida(
  fecha: string,
  idEmp: string,
  horaSaReal: string,
  estadoSa: string
): Promise<void> {
  const sheets = await getGoogleSheets();
  // We need to find the row to update
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Asistencia!A:G',
  });
  
  const rows = response.data.values || [];
  // Find the row index (1-based for A1 notation)
  let rowIndex = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] === fecha && rows[i][1] === idEmp) {
      rowIndex = i + 1; // Google Sheets is 1-indexed
      break;
    }
  }
  
  if (rowIndex === -1) {
    throw new Error('No se encontró registro de entrada para actualizar salida');
  }
  
  // Update the row (Columns E and F for HORA_SA_REAL and ESTADO_SA)
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Asistencia!E${rowIndex}:F${rowIndex}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[horaSaReal, estadoSa]]
    }
  });
}

export async function updateConfig(config: Partial<SystemConfig>): Promise<void> {
  const currentConfig = await getConfig();
  const newConfig = { ...currentConfig, ...config };
  
  const sheets = await getGoogleSheets();
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Config!A2:I2',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        newConfig.TOLERANCIA_ENTRADA_MIN.toString(),
        newConfig.TOLERANCIA_SALIDA_MIN.toString(),
        newConfig.UMBRAL_FALTA_MIN.toString(),
        newConfig.ZONA_HORARIA,
        newConfig.MODO_MANTENIMIENTO,
        newConfig.HORA_EN_LUN_SAB,
        newConfig.HORA_SA_LUN_SAB,
        newConfig.HORA_EN_DOM,
        newConfig.HORA_SA_DOM
      ]]
    }
  });
}
