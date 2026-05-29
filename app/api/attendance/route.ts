import { NextResponse } from 'next/server';
import { getEmpleados, getAsistenciasPorFecha, getAusenciasPlanificadas, getConfig, registrarEntrada, registrarSalida } from '@/lib/googleSheetsService';
import { getCurrentDateTime, differenceInMinutes, getExpectedTime } from '@/lib/dateUtils';

export async function POST(request: Request) {
  try {
    const { idEmp, action } = await request.json(); // action: 'entrada' | 'salida'

    if (!idEmp || !action) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
    }

    const config = await getConfig();
    const { fecha, hora: horaReal, diaSemana } = getCurrentDateTime(config.ZONA_HORARIA);

    // 1. Validar empleado
    const empleados = await getEmpleados();
    const empleado = empleados.find(e => e.ID_EMP === idEmp);

    if (!empleado) {
      return NextResponse.json({ error: 'Empleado no encontrado' }, { status: 404 });
    }

    if (empleado.ESTADO !== 'Activo') {
      return NextResponse.json({ error: 'Empleado inactivo' }, { status: 400 });
    }

    // 2. Obtener asistencias de hoy para este empleado
    const asistenciasHoy = await getAsistenciasPorFecha(fecha);
    const registroHoy = asistenciasHoy.find(a => a.ID_EMP === idEmp);

    if (action === 'entrada') {
      if (registroHoy && registroHoy.HORA_EN_REAL) {
        return NextResponse.json({ error: 'Entrada ya registrada hoy' }, { status: 400 });
      }

      // Validar ausencias planificadas
      const ausencias = await getAusenciasPlanificadas(fecha);
      const ausencia = ausencias.find(a => a.ID_EMP === idEmp);
      if (ausencia) {
        return NextResponse.json({ error: 'Ausencia planificada: ' + ausencia.MOTIVO }, { status: 400 });
      }

      const horaEsperada = getExpectedTime(config, diaSemana, true);
      const diff = differenceInMinutes(horaEsperada, horaReal);
      
      let estadoEn = 'A_tiempo';
      if (diff > config.TOLERANCIA_ENTRADA_MIN) {
        estadoEn = 'Tardanza';
      }

      await registrarEntrada(fecha, idEmp, horaReal, estadoEn);

      return NextResponse.json({
        success: true,
        message: `${empleado.NOMBRE} ${empleado.APELLIDO} - Entrada ${horaReal} - ${estadoEn.replace('_', ' ')}`,
        estado: estadoEn,
        nombre: `${empleado.NOMBRE} ${empleado.APELLIDO}`,
        hora: horaReal,
        tipo: 'Entrada'
      });
    } else if (action === 'salida') {
      if (!registroHoy || !registroHoy.HORA_EN_REAL) {
        return NextResponse.json({ error: 'No registró entrada hoy' }, { status: 400 });
      }
      
      if (registroHoy.HORA_SA_REAL) {
        return NextResponse.json({ error: 'Salida ya registrada hoy' }, { status: 400 });
      }

      const horaEsperada = getExpectedTime(config, diaSemana, false);
      const diff = differenceInMinutes(horaEsperada, horaReal);

      let estadoSa = 'A_tiempo';
      if (diff < -15) { // Salida anticipada: si sale 15 min antes
        estadoSa = 'Salida_anticipada';
      } else if (diff > config.TOLERANCIA_SALIDA_MIN) {
        estadoSa = 'Horas_extras';
      }

      await registrarSalida(fecha, idEmp, horaReal, estadoSa);

      return NextResponse.json({
        success: true,
        message: `${empleado.NOMBRE} ${empleado.APELLIDO} - Salida ${horaReal} - ${estadoSa.replace('_', ' ')}`,
        estado: estadoSa,
        nombre: `${empleado.NOMBRE} ${empleado.APELLIDO}`,
        hora: horaReal,
        tipo: 'Salida'
      });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error: any) {
    console.error('Attendance API Error:', error);
    return NextResponse.json({ error: error.message || 'Error del servidor' }, { status: 500 });
  }
}
