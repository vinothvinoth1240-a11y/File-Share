
import React, { useState, useRef } from 'react';
import { StorageService } from '../services/db';
import { SharedFile } from '../types';

const UploadView: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<SharedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

  const handleFile = async (file: File) => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    // Simulate progress while saving to IndexedDB
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + 5;
      });
    }, 50);

    try {
      const sharedFile: SharedFile = {
        id: generateId(),
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        data: file,
        createdAt: Date.now()
      };

      await StorageService.saveFile(sharedFile);
      
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setUploading(false);
        setUploadedFile(sharedFile);
      }, 500);

    } catch (error) {
      console.error("Upload failed", error);
      alert("Browser storage limit reached or error occurred.");
      setUploading(false);
      clearInterval(interval);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const copyLink = () => {
    if (!uploadedFile) return;
    const url = `${window.location.origin}${window.location.pathname}#/d/${uploadedFile.id}`;
    navigator.clipboard.writeText(url);
    alert("Share link copied to clipboard!");
  };

  const reset = () => {
    setUploadedFile(null);
    setProgress(0);
  };

  if (uploadedFile) {
    const shareUrl = `${window.location.origin}${window.location.pathname}#/d/${uploadedFile.id}`;
    return (
      <div className="glass p-8 rounded-3xl animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">File Ready to Share!</h2>
          <p className="text-gray-400 mt-1">{uploadedFile.name}</p>
        </div>

        <div className="bg-black/30 p-4 rounded-xl flex items-center gap-3 border border-white/5 mb-6">
          <input 
            type="text" 
            readOnly 
            value={shareUrl} 
            className="bg-transparent text-sm w-full outline-none text-gray-300 truncate"
          />
          <button 
            onClick={copyLink}
            className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex-shrink-0"
            title="Copy link"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        </div>

        <button 
          onClick={reset}
          className="w-full py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-colors font-medium text-gray-400"
        >
          Send another file
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          glass relative h-80 rounded-[2.5rem] flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 cursor-pointer
          ${isDragging ? 'border-blue-500 bg-blue-500/5 scale-[1.02]' : 'border-white/10 hover:border-white/30'}
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        />
        
        {uploading ? (
          <div className="text-center w-full px-12">
            <div className="mb-6">
              <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            </div>
            <h3 className="text-xl font-bold mb-4">Uploading...</h3>
            <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">{progress}% completed</p>
          </div>
        ) : (
          <>
            <div className="w-24 h-24 rounded-3xl bg-blue-600/10 flex items-center justify-center mb-6 glow-hover transition-all">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Drop your file here</h3>
            <p className="text-gray-400">or click to browse from device</p>
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Secure', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
          { label: 'Private', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
          { label: 'Direct', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
        ].map((feat, idx) => (
          <div key={idx} className="glass p-4 rounded-2xl text-center">
            <svg className="w-6 h-6 mx-auto mb-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feat.icon} />
            </svg>
            <span className="text-xs font-medium text-gray-300">{feat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadView;
