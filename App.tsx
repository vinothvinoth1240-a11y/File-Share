
import React, { useState, useEffect, useCallback } from 'react';
import { StorageService } from './services/db';
import { SharedFile, ViewMode } from './types';
import Header from './components/Header';
import UploadView from './components/UploadView';
import DownloadView from './components/DownloadView';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.UPLOAD);
  const [targetId, setTargetId] = useState<string | null>(null);

  // Simple hash-based router
  const handleRouting = useCallback(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/d/')) {
      const id = hash.replace('#/d/', '');
      setTargetId(id);
      setViewMode(ViewMode.DOWNLOAD);
    } else {
      setTargetId(null);
      setViewMode(ViewMode.UPLOAD);
    }
  }, []);

  useEffect(() => {
    handleRouting();
    window.addEventListener('hashchange', handleRouting);
    return () => window.removeEventListener('hashchange', handleRouting);
  }, [handleRouting]);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 relative">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full z-0"></div>

      <div className="w-full max-w-2xl relative z-10">
        <Header />
        
        <main className="mt-8">
          {viewMode === ViewMode.UPLOAD ? (
            <UploadView />
          ) : (
            <DownloadView fileId={targetId || ''} />
          )}
        </main>
        
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2024 NovaShare • Secure Private Transfers</p>
          <p className="mt-1">Files are stored locally in your browser for demonstration.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
