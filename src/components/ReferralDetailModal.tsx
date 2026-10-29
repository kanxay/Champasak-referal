import React, { useState } from 'react';
import { X, Printer, CheckCircle2, Clock, MapPin, Phone, User, AlertTriangle, ShieldCheck, Ambulance } from 'lucide-react';
import { ReferralRecord, ReferralStatus } from '../types';
import { DESTINATION_DEPARTMENTS } from '../data/hospitals';

interface ReferralDetailModalProps {
  referral: ReferralRecord;
  onClose: () => void;
  onUpdateStatus: (
    id: string,
    status: ReferralStatus,
    notes?: string,
    doctor?: string,
    ward?: string
  ) => Promise<void>;
  onPrintSlip: (referral: ReferralRecord) => void;
}

export const ReferralDetailModal: React.FC<ReferralDetailModalProps> = ({
  referral,
  onClose,
  onUpdateStatus,
  onPrintSlip,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ReferralStatus>(referral.status);
  const [notes, setNotes] = useState(referral.receivingNotes || '');
  const [assignedDoctor, setAssDoctor] = useState(referral.assignedDoctor || '');
  const [assignedWard, setAssWard] = useState(referral.assignedWard || referral.destinationDepartment);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveStatus = async () => {
    setIsSaving(true);
    await onUpdateStatus(referral.id, selectedStatus, notes, assignedDoctor, assignedWard);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const isVitalsAbnormal = {
    bp: (referral.vitalSigns.bpSystolic && referral.vitalSigns.bpSystolic > 160) || (referral.vitalSigns.bpSystolic && referral.vitalSigns.bpSystolic < 90),
    pulse: (referral.vitalSigns.pulse && referral.vitalSigns.pulse > 110) || (referral.vitalSigns.pulse && referral.vitalSigns.pulse < 50),
    spo2: referral.vitalSigns.spo2 && referral.vitalSigns.spo2 < 95,
    temp: referral.vitalSigns.temperature && referral.vitalSigns.temperature > 38.5,
    gcs: referral.vitalSigns.gcs && referral.vitalSigns.gcs < 13,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-6 overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded ${
                referral.urgency === 'emergency'
                  ? 'bg-red-500 text-white'
                  : referral.urgency === 'urgent'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-emerald-500 text-white'
              }`}
            >
              {referral.urgency === 'emergency'
                ? 'ສຸກເສີນວິກິດ (Emergency)'
                : referral.urgency === 'urgent'
                ? 'ເລັ່ງດ່ວນ (Urgent)'
                : 'ທົ່ວໄປ (Routine)'}
            </span>
            <div>
              <h2 className="text-base font-bold text-white">
                {referral.patient.name} ({referral.patient.age} ປີ, {referral.patient.gender === 'male' ? 'ຊາຍ' : 'ຍິງ'})
              </h2>
              <p className="text-xs text-slate-300 font-mono">
                ເລກລະຫັດ: {referral.referralCode} · ສົ່ງຈາກ: {referral.sendingHospital.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrintSlip(referral)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>ພິມໃບສົ່ງຕົວ</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="space-y-1">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> ໂຮງໝໍຕົ້ນທາງ:
              </span>
              <p className="font-bold text-slate-900">{referral.sendingHospital.name}</p>
              <p className="text-slate-600">ແພດສົ່ງຕົວ: {referral.sendingHospital.doctorName}</p>
              <p className="text-slate-600 font-mono">ໂທ: {referral.sendingHospital.doctorPhone}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Ambulance className="w-3.5 h-3.5 text-slate-400" /> ການຂົນສົ່ງ & ເວລາ:
              </span>
              <p className="font-semibold text-slate-900">
                {referral.logistics.transportType === 'ambulance' ? 'ລົດໂຮງໝໍສຸກເສີນ' : referral.logistics.transportType === 'rescue' ? 'ລົດກູ້ໄພ' : 'ລົດສ່ວນຕົວ'}
                {referral.logistics.vehiclePlate ? ` (${referral.logistics.vehiclePlate})` : ''}
              </p>
              <p className="text-slate-600">ແພດ/ພະຍາບານຕິດຕາມ: {referral.logistics.escortStaffName}</p>
              <p className="text-teal-800 font-medium">
                ETA ຄາດຄະເນມາຮອດ: {new Date(referral.logistics.estimatedArrivalTime).toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> ຂໍ້ມູນຄົນເຈັບ & ປະກັນ:
              </span>
              <p className="font-semibold text-slate-900">
                ບ້ານ {referral.patient.village}, ເມືອງ{referral.patient.district}
              </p>
              <p className="text-slate-600">
                ປະກັນ: {referral.patient.insuranceType === 'nhi' ? 'ກອງທຶນປະກັນສຸຂະພາບແຫ່ງຊາດ' : referral.patient.insuranceType === 'nssf' ? 'ປະກັນສັງຄົມ' : 'ອື່ນໆ'}
              </p>
              <p className="text-slate-600 font-mono">ໂທຄົນເຈັບ/ຍາດ: {referral.patient.phone || '-'}</p>
            </div>
          </div>

          {/* Vital Signs Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">ສັນຍານຊີວິດລ່າສຸດ (Vital Signs)</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              <div className={`p-2.5 border rounded-lg text-center ${isVitalsAbnormal.bp ? 'border-red-300 bg-red-50 text-red-900' : 'border-slate-200 bg-white'}`}>
                <div className="text-[10px] text-slate-500">ຄວາມດັນເລືອດ BP</div>
                <div className="font-mono font-bold text-sm mt-0.5">
                  {referral.vitalSigns.bpSystolic || '-'}/{referral.vitalSigns.bpDiastolic || '-'} <span className="text-[10px] font-normal">mmHg</span>
                </div>
              </div>

              <div className={`p-2.5 border rounded-lg text-center ${isVitalsAbnormal.pulse ? 'border-red-300 bg-red-50 text-red-900' : 'border-slate-200 bg-white'}`}>
                <div className="text-[10px] text-slate-500">ກຳມະຈອນ Pulse</div>
                <div className="font-mono font-bold text-sm mt-0.5">
                  {referral.vitalSigns.pulse || '-'} <span className="text-[10px] font-normal">bpm</span>
                </div>
              </div>

              <div className={`p-2.5 border rounded-lg text-center border-slate-200 bg-white`}>
                <div className="text-[10px] text-slate-500">ອັດຕາຫາຍໃຈ RR</div>
                <div className="font-mono font-bold text-sm mt-0.5">
                  {referral.vitalSigns.respiratoryRate || '-'} <span className="text-[10px] font-normal">/min</span>
                </div>
              </div>

              <div className={`p-2.5 border rounded-lg text-center ${isVitalsAbnormal.temp ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-slate-200 bg-white'}`}>
                <div className="text-[10px] text-slate-500">ອຸນຫະພູມ Temp</div>
                <div className="font-mono font-bold text-sm mt-0.5">
                  {referral.vitalSigns.temperature || '-'} <span className="text-[10px] font-normal">°C</span>
                </div>
              </div>

              <div className={`p-2.5 border rounded-lg text-center ${isVitalsAbnormal.spo2 ? 'border-red-300 bg-red-50 text-red-900' : 'border-slate-200 bg-white'}`}>
                <div className="text-[10px] text-slate-500">ອອກຊີເຈນ SpO2</div>
                <div className="font-mono font-bold text-sm mt-0.5">
                  {referral.vitalSigns.spo2 ? `${referral.vitalSigns.spo2}%` : '-'}
                </div>
              </div>

              <div className={`p-2.5 border rounded-lg text-center ${isVitalsAbnormal.gcs ? 'border-red-300 bg-red-50 text-red-900' : 'border-slate-200 bg-white'}`}>
                <div className="text-[10px] text-slate-500">ສະຕິ GCS</div>
                <div className="font-mono font-bold text-sm mt-0.5">
                  {referral.vitalSigns.gcs || '-'}/15
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Findings */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-500">ການບົ່ງມະຕິ ແລະ ອາການຄົນເຈັບ</h3>
            <div className="p-3 bg-teal-50/60 border border-teal-200 rounded-lg">
              <span className="text-teal-900 font-bold block mb-0.5">ການບົ່ງມະຕິເບື້ອງຕົ້ນ (Initial Diagnosis):</span>
              <p className="text-teal-950 font-semibold text-sm">{referral.clinical.initialDiagnosis}</p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-500 font-bold block mb-0.5">ອາການສຳຄັນທີ່ນຳສົ່ງ (Chief Complaint):</span>
              <p className="text-slate-900">{referral.clinical.chiefComplaint}</p>
            </div>

            {referral.clinical.historyOfPresentIllness && (
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-500 font-bold block mb-0.5">ປະຫວັດເຈັບເປັນປັດຈຸບັນ (History of Present Illness):</span>
                <p className="text-slate-900">{referral.clinical.historyOfPresentIllness}</p>
              </div>
            )}

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-500 font-bold block mb-0.5">ການປິ່ນປົວເບື້ອງຕົ້ນທີ່ໄດ້ໃຫ້ແລ້ວ (Treatments Given):</span>
              <p className="text-slate-900">{referral.clinical.initialTreatment}</p>
              {referral.clinical.ivFluid && (
                <p className="text-slate-600 mt-1"><strong>ສານນ້ຳ IV: </strong>{referral.clinical.ivFluid}</p>
              )}
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-500 font-bold block mb-0.5">ເຫດຜົນໃນການສົ່ງຕໍ່ໂຮງໝໍແຂວງຈຳປາສັກ:</span>
              <p className="text-slate-900">{referral.clinical.reasonForReferral}</p>
            </div>
          </div>

          {/* Status Update & Ward Assignment Action Panel */}
          <div className="p-4 bg-slate-100 border border-slate-300 rounded-xl space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-800">
              ອັບເດດສະຖານະການຮັບຄົນເຈັບ ຢູ່ໂຮງໝໍແຂວງຈຳປາສັກ
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ສະຖານະປັດຈຸບັນ:
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ReferralStatus)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 font-medium"
                >
                  <option value="in_transit">ກຳລັງເດີນທາງມາ (In Transit)</option>
                  <option value="arrived">ມາຮອດຫ້ອງສຸກເສີນແລ້ວ (Arrived ER)</option>
                  <option value="admitted">ຮັບເຂົ້າຕຶກປິ່ນປົວ (Admitted)</option>
                  <option value="completed">ປິ່ນປົວສຳເລັດ / ສົ່ງຕໍ່ (Completed)</option>
                  <option value="cancelled">ຍົກເລີກການສົ່ງຕົວ (Cancelled)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ຕຶກ/ພະແນກທີ່ຮັບຮັກສາ:
                </label>
                <select
                  value={assignedWard}
                  onChange={(e) => setAssWard(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
                >
                  {DESTINATION_DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ທ່ານໝໍຜູ້ຮັບຜິດຊອບ:
                </label>
                <input
                  type="text"
                  value={assignedDoctor}
                  onChange={(e) => setAssDoctor(e.target.value)}
                  placeholder="ເຊັ່ນ: ດຣ. ສົມສັກ ແກ້ວວິໄລ"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ບັນທຶກຂອງທີມງານຮັບຄົນເຈັບ (Receiving Notes):
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ບັນທຶກອາການເມື່ອມາຮອດ, ຕຽງນອນ, ຫຼື ການກວດພິເສດ..."
                rows={2}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              {saveSuccess ? (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> ອັບເດດສະຖານະສຳເລັດແລ້ວ!
                </span>
              ) : (
                <span className="text-xs text-slate-500">
                  {referral.receivedAt ? `ມາຮອດເວລາ: ${new Date(referral.receivedAt).toLocaleTimeString('lo-LA')}` : 'ຍັງບໍ່ທັນມາຮອດ'}
                </span>
              )}

              <button
                type="button"
                onClick={handleSaveStatus}
                disabled={isSaving}
                className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                {isSaving ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກການອັບເດດສະຖານະ'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
