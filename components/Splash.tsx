import React, { useEffect, useState } from 'react';

export const Splash = ({ onComplete }: { onComplete: () => void }) => {
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const fullText = "VlogIt !!!!";

  useEffect(() => {
    // Wait for the SVG draw animation (2s) to finish before typing
    const startTypingDelay = setTimeout(() => {
        setShowCursor(true);
        let i = 0;
        // Start typing immediately after cursor appears
        const intervalId = setInterval(() => {
            setText(fullText.slice(0, i + 1));
            i++;
            if (i === fullText.length) {
                clearInterval(intervalId);
                setTimeout(onComplete, 1200); 
            }
        }, 100); 
    }, 2000); // 2s matches the CSS animation duration

    return () => clearTimeout(startTypingDelay);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 select-none">
       <div className="relative transform scale-150 mb-10">
           {/* SVG with drawing animation */}
           <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#bef264" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" className="camera-draw">
               <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
               <circle cx="12" cy="13" r="3" />
           </svg>
       </div>
       
       <div className="h-14 flex items-center justify-center min-w-[200px]">
            <h1 className="text-5xl font-black text-white tracking-tighter flex items-center">
                {text}
                {showCursor && <span className="text-lime-400 animate-pulse ml-1">|</span>}
            </h1>
       </div>
       
       <style>{`
         .camera-draw path, .camera-draw circle {
           stroke-dasharray: 100;
           stroke-dashoffset: 100;
           animation: draw 2s ease-in-out forwards;
         }
         
         @keyframes draw {
           to { stroke-dashoffset: 0; }
         }
       `}</style>
    </div>
  );
};