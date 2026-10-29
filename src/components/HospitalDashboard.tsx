import React, { useState, useMemo } from 'react';
import { ReferralRecord, UrgencyLevel, ReferralStatus } from '../types';
import { HOSPITAL_PRESETS } from '../data/hospitals';
import { Search, Filter, Clock, Eye, Printer, AlertCircle, Ambulance, CheckCircle, MapPin, Plus } from 'lucide-react';

interface HospitalDashboardProps {
  referrals: ReferralRecord[];
  onSelectReferral: (referral: ReferralRecord) => void;
  onPrintSlip: (referral: ReferralRecord) => void;
  onQuickArrived: (id: string) => Promise<void>;
  onNewReferralClick: () => void;
}

export const HospitalDashboard: React.FC<HospitalDashboardProps> = ({
  referrals,
  onSelectReferral,
  onPrintSlip,
  onQuickArrived,
  onNewReferralClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | UrgencyLevel>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ReferralStatus>('all');
  const [originFilter, setOriginFilter] = useState<string>('all');

  // KPI Metrics
  const totalCount = referrals.length;
  const emergencyCount = referrals.filter((r) => r.urgency === 'emergency').length;
  const inTransitCount = referrals.filter((r) => r.status === 'in_transit').length;
  const arrivedCount = referrals.filter((r) => r.status === 'arrived' || r.status === 'admitted').length;

  // Filtered list
  const filteredReferrals = useMemo(() => {
    return referrals.filter((r) => {
      // Search
      const term = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        r.patient.name.toLowerCase().includes(term) ||
        r.referralCode.toLowerCase().includes(term) ||
        r.clinical.initialDiagnosis.toLowerCase().includes(term) ||
        r.sendingHospital.name.toLowerCase().includes(term);

      // Urgency
      const matchUrgency = urgencyFilter === 'all' || r.urgency === urgencyFilter;

      // Status
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;

      // Origin
      const matchOrigin = originFilter === 'all' || r.sendingHospital.id === originFilter;

      return matchSearch && matchUrgency && matchStatus && matchOrigin;
    });
  }, [referrals, searchTerm, urgencyFilter, statusFilter, originFilter]);

  const getStatusBadge = (status: ReferralStatus) => {
    switch (status) {
      case 'in_transit':
        return {
          label: 'ກຳລັງເດີນທາງມາ',
          classes: 'bg-sky-50 text-sky-700 border border-sky-200',
        };
      case 'arrived':
        return {
          label: 'ມາຮອດ ER ແລ້ວ',
          classes: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
        };
      case 'admitted':
        return {
          label: 'ຮັບເຂົ້າຕຶກປິ່ນປົວ',
          classes: 'bg-purple-50 text-purple-700 border border-purple-200',
        };
      case 'completed':
        return {
          label: 'ສຳເລັດການປິ່ນປົວ',
          classes: 'bg-slate-100 text-slate-700 border border-slate-200',
        };
      case 'cancelled':
        return {
          label: 'ຍົກເລີກ',
          classes: 'bg-rose-50 text-rose-700 border border-rose-200',
        };
    }
  };

  const getUrgencyBadge = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'emergency':
        return {
          label: 'ສຸກເສີນ Red',
          classes: 'bg-red-50 text-red-700 border border-red-200 font-bold',
        };
      case 'urgent':
        return {
          label: 'ເລັ່ງດ່ວນ Yellow',
          classes: 'bg-amber-50 text-amber-800 border border-amber-200 font-bold',
        };
      default:
        return {
          label: 'ທົ່ວໄປ Green',
          classes: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            ແດຊບອດຮັບຄົນເຈັບ ໂຮງໝໍແຂວງຈຳປາສັກ (Champasak Referral Center)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ຕິດຕາມການນຳສົ່ງຄົນເຈັບສຸກເສີນ ຈາກໂຮງໝໍ 9 ຕົວເມືອງ ແລະ ແຂວງອ້ອມຂ້າງແບບ Realtime
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNewReferralClick}
            className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>ສ້າງໃບນຳສົ່ງໃໝ່</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">ເຄສສົ່ງຕົວທັງໝົດ</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {totalCount}
            </span>
            <span className="text-xs text-slate-400">ເຄສ</span>
          </div>
        </div>

        {/* Emergency */}
        <div className="bg-white border border-red-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-red-700 font-medium block mb-1">ສຸກເສີນວິກິດ (Triage Red)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-red-600 tabular-nums">
              {emergencyCount}
            </span>
            <span className="text-xs text-red-400">ເຄສ</span>
          </div>
        </div>

        {/* In Transit */}
        <div className="bg-white border border-sky-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-sky-700 font-medium block mb-1">ກຳລັງເດີນທາງມາ (In Transit)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-sky-600 tabular-nums">
              {inTransitCount}
            </span>
            <span className="text-xs text-sky-400">ເຄສ</span>
          </div>
        </div>

        {/* Arrived / Admitted */}
        <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-emerald-700 font-medium block mb-1">ມາຮອດແລ້ວ / ຮັບຮັກສາ</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
              {arrivedCount}
            </span>
            <span className="text-xs text-emerald-400">ເຄສ</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ຄົ້ນຫາຊື່ຄົນເຈັບ, ເລກໃບສົ່ງຕົວ, ພະຍາດ, ໂຮງໝໍ..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          {/* Hospital Origin Filter */}
          <div>
            <select
              value={originFilter}
              onChange={(e) => setOriginFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 font-medium"
            >
              <option value="all">ທຸກໂຮງໝໍຕົ້ນທາງ</option>
              {HOSPITAL_PRESETS.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 font-medium"
            >
              <option value="all">ທຸກສະຖານະ</option>
              <option value="in_transit">ກຳລັງເດີນທາງມາ</option>
              <option value="arrived">ມາຮອດ ER ແລ້ວ</option>
              <option value="admitted">ຮັບເຂົ້າຕຶກປິ່ນປົວ</option>
              <option value="completed">ສຳເລັດ</option>
            </select>
          </div>
        </div>

        {/* Urgency Filter Segmented Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
          <span className="text-[11px] text-slate-400 mr-2">ລະດັບຄວາມສຸກເສີນ:</span>
          <button
            onClick={() => setUrgencyFilter('all')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              urgencyFilter === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ທັງໝົດ ({referrals.length})
          </button>
          <button
            onClick={() => setUrgencyFilter('emergency')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
              urgencyFilter === 'emergency'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            ສຸກເສີນ Red ({referrals.filter((r) => r.urgency === 'emergency').length})
          </button>
          <button
            onClick={() => setUrgencyFilter('urgent')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
              urgencyFilter === 'urgent'
                ? 'bg-amber-500 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            ເລັ່ງດ່ວນ Yellow ({referrals.filter((r) => r.urgency === 'urgent').length})
          </button>
          <button
            onClick={() => setUrgencyFilter('routine')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              urgencyFilter === 'routine'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            ທົ່ວໄປ Green ({referrals.filter((r) => r.urgency === 'routine').length})
          </button>
        </div>
      </div>

      {/* Referrals List / Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {filteredReferrals.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-medium text-slate-600">ບໍ່ພົບຂໍ້ມູນການນຳສົ່ງທີ່ກົງກັບເງື່ອນໄຂ</p>
            <p className="text-xs">ລອງປັບປ່ຽນຄຳຄົ້ນຫາ ຫຼື ກົດສ້າງໃບນຳສົ່ງໃໝ່</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">ລະຫັດ & ເວລາ</th>
                  <th className="py-3 px-4">ຂໍ້ມູນຄົນເຈັບ</th>
                  <th className="py-3 px-4">ໂຮງໝໍຕົ້ນທາງ</th>
                  <th className="py-3 px-4">ການບົ່ງມະຕິ & ອາການ</th>
                  <th className="py-3 px-4">ສັນຍານຊີວິດ</th>
                  <th className="py-3 px-4">ຄວາມສຸກເສີນ & ສະຖານະ</th>
                  <th className="py-3 px-4 text-right">ຈັດການ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReferrals.map((r) => {
                  const statusBadge = getStatusBadge(r.status);
                  const urgencyBadge = getUrgencyBadge(r.urgency);

                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Code & Time */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 block">
                          #{r.referralCode}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(r.createdAt).toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit' })} · {new Date(r.createdAt).toLocaleDateString('lo-LA')}
                        </span>
                      </td>

                      {/* Patient Info */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block text-xs">
                          {r.patient.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <span>{r.patient.age} ປີ</span>
                          <span>·</span>
                          <span>{r.patient.gender === 'male' ? 'ຊາຍ' : 'ຍິງ'}</span>
                          <span>·</span>
                          <span className="truncate max-w-[120px]">{r.patient.district}</span>
                        </div>
                      </td>

                      {/* Origin Hospital */}
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800 block">
                          {r.sendingHospital.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          ແພດ: {r.sendingHospital.doctorName}
                        </span>
                      </td>

                      {/* Clinical Diagnosis & Ward */}
                      <td className="py-3 px-4 max-w-xs">
                        <span className="font-bold text-teal-950 block truncate">
                          {r.clinical.initialDiagnosis}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate">
                          ສົ່ງເຂົ້າ: {r.destinationDepartment}
                        </span>
                      </td>

                      {/* Vital Signs Preview */}
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                        <div>
                          <span className="text-slate-400">BP: </span>
                          <strong className="text-slate-800">{r.vitalSigns.bpSystolic || '-'}/{r.vitalSigns.bpDiastolic || '-'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">SpO2: </span>
                          <strong className={r.vitalSigns.spo2 && r.vitalSigns.spo2 < 95 ? 'text-red-600' : 'text-slate-800'}>
                            {r.vitalSigns.spo2 ? `${r.vitalSigns.spo2}%` : '-'}
                          </strong>
                        </div>
                      </td>

                      {/* Badges */}
                      <td className="py-3 px-4 whitespace-nowrap space-y-1">
                        <div>
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] ${urgencyBadge.classes}`}>
                            {urgencyBadge.label}
                          </span>
                        </div>
                        <div>
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] ${statusBadge.classes}`}>
                            {statusBadge.label}
                          </span>
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {r.status === 'in_transit' && (
                            <button
                              onClick={() => onQuickArrived(r.id)}
                              title="ບັນທຶກວ່າຄົນເຈັບມາຮອດຫ້ອງສຸກເສີນແລ້ວ"
                              className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>ຮັບຄົນເຈັບ</span>
                            </button>
                          )}
                          <button
                            onClick={() => onSelectReferral(r)}
                            title="ເບິ່ງລາຍລະອຽດເຄສ"
                            className="p-1.5 text-slate-600 hover:text-teal-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onPrintSlip(r)}
                            title="ພິມໃບນຳສົ່ງ (Print Slip)"
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
