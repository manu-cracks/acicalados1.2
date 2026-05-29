"use client";

import { useState } from "react";
import { Empleado } from "@/types";
import { saveEmpleado } from "@/app/actions/empleados";

export default function EmpleadosClient({ initialEmpleados }: { initialEmpleados: Empleado[] }) {
  const [empleados, setEmpleados] = useState<Empleado[]>(initialEmpleados);
  const [editing, setEditing] = useState<Empleado | null>(null);
  const [isNew, setIsNew] = useState(false);

  const handleEdit = (empleado: Empleado) => {
    setEditing(empleado);
    setIsNew(false);
  };

  const handleCreate = () => {
    setEditing({
      ID_EMP: "",
      NOMBRE: "",
      APELLIDO: "",
      RUBRO: "Spa",
      HORA_EN_LUN_SAB: "09:00",
      HORA_SA_LUN_SAB: "18:00",
      HORA_EN_DOM: "10:00",
      HORA_SA_DOM: "16:00",
      ESTADO: "Activo"
    });
    setIsNew(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    
    await saveEmpleado(editing, isNew);
    
    // Update local state for immediate feedback
    if (isNew) {
      setEmpleados([...empleados, editing]);
    } else {
      setEmpleados(empleados.map(emp => emp.ID_EMP === editing.ID_EMP ? editing : emp));
    }
    
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display uppercase tracking-wider text-vintage-dark">Gestión de Empleados</h2>
        <button onClick={handleCreate} className="vintage-button bg-vintage-dark text-white hover:bg-vintage-dark/90">
          + Nuevo Empleado
        </button>
      </div>

      <div className="vintage-box p-6 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-vintage-border text-vintage-dark/70 font-bold">
                <th className="p-3">ID</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Rubro</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((emp) => (
                <tr key={emp.ID_EMP} className="border-b border-vintage-border/50 hover:bg-[#faf6ef]">
                  <td className="p-3">{emp.ID_EMP}</td>
                  <td className="p-3">{emp.NOMBRE} {emp.APELLIDO}</td>
                  <td className="p-3">{emp.RUBRO}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${emp.ESTADO === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {emp.ESTADO}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleEdit(emp)} className="text-vintage-teal hover:underline text-sm font-bold">Editar</button>
                  </td>
                </tr>
              ))}
              {empleados.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-vintage-dark/60">No hay empleados registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="vintage-box bg-[#eaddc5] max-w-lg w-full p-6 relative">
            <h3 className="text-xl font-display uppercase tracking-widest mb-4 border-b border-vintage-border pb-2">
              {isNew ? 'Nuevo Empleado' : 'Editar Empleado'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-vintage-dark uppercase mb-1">ID (DNI/Cédula)</label>
                  <input required disabled={!isNew} type="text" value={editing.ID_EMP} onChange={e => setEditing({...editing, ID_EMP: e.target.value})} className="vintage-input w-full" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-vintage-dark uppercase mb-1">Estado</label>
                  <select value={editing.ESTADO} onChange={e => setEditing({...editing, ESTADO: e.target.value})} className="vintage-input w-full">
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-vintage-dark uppercase mb-1">Nombres</label>
                  <input required type="text" value={editing.NOMBRE} onChange={e => setEditing({...editing, NOMBRE: e.target.value})} className="vintage-input w-full" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-vintage-dark uppercase mb-1">Apellidos</label>
                  <input required type="text" value={editing.APELLIDO} onChange={e => setEditing({...editing, APELLIDO: e.target.value})} className="vintage-input w-full" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-vintage-dark uppercase mb-1">Rubro</label>
                  <select required value={editing.RUBRO} onChange={e => setEditing({...editing, RUBRO: e.target.value})} className="vintage-input w-full">
                    <option value="Spa">Spa</option>
                    <option value="Barberia">Barbería</option>
                    <option value="Recepcionista">Recepcionista</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setEditing(null)} className="vintage-button text-sm">Cancelar</button>
                <button type="submit" className="vintage-button bg-vintage-dark text-white text-sm">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
