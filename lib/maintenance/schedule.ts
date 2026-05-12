import type { MaintenanceTask, ServiceType, TaskCategory, TaskActionType } from '@/types/maintenance'

// Honda XR150L 2025 — Official Maintenance Task Definitions
// Based on Honda XR150L Service Manual (6MW-K1600-E1)

const task = (
  id: string,
  title: string,
  description: string,
  category: TaskCategory,
  actionType: TaskActionType,
  specification?: string
): MaintenanceTask => ({ id, title, description, category, actionType, specification })

export const TASKS: Record<string, MaintenanceTask> = {
  // ── MOTOR ────────────────────────────────────────────────────────
  'engine-oil-change': task(
    'engine-oil-change',
    'Cambio de Aceite',
    'Drena y reemplaza el aceite del motor. Verifica el estado de la arandela del tapón.',
    'engine',
    'replace',
    'Honda GN4 10W-30 SJ/MA — capacidad 1.0 L'
  ),
  'air-filter-clean': task(
    'air-filter-clean',
    'Limpieza del Filtro de Aire',
    'Retira, inspecciona y limpia el filtro de espuma. Vuelve a engrasarlo con aceite para filtro.',
    'engine',
    'clean'
  ),
  'air-filter-replace': task(
    'air-filter-replace',
    'Reemplazo del Filtro de Aire',
    'Reemplaza el filtro de aire por uno nuevo.',
    'engine',
    'replace'
  ),
  'spark-plug-inspect': task(
    'spark-plug-inspect',
    'Inspección de Bujía',
    'Retira la bujía, revisa el desgaste del electrodo y depósitos de carbón. Limpia o ajusta la brecha.',
    'engine',
    'inspect',
    'NGK CR7HSA — Brecha: 0.6–0.7 mm'
  ),
  'spark-plug-replace': task(
    'spark-plug-replace',
    'Reemplazo de Bujía',
    'Reemplaza la bujía por una nueva. Aprieta con el torque especificado.',
    'engine',
    'replace',
    'NGK CR7HSA — Torque: 12–15 N·m'
  ),
  'valve-clearance': task(
    'valve-clearance',
    'Ajuste de Holgura de Válvulas',
    'Verifica y ajusta la holgura de válvulas de admisión y escape con el motor frío.',
    'engine',
    'adjust',
    'Admisión: 0.10 mm ± 0.02 | Escape: 0.10 mm ± 0.02'
  ),

  // ── TRANSMISIÓN ──────────────────────────────────────────────────
  'chain-lubricate': task(
    'chain-lubricate',
    'Lubricación de Cadena',
    'Limpia la cadena con keroseno, sécala y aplica lubricante en el lado interno girando la rueda.',
    'drivetrain',
    'lubricate'
  ),
  'chain-tension': task(
    'chain-tension',
    'Tensión y Desgaste de Cadena',
    'Mide la holgura de la cadena y ajusta si es necesario. Inspecciona eslabones rígidos y desgaste.',
    'drivetrain',
    'adjust',
    'Holgura: 20–30 mm (en el punto medio entre piñones)'
  ),
  'clutch-adjust': task(
    'clutch-adjust',
    'Ajuste del Embrague',
    'Verifica y ajusta el juego libre de la palanca de embrague.',
    'drivetrain',
    'adjust',
    'Juego libre: 10–20 mm en el extremo de la palanca'
  ),

  // ── FRENOS ───────────────────────────────────────────────────────
  'brake-front': task(
    'brake-front',
    'Inspección del Freno Delantero',
    'Inspecciona el grosor de las pastillas del disco delantero y el estado de la manguera hidráulica.',
    'brakes',
    'inspect',
    'Grosor mínimo de pastilla: 1.0 mm'
  ),
  'brake-rear': task(
    'brake-rear',
    'Inspección del Freno Trasero',
    'Revisa el indicador de desgaste de las balatas del tambor trasero y el juego libre del pedal.',
    'brakes',
    'inspect',
    'Juego libre del pedal: 20–30 mm'
  ),
  'brake-fluid': task(
    'brake-fluid',
    'Nivel de Líquido de Frenos',
    'Verifica el nivel y estado del líquido de frenos delantero. Rellena o reemplaza si está oscuro.',
    'brakes',
    'inspect',
    'Honda DOT 4 — reemplazar cada 2 años'
  ),
  'brake-fluid-replace': task(
    'brake-fluid-replace',
    'Reemplazo de Líquido de Frenos',
    'Purga y reemplaza completamente el líquido hidráulico del freno delantero.',
    'brakes',
    'replace',
    'Honda DOT 4'
  ),

  // ── LLANTAS ───────────────────────────────────────────────────────
  'tire-check': task(
    'tire-check',
    'Inspección de Llantas',
    'Verifica presión, profundidad del labrado, estado del flanco y objetos incrustados.',
    'tires',
    'inspect',
    'Delantera: 200 kPa (29 psi) | Trasera: 225 kPa (33 psi)'
  ),

  // ── ELÉCTRICO ─────────────────────────────────────────────────────
  'battery-check': task(
    'battery-check',
    'Inspección de Batería',
    'Revisa los terminales de la batería en busca de corrosión y verifica el nivel de carga.',
    'electrical',
    'inspect'
  ),
  'lights-check': task(
    'lights-check',
    'Luces y Sistema Eléctrico',
    'Prueba la linterna (alta/baja), direccionales, luz de freno, bocina y tablero de instrumentos.',
    'electrical',
    'inspect'
  ),

  // ── INSPECCIÓN ────────────────────────────────────────────────────
  'throttle-check': task(
    'throttle-check',
    'Operación del Acelerador',
    'Verifica el juego libre del acelerador y que cierre solo. Inspecciona el cable por dobleces.',
    'inspection',
    'adjust',
    'Juego libre: 2–6 mm en la brida del puño'
  ),
  'fuel-line': task(
    'fuel-line',
    'Inspección del Sistema de Combustible',
    'Inspecciona la tapa del tanque, el recorrido de la manguera de combustible y las conexiones.',
    'inspection',
    'inspect'
  ),
  'fasteners': task(
    'fasteners',
    'Revisión de Tornillos y Tuercas',
    'Verifica el torque de los pernos de motor, chasis y suspensión.',
    'inspection',
    'inspect'
  ),
  'fork-inspection': task(
    'fork-inspection',
    'Inspección de la Horquilla Delantera',
    'Revisa la horquilla telescópica en busca de fugas de aceite y daños físicos.',
    'inspection',
    'inspect'
  ),
  'steering-bearings': task(
    'steering-bearings',
    'Rodamientos de la Dirección',
    'Verifica si hay juego en los rodamientos de la columna de dirección. Ajusta si es necesario.',
    'inspection',
    'inspect'
  ),
  'wheel-bearings': task(
    'wheel-bearings',
    'Rodamientos de Ruedas',
    'Levanta cada rueda y verifica el juego lateral y axial de los rodamientos delantero y trasero.',
    'inspection',
    'inspect'
  ),
}

// Task sets for each service type — tasks accumulate at each level
export const SERVICE_TASK_IDS: Record<ServiceType, string[]> = {
  regular: [
    'engine-oil-change',
    'chain-lubricate',
    'chain-tension',
    'brake-front',
    'brake-rear',
    'tire-check',
    'fasteners',
  ],
  intermediate: [
    'engine-oil-change',
    'chain-lubricate',
    'chain-tension',
    'brake-front',
    'brake-rear',
    'tire-check',
    'fasteners',
    'air-filter-clean',
    'spark-plug-inspect',
    'throttle-check',
    'clutch-adjust',
    'battery-check',
    'fuel-line',
  ],
  major: [
    'engine-oil-change',
    'chain-lubricate',
    'chain-tension',
    'brake-front',
    'brake-rear',
    'tire-check',
    'fasteners',
    'air-filter-clean',
    'spark-plug-inspect',
    'throttle-check',
    'clutch-adjust',
    'battery-check',
    'fuel-line',
    'valve-clearance',
    'fork-inspection',
    'steering-bearings',
    'brake-fluid',
    'lights-check',
  ],
  comprehensive: [
    'engine-oil-change',
    'chain-lubricate',
    'chain-tension',
    'brake-front',
    'brake-rear',
    'tire-check',
    'fasteners',
    'air-filter-replace',
    'spark-plug-replace',
    'throttle-check',
    'clutch-adjust',
    'battery-check',
    'fuel-line',
    'valve-clearance',
    'fork-inspection',
    'steering-bearings',
    'brake-fluid-replace',
    'lights-check',
    'wheel-bearings',
  ],
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
  regular: 'Servicio Regular',
  intermediate: 'Servicio Intermedio',
  major: 'Servicio Mayor',
  comprehensive: 'Servicio Completo',
}

export const SERVICE_SHORT_LABELS: Record<ServiceType, string> = {
  regular: 'Regular',
  intermediate: 'Intermedio',
  major: 'Mayor',
  comprehensive: 'Completo',
}
