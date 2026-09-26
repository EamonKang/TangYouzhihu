import React, { useState } from 'react';
import { Header } from './components/Header';
import { PatientApp } from './components/patient/PatientApp';
import { NurseDashboard } from './components/nurse/NurseDashboard';
import { RequirementsOverview } from './components/requirements/RequirementsOverview';
import { mockPatients, mockGlucoseRecords } from './data/mockData';
import { PatientProfile, BloodGlucoseRecord } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<'patient' | 'nurse' | 'requirements'>('patient');
  const [patients, setPatients] = useState<PatientProfile[]>(mockPatients);
  const [currentPatient, setCurrentPatient] = useState<PatientProfile>(mockPatients[0]);
  const [records, setRecords] = useState<BloodGlucoseRecord[]>(mockGlucoseRecords);
  const [isLargeFont, setIsLargeFont] = useState<boolean>(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add blood glucose record
  const handleAddRecord = (newRec: Omit<BloodGlucoseRecord, 'id' | 'patientId'>) => {
    const record: BloodGlucoseRecord = {
      ...newRec,
      id: `rec-${Date.now()}`,
      patientId: currentPatient.id,
    };

    setRecords((prev) => [record, ...prev]);

    // Add points
    handleAddPoints(10, '完成血糖记录');

    if (newRec.value < 3.9) {
      showToast('⚠️ 已检测到低血糖，系统已自动触发双15应急干预并通报责任护士！');
    } else {
      showToast('🎉 血糖记录成功！已获得 10 依从性积分！');
    }
  };

  // Add points to current patient
  const handleAddPoints = (pts: number, reason: string) => {
    setCurrentPatient((prev) => ({
      ...prev,
      points: prev.points + pts,
    }));
    setPatients((prev) =>
      prev.map((p) => (p.id === currentPatient.id ? { ...p, points: p.points + pts } : p))
    );
  };

  // Deduct points
  const handleDeductPoints = (pts: number, reason: string): boolean => {
    if (currentPatient.points < pts) return false;

    setCurrentPatient((prev) => ({
      ...prev,
      points: prev.points - pts,
    }));
    setPatients((prev) =>
      prev.map((p) => (p.id === currentPatient.id ? { ...p, points: p.points - pts } : p))
    );
    showToast(`扣减 ${pts} 积分，${reason}`);
    return true;
  };

  // Toggle medication taken status
  const handleToggleMedication = (medId: string) => {
    setCurrentPatient((prev) => {
      const updatedMeds = prev.medications.map((m) =>
        m.id === medId ? { ...m, takenToday: !m.takenToday } : m
      );
      return {
        ...prev,
        medications: updatedMeds,
      };
    });

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === currentPatient.id) {
          const updatedMeds = p.medications.map((m) =>
            m.id === medId ? { ...m, takenToday: !m.takenToday } : m
          );
          return { ...p, medications: updatedMeds };
        }
        return p;
      })
    );

    showToast('用药状态已更新并同步至科研随访档案！');
  };

  return (
    <div className={`min-h-screen bg-slate-100/70 text-slate-800 ${isLargeFont ? 'text-base font-medium' : 'text-sm'}`}>
      {/* Global Header & Switcher */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        patients={patients}
        currentPatient={currentPatient}
        setCurrentPatient={setCurrentPatient}
        isLargeFont={isLargeFont}
        setIsLargeFont={setIsLargeFont}
        isAudioEnabled={isAudioEnabled}
        setIsAudioEnabled={setIsAudioEnabled}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-2xl shadow-xl border border-slate-700 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* Main Views */}
      <main>
        {activeView === 'patient' && (
          <PatientApp
            currentPatient={currentPatient}
            records={records.filter((r) => r.patientId === currentPatient.id)}
            onAddRecord={handleAddRecord}
            onAddPoints={handleAddPoints}
            onDeductPoints={handleDeductPoints}
            onToggleMedication={handleToggleMedication}
            isLargeFont={isLargeFont}
            isAudioEnabled={isAudioEnabled}
          />
        )}

        {activeView === 'nurse' && (
          <NurseDashboard
            patients={patients}
            onSelectPatient={(p) => {
              setCurrentPatient(p);
              setActiveView('patient');
              showToast(`已切换至模拟患者【${p.name}】的微信小程序视角`);
            }}
            isLargeFont={isLargeFont}
          />
        )}

        {activeView === 'requirements' && (
          <RequirementsOverview />
        )}
      </main>
    </div>
  );
}
