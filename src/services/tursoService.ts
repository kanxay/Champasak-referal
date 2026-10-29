import { ReferralRecord } from '../types';

const STORAGE_KEY = 'cps_referral_records_v1';
const TURSO_CONFIG_KEY = 'cps_turso_config_v1';

export interface TursoConfig {
  databaseUrl: string;
  authToken: string;
  useLiveTurso: boolean;
}

export const TURSO_SCHEMA_SQL = `-- ໂຄງສ້າງຖານຂໍ້ມູນສຳລັບລະບົບນຳສົ່ງຄົນເຈັບ ໂຮງໝໍແຂວງຈຳປາສັກ
-- Database Schema for Champasak Hospital Patient Referral System (Turso LibSQL)

CREATE TABLE IF NOT EXISTS referrals (
  id TEXT PRIMARY KEY,
  referral_code TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  status TEXT NOT NULL, -- 'in_transit', 'arrived', 'admitted', 'completed', 'cancelled'
  urgency TEXT NOT NULL, -- 'emergency', 'urgent', 'routine'
  
  -- Patient Information
  patient_name TEXT NOT NULL,
  patient_age INTEGER NOT NULL,
  patient_gender TEXT NOT NULL,
  patient_phone TEXT,
  patient_national_id TEXT,
  patient_village TEXT,
  patient_district TEXT,
  patient_province TEXT,
  insurance_type TEXT,
  relative_name TEXT,
  relative_phone TEXT,

  -- Sending Facility Information
  from_hospital_id TEXT NOT NULL,
  from_hospital_name TEXT NOT NULL,
  from_hospital_district TEXT,
  from_hospital_province TEXT,
  referring_doctor TEXT,
  referring_phone TEXT,
  referring_department TEXT,
  destination_department TEXT,

  -- Clinical & Triage
  chief_complaint TEXT NOT NULL,
  history_illness TEXT,
  initial_diagnosis TEXT NOT NULL,
  past_medical_history TEXT,
  allergies TEXT,
  initial_treatment TEXT,
  iv_fluid TEXT,
  current_medications TEXT,
  reason_for_referral TEXT,

  -- Vital Signs
  bp_systolic INTEGER,
  bp_diastolic INTEGER,
  pulse INTEGER,
  respiratory_rate INTEGER,
  temperature REAL,
  spo2 REAL,
  gcs INTEGER,
  blood_sugar REAL,

  -- Logistics & Transport
  transport_type TEXT,
  vehicle_plate TEXT,
  driver_name TEXT,
  driver_phone TEXT,
  escort_staff_name TEXT NOT NULL,
  escort_staff_phone TEXT,
  departure_time TEXT,
  estimated_arrival TEXT,

  -- Champasak Hospital Receiving Notes
  receiving_notes TEXT,
  assigned_doctor TEXT,
  assigned_ward TEXT,
  received_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_urgency ON referrals(urgency);
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON referrals(created_at);
`;

const INITIAL_MOCK_REFERRALS: ReferralRecord[] = [
  {
    id: 'ref-001',
    referralCode: 'CPS-20261028-001',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    status: 'in_transit',
    urgency: 'emergency',
    patient: {
      name: 'ທ້າວ ສົມພອນ ແກ້ວມະນີ',
      age: 28,
      gender: 'male',
      phone: '020 5589 1234',
      nationalId: '16010049281',
      village: 'ບ້ານ ຫຼັກ 35',
      district: 'ປາກຊ່ອງ',
      province: 'ຈຳປາສັກ',
      insuranceType: 'nhi',
      relativeName: 'ນາງ ວັນດີ (ພັນລະຍາ)',
      relativePhone: '020 9942 5511',
    },
    sendingHospital: {
      id: 'hosp-paksong',
      name: 'ໂຮງໝໍເມືອງປາກຊ່ອງ (ພູພຽງບໍລະເວນ)',
      district: 'ປາກຊ່ອງ',
      province: 'ຈຳປາສັກ',
      doctorName: 'ດຣ. ບຸນທອງ ສີປະເສີດ',
      doctorPhone: '020 5512 8899',
      department: 'ຫ້ອງສຸກເສີນ',
    },
    destinationDepartment: 'ສູນອຸບັດຕິເຫດ (Trauma Center) & ICU',
    clinical: {
      chiefComplaint: 'ອຸບັດຕິເຫດລົດຈັກຕຳກັນ, ໝົດສະຕິ, ເລືອດອອກຫົວ ແລະ ຫັກຂາເບື້ອງຂວາ',
      historyOfPresentIllness: 'ປະມານ 1 ຊົ່ວໂມງກ່ອນມາໂຮງໝໍ ຄົນເຈັບຂີ່ລົດຈັກລົງພູພຽງປາກຊ່ອງແລ້ວເສຍຫຼັກ ຫົວຟາດພື້ນຖະໜົນ ບໍ່ໄດ້ໃສ່ໝວກກັນກະທົບ ໝົດສະຕິຊົ່ວຄາວ',
      initialDiagnosis: 'Severe Traumatic Brain Injury (TBI) c Closed Fracture Right Femur',
      pastMedicalHistory: 'ບໍ່ມີ',
      allergies: 'ບໍ່ມີປະຫວັດແພ້ຢາ',
      initialTreatment: 'Collar neck locked, Oxygen cannula 5L/min, IV fluid NSS 1000ml iv drip, Splint right leg, Dressing head wound',
      ivFluid: '0.9% NSS 1000ml free flow',
      currentMedications: 'Paracetamol 1g IV, Tranexamic acid 1g IV',
      reasonForReferral: 'ຕ້ອງການກວດ CT-Scan Brain ດ່ວນ ແລະ ຜ່າຕັດສັນຍາກຳລະບົບປະສາດ (Neurosurgeon)',
    },
    vitalSigns: {
      bpSystolic: 95,
      bpDiastolic: 60,
      pulse: 118,
      respiratoryRate: 24,
      temperature: 36.8,
      spo2: 94,
      gcs: 8,
      bloodSugar: 125,
    },
    logistics: {
      transportType: 'ambulance',
      vehiclePlate: 'ກຳແພງນະຄອນ ກຂ-4491',
      driverName: 'ທ້າວ ຄຳຫຼ້າ',
      driverPhone: '020 2233 4455',
      escortStaffName: 'ພະຍາບານ ສົມໃຈ ພອນສະຫວັນ',
      escortStaffPhone: '020 5544 3322',
      departureTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      estimatedArrivalTime: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
    },
    receivingNotes: 'ທີມສຸກເສີນໂຮງໝໍແຂວງຈຳປາສັກໄດ້ຮັບແຈ້ງແລ້ວ, ກະກຽມຫ້ອງ Trauma Bay 1 ແລະ ແຈ້ງ Neurosurgeon on-call',
  },
  {
    id: 'ref-002',
    referralCode: 'CPS-20261028-002',
    createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'arrived',
    urgency: 'urgent',
    patient: {
      name: 'ນາງ ມະນີວັນ ຈັນທະວົງ',
      age: 34,
      gender: 'female',
      phone: '020 5411 9922',
      nationalId: '16040019283',
      village: 'ບ້ານ ໂພນທອງເໜືອ',
      district: 'ໂພນທອງ',
      province: 'ຈຳປາສັກ',
      insuranceType: 'nhi',
      relativeName: 'ທ້າວ ແກ້ວ (ສາມີ)',
      relativePhone: '020 5411 9923',
    },
    sendingHospital: {
      id: 'hosp-phonthong',
      name: 'ໂຮງໝໍເມືອງໂພນທອງ',
      district: 'ໂພນທອງ',
      province: 'ຈຳປາສັກ',
      doctorName: 'ດຣ. ອານຸສອນ ພົມມະຈັນ',
      doctorPhone: '020 5678 1234',
      department: 'ກວດເຂດນອກ / ຫ້ອງສຸກເສີນ',
    },
    destinationDepartment: 'ຕຶກສັນຍາກຳ / ຫ້ອງຜ່າຕັດ (Surgery Department)',
    clinical: {
      chiefComplaint: 'ເຈັບທ້ອງຮຸນແຮງຢູ່ບໍລິເວນເບື້ອງຂວາລຸ່ມ ມານານ 12 ຊົ່ວໂມງ ພ້ອມມີໄຂ້ ແລະ ຮາກ',
      historyOfPresentIllness: 'ເລີ່ມເຈັບອ້ອມສະດືຕັ້ງແຕ່ຕອນເຊົ້າ ແລ້ວຍ້າຍມາເຈັບແຮງຢູ່ທ້ອງນ້ອຍເບື້ອງຂວາ (Right lower quadrant), ກິນອາຫານບໍ່ໄດ້, ມີໄຂ້ໜາວສັ່ນ',
      initialDiagnosis: 'Acute Appendicitis with impending rupture (ໄສ້ຕິ່ງອັກເສບຮຸນແຮງ)',
      pastMedicalHistory: 'ບໍ່ມີ',
      allergies: 'ແພ້ຢາ Penicillin (ມີຜື່ນຄັນ)',
      initialTreatment: 'NPO (ງົດນ້ຳ-ອາຫານ), IV NSS 1000ml, Ceftriaxone 1g IV drip, Plasil 10mg IV',
      ivFluid: '0.9% NSS 80ml/hr',
      currentMedications: 'Ceftriaxone 1g IV, Paracetamol 1g iv',
      reasonForReferral: 'ຕ້ອງການຜ່າຕັດສຸກເສີນ Appendectomy ໂດຍແພດຊ່ຽວຊານສັນຍາກຳ',
    },
    vitalSigns: {
      bpSystolic: 115,
      bpDiastolic: 75,
      pulse: 92,
      respiratoryRate: 18,
      temperature: 38.6,
      spo2: 98,
      gcs: 15,
      bloodSugar: 104,
    },
    logistics: {
      transportType: 'ambulance',
      vehiclePlate: 'ຈຳປາສັກ ກຂ-1120',
      driverName: 'ທ້າວ ບຸນມີ',
      driverPhone: '020 9876 5432',
      escortStaffName: 'ພະຍາບານ ຈັນສຸກ ດວງມະນີ',
      escortStaffPhone: '020 5522 1100',
      departureTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      estimatedArrivalTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    receivingNotes: 'ມາຮອດຫ້ອງສຸກເສີນແລ້ວ ເວລາ 14:20. ຜົນ Ultrasound ຢືນຢັນໄສ້ຕິ່ງບວມໃຫຍ່. ກຳລັງກຽມສົ່ງເຂົ້າຫ້ອງຜ່າຕັດສັນຍາກຳ',
    assignedDoctor: 'ດຣ. ວິໄລສັກ ສັນຍາແພດ',
    assignedWard: 'ຫ້ອງຜ່າຕັດ OR 2',
    receivedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'ref-003',
    referralCode: 'CPS-20261028-003',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    status: 'admitted',
    urgency: 'routine',
    patient: {
      name: 'ນາງ ຄຳພອນ ໄຊຍະວົງ',
      age: 62,
      gender: 'female',
      phone: '020 5991 3344',
      nationalId: '16020088192',
      village: 'ບ້ານ ໜອງສະໂນ',
      district: 'ຊະນະສົມບູນ',
      province: 'ຈຳປາສັກ',
      insuranceType: 'nhi',
      relativeName: 'ທ້າວ ອຸດົມ (ລູກຊາຍ)',
      relativePhone: '020 5991 3345',
    },
    sendingHospital: {
      id: 'hosp-sanasomboun',
      name: 'ໂຮງໝໍເມືອງຊະນະສົມບູນ',
      district: 'ຊະນະສົມບູນ',
      province: 'ຈຳປາສັກ',
      doctorName: 'ດຣ. ສອນໄຊ ແກ້ວພິລາ',
      doctorPhone: '020 5533 9911',
      department: 'ຕຶກນອນຄົນເຈັບພາຍໃນ',
    },
    destinationDepartment: 'ຕຶກອາຍຸລະກຳ (Internal Medicine)',
    clinical: {
      chiefComplaint: 'ຫາຍໃຈຝືດ ເມື່ອຍງ່າຍ ບວມຂາທັງສອງເບື້ອງ ມານານ 1 ອາທິດ ອາການຊຸດໂຊມລົງ',
      historyOfPresentIllness: 'ມີປະຫວັດພະຍາດເບົາຫວານ ແລະ ຄວາມດັນເລືອດສູງມານານ 10 ປີ ກິນຢາບໍ່ສະໝ່ຳສະເໝີ. 1 ອາທິດມານີ້ ນອນຮາບບໍ່ໄດ້, ໄອກາງຄືນ',
      initialDiagnosis: 'Congestive Heart Failure (CHF) NYHA Class III c Diabetic Nephropathy',
      pastMedicalHistory: 'DM type 2, HTN, CKD stage 3',
      allergies: 'ບໍ່ມີ',
      initialTreatment: 'Furosemide 40mg IV stat, O2 cannula 3L/min, Enalapril 5mg oral',
      ivFluid: 'KVO (Keep Vein Open) 0.9% NSS',
      currentMedications: 'Furosemide 40mg iv, O2 therapy',
      reasonForReferral: 'ສົ່ງຕໍ່ເພື່ອ Echocardiogram, ປັບຢາຫົວໃຈ ແລະ ປຶກສາແພດຊ່ຽວຊານພະຍາດໝາກໄຂ່ຫຼັງ',
    },
    vitalSigns: {
      bpSystolic: 160,
      bpDiastolic: 95,
      pulse: 88,
      respiratoryRate: 22,
      temperature: 36.6,
      spo2: 95,
      gcs: 15,
      bloodSugar: 182,
    },
    logistics: {
      transportType: 'rescue',
      vehiclePlate: 'ຈຳປາສັກ ບຂ-9912',
      driverName: 'ທ້າວ ຕຸ້ຍ ອາສາກູ້ໄພ',
      driverPhone: '020 7711 2233',
      escortStaffName: 'ພະຍາບານ ຄຳຫຼ້າ',
      escortStaffPhone: '020 5511 8877',
      departureTime: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
      estimatedArrivalTime: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    },
    receivingNotes: 'ຮັບເຂົ້າຕຶກອາຍຸລະກຳ ຊັ້ນ 3 ຫ້ອງ 304. ໄດ້ຮັບການກວດ EKG ແລະ ຈອງຄິວ Echo ເວລາ 09:00 ມື້ອື່ນເຊົ້າ',
    assignedDoctor: 'ດຣ. ພອນທິບ ຫົວໃຈແພດ',
    assignedWard: 'ຕຶກອາຍຸລະກຳ ຫ້ອງ 304',
    receivedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
];

export const DEFAULT_TURSO_DATABASE_URL = 'libsql://cps-transfer-drkanxay.aws-ap-northeast-1.turso.io';
export const DEFAULT_TURSO_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMxNzczMTcsImlkIjoiMDFhMTgxYjItMzEwMS03NjUzLWE1NTMtNmU3NTE5NTVhM2ZlIiwia2lkIjoiMUZwdThIZk8wS1BBcms5WERTTGhWanNKREJxMWZ2Y2wzY0FIRWl6cFJTUSIsInJpZCI6ImU1YWIyYTcyLWFhNTItNDEyYS1hYWFmLTdhODA3MzJmYjU5ZSJ9.YjMbJyXhS8Mny3IeC72-gv9HDFDDCPOoL_bR_oVi2g37Kn7lpt5tXQWujnRWqkUDDmch5Be_8wyDlPwAoUipDw';

class TursoService {
  private config: TursoConfig;

  constructor() {
    this.config = this.loadConfig();
    this.ensureInitialData();
  }

  public getConfig(): TursoConfig {
    return { ...this.config };
  }

  public saveConfig(newConfig: Partial<TursoConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (typeof window !== 'undefined') {
      localStorage.setItem(TURSO_CONFIG_KEY, JSON.stringify(this.config));
    }
  }

  private loadConfig(): TursoConfig {
    const envUrl = (import.meta as any).env?.VITE_TURSO_DATABASE_URL || DEFAULT_TURSO_DATABASE_URL;
    const envToken = (import.meta as any).env?.VITE_TURSO_AUTH_TOKEN || DEFAULT_TURSO_AUTH_TOKEN;

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(TURSO_CONFIG_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            databaseUrl: parsed.databaseUrl || envUrl,
            authToken: parsed.authToken || envToken,
            useLiveTurso: parsed.useLiveTurso !== undefined ? parsed.useLiveTurso : true,
          };
        } catch {
          // fallback
        }
      }
    }

    return {
      databaseUrl: envUrl,
      authToken: envToken,
      useLiveTurso: true,
    };
  }

  private ensureInitialData(): void {
    if (typeof window === 'undefined') return;
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_REFERRALS));
    }
  }

  // Converts libsql:// URL into https:// pipeline endpoint
  private getPipelineUrl(url: string): string {
    let clean = url.trim();
    if (clean.startsWith('libsql://')) {
      clean = clean.replace('libsql://', 'https://');
    }
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    if (clean.endsWith('/')) {
      clean = clean.slice(0, -1);
    }
    return `${clean}/v2/pipeline`;
  }

  // Execute SQL statement on Turso over HTTP Pipeline API
  public async executeTursoSql(sql: string, args: any[] = []): Promise<{ success: boolean; data?: any; error?: string }> {
    const { databaseUrl, authToken } = this.config;
    if (!databaseUrl || !authToken) {
      return { success: false, error: 'ບໍ່ພົບ URL ຫຼື Auth Token ຂອງ Turso Database' };
    }

    try {
      const pipelineUrl = this.getPipelineUrl(databaseUrl);
      const res = await fetch(pipelineUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken.trim()}`,
        },
        body: JSON.stringify({
          requests: [
            {
              type: 'execute',
              stmt: {
                sql,
                args: args.map((arg) => {
                  if (arg === null || arg === undefined) return { type: 'null' };
                  if (typeof arg === 'number') {
                    return Number.isInteger(arg)
                      ? { type: 'integer', value: String(arg) }
                      : { type: 'float', value: arg };
                  }
                  if (typeof arg === 'boolean') return { type: 'integer', value: arg ? '1' : '0' };
                  return { type: 'text', value: String(arg) };
                }),
              },
            },
            { type: 'close' },
          ],
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return { success: false, error: `Turso HTTP ${res.status}: ${errorText}` };
      }

      const json = await res.json();
      const firstResult = json?.results?.[0];
      if (firstResult?.type === 'error') {
        return { success: false, error: firstResult.error?.message || 'Turso Query Error' };
      }

      return { success: true, data: firstResult?.response?.result };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error executing Turso query' };
    }
  }

  // Test live connection to Turso
  public async testConnection(): Promise<{ success: boolean; message: string; latencyMs?: number }> {
    const startTime = Date.now();
    const result = await this.executeTursoSql('SELECT 1 as connected, datetime("now") as server_time;');
    const latency = Date.now() - startTime;

    if (result.success) {
      return {
        success: true,
        message: `ເຊື່ອມຕໍ່ Turso LibSQL ສຳເລັດ! (Latency: ${latency}ms)`,
        latencyMs: latency,
      };
    } else {
      return {
        success: false,
        message: `ການເຊື່ອມຕໍ່ຂັດຂ້ອງ: ${result.error}`,
      };
    }
  }

  // Initialize Turso table schemas
  public async setupTursoSchema(): Promise<{ success: boolean; message: string }> {
    const statements = TURSO_SCHEMA_SQL.split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    for (const stmt of statements) {
      const res = await this.executeTursoSql(stmt);
      if (!res.success) {
        return { success: false, message: `ສ້າງ Table ບໍ່ສຳເລັດ: ${res.error}` };
      }
    }

    return { success: true, message: 'ສ້າງ Tables ແລະ Indexes ໃນ Turso Database ສຳເລັດຮຽບຮ້ອຍ!' };
  }

  // Fetch referrals (from Turso if enabled & configured, otherwise from Local Storage)
  public async getReferrals(): Promise<ReferralRecord[]> {
    if (this.config.useLiveTurso && this.config.databaseUrl && this.config.authToken) {
      try {
        const queryRes = await this.executeTursoSql(
          'SELECT * FROM referrals ORDER BY created_at DESC LIMIT 100;'
        );
        if (queryRes.success && queryRes.data?.rows) {
          const cols: string[] = queryRes.data.cols.map((c: any) => c.name);
          return queryRes.data.rows.map((row: any[]) => this.mapTursoRowToRecord(cols, row));
        }
      } catch (err) {
        console.warn('Fallback to local storage due to Turso query error:', err);
      }
    }

    // Local Storage / Simulated fallback
    if (typeof window === 'undefined') return INITIAL_MOCK_REFERRALS;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_MOCK_REFERRALS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_MOCK_REFERRALS;
    }
  }

  // Create new referral record
  public async createReferral(record: Omit<ReferralRecord, 'id' | 'referralCode' | 'createdAt' | 'updatedAt'>): Promise<ReferralRecord> {
    const id = 'ref_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSeq = Math.floor(100 + Math.random() * 900);
    const referralCode = `CPS-${dateStr}-${randomSeq}`;
    const now = new Date().toISOString();

    const fullRecord: ReferralRecord = {
      ...record,
      id,
      referralCode,
      createdAt: now,
      updatedAt: now,
    };

    // Save to Turso if configured
    if (this.config.useLiveTurso && this.config.databaseUrl && this.config.authToken) {
      try {
        await this.insertTursoRecord(fullRecord);
      } catch (err) {
        console.error('Failed to insert into Turso:', err);
      }
    }

    // Always mirror to Local Storage for offline/cache guarantee
    if (typeof window !== 'undefined') {
      const existing = await this.getLocalReferrals();
      const updated = [fullRecord, ...existing];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    return fullRecord;
  }

  // Update referral status and receiving notes
  public async updateReferralStatus(
    id: string,
    status: ReferralRecord['status'],
    notes?: string,
    assignedDoctor?: string,
    assignedWard?: string
  ): Promise<boolean> {
    const now = new Date().toISOString();

    if (this.config.useLiveTurso && this.config.databaseUrl && this.config.authToken) {
      try {
        await this.executeTursoSql(
          `UPDATE referrals SET status = ?, updated_at = ?, receiving_notes = COALESCE(?, receiving_notes), assigned_doctor = COALESCE(?, assigned_doctor), assigned_ward = COALESCE(?, assigned_ward), received_at = CASE WHEN ? = 'arrived' AND received_at IS NULL THEN ? ELSE received_at END WHERE id = ?`,
          [status, now, notes || null, assignedDoctor || null, assignedWard || null, status, now, id]
        );
      } catch (err) {
        console.error('Turso update error:', err);
      }
    }

    // Update local storage
    if (typeof window !== 'undefined') {
      const records = await this.getLocalReferrals();
      const updated = records.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status,
            updatedAt: now,
            receivingNotes: notes !== undefined ? notes : r.receivingNotes,
            assignedDoctor: assignedDoctor || r.assignedDoctor,
            assignedWard: assignedWard || r.assignedWard,
            receivedAt: status === 'arrived' && !r.receivedAt ? now : r.receivedAt,
          };
        }
        return r;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    return true;
  }

  // Reset demo data
  public resetToSampleData(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_REFERRALS));
    }
  }

  private async getLocalReferrals(): Promise<ReferralRecord[]> {
    if (typeof window === 'undefined') return INITIAL_MOCK_REFERRALS;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_MOCK_REFERRALS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_MOCK_REFERRALS;
    }
  }

  private async insertTursoRecord(r: ReferralRecord): Promise<void> {
    const sql = `
      INSERT INTO referrals (
        id, referral_code, created_at, updated_at, status, urgency,
        patient_name, patient_age, patient_gender, patient_phone, patient_national_id,
        patient_village, patient_district, patient_province, insurance_type,
        relative_name, relative_phone,
        from_hospital_id, from_hospital_name, from_hospital_district, from_hospital_province,
        referring_doctor, referring_phone, referring_department, destination_department,
        chief_complaint, history_illness, initial_diagnosis, past_medical_history, allergies,
        initial_treatment, iv_fluid, current_medications, reason_for_referral,
        bp_systolic, bp_diastolic, pulse, respiratory_rate, temperature, spo2, gcs, blood_sugar,
        transport_type, vehicle_plate, driver_name, driver_phone,
        escort_staff_name, escort_staff_phone, departure_time, estimated_arrival,
        receiving_notes, assigned_doctor, assigned_ward, received_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?
      )
    `;

    const args = [
      r.id, r.referralCode, r.createdAt, r.updatedAt, r.status, r.urgency,
      r.patient.name, r.patient.age, r.patient.gender, r.patient.phone || null, r.patient.nationalId || null,
      r.patient.village || null, r.patient.district || null, r.patient.province || null, r.patient.insuranceType,
      r.patient.relativeName || null, r.patient.relativePhone || null,
      r.sendingHospital.id, r.sendingHospital.name, r.sendingHospital.district, r.sendingHospital.province,
      r.sendingHospital.doctorName, r.sendingHospital.doctorPhone, r.sendingHospital.department || null, r.destinationDepartment,
      r.clinical.chiefComplaint, r.clinical.historyOfPresentIllness, r.clinical.initialDiagnosis, r.clinical.pastMedicalHistory || null, r.clinical.allergies || null,
      r.clinical.initialTreatment, r.clinical.ivFluid || null, r.clinical.currentMedications || null, r.clinical.reasonForReferral,
      r.vitalSigns.bpSystolic || null, r.vitalSigns.bpDiastolic || null, r.vitalSigns.pulse || null, r.vitalSigns.respiratoryRate || null, r.vitalSigns.temperature || null, r.vitalSigns.spo2 || null, r.vitalSigns.gcs || null, r.vitalSigns.bloodSugar || null,
      r.logistics.transportType, r.logistics.vehiclePlate || null, r.logistics.driverName || null, r.logistics.driverPhone || null,
      r.logistics.escortStaffName, r.logistics.escortStaffPhone || null, r.logistics.departureTime, r.logistics.estimatedArrivalTime,
      r.receivingNotes || null, r.assignedDoctor || null, r.assignedWard || null, r.receivedAt || null
    ];

    await this.executeTursoSql(sql, args);
  }

  private mapTursoRowToRecord(cols: string[], row: any[]): ReferralRecord {
    const getVal = (colName: string) => {
      const idx = cols.indexOf(colName);
      if (idx === -1) return undefined;
      const cell = row[idx];
      return cell !== null && typeof cell === 'object' && 'value' in cell ? cell.value : cell;
    };

    return {
      id: String(getVal('id')),
      referralCode: String(getVal('referral_code')),
      createdAt: String(getVal('created_at')),
      updatedAt: String(getVal('updated_at')),
      status: getVal('status') as any,
      urgency: getVal('urgency') as any,
      patient: {
        name: String(getVal('patient_name') || ''),
        age: Number(getVal('patient_age') || 0),
        gender: (getVal('patient_gender') as any) || 'male',
        phone: String(getVal('patient_phone') || ''),
        nationalId: getVal('patient_national_id') ? String(getVal('patient_national_id')) : undefined,
        village: String(getVal('patient_village') || ''),
        district: String(getVal('patient_district') || ''),
        province: String(getVal('patient_province') || ''),
        insuranceType: (getVal('insurance_type') as any) || 'nhi',
        relativeName: getVal('relative_name') ? String(getVal('relative_name')) : undefined,
        relativePhone: getVal('relative_phone') ? String(getVal('relative_phone')) : undefined,
      },
      sendingHospital: {
        id: String(getVal('from_hospital_id') || ''),
        name: String(getVal('from_hospital_name') || ''),
        district: String(getVal('from_hospital_district') || ''),
        province: String(getVal('from_hospital_province') || ''),
        doctorName: String(getVal('referring_doctor') || ''),
        doctorPhone: String(getVal('referring_phone') || ''),
        department: getVal('referring_department') ? String(getVal('referring_department')) : undefined,
      },
      destinationDepartment: String(getVal('destination_department') || 'ຫ້ອງສຸກເສີນ ER'),
      clinical: {
        chiefComplaint: String(getVal('chief_complaint') || ''),
        historyOfPresentIllness: String(getVal('history_illness') || ''),
        initialDiagnosis: String(getVal('initial_diagnosis') || ''),
        pastMedicalHistory: getVal('past_medical_history') ? String(getVal('past_medical_history')) : undefined,
        allergies: getVal('allergies') ? String(getVal('allergies')) : undefined,
        initialTreatment: String(getVal('initial_treatment') || ''),
        ivFluid: getVal('iv_fluid') ? String(getVal('iv_fluid')) : undefined,
        currentMedications: getVal('current_medications') ? String(getVal('current_medications')) : undefined,
        reasonForReferral: String(getVal('reason_for_referral') || ''),
      },
      vitalSigns: {
        bpSystolic: getVal('bp_systolic') ? Number(getVal('bp_systolic')) : undefined,
        bpDiastolic: getVal('bp_diastolic') ? Number(getVal('bp_diastolic')) : undefined,
        pulse: getVal('pulse') ? Number(getVal('pulse')) : undefined,
        respiratoryRate: getVal('respiratory_rate') ? Number(getVal('respiratory_rate')) : undefined,
        temperature: getVal('temperature') ? Number(getVal('temperature')) : undefined,
        spo2: getVal('spo2') ? Number(getVal('spo2')) : undefined,
        gcs: getVal('gcs') ? Number(getVal('gcs')) : undefined,
        bloodSugar: getVal('blood_sugar') ? Number(getVal('blood_sugar')) : undefined,
      },
      logistics: {
        transportType: (getVal('transport_type') as any) || 'ambulance',
        vehiclePlate: getVal('vehicle_plate') ? String(getVal('vehicle_plate')) : undefined,
        driverName: getVal('driver_name') ? String(getVal('driver_name')) : undefined,
        driverPhone: getVal('driver_phone') ? String(getVal('driver_phone')) : undefined,
        escortStaffName: String(getVal('escort_staff_name') || ''),
        escortStaffPhone: getVal('escort_staff_phone') ? String(getVal('escort_staff_phone')) : undefined,
        departureTime: String(getVal('departure_time') || new Date().toISOString()),
        estimatedArrivalTime: String(getVal('estimated_arrival') || new Date().toISOString()),
      },
      receivingNotes: getVal('receiving_notes') ? String(getVal('receiving_notes')) : undefined,
      assignedDoctor: getVal('assigned_doctor') ? String(getVal('assigned_doctor')) : undefined,
      assignedWard: getVal('assigned_ward') ? String(getVal('assigned_ward')) : undefined,
      receivedAt: getVal('received_at') ? String(getVal('received_at')) : undefined,
    };
  }
}

export const tursoService = new TursoService();
