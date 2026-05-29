"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  isPaused?: boolean;
}

export default function QRScanner({ onScan, isPaused }: QRScannerProps) {
  const [error, setError] = useState<string>("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!isCameraActive) {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
        scannerRef.current.clear();
      }
      return;
    }

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    const startScanning = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            if (isPaused) return;
            // Apagar la cámara inmediatamente tras leer un QR válido
            setIsCameraActive(false);
            onScan(decodedText);
          },
          (errorMessage) => {
            // Ignorar errores normales de escaneo continuo
          }
        );
      } catch (err: any) {
        setError("Error al acceder a la cámara. Verifique permisos.");
        setIsCameraActive(false);
      }
    };

    startScanning();

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
        scannerRef.current.clear();
      }
    };
  }, [isCameraActive, onScan, isPaused]);

  return (
    <div className="w-full max-w-md mx-auto relative vintage-box p-4 bg-[#2a2622] flex flex-col items-center justify-center min-h-[300px]">
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 text-white p-4 text-center">
          {error}
        </div>
      )}
      
      {!isCameraActive ? (
        <div className="flex flex-col items-center justify-center text-center p-6 h-full w-full bg-[#dfcdb1] border border-vintage-border rounded">
          <div className="w-20 h-20 mb-4 bg-vintage-dark rounded-full flex items-center justify-center border-2 border-vintage-teal">
            <svg className="w-10 h-10 text-vintage-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <p className="text-vintage-dark font-bold uppercase mb-6">La cámara está apagada</p>
          <button 
            onClick={() => { setError(""); setIsCameraActive(true); }}
            className="vintage-button bg-vintage-teal text-vintage-dark w-full shadow-lg hover:scale-105 transition-transform"
          >
            Encender Cámara
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col h-full">
          <div id="reader" className="w-full flex-grow overflow-hidden rounded-md border border-vintage-border/50 bg-black min-h-[250px]"></div>
          <button 
            onClick={() => setIsCameraActive(false)}
            className="mt-4 vintage-button bg-vintage-red text-white text-xs w-full uppercase"
          >
            Apagar Cámara
          </button>
        </div>
      )}
    </div>
  );
}
