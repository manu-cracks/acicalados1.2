"use client";

import { useState } from "react";
import { AusenciaPlanificada, Empleado } from "@/types";
import { saveAusencia } from "@/app/actions/ausencias";
import { format } from "date-fns";

export default function AusenciasClient({ empleados, initialAusencias }: { empleados: Empleado[], initialAusencias: AusenciaPlanificada[] }) {
  const [ausencias, setAusencias] = useState<AusenciaPlanificada[]>(initialAusencias);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    ID_EMP: "",
    FECHA: format(new Date(), 'yyyy-MM-dd'),
    MOTIVO: ""
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.ID_EMP || !formData.FECHA || !formData.MOTIVO) return;
    
    const newAusencia = {
      ID_EMP: formData.ID_EMP,
      FECHA: formData.FECHA,
      MOTIVO: formData.MOTIVO,
      CREADO_POR: "Admin" // You could get this from session
    };
    
    await saveAusencia(newAusencia);
    
    // Optimistic update
    setAusencias([...ausencias, { ID: crypto.randomUUID(), ...newAusencia }]);
    setIsModalOpen(false);
    setFormData({ ...formData, MOTIVO: "" });
  };

  const getEmpleadoNombre = (id: string) => {
    const emp = empleados.find(e => e.ID_EMP === id);
    return emp ? `${emp.NOMBRE} ${emp.APELLIDO}` : id;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display uppercase tracking-wider text-vintage-dark">Ausencias Planificadas</h2>
        <button onClick={() => setIsModalOpen(true)} className="vintage-button bg-vintage-dark text-white hover:bg-vintage-dark/90">
          + Registrar Ausencia
        </button>
      </div>

      <div className="vintage-box p-6 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-vintage-border text-vintage-dark/70 font-bold">
                <th className="p-3">Fecha</th>
                <th className="p-3">Empleado</th>
                <th className="p-3">Motivo</th>
                <th className="p-3">Creado Por</th>
              </tr>
            </thead>
            <tbody>
              {ausencias.sort((a, b) => new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime()).map((aus) => (
                <tr key={aus.ID} className="border-b border-vintage-border/50 hover:bg-[#faf6ef]">
                  <td className="p-3 font-medium">{aus.FECHA}</td>
                  <td className="p-3">{getEmpleadoNombre(aus.ID_EMP)}</td>
                  <td className="p-3">{aus.MOTIVO}</td>
                  <td className="p-3 text-xs text-gray-500">{aus.CREADO_POR}</td>
                </tr>
              ))}
              {ausencias.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-vintage-dark/60">No hay ausencias registradas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="vintage-box bg-[#eaddc5] max-w-md w-full p-6 relative">
            <h3 className="text-xl font-display uppercase tracking-widest mb-4 border-b border-vintage-border pb-2">
              Registrar Ausencia
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-vintage-dark uppercase mb-1">Empleado</label>
                <select 
                  required 
                  value={formData.ID_EMP} 
                  onChange={e => setFormData({...formData, ID_EMP: e.target.value})} 
                  className="vintage-input w-full"
                >
                  <option value="">Seleccione un empleado...</option>
                  {empleados.filter(e => e.ESTADO === 'Activo').map(emp => (
                    <option key={emp.ID_EMP} value={emp.ID_EMP}>
                      {emp.NOMBRE} {emp.APELLIDO} ({emp.RUBRO})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-vintage-dark uppercase mb-1">Fecha de Ausencia</label>
                <input 
                  required 
                  type="date" 
                  value={formData.FECHA} 
                  onChange={e => setFormData({...formData, FECHA: e.target.value})} 
                  className="vintage-input w-full" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-vintage-dark uppercase mb-1">Motivo / Justificación</label>
                <textarea 
                  required 
                  rows={3}
                  value={formData.MOTIVO} 
                  onChange={e => setFormData({...formData, MOTIVO: e.target.value})} 
                  className="vintage-input w-full resize-none" 
                  placeholder="Ej. Vacaciones, permiso médico, falta injustificada..."
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="vintage-button text-sm">Cancelar</button>
                <button type="submit" className="vintage-button bg-vintage-dark text-white text-sm">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
