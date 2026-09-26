export type TimeSlot = 
  | 'fasting'          // 晨起空腹
  | 'post_breakfast'  // 早餐后2小时
  | 'pre_lunch'       // 午餐前
  | 'post_lunch'      // 午餐后2小时
  | 'pre_dinner'      // 晚餐前
  | 'post_dinner'     // 晚餐后2小时
  | 'bedtime'         // 睡前
  | 'random';         // 随机

export type GlucoseStatus = 'low' | 'normal' | 'high' | 'very_high';

export interface BloodGlucoseRecord {
  id: string;
  patientId: string;
  timestamp: string; // ISO string or YYYY-MM-DD HH:mm
  timeSlot: TimeSlot;
  value: number; // mmol/L
  status: GlucoseStatus;
  note?: string;
  isIntervened?: boolean;
}

export interface MedicationItem {
  id: string;
  name: string;
  dose: string;
  timing: string; // e.g., '早餐随餐', '睡前'
  reminderTime: string; // e.g. '07:30', '21:00'
  takenToday: boolean;
}

export interface PatientProfile {
  id: string;
  uuid: string; // 科研脱敏编码，如 FX-RCT-2026-042
  name: string;
  gender: '男' | '女';
  age: number;
  diabetesType: '2型糖尿病' | '1型糖尿病' | '妊娠糖尿病';
  courseYears: number; // 病程年数
  treatmentMethod: '生活方式管理' | '口服降糖药' | '胰岛素治疗' | '口服药+胰岛素联合';
  group: 'experimental' | 'control'; // 实验组(AI虚拟护士干预) vs 对照组(常规随访)
  weekInStudy: number; // 课题第几周 (1-12周)
  baselineHbA1c: number; // 基线糖化血红蛋白 %
  currentHbA1c?: number; // 当前或第12周糖化血红蛋白 %
  complianceRate: number; // 监测依从率 (0-100%)
  nonFastingMissRate: number; // 非空腹漏测率 (0-100%)
  points: number; // 激励积分
  continuousDays: number; // 连续监测打卡天数
  phone: string; // 脱敏展示
  primaryDoctor: string; // 责任医生
  primaryNurse: string; // 责任护士
  signedConsent: boolean; // 是否签署伦理知情同意书
  medications: MedicationItem[];
  tcmSyndrome?: string; // 中医辨证分型，如 "气阴两虚证"
}

export type AlertType = 'severe_low' | 'high_glucose' | 'continuous_missed' | 'emotional_distress';
export type AlertSeverity = 'critical' | 'high' | 'medium';

export interface NurseAlert {
  id: string;
  patientId: string;
  patientName: string;
  patientUuid: string;
  type: AlertType;
  severity: AlertSeverity;
  timestamp: string;
  value?: number;
  details: string;
  status: 'pending' | 'processing' | 'resolved';
  handlerNote?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: '水果' | '主食' | '蔬菜' | '肉蛋奶' | '零食饮品';
  gi: number;
  gl: number;
  level: 'low' | 'medium' | 'high';
  portion: string;
  advice: string;
  tcmProperty: string;
}

export interface TcmPrescription {
  id: string;
  title: string;
  syndrome: string;
  teaOrDiet: string;
  ingredients: string[];
  acupoints: string[];
  cautions: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  source?: string;
  suggestions?: string[];
  isWarning?: boolean;
}

export interface RCTCohortMetrics {
  totalEnrolled: number;
  experimentalCount: number;
  controlCount: number;
  avgComplianceExperimental: number;
  avgComplianceControl: number;
  missedRateExperimental: number;
  missedRateControl: number;
  hba1cBaselineAvg: number;
  hba1c12wExperimentalAvg: number;
  hba1c12wControlAvg: number;
  satisfactionScore: number;
}
