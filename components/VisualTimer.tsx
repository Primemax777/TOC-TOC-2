import React, { useState, useEffect } from 'react';
import { AppMode, COLORS } from '../types';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface VisualTimerProps {
  mode: AppMode;
}

const VisualTimer: React.FC<VisualTimerProps> = ({ mode }) => {
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds default
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(60);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const progress = (timeLeft / duration) * 100;

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <h2 className={`text-center font-bold text-gray-700 mb-8 ${mode === AppMode.KID ? 'text-4xl' : 'text-2xl'}`}>
        {mode === AppMode.KID ? "Focus Time!" : "Timer"}
      </h2>

      {/* Visual Liquid Container */}
      <div className="relative w-64 h-64 bg-white rounded-full shadow-[inset_0_10px_20px_rgba(0,0,0,0.1)] border-8 border-white overflow-hidden mb-10">
        
        {/* Liquid */}
        <div 
          className="absolute bottom-0 left-0 right-0 bg-[#FF6B6B] transition-all duration-1000 ease-linear flex items-center justify-center"
          style={{ height: `${progress}%` }}
        >
             {/* Bubbles in liquid */}
             <div className="absolute top-0 left-0 w-full h-4 bg-[#FF8E8E] opacity-50 animate-pulse rounded-full transform -translate-y-1/2 scale-x-150" />
        </div>

        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
            <span className={`font-bold drop-shadow-md ${progress > 50 ? 'text-white' : 'text-gray-700'} ${mode === AppMode.KID ? 'text-6xl' : 'text-5xl'}`}>
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-6">
        <button 
            onClick={() => setIsActive(!isActive)}
            className="w-20 h-20 bg-[#4D96FF] text-white rounded-[2rem] shadow-lg active:scale-90 transition-all flex items-center justify-center"
        >
            {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1"/>}
        </button>
        
        <button 
            onClick={() => { setIsActive(false); setTimeLeft(duration); }}
            className="w-20 h-20 bg-[#FFD93D] text-white rounded-[2rem] shadow-lg active:scale-90 transition-all flex items-center justify-center"
        >
            <RotateCcw size={40} />
        </button>
      </div>

      {mode === AppMode.ADULT && (
          <div className="mt-8 flex gap-4">
              {[5, 10, 15, 30].map(min => (
                  <button 
                    key={min} 
                    onClick={() => { setDuration(min * 60); setTimeLeft(min * 60); setIsActive(false); }}
                    className="px-4 py-2 bg-white rounded-xl text-gray-600 font-bold border hover:bg-gray-50"
                  >
                      {min}m
                  </button>
              ))}
          </div>
      )}
    </div>
  );
};

export default VisualTimer;