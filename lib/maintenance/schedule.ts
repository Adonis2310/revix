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
  // ── ENGINE ──────────────────────────────────────────────────────
  'engine-oil-change': task(
    'engine-oil-change',
    'Engine Oil Change',
    'Drain and replace engine oil. Check drain plug washer condition.',
    'engine',
    'replace',
    'Honda GN4 10W-30 SJ/MA — 1.0 L capacity'
  ),
  'air-filter-clean': task(
    'air-filter-clean',
    'Air Filter Service',
    'Remove, inspect, and clean the foam air filter element. Re-oil with filter oil.',
    'engine',
    'clean'
  ),
  'air-filter-replace': task(
    'air-filter-replace',
    'Air Filter Replacement',
    'Replace air filter element with a new unit.',
    'engine',
    'replace'
  ),
  'spark-plug-inspect': task(
    'spark-plug-inspect',
    'Spark Plug Inspection',
    'Remove spark plug, inspect electrode wear and carbon deposits. Clean or regap as needed.',
    'engine',
    'inspect',
    'NGK CR7HSA — Gap: 0.6–0.7 mm'
  ),
  'spark-plug-replace': task(
    'spark-plug-replace',
    'Spark Plug Replacement',
    'Replace spark plug with a new unit. Torque to specification.',
    'engine',
    'replace',
    'NGK CR7HSA — Torque: 12–15 N·m'
  ),
  'valve-clearance': task(
    'valve-clearance',
    'Valve Clearance Adjustment',
    'Check and adjust intake and exhaust valve clearance with engine cold.',
    'engine',
    'adjust',
    'IN: 0.10 mm ± 0.02 | EX: 0.10 mm ± 0.02'
  ),

  // ── DRIVETRAIN ───────────────────────────────────────────────────
  'chain-lubricate': task(
    'chain-lubricate',
    'Drive Chain Lubrication',
    'Clean drive chain with kerosene, dry, and apply chain lubricant to inner side while rotating wheel.',
    'drivetrain',
    'lubricate'
  ),
  'chain-tension': task(
    'chain-tension',
    'Chain Tension & Wear Check',
    'Measure chain slack, adjust if needed. Inspect for tight links, kinks, and wear with a ruler.',
    'drivetrain',
    'adjust',
    'Slack: 20–30 mm (at midpoint between sprockets)'
  ),
  'clutch-adjust': task(
    'clutch-adjust',
    'Clutch Lever Adjustment',
    'Check and adjust clutch lever free play.',
    'drivetrain',
    'adjust',
    'Free play: 10–20 mm at lever end'
  ),

  // ── BRAKES ───────────────────────────────────────────────────────
  'brake-front': task(
    'brake-front',
    'Front Brake Inspection',
    'Inspect front disc brake pad thickness and hydraulic line condition. Check lever feel.',
    'brakes',
    'inspect',
    'Min. pad thickness: 1.0 mm'
  ),
  'brake-rear': task(
    'brake-rear',
    'Rear Brake Inspection',
    'Inspect rear drum brake shoe wear indicator, pedal free play and adjustment.',
    'brakes',
    'inspect',
    'Pedal free play: 20–30 mm'
  ),
  'brake-fluid': task(
    'brake-fluid',
    'Brake Fluid Level',
    'Check front brake fluid level and condition. Top up or replace if discolored.',
    'brakes',
    'inspect',
    'Honda DOT 4 brake fluid — replace every 2 years'
  ),
  'brake-fluid-replace': task(
    'brake-fluid-replace',
    'Brake Fluid Replacement',
    'Completely flush and replace front brake hydraulic fluid.',
    'brakes',
    'replace',
    'Honda DOT 4 brake fluid'
  ),

  // ── TIRES ─────────────────────────────────────────────────────────
  'tire-check': task(
    'tire-check',
    'Tire Inspection',
    'Check tire pressure, tread depth, sidewall condition and look for embedded objects.',
    'tires',
    'inspect',
    'Front: 200 kPa (29 psi) | Rear: 225 kPa (33 psi)'
  ),

  // ── ELECTRICAL ────────────────────────────────────────────────────
  'battery-check': task(
    'battery-check',
    'Battery Inspection',
    'Inspect battery terminals for corrosion, check terminal tightness and charge level.',
    'electrical',
    'inspect'
  ),
  'lights-check': task(
    'lights-check',
    'Lights & Electrics Check',
    'Test headlight (high/low beam), turn signals, brake light, horn, and instrument cluster.',
    'electrical',
    'inspect'
  ),

  // ── INSPECTION ────────────────────────────────────────────────────
  'throttle-check': task(
    'throttle-check',
    'Throttle Operation',
    'Check throttle free play and snap-close function. Inspect cable routing for kinks.',
    'inspection',
    'adjust',
    'Free play: 2–6 mm at grip flange'
  ),
  'fuel-line': task(
    'fuel-line',
    'Fuel System Inspection',
    'Inspect fuel tank cap, fuel line routing, fuel valve, and connections for leaks.',
    'inspection',
    'inspect'
  ),
  'fasteners': task(
    'fasteners',
    'Nuts & Bolts Torque Check',
    'Check torque of engine mounting bolts, frame bolts, and suspension fasteners.',
    'inspection',
    'inspect'
  ),
  'fork-inspection': task(
    'fork-inspection',
    'Front Fork Inspection',
    'Check telescopic forks for oil leaks around seals, inspect for physical damage.',
    'inspection',
    'inspect'
  ),
  'steering-bearings': task(
    'steering-bearings',
    'Steering Head Bearings',
    'Check for play in steering head bearings. Loosen and tighten correctly if any freeplay.',
    'inspection',
    'inspect'
  ),
  'wheel-bearings': task(
    'wheel-bearings',
    'Wheel Bearing Inspection',
    'Lift each wheel and check for lateral and axial play in front and rear wheel bearings.',
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
  regular: 'Regular Service',
  intermediate: 'Intermediate Service',
  major: 'Major Service',
  comprehensive: 'Comprehensive Service',
}

export const SERVICE_SHORT_LABELS: Record<ServiceType, string> = {
  regular: 'Regular',
  intermediate: 'Intermediate',
  major: 'Major',
  comprehensive: 'Comprehensive',
}
