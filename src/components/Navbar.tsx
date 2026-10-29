import React from 'react';
import { Database, Plus, RefreshCw } from 'lucide-react';
import { TursoConfig } from '../services/tursoService';

interface NavbarProps {
  currentTab: 'dashboard' | 'new-referral' | 'turso-guide';
  setCurrentTab: (tab: 'dashboard' | 'new-referral' | 'turso-guide') => void;
  tursoConfig: TursoConfig;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  tursoConfig,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-teal-700 flex items-center justify-center text-white font-bold text-lg shadow-xs">
              +
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentTab('dashboard');
              }}
              className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap"
            >
              ໂຮງໝໍແຂວງຈຳປາສັກ <span className="text-teal-700 font-medium text-sm">· ລະບົບນຳສົ່ງຄົນເຈັບ</span>
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer border-b-2 ${
                currentTab === 'dashboard'
                  ? 'border-teal-700 text-teal-800 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              ແດຊບອດຮັບຄົນເຈັບ
            </button>
            <button
              onClick={() => setCurrentTab('new-referral')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer border-b-2 ${
                currentTab === 'new-referral'
                  ? 'border-teal-700 text-teal-800 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              ຟອມນຳສົ່ງຄົນເຈັບ
            </button>
            <button
              onClick={() => setCurrentTab('turso-guide')}
              className={`flex items-center gap-1.5 whitespace-nowrap transition-colors py-1 cursor-pointer border-b-2 ${
                currentTab === 'turso-guide'
                  ? 'border-teal-700 text-teal-800 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Turso & Vercel</span>
              <span className="text-xs text-slate-400">
                ({tursoConfig.useLiveTurso ? 'Live Turso' : 'Local Test'})
              </span>
            </button>
          </nav>

          {/* Zone 3: Primary Action CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onRefresh}
              title="ໂຫຼດຂໍ້ມູນໃໝ່"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-teal-700' : ''}`} />
            </button>
            <button
              onClick={() => setCurrentTab('new-referral')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>ສ້າງໃບນຳສົ່ງໃໝ່</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
