"use client";

import { useState, useEffect } from "react";
import QRScanner from "@/components/QRScanner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchEmpleadosAction } from "@/app/actions/empleados";
import { Empleado } from "@/types";

export default function CheckinPage() {
  const [mode, setMode] = useState<"entrada" | "salida">("entrada");
  const [role, setRole] = useState<string | null>(null);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [manualId, setManualId] = useState("");
  const [pendingScan, setPendingScan] = useState<Empleado | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setRole(data.role))
      .catch(console.error);
      
    fetchEmpleadosAction()
      .then(data => setEmpleados(data))
      .catch(console.error);
  }, []);

  const handleScan = (idEmp: string) => {
    setIsPaused(true);
    
    // Buscar empleado
    const emp = empleados.find(e => e.ID_EMP === idEmp);
    if (!emp) {
      setScanResult({
        success: false,
        message: `Empleado con ID "${idEmp}" no encontrado.`
      });
      return;
    }
    
    setPendingScan(emp);
  };

  const confirmAttendance = async () => {
    if (!pendingScan) return;
    
    const idEmp = pendingScan.ID_EMP;
    setPendingScan(null);
    
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idEmp, action: mode }),
      });
      const data = await res.json();
      
      setScanResult({
        success: res.ok,
        message: data.message || data.error,
        data: data
      });
    } catch (err) {
      setScanResult({
        success: false,
        message: "Error de conexión"
      });
    }
  };

  const cancelAttendance = () => {
    setPendingScan(null);
    setTimeout(() => setIsPaused(false), 500);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) {
      handleScan(manualId.trim());
      setManualId("");
    }
  };

  const closePopup = () => {
    setScanResult(null);
    setTimeout(() => setIsPaused(false), 1500); // Resume scanning after 1.5s pause
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  const getResultColor = () => {
    if (!scanResult?.success) return "bg-red-200 text-red-900 border-red-500";
    if (scanResult.data?.estado === "A_tiempo") return "bg-green-200 text-green-900 border-green-500";
    if (scanResult.data?.estado === "Tardanza") return "bg-yellow-200 text-yellow-900 border-yellow-500";
    if (scanResult.data?.estado === "Horas_extras") return "bg-blue-200 text-blue-900 border-blue-500";
    return "bg-gray-200 text-gray-900 border-gray-500";
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl flex justify-between items-center mb-8 vintage-box p-4 bg-[#eaddc5]">
        <div className="flex items-center gap-4">
          <Image src="/logo.webp" alt="Logo" width={60} height={60} className="rounded-full border border-vintage-border" />
          <div>
            <h1 className="text-xl font-display uppercase tracking-widest text-vintage-dark">Control de Asistencia</h1>
            <p className="text-xs font-bold text-vintage-teal uppercase">{mode === "entrada" ? "Modo: Registro de Entrada" : "Modo: Registro de Salida"}</p>
          </div>
        </div>
        <div className="flex gap-4">
          {role === "OWNER" && (
            <button onClick={() => router.push("/dashboard")} className="vintage-button text-sm">Dashboard</button>
          )}
          <button onClick={handleLogout} className="text-sm font-bold text-vintage-red uppercase hover:underline">Salir</button>
        </div>
      </header>

      <main className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-6">
          <div className="vintage-box p-6 bg-[#eaddc5]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-lg uppercase">Lector QR</h2>
              {role === "OWNER" && (
                <button 
                  onClick={() => setMode(mode === "entrada" ? "salida" : "entrada")}
                  className="vintage-badge bg-vintage-dark text-vintage-paper transform-none"
                >
                  Cambiar a {mode === "entrada" ? "Salida" : "Entrada"}
                </button>
              )}
            </div>
            
            <QRScanner onScan={handleScan} isPaused={isPaused || !!scanResult || !!pendingScan} />
            
            {role === "OWNER" && (
              <form onSubmit={handleManualSubmit} className="mt-6 border-t border-vintage-dark/20 pt-4">
                <p className="text-xs uppercase font-bold mb-2 text-vintage-dark/70">Ingreso Manual (Solo Owner)</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={manualId} 
                    onChange={e => setManualId(e.target.value)} 
                    placeholder="ID_EMP (ej. BAR001)" 
                    className="vintage-input"
                  />
                  <button type="submit" className="vintage-button py-1 px-4 text-sm">Validar</button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6 h-full">
           <div className="vintage-box p-6 bg-[#dfcdb1] flex-grow flex flex-col items-center justify-center text-center min-h-[300px]">
             <div className="w-24 h-24 rounded-full border-4 border-vintage-dark mb-4 flex items-center justify-center bg-vintage-paper">
                <span className="font-display text-4xl">
                  {mode === "entrada" ? "E" : "S"}
                </span>
             </div>
             <h2 className="font-display text-2xl uppercase mb-2">Escanee su Identificación</h2>
             <p className="text-sm">Acerque el código QR proporcionado a la cámara para registrar su {mode === "entrada" ? "ingreso" : "salida"}.</p>
           </div>
        </div>
      </main>

      {/* Popups de Confirmación */}
      {pendingScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-vintage-dark/80 p-4">
          <div className="vintage-box p-8 max-w-md w-full bg-[#eaddc5]">
            <h3 className="font-display text-2xl mb-4 uppercase text-center border-b border-vintage-border pb-2">
              Confirmar {mode === "entrada" ? "Entrada" : "Salida"}
            </h3>
            <div className="text-center mb-8">
              <p className="text-sm uppercase font-bold text-vintage-teal">Empleado Identificado:</p>
              <p className="text-2xl font-bold text-vintage-dark mt-2">{pendingScan.NOMBRE} {pendingScan.APELLIDO}</p>
              <p className="text-sm text-vintage-dark/70 mt-1">{pendingScan.RUBRO} - {pendingScan.ID_EMP}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={cancelAttendance} className="w-full vintage-button bg-white text-vintage-dark hover:bg-gray-100 py-3">
                CANCELAR
              </button>
              <button onClick={confirmAttendance} className="w-full vintage-button bg-vintage-dark text-vintage-paper hover:bg-black py-3">
                CONFIRMAR
              </button>
            </div>
          </div>
        </div>
      )}

      {scanResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-vintage-dark/80 p-4">
          <div className={`vintage-box p-8 max-w-md w-full border-4 ${getResultColor()}`}>
            <h3 className="font-display text-2xl mb-4 uppercase text-center border-b border-current pb-2">
              {scanResult.success ? "Registro Exitoso" : "Error de Registro"}
            </h3>
            <p className="text-lg text-center font-bold mb-6 min-h-[60px] flex items-center justify-center">
              {scanResult.message}
            </p>
            <button onClick={closePopup} className="w-full vintage-button bg-vintage-dark text-vintage-paper hover:bg-black text-xl py-3">
              ACEPTAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
