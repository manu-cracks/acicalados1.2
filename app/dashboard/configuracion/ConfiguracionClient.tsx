"use client";

import { useState } from "react";
import { SystemConfig } from "@/types";
import { saveConfig } from "@/app/actions/config";

export default function ConfiguracionClient({ initialConfig }: { initialConfig: SystemConfig }) {
  const [config, setConfig] = useState<SystemConfig>(initialConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");
    
    try {
      await saveConfig(config);
      setMessage("Configuración guardada exitosamente.");
    } catch (error) {
      setMessage("Error al guardar la configuración.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display uppercase tracking-wider text-vintage-dark">Configuración del Sistema</h2>
      </div>

      <div className="vintage-box p-6 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4 border-b border-vintage-border pb-6">
            <h3 className="font-bold text-vintage-dark uppercase tracking-widest border-b border-vintage-border pb-2">Asistencia y Tolerancias</h3>
            
            <div>
              <label className="block text-xs font-bold text-vintage-dark uppercase mb-1">Tolerancia de Entrada (Minutos)</label>
              <p className="text-xs text-gray-500 mb-2">Minutos permitidos después de la hora de entrada antes de marcar "Tardanza".</p>
              <input 
                required 
                type="number" 
                min="0"
                value={config.TOLERANCIA_ENTRADA_MIN} 
                onChange={e => setConfig({...config, TOLERANCIA_ENTRADA_MIN: parseInt(e.target.value) || 0})} 
                className="vintage-input w-full md:w-1/2" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-vintage-dark uppercase mb-1">Tolerancia de Salida (Minutos)</label>
              <p className="text-xs text-gray-500 mb-2">Minutos después de la hora de salida a partir de los cuales se considera "Horas Extras".</p>
              <input 
                required 
                type="number" 
                min="0"
                value={config.TOLERANCIA_SALIDA_MIN} 
                onChange={e => setConfig({...config, TOLERANCIA_SALIDA_MIN: parseInt(e.target.value) || 0})} 
                className="vintage-input w-full md:w-1/2" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-vintage-dark uppercase mb-1">Umbral de Falta (Minutos)</label>
              <p className="text-xs text-gray-500 mb-2">Minutos después de la hora de entrada tras los cuales el sistema marca automáticamente "Falta".</p>
              <input 
                required 
                type="number" 
                min="0"
                value={config.UMBRAL_FALTA_MIN} 
                onChange={e => setConfig({...config, UMBRAL_FALTA_MIN: parseInt(e.target.value) || 0})} 
                className="vintage-input w-full md:w-1/2" 
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-vintage-dark uppercase tracking-widest border-b border-vintage-border pb-2">Sistema</h3>
            
            <div>
              <label className="block text-xs font-bold text-vintage-dark uppercase mb-1">Zona Horaria</label>
              <input 
                required 
                type="text" 
                value={config.ZONA_HORARIA} 
                onChange={e => setConfig({...config, ZONA_HORARIA: e.target.value})} 
                className="vintage-input w-full md:w-1/2" 
              />
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="modoMantenimiento"
                checked={config.MODO_MANTENIMIENTO === "true"} 
                onChange={e => setConfig({...config, MODO_MANTENIMIENTO: e.target.checked ? "true" : "false"})} 
                className="w-4 h-4 text-vintage-dark focus:ring-vintage-dark border-gray-300 rounded" 
              />
              <label htmlFor="modoMantenimiento" className="text-sm font-bold text-vintage-dark uppercase">Modo Mantenimiento (Desactiva Check-in)</label>
            </div>
          </div>

          {message && (
            <div className={`p-3 text-sm font-bold rounded ${message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {message}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-vintage-border">
            <button disabled={isSaving} type="submit" className="vintage-button bg-vintage-dark text-white text-sm">
              {isSaving ? "Guardando..." : "Guardar Configuración"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
