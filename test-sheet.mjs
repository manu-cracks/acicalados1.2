import { google } from 'googleapis';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2];
});

async function checkSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: env.GOOGLE_CLIENT_EMAIL,
      private_key: env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, ''),
    },
    projectId: env.GOOGLE_PROJECT_ID,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });
  const SPREADSHEET_ID = env.GOOGLE_SHEET_ID;

  const res = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: SPREADSHEET_ID,
    ranges: ['Empleados!A1:Z1', 'Asistencia!A1:Z1', 'Asistencia!A1:A50'],
  });

  console.log("Headers Empleados:", res.data.valueRanges[0].values[0]);
  console.log("Headers Asistencia:", res.data.valueRanges[1].values[0]);
  console.log("Asistencia Col A (Fechas):", res.data.valueRanges[2].values?.length || 0, "filas con datos");
}

checkSheets().catch(console.error);
