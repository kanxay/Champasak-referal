import React, { useState } from 'react';
import { HospitalPreset, ReferralRecord, UrgencyLevel, TransportType, InsuranceType } from '../types';
import { HOSPITAL_PRESETS, DESTINATION_DEPARTMENTS, CHAMPASAK_PROVINCIAL_HOSPITAL } from '../data/hospitals';
import { tursoService } from '../services/tursoService';
import { AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, Send, Sparkles, Printer } from 'lucide-react';

interface ReferralFormProps {
  onReferralCreated: (created: ReferralRecord) => void;
  onOpenDashboard: () => void;
  onPrintSlip: (referral: ReferralRecord) => void;
}

export const ReferralForm: React.FC<ReferralFormProps> = ({
  onReferralCreated,
  onOpenDashboard,
  onPrintSlip,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdReferral, setCreatedReferral] = useState<ReferralRecord | null>(null);

  // Form states
  // Step 1: Patient
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [patientGender, setPatientGender] = useState<'male' | 'female' | 'other'>('male');
  const [patientPhone, setPatientPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('ໂພນທອງ');
  const [province, setProvince] = useState('ຈຳປາສັກ');
  const [insuranceType, setInsuranceType] = useState<InsuranceType>('nhi');
  const [relativeName, setRelativeName] = useState('');
  const [relativePhone, setRelativePhone] = useState('');

  // Step 2: Sending Facility & Destination Ward
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(HOSPITAL_PRESETS[0].id);
  const [doctorName, setDoctorName] = useState('');
  const [doctorPhone, setDoctorPhone] = useState('');
  const [sendingDepartment, setSendingDepartment] = useState('ຫ້ອງສຸກເສີນ');
  const [destinationWard, setDestinationWard] = useState(DESTINATION_DEPARTMENTS[0].name);

  // Step 3: Clinical & Vitals
  const [urgency, setUrgency] = useState<UrgencyLevel>('urgent');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [hpi, setHpi] = useState('');
  const [initialDiagnosis, setInitialDiagnosis] = useState('');
  const [pastHistory, setPastHistory] = useState('');
  const [allergies, setAllergies] = useState('');
  const [initialTreatment, setInitialTreatment] = useState('');
  const [ivFluid, setIvFluid] = useState('');
  const [reasonForReferral, setReasonForReferral] = useState('');

  // Vital signs
  const [bpSystolic, setBpSystolic] = useState<number | ''>('');
  const [bpDiastolic, setBpDiastolic] = useState<number | ''>('');
  const [pulse, setPulse] = useState<number | ''>('');
  const [respiratoryRate, setRespiratoryRate] = useState<number | ''>('');
  const [temperature, setTemperature] = useState<number | ''>('');
  const [spo2, setSpo2] = useState<number | ''>('');
  const [gcs, setGcs] = useState<number | ''>(15);
  const [bloodSugar, setBloodSugar] = useState<number | ''>('');

  // Step 4: Transport & Logistics
  const [transportType, setTransportType] = useState<TransportType>('ambulance');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [escortStaffName, setEscortStaffName] = useState('');
  const [escortStaffPhone, setEscortStaffPhone] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(35);

  // Auto calculate ETA when hospital changes
  const handleHospitalChange = (hospitalId: string) => {
    setSelectedHospitalId(hospitalId);
    const found = HOSPITAL_PRESETS.find((h) => h.id === hospitalId);
    if (found) {
      setDistrict(found.district);
      setProvince(found.province);
      setEstimatedMinutes(found.estimatedMinutes);
    }
  };

  // Quick fill demo patient data for testing
  const handleFillDemoData = () => {
    setPatientName('ທ້າວ ສຸລິວັນ ພັນທະວົງ');
    setPatientAge(45);
    setPatientGender('male');
    setPatientPhone('020 5588 3311');
    setNationalId('16030018274');
    setVillage('ບ້ານ ນາໄຊ');
    setDistrict('ໂພນທອງ');
    setProvince('ຈຳປາສັກ');
    setInsuranceType('nhi');
    setRelativeName('ນາງ ຄຳ (ພັນລະຍາ)');
    setRelativePhone('020 5588 3312');

    setSelectedHospitalId('hosp-phonthong');
    setDoctorName('ດຣ. ອານຸສອນ ໄຊຍະສິດ');
    setDoctorPhone('020 5432 1098');
    setSendingDepartment('ຫ້ອງສຸກເສີນ');
    setDestinationWard(DESTINATION_DEPARTMENTS[1].name); // ICU

    setUrgency('emergency');
    setChiefComplaint('ເຈັບແໜ້ນໜ້າເອິກຮຸນແຮງລາມຂຶ້ນຄາງ ແລະ ແຂນຊ້າຍ ມານານ 2 ຊົ່ວໂມງ ເຫື່ອອອກຫຼາຍ');
    setHpi('ຄົນເຈັບມີອາການເຈັບໜ້າເອິກຄືມີຂອງໜັກມາກົດທັບ ຂະນະເຮັດວຽກ ພັກຜ່ອນບໍ່ດີຂຶ້ນ EKG ພົບ ST-elevation V1-V4');
    setInitialDiagnosis('Acute Anterior STEMI (ກ້າມຊີ້ນຫົວໃຈຕາຍສ້ວຍແຫຼມ)');
    setPastHistory('HTN 5 ປີ, ສູບຢາ 1 ຊອງ/ມື້');
    setAllergies('ບໍ່ມີປະຫວັດແພ້ຢາ');
    setInitialTreatment('Oxygen cannula 4L/min, Aspirin 300mg chew stat, Clopidogrel 300mg oral stat, ISDN 5mg SL 1 tab');
    setIvFluid('0.9% NSS KVO (keep vein open)');
    setReasonForReferral('ຕ້ອງການສົ່ງສູນຫົວໃຈ ໂຮງໝໍແຂວງຈຳປາສັກ ເພື່ອເຮັດ PCI / Cath Lab ດ່ວນ');

    setBpSystolic(145);
    setBpDiastolic(90);
    setPulse(104);
    setRespiratoryRate(22);
    setTemperature(36.7);
    setSpo2(95);
    setGcs(15);
    setBloodSugar(142);

    setTransportType('ambulance');
    setVehiclePlate('ຈຳປາສັກ ກຂ-8831');
    setDriverName('ທ້າວ ບຸນເຮືອງ');
    setDriverPhone('020 2233 8899');
    setEscortStaffName('ພະຍາບານ ຈັນສຸກ (Nurse-in-charge)');
    setEscortStaffPhone('020 5522 9900');
    setEstimatedMinutes(35);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      alert('ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນຄົນເຈັບ');
      setStep(1);
      return;
    }
    if (!chiefComplaint.trim() || !initialDiagnosis.trim()) {
      alert('ກະລຸນາປ້ອນອາການສຳຄັນ ແລະ ການບົ່ງມະຕິເບື້ອງຕົ້ນ');
      setStep(3);
      return;
    }

    setIsSubmitting(true);

    const sendingHosp = HOSPITAL_PRESETS.find((h) => h.id === selectedHospitalId) || {
      id: 'custom',
      name: 'ໂຮງໝໍເມືອງຕົ້ນທາງ',
      district: district,
      province: province,
    };

    const departure = new Date();
    const eta = new Date(departure.getTime() + (estimatedMinutes || 40) * 60 * 1000);

    try {
      const created = await tursoService.createReferral({
        status: 'in_transit',
        urgency: urgency,
        patient: {
          name: patientName,
          age: Number(patientAge) || 0,
          gender: patientGender,
          phone: patientPhone,
          nationalId: nationalId || undefined,
          village: village || 'ບໍ່ໄດ້ລະບຸ',
          district: district,
          province: province,
          insuranceType: insuranceType,
          relativeName: relativeName || undefined,
          relativePhone: relativePhone || undefined,
        },
        sendingHospital: {
          id: sendingHosp.id,
          name: sendingHosp.name,
          district: sendingHosp.district,
          province: sendingHosp.province,
          doctorName: doctorName || 'ແພດປະຈຳການ',
          doctorPhone: doctorPhone || '-',
          department: sendingDepartment,
        },
        destinationDepartment: destinationWard,
        clinical: {
          chiefComplaint,
          historyOfPresentIllness: hpi,
          initialDiagnosis,
          pastMedicalHistory: pastHistory || undefined,
          allergies: allergies || undefined,
          initialTreatment: initialTreatment || 'ປິ່ນປົວປະຄັບປະຄອງເບື້ອງຕົ້ນ',
          ivFluid: ivFluid || undefined,
          reasonForReferral: reasonForReferral || 'ສົ່ງຕໍ່ເພື່ອການກວດ ແລະ ປິ່ນປົວສະເພາະທາງ ໂຮງໝໍແຂວງຈຳປາສັກ',
        },
        vitalSigns: {
          bpSystolic: bpSystolic ? Number(bpSystolic) : undefined,
          bpDiastolic: bpDiastolic ? Number(bpDiastolic) : undefined,
          pulse: pulse ? Number(pulse) : undefined,
          respiratoryRate: respiratoryRate ? Number(respiratoryRate) : undefined,
          temperature: temperature ? Number(temperature) : undefined,
          spo2: spo2 ? Number(spo2) : undefined,
          gcs: gcs ? Number(gcs) : undefined,
          bloodSugar: bloodSugar ? Number(bloodSugar) : undefined,
        },
        logistics: {
          transportType,
          vehiclePlate: vehiclePlate || undefined,
          driverName: driverName || undefined,
          driverPhone: driverPhone || undefined,
          escortStaffName: escortStaffName || 'ພະຍາບານຕິດຕາມ',
          escortStaffPhone: escortStaffPhone || undefined,
          departureTime: departure.toISOString(),
          estimatedArrivalTime: eta.toISOString(),
        },
      });

      setCreatedReferral(created);
      onReferralCreated(created);
    } catch (err: any) {
      alert(`ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success view after submitting
  if (createdReferral) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white border border-teal-200 rounded-2xl p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-teal-50 border border-teal-200 text-teal-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs font-semibold text-teal-800 tracking-wider uppercase">
            ສົ່ງຕໍ່ສຳເລັດແລ້ວ! (REFERRAL SENT)
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            ໄດ້ແຈ້ງການນຳສົ່ງຄົນເຈັບ ມາຍັງໂຮງໝໍແຂວງຈຳປາສັກ ແລ້ວ
          </h2>
          <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
            ລະຫັດການສົ່ງຕົວ: <strong className="font-mono text-slate-800 text-sm">#{createdReferral.referralCode}</strong>
            <br />
            ທີມງານຫ້ອງສຸກເສີນ ແລະ ພະແນກປາຍທາງ ຈະເຫັນຂໍ້ມູນໃນ Dashboard ທັນທີ
          </p>

          <div className="my-6 p-4 bg-slate-50 rounded-xl text-left text-xs border border-slate-200 space-y-1.5">
            <p><strong>ຊື່ຄົນເຈັບ: </strong>{createdReferral.patient.name} ({createdReferral.patient.age} ປີ)</p>
            <p><strong>ໂຮງໝໍຕົ້ນທາງ: </strong>{createdReferral.sendingHospital.name}</p>
            <p><strong>ການບົ່ງມະຕິ: </strong>{createdReferral.clinical.initialDiagnosis}</p>
            <p><strong>ພະແນກປາຍທາງ: </strong>{createdReferral.destinationDepartment}</p>
            <p><strong>ເວລາຄາດຄະເນມາຮອດ (ETA): </strong>
              {new Date(createdReferral.logistics.estimatedArrivalTime).toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onPrintSlip(createdReferral)}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>ພິມໃບນຳສົ່ງຄົນເຈັບ (Print Slip)</span>
            </button>
            <button
              onClick={onOpenDashboard}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              ໄປໜ້າ Dashboard ຕິດຕາມສະຖານະ
            </button>
            <button
              onClick={() => {
                setCreatedReferral(null);
                setStep(1);
                setPatientName('');
                setChiefComplaint('');
                setInitialDiagnosis('');
              }}
              className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              ສ້າງໃບສົ່ງຕົວໃໝ່ອີກ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Banner & Demo Data Helper */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            ຟອມນຳສົ່ງຄົນເຈັບ (Patient Referral Form)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ສົ່ງຕໍ່ມາຍັງ: {CHAMPASAK_PROVINCIAL_HOSPITAL.name}
          </p>
        </div>
        <button
          type="button"
          onClick={handleFillDemoData}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>ກອກຂໍ້ມູນຕົວຢ່າງທົດລອງ (Auto Fill)</span>
        </button>
      </div>

      {/* Stepper Header */}
      <div className="grid grid-cols-4 gap-2 mb-8 text-xs font-medium">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`py-2 px-3 rounded-lg text-left border transition-all cursor-pointer ${
            step === 1
              ? 'border-teal-700 bg-teal-50/60 text-teal-950 font-bold'
              : 'border-slate-200 bg-white text-slate-600'
          }`}
        >
          <span className="block text-[10px] text-slate-400">ຂັ້ນຕອນ 1</span>
          1. ຂໍ້ມູນຄົນເຈັບ
        </button>
        <button
          type="button"
          onClick={() => setStep(2)}
          className={`py-2 px-3 rounded-lg text-left border transition-all cursor-pointer ${
            step === 2
              ? 'border-teal-700 bg-teal-50/60 text-teal-950 font-bold'
              : 'border-slate-200 bg-white text-slate-600'
          }`}
        >
          <span className="block text-[10px] text-slate-400">ຂັ້ນຕອນ 2</span>
          2. ໂຮງໝໍຕົ້ນທາງ
        </button>
        <button
          type="button"
          onClick={() => setStep(3)}
          className={`py-2 px-3 rounded-lg text-left border transition-all cursor-pointer ${
            step === 3
              ? 'border-teal-700 bg-teal-50/60 text-teal-950 font-bold'
              : 'border-slate-200 bg-white text-slate-600'
          }`}
        >
          <span className="block text-[10px] text-slate-400">ຂັ້ນຕອນ 3</span>
          3. ອາການ & ສັນຍານຊີວິດ
        </button>
        <button
          type="button"
          onClick={() => setStep(4)}
          className={`py-2 px-3 rounded-lg text-left border transition-all cursor-pointer ${
            step === 4
              ? 'border-teal-700 bg-teal-50/60 text-teal-950 font-bold'
              : 'border-slate-200 bg-white text-slate-600'
          }`}
        >
          <span className="block text-[10px] text-slate-400">ຂັ້ນຕອນ 4</span>
          4. ການຂົນສົ່ງ & ສົ່ງຕໍ່
        </button>
      </div>

      {/* Main Form Body */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        {/* STEP 1: PATIENT INFORMATION */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              1. ຂໍ້ມູນປະຫວັດຄົນເຈັບ (Patient Demographics)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ຊື່ ແລະ ນາມສະກຸນຄົນເຈັບ: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="ຕົວຢ່າງ: ທ້າວ ສົມພອນ ແກ້ວມະນີ"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ອາຍຸ (ປີ): <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={120}
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="28"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ເພດ:
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white"
                >
                  <option value="male">ຊາຍ (Male)</option>
                  <option value="female">ຍິງ (Female)</option>
                  <option value="other">ອື່ນໆ (Other)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ເບີໂທລະສັບຕິດຕໍ່:
                </label>
                <input
                  type="text"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="020 xxxx xxxx"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ເລກບັດປະຈຳຕົວ / ສຳມະໂນຄົວ:
                </label>
                <input
                  type="text"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder="160xxxxxxxx"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ບ້ານຢູ່ປັດຈຸບັນ:
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="ບ້ານ ຫຼັກ 35"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ເມືອງ:
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="ປາກຊ່ອງ"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ແຂວງ:
                </label>
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="ຈຳປາສັກ"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ປະເພດສິດປິ່ນປົວ / ປະກັນໄພ:
                </label>
                <select
                  value={insuranceType}
                  onChange={(e) => setInsuranceType(e.target.value as InsuranceType)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white"
                >
                  <option value="nhi">ກອງທຶນປະກັນສຸຂະພາບແຫ່ງຊາດ (NHI)</option>
                  <option value="nssf">ປະກັນສັງຄົມແຫ່ງຊາດ (NSSF)</option>
                  <option value="poor_fund">ນະໂຍບາຍສົງເຄາະຄົນທຸກຍາກ</option>
                  <option value="private">ປະກັນໄພເອກະຊົນ</option>
                  <option value="self_pay">ເສຍຄ່າເອງ (Self-pay)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ຊື່ຍາດຕິພີ່ນ້ອງທີ່ມານຳ:
                </label>
                <input
                  type="text"
                  value={relativeName}
                  onChange={(e) => setRelativeName(e.target.value)}
                  placeholder="ຊື່ຍາດ ແລະ ຄວາມສຳພັນ"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ເບີໂທຍາດຕິພີ່ນ້ອງ:
                </label>
                <input
                  type="text"
                  value={relativePhone}
                  onChange={(e) => setRelativePhone(e.target.value)}
                  placeholder="020 xxxx xxxx"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SENDING & RECEIVING FACILITY */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              2. ໂຮງໝໍຕົ້ນທາງ ແລະ ພະແນກປາຍທາງ ໂຮງໝໍແຂວງຈຳປາສັກ
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ເລືອກໂຮງໝໍຕົ້ນທາງ (9 ຕົວເມືອງໃນຈຳປາສັກ ແລະ ແຂວງໃກ້ຄຽງ): <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedHospitalId}
                onChange={(e) => handleHospitalChange(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white font-medium"
              >
                <optgroup label="ໂຮງໝໍ 9 ຕົວເມືອງ ແຂວງຈຳປາສັກ">
                  {HOSPITAL_PRESETS.filter((h) => h.province === 'ຈຳປາສັກ').map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} (ໄລຍະທາງປະມານ {h.distanceKm} km · {h.estimatedMinutes} ນາທີ)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="ໂຮງໝໍແຂວງ ແລະ ເມືອງໃກ້ຄຽງ (ພາກໃຕ້)">
                  {HOSPITAL_PRESETS.filter((h) => h.province !== 'ຈຳປາສັກ').map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.province} · ປະມານ {h.distanceKm} km)
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ທ່ານໝໍຜູ້ສົ່ງຕົວ:
                </label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="ດຣ. ສົມສັກ"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ເບີໂທທ່ານໝໍຜູ້ສົ່ງ:
                </label>
                <input
                  type="text"
                  value={doctorPhone}
                  onChange={(e) => setDoctorPhone(e.target.value)}
                  placeholder="020 xxxx xxxx"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ພະແນກ/ຕຶກຕົ້ນທາງ:
                </label>
                <input
                  type="text"
                  value={sendingDepartment}
                  onChange={(e) => setSendingDepartment(e.target.value)}
                  placeholder="ຫ້ອງສຸກເສີນ ER"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-teal-900 mb-1">
                ພະແນກປາຍທາງທີ່ຕ້ອງການສົ່ງເຂົ້າ ໂຮງໝໍແຂວງຈຳປາສັກ:
              </label>
              <select
                value={destinationWard}
                onChange={(e) => setDestinationWard(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 bg-teal-50/40 font-medium"
              >
                {DESTINATION_DEPARTMENTS.map((ward) => (
                  <option key={ward.id} value={ward.name}>
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* STEP 3: CLINICAL FINDINGS & VITAL SIGNS */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              3. ອາການຄົນເຈັບ, ການບົ່ງມະຕິ ແລະ ສັນຍານຊີວິດ
            </h3>

            {/* Urgency Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                ລະດັບຄວາມສຸກເສີນ (Triage Level):
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setUrgency('emergency')}
                  className={`py-2 px-3 rounded-lg border-2 text-xs font-bold transition-all cursor-pointer ${
                    urgency === 'emergency'
                      ? 'border-red-600 bg-red-50 text-red-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  ສຸກເສີນວິກິດ (Red)
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('urgent')}
                  className={`py-2 px-3 rounded-lg border-2 text-xs font-bold transition-all cursor-pointer ${
                    urgency === 'urgent'
                      ? 'border-amber-500 bg-amber-50 text-amber-800'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  ເລັ່ງດ່ວນ (Yellow)
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('routine')}
                  className={`py-2 px-3 rounded-lg border-2 text-xs font-bold transition-all cursor-pointer ${
                    urgency === 'routine'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  ທົ່ວໄປ (Green)
                </button>
              </div>
            </div>

            {/* Vital Signs Grid */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <span className="text-xs font-bold text-slate-800 block">
                ສັນຍານຊີວິດຂະນະສົ່ງຕົວ (Vital Signs):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    BP Systolic (mmHg):
                  </label>
                  <input
                    type="number"
                    value={bpSystolic}
                    onChange={(e) => setBpSystolic(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="120"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    BP Diastolic (mmHg):
                  </label>
                  <input
                    type="number"
                    value={bpDiastolic}
                    onChange={(e) => setBpDiastolic(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="80"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Pulse (bpm):
                  </label>
                  <input
                    type="number"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="80"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Respiratory Rate (/min):
                  </label>
                  <input
                    type="number"
                    value={respiratoryRate}
                    onChange={(e) => setRespiratoryRate(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="20"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Temperature (°C):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="37.0"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    SpO2 (%):
                  </label>
                  <input
                    type="number"
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="98"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    GCS (3 - 15):
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={15}
                    value={gcs}
                    onChange={(e) => setGcs(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="15"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Blood Sugar DTX (mg/dL):
                  </label>
                  <input
                    type="number"
                    value={bloodSugar}
                    onChange={(e) => setBloodSugar(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="110"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-700 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Clinical text fields */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ການບົ່ງມະຕິພະຍາດເບື້ອງຕົ້ນ (Initial Diagnosis): <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={initialDiagnosis}
                onChange={(e) => setInitialDiagnosis(e.target.value)}
                placeholder="ເຊັ່ນ: Acute Appendicitis, Traumatic Brain Injury, STEMI..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 font-semibold text-teal-950"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ອາການສຳຄັນທີ່ນຳສົ່ງ (Chief Complaint): <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                rows={2}
                placeholder="ເຊັ່ນ: ເຈັບທ້ອງຮຸນແຮງເບື້ອງຂວາລຸ່ມ ມານານ 12 ຊົ່ວໂມງ..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ປະຫວັດເຈັບເປັນປັດຈຸບັນ (History of Present Illness):
              </label>
              <textarea
                value={hpi}
                onChange={(e) => setHpi(e.target.value)}
                rows={2}
                placeholder="ລາຍລະອຽດອາການຕັ້ງແຕ່ເລີ່ມເຈັບ..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ປະຫວັດພະຍາດປະຈຳຕົວ (Past Medical History):
                </label>
                <input
                  type="text"
                  value={pastHistory}
                  onChange={(e) => setPastHistory(e.target.value)}
                  placeholder="HTN, DM, CKD, ບໍ່ມີ..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ປະຫວັດແພ້ຢາ / ອາຫານ (Allergies):
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="ບໍ່ມີ ຫຼື ລະບຸຊື່ຢາທີ່ແພ້"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: TREATMENTS GIVEN & TRANSPORT LOGISTICS */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              4. ການປິ່ນປົວເບື້ອງຕົ້ນ, ການຂົນສົ່ງ ແລະ ສົ່ງຕໍ່
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ການປິ່ນປົວທີ່ໄດ້ໃຫ້ແລ້ວ ກ່ອນສົ່ງຕົວ (Treatments Given):
              </label>
              <textarea
                value={initialTreatment}
                onChange={(e) => setInitialTreatment(e.target.value)}
                rows={2}
                placeholder="ເຊັ່ນ: Oxygen cannula 3L, Paracetamol 1g, Splint, Dressing..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ສານນ້ຳ IV / ຢາທີ່ກຳລັງໃຫ້ຂະນະເດີນທາງ:
              </label>
              <input
                type="text"
                value={ivFluid}
                onChange={(e) => setIvFluid(e.target.value)}
                placeholder="ເຊັ່ນ: 0.9% NSS 1000ml iv drip 80ml/hr..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ເຫດຜົນໃນການສົ່ງຕໍ່ ໂຮງໝໍແຂວງຈຳປາສັກ:
              </label>
              <input
                type="text"
                value={reasonForReferral}
                onChange={(e) => setReasonForReferral(e.target.value)}
                placeholder="ເຊັ່ນ: ຕ້ອງການຜ່າຕັດດ່ວນ, ກວດ CT Scan, ປຶກສາແພດຊ່ຽວຊານສະເພາະທາງ..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ຍານພາຫະນະນຳສົ່ງ:
                </label>
                <select
                  value={transportType}
                  onChange={(e) => setTransportType(e.target.value as TransportType)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white"
                >
                  <option value="ambulance">ລົດໂຮງໝໍສຸກເສີນ (Ambulance)</option>
                  <option value="rescue">ລົດກູ້ໄພ (Rescue Vehicle)</option>
                  <option value="private">ລົດສ່ວນຕົວ / ຄອບຄົວ</option>
                  <option value="other">ອື່ນໆ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ປ້າຍທະບຽນລົດ:
                </label>
                <input
                  type="text"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  placeholder="ກຂ-xxxx"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ເວລາເດີນທາງຄາດຄະເນ (ນາທີ):
                </label>
                <input
                  type="number"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  placeholder="35"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ຊື່ແພດ / ພະຍາບານຕິດຕາມ:
                </label>
                <input
                  type="text"
                  value={escortStaffName}
                  onChange={(e) => setEscortStaffName(e.target.value)}
                  placeholder="ພະຍາບານ ຈັນສຸກ"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ເບີໂທຜູ້ຕິດຕາມ:
                </label>
                <input
                  type="text"
                  value={escortStaffPhone}
                  onChange={(e) => setEscortStaffPhone(e.target.value)}
                  placeholder="020 xxxx xxxx"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-slate-200 mt-8 pt-5">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>ຍ້ອນກັບ</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as any)}
              className="flex items-center gap-1.5 px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <span>ຂັ້ນຕອນຕໍ່ໄປ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ ແລະ ສົ່ງຕໍ່ຄົນເຈັບ'}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
