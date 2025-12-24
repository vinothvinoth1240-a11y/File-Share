
import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/db';
import { SharedFile } from '../types';

interface Props {
  fileId: string;
}

const DownloadView: React.FC<Props> = ({ fileId }) => {
  const [file, setFile] = useState<SharedFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        setLoading(true);
        const result = await StorageService.getFile(fileId);
        if (result) {
          setFile(result);
        } else {
          setError("File not found or link has expired.");
        }
      } catch (err) {
        setError("Error retrieving the file.");
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [fileId]);

  const handleDownload = () => {
    if (!file) return;

    const url = URL.createObjectURL(file.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Cleanup URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="glass p-12 rounded-[2.5rem] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400">Verifying transfer...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass p-12 rounded-[2.5rem] text-center">
        <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Oops! Link Invalid</h2>
        <p className="text-gray-400 mb-8">{error}</p>
        <button 
          onClick={() => window.location.hash = ''}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all font-semibold"
        >
          Return Home
        </button>
      </div>
    );
  }

  if (!file) return null;

  return (
    <div className="glass p-8 rounded-[2.5rem] animate-in slide-in-from-bottom-10 duration-500">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-6 shadow-xl border border-white/5">
          <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-extrabold mb-1 truncate w-full px-4">{file.name}</h2>
        <p className="text-blue-400 font-medium mb-8">{formatSize(file.size)} • {file.type.split('/')[1]?.toUpperCase() || 'FILE'}</p>

        <button 
          onClick={handleDownload}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 mb-4"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Now
        </button>

        <p className="text-xs text-gray-500">
          Shared via NovaShare • {new Date(file.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default DownloadView;
