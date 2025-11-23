import React, { useState, useRef } from 'react';
import { X, Upload, Camera, Loader2 } from 'lucide-react';

interface UploadOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  promptTitle: string;
}

export const UploadOverlay: React.FC<UploadOverlayProps> = ({ isOpen, onClose, onUpload, promptTitle }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setUploading(true);
    setTimeout(() => {
        onUpload(file);
        setUploading(false);
        onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-3xl flex flex-col p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">New Entry</span>
        <button 
            onClick={onClose}
            className="p-3 rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition-colors border border-zinc-800"
        >
            <X size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full pb-10">
        <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">
                Show us the <span className="text-lime-400">Vibe</span>
            </h2>
             <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
                <span className="text-sm font-bold text-white tracking-wide">{promptTitle}</span>
            </div>
        </div>

        {uploading ? (
             <div className="flex-1 flex flex-col items-center justify-center gap-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-lime-400/30 blur-3xl rounded-full"></div>
                    <div className="relative z-10 w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                        <Loader2 size={40} className="text-lime-400 animate-spin" />
                    </div>
                </div>
                <div className="text-center">
                    <h3 className="text-white font-bold text-xl mb-1.5">Compressing...</h3>
                    <p className="text-zinc-500 text-sm">Getting your vlog ready for the feed</p>
                </div>
            </div>
        ) : (
            <div 
                className={`flex-1 flex flex-col gap-5 transition-all duration-300 ${isDragging ? 'scale-[1.02]' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if(e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
                }}
            >
                {/* Main Camera Option */}
                <label className="flex-1 relative group cursor-pointer overflow-hidden rounded-[2rem] bg-zinc-900 border border-zinc-800 hover:border-lime-400/50 transition-all duration-300 min-h-[240px]">
                    <input 
                        type="file" 
                        accept="video/*" 
                        capture="user"
                        className="hidden" 
                        onChange={handleFileChange}
                    />
                    
                    {/* Viewfinder corners */}
                    <div className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-zinc-700 group-hover:border-lime-400 transition-colors rounded-tl-sm"></div>
                    <div className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-zinc-700 group-hover:border-lime-400 transition-colors rounded-tr-sm"></div>
                    <div className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-zinc-700 group-hover:border-lime-400 transition-colors rounded-bl-sm"></div>
                    <div className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-zinc-700 group-hover:border-lime-400 transition-colors rounded-br-sm"></div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-5 border border-zinc-800 group-hover:scale-110 group-hover:border-lime-400/50 shadow-2xl transition-all duration-300">
                           <Camera size={36} className="text-zinc-400 group-hover:text-lime-400 transition-colors" />
                        </div>
                        <span className="text-white font-black text-xl tracking-tight group-hover:text-lime-400 transition-colors">Record Video</span>
                        <span className="text-zinc-500 text-sm mt-1.5 font-medium">Tap to open camera</span>
                    </div>
                </label>

                {/* Separator */}
                <div className="flex items-center gap-4 px-6 py-2">
                    <div className="h-px bg-zinc-900 flex-1"></div>
                    <span className="text-xs font-bold text-zinc-600 uppercase">Or</span>
                    <div className="h-px bg-zinc-900 flex-1"></div>
                </div>

                {/* Upload Option */}
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-20 flex items-center justify-center gap-4 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 transition-all group"
                >
                     <div className="p-2.5 bg-black rounded-xl border border-zinc-800 group-hover:border-zinc-600 transition-colors">
                        <Upload size={20} className="text-zinc-400 group-hover:text-white" />
                     </div>
                     <span className="text-white font-bold text-base">Select from Gallery</span>
                </button>
                
                 <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="video/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                />
            </div>
        )}
      </div>
    </div>
  );
};