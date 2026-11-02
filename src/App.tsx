import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ApproachSection } from './components/ApproachSection';
import { ScanWorkflow } from './components/ScanWorkflow';
import { ResultsView } from './components/ResultsView';
import { PassportView } from './components/PassportView';
import { ComparisonView } from './components/ComparisonView';
import { SkincareRoutineModal } from './components/SkincareRoutineModal';
import { SkinProfileModal } from './components/SkinProfileModal';
import { PrivacyModal } from './components/PrivacyModal';
import { Footer } from './components/Footer';
import {
  loadPassportRecords,
  savePassportRecord,
  deletePassportRecord,
  clearAllPassportRecords,
  loadUserProfile,
} from './utils/storage';
import type { SkinScanRecord, UserSkinProfile } from './types/skin';

export default function App() {
  const getInitialPage = (): 'home' | 'scan' | 'results' | 'passport' | 'compare' => {
    if (typeof window === 'undefined') return 'home';
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (['scan', 'passport', 'compare'].includes(hash)) return hash as any;
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<'home' | 'scan' | 'results' | 'passport' | 'compare'>(getInitialPage);
  const [currentResult, setCurrentResult] = useState<SkinScanRecord | null>(null);
  const [passportRecords, setPassportRecords] = useState<SkinScanRecord[]>([]);
  const [userProfile, setUserProfile] = useState<UserSkinProfile | null>(null);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(() => typeof window !== 'undefined' && window.location.hash === '#profile');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(() => typeof window !== 'undefined' && window.location.hash === '#privacy');

  useEffect(() => {
    setPassportRecords(loadPassportRecords());
    setUserProfile(loadUserProfile());

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'privacy') setIsPrivacyModalOpen(true);
      if (hash === 'profile') setIsProfileModalOpen(true);
      if (['home', 'scan', 'passport', 'compare'].includes(hash)) {
        setCurrentPage(hash === 'home' ? 'home' : (hash as any));
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isCurrentResultSaved = Boolean(
    currentResult && passportRecords.some((r) => r.id === currentResult.id)
  );

  const handleScanCompleted = (record: SkinScanRecord) => {
    setCurrentResult(record);
    savePassportRecord(record);
    setPassportRecords(loadPassportRecords());
    setCurrentPage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveToPassport = () => {
    if (!currentResult) return;
    savePassportRecord(currentResult);
    setPassportRecords(loadPassportRecords());
  };

  const handleDeleteRecord = (id: string) => {
    deletePassportRecord(id);
    const updated = loadPassportRecords();
    setPassportRecords(updated);
    if (currentResult?.id === id) {
      setCurrentResult(null);
      if (currentPage === 'results') {
        setCurrentPage('passport');
      }
    }
  };

  const handleClearAllData = () => {
    clearAllPassportRecords();
    setPassportRecords([]);
    setCurrentResult(null);
    setCurrentPage('home');
  };

  const handleOpenRecord = (record: SkinScanRecord) => {
    setCurrentResult(record);
    setCurrentPage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: 'home' | 'scan' | 'passport' | 'compare') => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.location.hash = page === 'home' ? '' : page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="shell min-h-screen flex flex-col justify-between">
      <div>
        <Header
          currentPage={currentPage === 'results' ? 'scan' : currentPage}
          onNavigate={handleNavigate}
          passportCount={passportRecords.length}
          onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          hasProfile={Boolean(userProfile)}
        />

        {currentPage === 'home' && (
          <ApproachSection
            onStartScan={() => handleNavigate('scan')}
            onExplorePassport={() => handleNavigate('passport')}
            passportCount={passportRecords.length}
          />
        )}

        {currentPage === 'scan' && (
          <ScanWorkflow
            onScanCompleted={handleScanCompleted}
            onNavigateToPassport={() => handleNavigate('passport')}
          />
        )}

        {currentPage === 'results' && currentResult && (
          <ResultsView
            record={currentResult}
            isSavedInPassport={isCurrentResultSaved}
            onSaveToPassport={handleSaveToPassport}
            onOpenRoutineGuidance={() => setIsRoutineModalOpen(true)}
            onNewScan={() => handleNavigate('scan')}
          />
        )}

        {currentPage === 'passport' && (
          <PassportView
            records={passportRecords}
            onOpenRecord={handleOpenRecord}
            onDeleteRecord={handleDeleteRecord}
            onNavigateToScan={() => handleNavigate('scan')}
            onNavigateToCompare={() => handleNavigate('compare')}
            onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
          />
        )}

        {currentPage === 'compare' && (
          <ComparisonView
            records={passportRecords}
            onBackToPassport={() => handleNavigate('passport')}
            onOpenRecord={handleOpenRecord}
          />
        )}
      </div>

      <Footer
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        onNavigate={(p) => handleNavigate(p)}
      />

      {/* Skincare Routine Guidance Modal */}
      {isRoutineModalOpen && currentResult && (
        <SkincareRoutineModal
          metrics={currentResult.metrics}
          onClose={() => setIsRoutineModalOpen(false)}
          onOpenProfile={() => {
            setIsRoutineModalOpen(false);
            setIsProfileModalOpen(true);
          }}
        />
      )}

      {/* Skin Profile Questionnaire Modal */}
      <SkinProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={(updated) => setUserProfile(updated)}
      />

      {/* Privacy & Data Management Modal */}
      {isPrivacyModalOpen && (
        <PrivacyModal
          onClose={() => setIsPrivacyModalOpen(false)}
          onClearAllData={handleClearAllData}
          recordCount={passportRecords.length}
        />
      )}
    </div>
  );
}
