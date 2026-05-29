"use client";

import { useState } from "react";
import { Asistencia, Empleado } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import * as XLSX from 'xlsx';

export default function DashboardClient({ initialAsistencias, empleados }: { initialAsistencias: Asistencia[], empleados: Empleado[] }) {
  const [filterPeriod, setFilterPeriod] = useState<"hoy" | "semana" | "mes" | "todo">("todo");
  const [filterRubro, setFilterRubro] = useState<string>("Todos");

  // Basic filtering based on client state
  const asistencias = initialAsistencias.filter(a => {
    if (filterRubro !== "Todos") {
      const emp = empleados.find(e => e.ID_EMP === a.ID_EMP);
      if (emp?.RUBRO !== filterRubro) return false;
    }
    // simple period filter just to show it works, actual date filtering can be more complex
    if (filterPeriod === "hoy") {
       const today = new Date().toISOString().split('T')[0];
       if (a.FECHA !== today) return false;
    }
    return true;
  });

  const kpiAsistentes = new Set(asistencias.filter(a => a.HORA_EN_REAL).map(a => a.ID_EMP)).size;
  const entradasTotales = asistencias.filter(a => a.HORA_EN_REAL).length;
  const aTiempo = asistencias.filter(a => a.ESTADO_EN === "A_tiempo").length;
  const pctPuntualidad = entradasTotales > 0 ? Math.round((aTiempo / entradasTotales) * 100) : 0;
  const tardanzas = asistencias.filter(a => a.ESTADO_EN === "Tardanza").length;
  const horasExtras = asistencias.filter(a => a.ESTADO_SA === "Horas_extras").length;
  const faltas = asistencias.filter(a => a.ESTADO_EN === "Falta").length;

  const pieData = [
    { name: 'A Tiempo', value: aTiempo, color: '#3a7a7a' },
    { name: 'Tardanza', value: tardanzas, color: '#c29b62' },
    { name: 'Faltas', value: faltas, color: '#8b3a3a' },
  ].filter(d => d.value > 0);

  const tardanzasPorEmpleado = empleados.map(emp => {
    const tards = asistencias.filter(a => a.ID_EMP === emp.ID_EMP && a.ESTADO_EN === "Tardanza").length;
    return { name: emp.NOMBRE, Tardanzas: tards };
  }).filter(d => d.Tardanzas > 0);

  const handleExport = () => {
    const dataToExport = asistencias.map(a => {
      const emp = empleados.find(e => e.ID_EMP === a.ID_EMP);
      return {
        Fecha: a.FECHA,
        Empleado: emp ? `${emp.NOMBRE} ${emp.APELLIDO}` : a.ID_EMP,
        Rubro: emp?.RUBRO || '',
        'Entrada Real': a.HORA_EN_REAL,
        'Estado Entrada': a.ESTADO_EN,
        'Salida Real': a.HORA_SA_REAL,
        'Estado Salida': a.ESTADO_SA,
        Observaciones: a.OBSERVACIONES
      };
    });
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Asistencias");
    XLSX.writeFile(wb, "Reporte_Asistencia_Acicalados.xlsx");
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="vintage-box p-4 flex flex-wrap gap-4 items-center bg-[#dfcdb1]">
        <select className="vintage-input w-auto bg-transparent" value={filterPeriod} onChange={e => setFilterPeriod(e.target.value as any)}>
          <option value="todo">Todo el tiempo</option>
          <option value="hoy">Hoy</option>
          <option value="semana">Esta Semana</option>
          <option value="mes">Este Mes</option>
        </select>
        <select className="vintage-input w-auto bg-transparent" value={filterRubro} onChange={e => setFilterRubro(e.target.value)}>
          <option value="Todos">Todos los Rubros</option>
          <option value="Barbería">Barbería</option>
          <option value="Spa">Spa</option>
          <option value="Recepción">Recepción</option>
        </select>
        <button onClick={handleExport} className="vintage-button ml-auto text-sm">
          Exportar Excel
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KPICard title="Asistentes" value={kpiAsistentes} />
        <KPICard title="% Puntualidad" value={`${pctPuntualidad}%`} />
        <KPICard title="Tardanzas" value={tardanzas} color="text-yellow-700" />
        <KPICard title="Horas Extras" value={horasExtras} color="text-blue-700" />
        <KPICard title="Faltas" value={faltas} color="text-red-700" />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="vintage-box p-4 h-[350px] flex flex-col">
          <h3 className="font-display uppercase text-center mb-4 border-b border-vintage-dark/20 pb-2">Distribución de Ingresos</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="vintage-box p-4 h-[350px] flex flex-col">
          <h3 className="font-display uppercase text-center mb-4 border-b border-vintage-dark/20 pb-2">Tardanzas por Empleado</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tardanzasPorEmpleado}>
                <CartesianGrid strokeDasharray="3 3" stroke="#8c7b64" opacity={0.3} />
                <XAxis dataKey="name" stroke="#2a2622" />
                <YAxis stroke="#2a2622" allowDecimals={false} />
                <RechartsTooltip cursor={{fill: 'rgba(140,123,100,0.1)'}} />
                <Bar dataKey="Tardanzas" fill="#c29b62" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="vintage-box p-4 overflow-x-auto">
        <h3 className="font-display uppercase mb-4 border-b border-vintage-dark/20 pb-2">Registros Recientes</h3>
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b-2 border-vintage-dark/50">
              <th className="p-2 font-bold uppercase tracking-wider">Fecha</th>
              <th className="p-2 font-bold uppercase tracking-wider">Empleado</th>
              <th className="p-2 font-bold uppercase tracking-wider">Entrada</th>
              <th className="p-2 font-bold uppercase tracking-wider">Estado En.</th>
              <th className="p-2 font-bold uppercase tracking-wider">Salida</th>
              <th className="p-2 font-bold uppercase tracking-wider">Estado Sa.</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.slice(0, 10).map((a, i) => {
              const emp = empleados.find(e => e.ID_EMP === a.ID_EMP);
              return (
                <tr key={i} className="border-b border-vintage-border/30 hover:bg-[#dfcdb1]/50">
                  <td className="p-2">{a.FECHA}</td>
                  <td className="p-2 font-bold">{emp ? `${emp.NOMBRE} ${emp.APELLIDO}` : a.ID_EMP}</td>
                  <td className="p-2">{a.HORA_EN_REAL || '-'}</td>
                  <td className="p-2"><StatusBadge status={a.ESTADO_EN} /></td>
                  <td className="p-2">{a.HORA_SA_REAL || '-'}</td>
                  <td className="p-2"><StatusBadge status={a.ESTADO_SA} /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KPICard({ title, value, color = "text-vintage-dark" }: { title: string, value: string | number, color?: string }) {
  return (
    <div className="vintage-box p-4 text-center bg-white/40 flex flex-col justify-center">
      <span className="text-[10px] uppercase font-bold text-vintage-teal tracking-widest">{title}</span>
      <span className={`font-display text-3xl mt-2 ${color}`}>{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (!status) return <span>-</span>;
  const colorMap: any = {
    'A_tiempo': 'bg-green-100 text-green-800 border-green-800',
    'Tardanza': 'bg-yellow-100 text-yellow-800 border-yellow-800',
    'Falta': 'bg-red-100 text-red-800 border-red-800',
    'Salida_anticipada': 'bg-orange-100 text-orange-800 border-orange-800',
    'Horas_extras': 'bg-blue-100 text-blue-800 border-blue-800',
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold border ${colorMap[status] || 'bg-gray-100'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
