import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HospitalDashboard } from './components/HospitalDashboard';
import { ReferralForm } from './components/ReferralForm';
import { TursoSettingsModal } from './components/TursoSettingsModal';
import { ReferralDetailModal } from './components/ReferralDetailModal';
import { PrintableReferralSlip } from './components/PrintableReferralSlip';
import { tursoService, TursoConfig } from './services/tursoService';
import { ReferralRecord, ReferralStatus } from './types';
import { Phone, Building2, MapPin, Database } from 'lucide-react';
import { CHAMPASAK_PROVINCIAL_HOSPITAL } from './data/hospitals';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'new-referral' | 'turso-guide'>('dashboard');
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [tursoConfig, setTursoConfig] = useState<TursoConfig>(tursoService.getConfig());
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals
  const [detailModalCase, setDetailModalCase] = useState<ReferralRecord | null>(null);
  const [printModalCase, setPrintModalCase] = useState<ReferralRecord | null>(null);

  // Load referrals
  const loadData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setIsRefreshing(true);
    try {
      const data = await tursoService.getReferrals();
      setReferrals(data);
    } catch (err) {
      console.error('Failed to load referrals:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    status: ReferralStatus,
    notes?: string,
    doctor?: string,
    ward?: string
  ) => {
    await tursoService.updateReferralStatus(id, status, notes, doctor, ward);
    await loadData(false);

    // Also update current active detail modal if open
    if (detailModalCase && detailModalCase.id === id) {
      setDetailModalCase((prev) =>
        prev
          ? {
              ...prev,
              status,
              receivingNotes: notes !== undefined ? notes : prev.receivingNotes,
              assignedDoctor: doctor || prev.assignedDoctor,
              assignedWard: ward || prev.assignedWard,
            }
          : null
      );
    }
  };

  const handleQuickArrived = async (id: string) => {
    await handleUpdateStatus(id, 'arrived', 'ມາຮອດຫ້ອງສຸກເສີນໂຮງໝໍແຂວງຈຳປາສັກແລ້ວ');
  };

  const handleReferralCreated = (created: ReferralRecord) => {
    setReferrals((prev) => [created, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        tursoConfig={tursoConfig}
        onRefresh={() => loadData(false)}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Viewport */}
      <main className="flex-1">
        {isLoading ? (
          <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <div className="w-10 h-10 border-3 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500 font-medium">ກຳລັງໂຫຼດຂໍ້ມູນການນຳສົ່ງຄົນເຈັບ...</p>
          </div>
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <HospitalDashboard
                referrals={referrals}
                onSelectReferral={(ref) => setDetailModalCase(ref)}
                onPrintSlip={(ref) => setPrintModalCase(ref)}
                onQuickArrived={handleQuickArrived}
                onNewReferralClick={() => setCurrentTab('new-referral')}
              />
            )}

            {currentTab === 'new-referral' && (
              <ReferralForm
                onReferralCreated={handleReferralCreated}
                onOpenDashboard={() => setCurrentTab('dashboard')}
                onPrintSlip={(ref) => setPrintModalCase(ref)}
              />
            )}

            {currentTab === 'turso-guide' && (
              <TursoSettingsModal
                config={tursoConfig}
                onConfigChange={(updated) => {
                  setTursoConfig(updated);
                  loadData(false);
                }}
                onRefreshData={() => loadData(false)}
              />
            )}
          </>
        )}
      </main>

      {/* Modal: Clinical Details & Receiving Actions */}
      {detailModalCase && (
        <ReferralDetailModal
          referral={detailModalCase}
          onClose={() => setDetailModalCase(null)}
          onUpdateStatus={handleUpdateStatus}
          onPrintSlip={(ref) => setPrintModalCase(ref)}
        />
      )}

      {/* Modal: Official Printable Referral Slip */}
      {printModalCase && (
        <PrintableReferralSlip
          referral={printModalCase}
          onClose={() => setPrintModalCase(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-700" />
              <span className="font-semibold text-slate-800">{CHAMPASAK_PROVINCIAL_HOSPITAL.name}</span>
              <span>·</span>
              <span>{CHAMPASAK_PROVINCIAL_HOSPITAL.location}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1 font-mono text-slate-700">
                <Phone className="w-3.5 h-3.5 text-teal-700" />
                ສາຍດ່ວນສຸກເສີນ: 1195 / {CHAMPASAK_PROVINCIAL_HOSPITAL.phone}
              </span>
              <span>·</span>
              <button
                onClick={() => setCurrentTab('turso-guide')}
                className="flex items-center gap-1 text-teal-800 hover:underline cursor-pointer"
              >
                <Database className="w-3.5 h-3.5" />
                <span>
                  {tursoConfig.useLiveTurso ? 'Turso Cloud ຖານຂໍ້ມູນ' : 'ໂໝດຈຳລອງ Local Test'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
