export type UrgencyLevel = 'emergency' | 'urgent' | 'routine';

export type ReferralStatus = 'in_transit' | 'arrived' | 'admitted' | 'completed' | 'cancelled';

export type TransportType = 
  | 'ambulance' // ລົດໂຮງໝໍສຸກເສີນ
  | 'rescue'    // ລົດກູ້ໄພ
  | 'private'   // ລົດສ່ວນຕົວ/ລົດຄອບຄົວ
  | 'other';

export type InsuranceType =
  | 'nhi'       // ກອງທຶນປະກັນສຸຂະພາບແຫ່ງຊາດ
  | 'nssf'      // ປະກັນສັງຄົມແຫ່ງຊາດ
  | 'private'   // ປະກັນໄພເອກະຊົນ
  | 'self_pay'  // ເສຍຄ່າເອງ
  | 'poor_fund'; // ນະໂຍບາຍສົງເຄາະຄົນທຸກຍາກ

export interface VitalSigns {
  bpSystolic?: number;
  bpDiastolic?: number;
  pulse?: number; // ຄັ້ງ/ນາທີ
  respiratoryRate?: number; // ຄັ້ງ/ນາທີ
  temperature?: number; // ອົງສາ C
  spo2?: number; // %
  gcs?: number; // 3-15
  bloodSugar?: number; // mg/dL
}

export interface PatientInfo {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  nationalId?: string;
  village: string;
  district: string;
  province: string;
  insuranceType: InsuranceType;
  relativeName?: string;
  relativePhone?: string;
}

export interface SendingHospital {
  id: string;
  name: string;
  district: string;
  province: string;
  doctorName: string;
  doctorPhone: string;
  department?: string;
}

export interface ClinicalInfo {
  chiefComplaint: string; // ອາການສຳຄັນ
  historyOfPresentIllness: string; // ປະຫວັດເຈັບເປັນປັດຈຸບັນ
  initialDiagnosis: string; // ການບົ່ງມະຕິເບື້ອງຕົ້ນ
  pastMedicalHistory?: string; // ປະຫວັດພະຍາດປະຈຳຕົວ
  allergies?: string; // ປະຫວັດແພ້ຢາ/ອາຫານ
  initialTreatment: string; // ການປິ່ນປົວເບື້ອງຕົ້ນທີ່ໄດ້ໃຫ້ແລ້ວ
  ivFluid?: string; // ນ້ຳກັ່ນ/ສານນ້ຳ
  currentMedications?: string; // ຢາທີ່ກຳລັງໃຫ້ຂະນະເດີນທາງ
  reasonForReferral: string; // ເຫດຜົນການສົ່ງຕົວ
}

export interface TransportLogistics {
  transportType: TransportType;
  vehiclePlate?: string;
  driverName?: string;
  driverPhone?: string;
  escortStaffName: string; // ຊື່ແພດ/ພະຍາບານຕິດຕາມ
  escortStaffPhone?: string;
  departureTime: string;
  estimatedArrivalTime: string; // ເວລາຄາດຄະເນມາຮອດ (ETA)
}

export interface ReferralRecord {
  id: string;
  referralCode: string; // e.g. CPS-REF-20261028-001
  createdAt: string;
  updatedAt: string;
  status: ReferralStatus;
  urgency: UrgencyLevel;
  
  patient: PatientInfo;
  sendingHospital: SendingHospital;
  destinationDepartment: string;
  
  clinical: ClinicalInfo;
  vitalSigns: VitalSigns;
  logistics: TransportLogistics;
  
  receivingNotes?: string;
  assignedDoctor?: string;
  assignedWard?: string;
  receivedAt?: string;
}

export interface HospitalPreset {
  id: string;
  name: string;
  district: string;
  province: string;
  type: 'district' | 'provincial' | 'center';
  distanceKm: number;
  estimatedMinutes: number;
  phone: string;
}
