"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  isPaused: boolean;
}

export default function QRScanner({ onScan, isPaused }: QRScannerProps) {
  const [error, setError] = useState<string>("");
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
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
            if (!isPaused) {
              onScan(decodedText);
            }
          },
          (errorMessage) => {
            // Ignore normal scan errors (no qr found)
          }
        );
      } catch (err: any) {
        setError("Error al acceder a la cámara. Verifique permisos.");
      }
    };

    startScanning();

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isPaused, onScan]);

  return (
    <div className="w-full max-w-md mx-auto relative vintage-box p-4 bg-[#2a2622]">
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 text-white p-4 text-center">
          {error}
        </div>
      )}
      <div id="reader" className="w-full h-full overflow-hidden rounded-md border border-vintage-border/50"></div>
    </div>
  );
}
