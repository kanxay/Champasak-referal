import React from 'react';
import { Printer, X } from 'lucide-react';
import { ReferralRecord } from '../types';

interface PrintableReferralSlipProps {
  referral: ReferralRecord;
  onClose: () => void;
}

export const PrintableReferralSlip: React.FC<PrintableReferralSlipProps> = ({ referral, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const getUrgencyLao = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'ສຸກເສີນວິກິດ (Emergency / Triage Red)';
      case 'urgent':
        return 'ເລັ່ງດ່ວນ (Urgent / Triage Yellow)';
      default:
        return 'ທົ່ວໄປ (Routine / Triage Green)';
    }
  };

  const getInsuranceLao = (ins: string) => {
    switch (ins) {
      case 'nhi':
        return 'ກອງທຶນປະກັນສຸຂະພາບແຫ່ງຊາດ (NHI)';
      case 'nssf':
        return 'ປະກັນສັງຄົມແຫ່ງຊາດ (NSSF)';
      case 'poor_fund':
        return 'ນະໂຍບາຍສົງເຄາະຄົນທຸກຍາກ';
      case 'private':
        return 'ປະກັນໄພເອກະຊົນ';
      default:
        return 'ເສຍຄ່າເອງ (Self-Pay)';
    }
  };

  const getTransportLao = (trans: string) => {
    switch (trans) {
      case 'ambulance':
        return 'ລົດໂຮງໝໍສຸກເສີນ (Ambulance)';
      case 'rescue':
        return 'ລົດກູ້ໄພ (Rescue Vehicle)';
      case 'private':
        return 'ລົດສ່ວນຕົວ/ຄອບຄົວ';
      default:
        return 'ອື່ນໆ';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Container */}
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden print-container">
        {/* Screen Action Bar (Hidden when printing) */}
        <div className="no-print bg-slate-100 border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 text-sm">
              ໃບນຳສົ່ງຄົນເຈັບ (Official Referral Slip)
            </span>
            <span className="text-xs text-slate-500 font-mono">
              #{referral.referralCode}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>ພິມໃບສົ່ງຕົວ (Print A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Lao Medical Referral Document */}
        <div className="p-8 sm:p-12 text-slate-900 text-sm leading-relaxed">
          {/* Header & Emblem */}
          <div className="text-center mb-6">
            <h3 className="font-bold text-base tracking-wide">ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ</h3>
            <p className="font-medium text-xs text-slate-600">ສັນຕິພາບ ເອກະລາດ ປະຊາທິປະໄຕ ເອກະພາບ ວັດທະນະຖາວອນ</p>
            <div className="w-24 h-0.5 bg-slate-400 mx-auto my-2"></div>
            <p className="text-xs text-slate-600">ກະຊວງສາທາລະນະສຸກ · ພະແນກສາທາລະນະສຸກແຂວງຈຳປາສັກ</p>
            <h1 className="text-xl font-bold text-slate-900 mt-2 uppercase tracking-wide">
              ໃບນຳສົ່ງຄົນເຈັບ (PATIENT REFERRAL FORM)
            </h1>
            <p className="text-xs text-teal-800 font-semibold mt-0.5">
              ສົ່ງຕໍ່ມາຍັງ: ໂຮງໝໍແຂວງຈຳປາສັກ (CHAMPASAK PROVINCIAL HOSPITAL)
            </p>
          </div>

          {/* Document Reference Info */}
          <div className="flex justify-between items-center border-b border-slate-300 pb-3 mb-4 text-xs font-mono">
            <div>
              <span className="text-slate-500">ເລກທີໃບສົ່ງຕົວ: </span>
              <strong className="text-slate-900">{referral.referralCode}</strong>
            </div>
            <div>
              <span className="text-slate-500">ວັນທີ-ເວລາອອກໃບ: </span>
              <span>{new Date(referral.createdAt).toLocaleString('lo-LA')}</span>
            </div>
            <div>
              <span className="text-slate-500">ລະດັບຄວາມສຸກເສີນ: </span>
              <strong className={referral.urgency === 'emergency' ? 'text-red-600' : referral.urgency === 'urgent' ? 'text-amber-600' : 'text-emerald-700'}>
                {getUrgencyLao(referral.urgency)}
              </strong>
            </div>
          </div>

          {/* Section 1: Sending & Receiving Units */}
          <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <div>
              <p className="font-bold text-slate-700 mb-1">1. ໂຮງໝໍຕົ້ນທາງ (SENDING FACILITY):</p>
              <p><span className="text-slate-500">ຊື່ໂຮງໝໍ: </span><strong>{referral.sendingHospital.name}</strong></p>
              <p><span className="text-slate-500">ເມືອງ/ແຂວງ: </span>{referral.sendingHospital.district}, ແຂວງ{referral.sendingHospital.province}</p>
              <p><span className="text-slate-500">ທ່ານໝໍຜູ້ສົ່ງຕົວ: </span>{referral.sendingHospital.doctorName} (ໂທ: {referral.sendingHospital.doctorPhone})</p>
              {referral.sendingHospital.department && (
                <p><span className="text-slate-500">ພະແນກ/ຕຶກ: </span>{referral.sendingHospital.department}</p>
              )}
            </div>
            <div>
              <p className="font-bold text-slate-700 mb-1">2. ໂຮງໝໍປາຍທາງ (RECEIVING FACILITY):</p>
              <p><span className="text-slate-500">ຊື່ໂຮງໝໍ: </span><strong>ໂຮງໝໍແຂວງຈຳປາສັກ</strong></p>
              <p><span className="text-slate-500">ສະຖານທີ່: </span>ນະຄອນປາກເຊ, ແຂວງຈຳປາສັກ (ໂທ: 031 212 115 / ສຸກເສີນ: 1195)</p>
              <p><span className="text-slate-500">ພະແນກປາຍທາງ: </span><strong className="text-teal-900">{referral.destinationDepartment}</strong></p>
              {referral.assignedWard && (
                <p><span className="text-slate-500">ຕຶກ/ຕຽງທີ່ໄດ້ຮັບ: </span>{referral.assignedWard}</p>
              )}
            </div>
          </div>

          {/* Section 2: Patient Demographics */}
          <div className="mb-4">
            <h4 className="font-bold text-slate-800 text-xs uppercase border-b border-slate-200 pb-1 mb-2">
              3. ຂໍ້ມູນປະຫວັດຄົນເຈັບ (PATIENT INFORMATION)
            </h4>
            <div className="grid grid-cols-3 gap-y-2 gap-x-4 text-xs">
              <div>
                <span className="text-slate-500">ຊື່ ແລະ ນາມສະກຸນ: </span>
                <strong className="text-slate-900">{referral.patient.name}</strong>
              </div>
              <div>
                <span className="text-slate-500">ອາຍຸ: </span>
                <span className="font-mono">{referral.patient.age}</span> ປີ
              </div>
              <div>
                <span className="text-slate-500">ເພດ: </span>
                <span>{referral.patient.gender === 'male' ? 'ຊາຍ' : referral.patient.gender === 'female' ? 'ຍິງ' : 'ອື່ນໆ'}</span>
              </div>
              <div>
                <span className="text-slate-500">ເບີໂທລະສັບ: </span>
                <span className="font-mono">{referral.patient.phone || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500">ເລກບັດປະຈຳຕົວ: </span>
                <span className="font-mono">{referral.patient.nationalId || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500">ປະເພດປະກັນໄພ: </span>
                <span>{getInsuranceLao(referral.patient.insuranceType)}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">ທີ່ຢູ່ປັດຈຸບັນ: </span>
                <span>{referral.patient.village}, ເມືອງ{referral.patient.district}, ແຂວງ{referral.patient.province}</span>
              </div>
              <div>
                <span className="text-slate-500">ຍາດຕິພີ່ນ້ອງ: </span>
                <span>{referral.patient.relativeName ? `${referral.patient.relativeName} (${referral.patient.relativePhone || '-'})` : '-'}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Vital Signs */}
          <div className="mb-4">
            <h4 className="font-bold text-slate-800 text-xs uppercase border-b border-slate-200 pb-1 mb-2">
              4. ສັນຍານຊີວິດຂະນະສົ່ງຕົວ (VITAL SIGNS AT REFERRAL)
            </h4>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center text-xs">
              <div className="border border-slate-200 rounded p-1.5 bg-slate-50">
                <div className="text-[10px] text-slate-500">BP (mmHg)</div>
                <div className="font-bold font-mono text-slate-900 mt-0.5">
                  {referral.vitalSigns.bpSystolic || '-'}/{referral.vitalSigns.bpDiastolic || '-'}
                </div>
              </div>
              <div className="border border-slate-200 rounded p-1.5 bg-slate-50">
                <div className="text-[10px] text-slate-500">Pulse (bpm)</div>
                <div className="font-bold font-mono text-slate-900 mt-0.5">
                  {referral.vitalSigns.pulse || '-'}
                </div>
              </div>
              <div className="border border-slate-200 rounded p-1.5 bg-slate-50">
                <div className="text-[10px] text-slate-500">RR (/min)</div>
                <div className="font-bold font-mono text-slate-900 mt-0.5">
                  {referral.vitalSigns.respiratoryRate || '-'}
                </div>
              </div>
              <div className="border border-slate-200 rounded p-1.5 bg-slate-50">
                <div className="text-[10px] text-slate-500">Temp (°C)</div>
                <div className="font-bold font-mono text-slate-900 mt-0.5">
                  {referral.vitalSigns.temperature || '-'}
                </div>
              </div>
              <div className="border border-slate-200 rounded p-1.5 bg-slate-50">
                <div className="text-[10px] text-slate-500">SpO2 (%)</div>
                <div className="font-bold font-mono text-slate-900 mt-0.5">
                  {referral.vitalSigns.spo2 ? `${referral.vitalSigns.spo2}%` : '-'}
                </div>
              </div>
              <div className="border border-slate-200 rounded p-1.5 bg-slate-50">
                <div className="text-[10px] text-slate-500">GCS (3-15)</div>
                <div className="font-bold font-mono text-slate-900 mt-0.5">
                  {referral.vitalSigns.gcs || '-'}
                </div>
              </div>
              <div className="border border-slate-200 rounded p-1.5 bg-slate-50">
                <div className="text-[10px] text-slate-500">DTX (mg/dL)</div>
                <div className="font-bold font-mono text-slate-900 mt-0.5">
                  {referral.vitalSigns.bloodSugar || '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Clinical Findings & Diagnosis */}
          <div className="mb-4 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 text-xs uppercase border-b border-slate-200 pb-1 mb-2">
              5. ຂໍ້ມູນອາການ ແລະ ການບົ່ງມະຕິພະຍາດ (CLINICAL FINDINGS & DIAGNOSIS)
            </h4>
            <div className="p-2.5 border border-slate-200 rounded bg-white">
              <span className="font-semibold text-slate-700">ອາການສຳຄັນທີ່ນຳສົ່ງ (Chief Complaint): </span>
              <p className="mt-0.5 text-slate-900">{referral.clinical.chiefComplaint}</p>
            </div>
            <div className="p-2.5 border border-slate-200 rounded bg-white">
              <span className="font-semibold text-slate-700">ປະຫວັດເຈັບເປັນປັດຈຸບັນ (History of Present Illness): </span>
              <p className="mt-0.5 text-slate-900">{referral.clinical.historyOfPresentIllness || '-'}</p>
            </div>
            <div className="p-2.5 border border-teal-200 rounded bg-teal-50/50">
              <span className="font-semibold text-teal-900">ການບົ່ງມະຕິເບື້ອງຕົ້ນ (Initial Diagnosis): </span>
              <p className="mt-0.5 font-bold text-teal-950 text-sm">{referral.clinical.initialDiagnosis}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-slate-500">ປະຫວັດພະຍາດປະຈຳຕົວ: </span>
                <span>{referral.clinical.pastMedicalHistory || 'ບໍ່ມີ'}</span>
              </div>
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-slate-500">ປະຫວັດແພ້ຢາ/ອາຫານ: </span>
                <strong className={referral.clinical.allergies ? 'text-red-700' : 'text-slate-700'}>
                  {referral.clinical.allergies || 'ບໍ່ມີ'}
                </strong>
              </div>
            </div>
          </div>

          {/* Section 5: Treatments Given & Transfer Logistics */}
          <div className="mb-6 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 text-xs uppercase border-b border-slate-200 pb-1 mb-2">
              6. ການປິ່ນປົວເບື້ອງຕົ້ນ ແລະ ການຂົນສົ່ງ (TREATMENTS & LOGISTICS)
            </h4>
            <div className="p-2.5 border border-slate-200 rounded bg-white">
              <span className="font-semibold text-slate-700">ການປິ່ນປົວທີ່ໄດ້ໃຫ້ແລ້ວ (Treatments Given): </span>
              <p className="mt-0.5 text-slate-900">{referral.clinical.initialTreatment}</p>
              {referral.clinical.ivFluid && (
                <p className="text-slate-600 mt-1"><span className="font-medium">ສານນ້ຳ IV: </span>{referral.clinical.ivFluid}</p>
              )}
            </div>
            <div className="p-2.5 border border-slate-200 rounded bg-white">
              <span className="font-semibold text-slate-700">ເຫດຜົນໃນການສົ່ງຕໍ່ (Reason for Referral): </span>
              <p className="mt-0.5 text-slate-900">{referral.clinical.reasonForReferral}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded">
              <div>
                <span className="text-slate-500">ຍານພາຫະນະ: </span>
                <strong>{getTransportLao(referral.logistics.transportType)}</strong>
                {referral.logistics.vehiclePlate && ` (${referral.logistics.vehiclePlate})`}
              </div>
              <div>
                <span className="text-slate-500">ແພດ/ພະຍາບານຕິດຕາມ: </span>
                <strong>{referral.logistics.escortStaffName}</strong>
              </div>
              <div>
                <span className="text-slate-500">ເວລາຄາດຄະເນມາຮອດ (ETA): </span>
                <span className="font-mono font-medium">
                  {referral.logistics.estimatedArrivalTime ? new Date(referral.logistics.estimatedArrivalTime).toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit' }) : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 6: Official Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-300 text-xs text-center">
            <div className="flex flex-col items-center">
              <p className="font-bold text-slate-700">ທ່ານໝໍຜູ້ສົ່ງຕໍ່ (REFERRING DOCTOR)</p>
              <div className="h-16 flex items-end">
                <span className="text-slate-400 italic">...................................................</span>
              </div>
              <p className="font-medium text-slate-800 mt-1">({referral.sendingHospital.doctorName})</p>
              <p className="text-slate-500 text-[11px]">{referral.sendingHospital.name}</p>
            </div>

            <div className="flex flex-col items-center">
              <p className="font-bold text-slate-700">ທ່ານໝໍຜູ້ຮັບຄົນເຈັບ (RECEIVING DOCTOR)</p>
              <div className="h-16 flex items-end">
                <span className="text-slate-400 italic">...................................................</span>
              </div>
              <p className="font-medium text-slate-800 mt-1">
                ({referral.assignedDoctor || 'ແພດປະຈຳການ ຫ້ອງສຸກເສີນ'})
              </p>
              <p className="text-slate-500 text-[11px]">ໂຮງໝໍແຂວງຈຳປາສັກ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
