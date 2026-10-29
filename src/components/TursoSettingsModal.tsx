import React, { useState } from 'react';
import { Database, Check, Copy, ExternalLink, RefreshCw, Server, ShieldCheck, Terminal, AlertCircle } from 'lucide-react';
import { tursoService, TURSO_SCHEMA_SQL, TursoConfig } from '../services/tursoService';

interface TursoSettingsProps {
  config: TursoConfig;
  onConfigChange: (updated: TursoConfig) => void;
  onRefreshData: () => void;
}

export const TursoSettingsModal: React.FC<TursoSettingsProps> = ({
  config,
  onConfigChange,
  onRefreshData,
}) => {
  const [dbUrl, setDbUrl] = useState(config.databaseUrl);
  const [authToken, setAuthToken] = useState(config.authToken);
  const [useLiveTurso, setUseLiveTurso] = useState(config.useLiveTurso);

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);

  const [initingSchema, setInitingSchema] = useState(false);
  const [schemaResult, setSchemaResult] = useState<{ success: boolean; message: string } | null>(null);

  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'schema' | 'vercel'>('config');

  const handleSave = () => {
    tursoService.saveConfig({
      databaseUrl: dbUrl,
      authToken: authToken,
      useLiveTurso: useLiveTurso,
    });
    onConfigChange(tursoService.getConfig());
  };

  const handleTestConnection = async () => {
    // Save first
    handleSave();
    setTesting(true);
    setTestResult(null);

    const res = await tursoService.testConnection();
    setTestResult(res);
    setTesting(false);
  };

  const handleInitSchema = async () => {
    handleSave();
    setInitingSchema(true);
    setSchemaResult(null);

    const res = await tursoService.setupTursoSchema();
    setSchemaResult(res);
    setInitingSchema(false);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(TURSO_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleCopyEnv = () => {
    const text = `VITE_TURSO_DATABASE_URL="${dbUrl || 'libsql://your-database-name.turso.io'}"\nVITE_TURSO_AUTH_TOKEN="${authToken || 'your-auth-token'}"\nTURSO_DATABASE_URL="${dbUrl || 'libsql://your-database-name.turso.io'}"\nTURSO_AUTH_TOKEN="${authToken || 'your-auth-token'}"`;
    navigator.clipboard.writeText(text);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const handleResetSampleData = () => {
    if (confirm('ທ່ານຕ້ອງການໂຫຼດເຄສຕົວຢ່າງຂອງໂຮງໝໍແຂວງຈຳປາສັກຄືນໃໝ່ຫຼືບໍ່?')) {
      tursoService.resetToSampleData();
      onRefreshData();
      alert('ໂຫຼດຂໍ້ມູນຕົວຢ່າງສຳເລັດ!');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
            <Database className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                ຕັ້ງຄ່າຖານຂໍ້ມູນ Turso Database & ການນຳໃຊ້ເທິງ Vercel
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                ຖານຂໍ້ມູນ: cps-transfer (Tokyo AWS) · ເຊື່ອມຕໍ່ແລ້ວ
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Champasak Hospital Referral Database Setup & Cloud Deployment Guide
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('config')}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === 'config'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          1. ຕັ້ງຄ່າການເຊື່ອມຕໍ່ Turso
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === 'schema'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          2. SQL Schema (Turso Table)
        </button>
        <button
          onClick={() => setActiveTab('vercel')}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === 'vercel'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          3. ຄູ່ມື Deploy ຂຶ້ນ GitHub & Vercel
        </button>
      </div>

      {/* Tab 1: Config */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          {/* Mode Selector Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Server className="w-4 h-4 text-teal-700" />
              <span>ເລືອກໂໝດການເກັບຂໍ້ມູນ (Database Mode)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => {
                  setUseLiveTurso(false);
                  tursoService.saveConfig({ useLiveTurso: false });
                  onConfigChange(tursoService.getConfig());
                }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  !useLiveTurso
                    ? 'border-teal-700 bg-teal-50/40 text-slate-900'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-sm">ໂໝດຈຳລອງທົດສອບ (Simulated Local Mode)</strong>
                  {!useLiveTurso && <Check className="w-4 h-4 text-teal-700" />}
                </div>
                <p className="text-xs text-slate-500">
                  ເກັບຂໍ້ມູນໃນ browser storage, ມີເຄສຕົວຢ່າງໂຮງໝໍ 9 ຕົວເມືອງພ້ອມທົດລອງໄດ້ທັນທີ ໂດຍບໍ່ຕ້ອງຕໍ່ຖານຂໍ້ມູນພາຍນອກ.
                </p>
              </div>

              <div
                onClick={() => {
                  setUseLiveTurso(true);
                  tursoService.saveConfig({ useLiveTurso: true });
                  onConfigChange(tursoService.getConfig());
                }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  useLiveTurso
                    ? 'border-teal-700 bg-teal-50/40 text-slate-900'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-sm">Turso Cloud Database (LibSQL Live)</strong>
                  {useLiveTurso && <Check className="w-4 h-4 text-teal-700" />}
                </div>
                <p className="text-xs text-slate-500">
                  ບັນທຶກ ແລະ Sync ຂໍ້ມູນຄົນເຈັບຜ່ານ Turso LibSQL Cloud ເໝາະສຳລັບນຳໄປ Deploy ໃສ່ Vercel ໃຫ້ທີມງານແພດນຳໃຊ້ແທ້.
                </p>
              </div>
            </div>
          </div>

          {/* Credentials Input */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              ຂໍ້ມູນການເຊື່ອມຕໍ່ Turso Database
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              ສາມາດສະໝັກ ແລະ ສ້າງຖານຂໍ້ມູນຟຣີໄດ້ທີ່{' '}
              <a
                href="https://turso.tech"
                target="_blank"
                rel="noreferrer"
                className="text-teal-700 underline inline-flex items-center gap-1 font-medium"
              >
                turso.tech <ExternalLink className="w-3 h-3" />
              </a>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  TURSO DATABASE URL:
                </label>
                <input
                  type="text"
                  value={dbUrl}
                  onChange={(e) => setDbUrl(e.target.value)}
                  placeholder="libsql://champasak-hospital-db-username.turso.io ຫຼື https://..."
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  ຮອງຮັບທັງຮູບແບບ <code>libsql://...</code> ແລະ <code>https://...</code>
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  TURSO AUTH TOKEN (JWT Token):
                </label>
                <input
                  type="password"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  placeholder="eyJhbGciOi... (ສ້າງດ້ວຍຄຳສັ່ງ: turso db tokens create [dbname])"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  ບັນທຶກການຕັ້ງຄ່າ
                </button>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                  <span>{testing ? 'ກຳລັງທົດສອບ...' : 'ທົດສອບການເຊື່ອມຕໍ່ Turso'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleInitSchema}
                  disabled={initingSchema}
                  className="px-4 py-2 border border-teal-700 text-teal-800 hover:bg-teal-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{initingSchema ? 'ກຳລັງສ້າງ Table...' : 'ສ້າງ Tables ໃນ Turso ອັດຕະໂນມັດ'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetSampleData}
                  className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs rounded-lg transition-colors cursor-pointer ml-auto"
                >
                  ຣີເຊັດເຄສຕົວຢ່າງ (Reset Mock)
                </button>
              </div>

              {/* Test feedback */}
              {testResult && (
                <div
                  className={`p-3.5 rounded-lg text-xs flex items-start gap-2.5 ${
                    testResult.success
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  {testResult.success ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <strong className="block font-semibold">{testResult.message}</strong>
                    {testResult.latencyMs && (
                      <span className="text-[11px] text-emerald-700">
                        ເວລາຕອບສະໜອງ (Ping): {testResult.latencyMs} ມິນລີວິນາທີ
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Schema feedback */}
              {schemaResult && (
                <div
                  className={`p-3.5 rounded-lg text-xs flex items-start gap-2.5 ${
                    schemaResult.success
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  {schemaResult.success ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <strong className="block font-semibold">{schemaResult.message}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Schema */}
      {activeTab === 'schema' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                SQL Schema ສຳລັບສ້າງຕາຕະລາງ <code>referrals</code> ໃນ Turso
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ສາມາດນຳ script ນີ້ໄປ run ໃນ Turso Shell (<code>turso db shell &lt;dbname&gt;</code>) ຫຼື Turso Web Dashboard
              </p>
            </div>
            <button
              onClick={handleCopySql}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'ຄັດລອກແລ້ວ!' : 'ຄັດລອກ SQL'}</span>
            </button>
          </div>

          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed max-h-96">
            {TURSO_SCHEMA_SQL}
          </pre>
        </div>
      )}

      {/* Tab 3: Vercel & GitHub Guide */}
      {activeTab === 'vercel' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              ວິທີເຊື່ອມຕໍ່ GitHub ແລະ Deploy ຂຶ້ນ Vercel ສຳລັບທີມງານ
            </h3>
            <p className="text-slate-500">
              ປະຕິບັດຕາມ 4 ຂັ້ນຕອນງ່າຍໆນີ້ ເພື່ອໃຫ້ທີມງານແພດໝໍສາມາດເປີດລິ້ງໃຊ້ງານຜ່ານໂທລະສັບ ຫຼື ຄອມພິວເຕີໄດ້ທຸກບ່ອນ:
            </p>
          </div>

          {/* Step 1 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs">1</span>
              <span>Push ໂຄງການຂຶ້ນ GitHub Repository</span>
            </h4>
            <p>ສ້າງ New Repository ໃນ GitHub ຂອງເຈົ້າ, ຈາກນັ້ນ run ຄຳສັ່ງ:</p>
            <pre className="bg-slate-900 text-slate-200 p-3 rounded font-mono text-xs overflow-x-auto">
{`git init
git add .
git commit -m "feat: Champasak Hospital referral system with Turso DB"
git branch -M main
git remote add origin https://github.com/<your-username>/champasak-hospital-referral.git
git push -u origin main`}
            </pre>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs">2</span>
              <span>Import ໂຄງການໃສ່ Vercel</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 pl-2">
              <li>ເຂົ້າໄປທີ່ <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-teal-700 underline font-semibold">vercel.com/new</a></li>
              <li>ເລືອກ GitHub repository <code>champasak-hospital-referral</code> ທີ່ເຈົ້າຫາເພິ່ງ push ຂຶ້ນໄປ</li>
              <li>Framework Preset ຈະຖືກເລືອກເປັນ <strong>Vite</strong> ໂດຍອັດຕະໂນມັດ</li>
            </ol>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs">3</span>
                <span>ຕັ້ງຄ່າ Environment Variables ໃນ Vercel</span>
              </h4>
              <button
                onClick={handleCopyEnv}
                className="flex items-center gap-1.5 px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium rounded transition-colors cursor-pointer"
              >
                {copiedEnv ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEnv ? 'ຄັດລອກ ENV ແລ້ວ!' : 'ຄັດລອກ Environment Variables'}</span>
              </button>
            </div>
            <p>
              ຢູ່ໜ້າໂຄງການຂອງທ່ານໃນ Vercel ໃຫ້ໄປທີ່ <strong>Settings &gt; Environment Variables</strong> ແລ້ວເພີ່ມ:
            </p>
            <div className="bg-slate-900 text-slate-200 p-3 rounded font-mono text-xs space-y-1">
              <div><span className="text-teal-400">VITE_TURSO_DATABASE_URL</span> = libsql://cps-transfer-drkanxay.aws-ap-northeast-1.turso.io</div>
              <div className="truncate"><span className="text-teal-400">VITE_TURSO_AUTH_TOKEN</span> = eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...</div>
            </div>
            <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200 font-medium">
              * ເມື່ອເພີ່ມ Environment Variables ແລ້ວ, ໃຫ້ໄປທີ່ແຖບ <strong>Deployments</strong> &gt; ກົດປຸ່ມ <code>...</code> &gt; ເລືອກ <strong>Redeploy</strong> ເພື່ອໃຫ້ເວັບໄຊອັບເດດການເຊື່ອມຕໍ່ Turso.
            </p>
          </div>

          {/* Step 4: Real Domain & DNS notice */}
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg space-y-2">
            <h4 className="font-bold text-teal-950 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs">4</span>
              <span>ວິທີເບິ່ງລິ້ງໂດເມນແທ້ (ແກ້ໄຂບັນຫາ DNS_PROBE_FINISHED_NXDOMAIN)</span>
            </h4>
            <div className="text-teal-950 space-y-1">
              <p>
                ຖ້າທ່ານພົບຂໍ້ຄວາມ <code>DNS_PROBE_FINISHED_NXDOMAIN</code> (This site can’t be reached), ເກີດຈາກການພິມຊື່ໂດເມນຕົວຢ່າງທີ່ຍັງບໍ່ທັນມີຢູ່.
              </p>
              <p className="font-semibold">
                ວິທີເບິ່ງລິ້ງແທ້ທີ່ Vercel ສ້າງໃຫ້:
              </p>
              <ol className="list-decimal list-inside space-y-1 pl-2 text-slate-800">
                <li>ເຂົ້າໄປທີ່ <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" className="text-teal-800 underline font-bold">vercel.com/dashboard</a></li>
                <li>ກົດເຂົ້າໂຄງການຂອງທ່ານ (Project Overview)</li>
                <li>ເບິ່ງຢູ່ກ້ອງຊື່ໂຄງການ ຈະມີຄຳວ່າ <strong>DOMAINS</strong> (ເຊັ່ນ: <code>https://&lt;ຊື່-repo-ຂອງທ່ານ&gt;.vercel.app</code>)</li>
                <li>ກົດໃສ່ລິ້ງນັ້ນເພື່ອເປີດເວັບໄຊຕົວຈິງ!</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
