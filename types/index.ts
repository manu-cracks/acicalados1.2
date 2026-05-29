export type Role = 'OWNER' | 'RECEPTIONIST';

export interface UserSession {
  role: Role;
  username: string;
}

export interface Empleado {
  ID_EMP: string;
  NOMBRE: string;
  APELLIDO: string;
  RUBRO: string;
  HORA_EN_LUN_SAB: string;
  HORA_SA_LUN_SAB: string;
  HORA_EN_DOM: string;
  HORA_SA_DOM: string;
  ESTADO: string;
}

export interface Asistencia {
  FECHA: string;
  ID_EMP: string;
  HORA_EN_REAL: string;
  ESTADO_EN: string;
  HORA_SA_REAL: string;
  ESTADO_SA: string;
  OBSERVACIONES: string;
}

export interface AusenciaPlanificada {
  ID: string;
  ID_EMP: string;
  FECHA: string;
  MOTIVO: string;
  CREADO_POR: string;
}

export interface SystemConfig {
  TOLERANCIA_ENTRADA_MIN: number;
  TOLERANCIA_SALIDA_MIN: number;
  UMBRAL_FALTA_MIN: number;
  ZONA_HORARIA: string;
  MODO_MANTENIMIENTO: string;
  HORA_EN_LUN_SAB: string;
  HORA_SA_LUN_SAB: string;
  HORA_EN_DOM: string;
  HORA_SA_DOM: string;
}
