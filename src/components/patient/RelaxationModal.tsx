import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Heart, Volume2, Sparkles } from 'lucide-react';

interface RelaxationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLargeFont: boolean;
}

export const RelaxationModal: React.FC<RelaxationModalProps> = ({
  isOpen,
  onClose,
  isLargeFont,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [secondsLeft, setSecondsLeft] = useState<number>(300); // 5 minutes
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [phaseSeconds, setPhaseSeconds] = useState<number>(4);

  // 4s Inhale, 4s Hold, 6s Exhale cycle
  useEffect(() => {
    if (!isOpen || !isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });

      setPhaseSeconds((prev) => {
        if (prev <= 1) {
          if (phase === 'inhale') {
            setPhase('hold');
            return 4;
          } else if (phase === 'hold') {
            setPhase('exhale');
            return 6;
          } else {
            setPhase('inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isRunning, phase]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const phaseText = {
    inhale: '慢慢深吸气... 腹部微微隆起',
    hold: '屏住呼吸... 感受内心的安宁',
    exhale: '缓缓呼出所有疲惫与压力...',
  }[phase];

  const scaleClass = {
    inhale: 'scale-125 duration-[4000ms]',
    hold: 'scale-125 duration-[4000ms]',
    exhale: 'scale-90 duration-[6000ms]',
  }[phase];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-md">
      <div className="bg-gradient-to-b from-teal-900 to-slate-900 text-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-teal-500/30 text-center relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition text-slate-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-center gap-1.5 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Heart className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>糖糖护士 · 5分钟正念减压</span>
        </div>
        
        <h3 className={`font-bold mb-1 ${isLargeFont ? 'text-2xl' : 'text-xl'}`}>
          腹式呼吸 · 平衡血糖与身心
        </h3>
        <p className="text-xs text-teal-200/70 mb-6">
          深长呼吸能降低皮质醇压力激素分泌，辅助平抑因焦虑导致的升糖
        </p>

        {/* Breathing Animation Orb */}
        <div className="relative w-52 h-52 mx-auto my-6 flex items-center justify-center">
          {/* Outer glowing rings */}
          <div className="absolute inset-0 rounded-full bg-teal-500/10 blur-xl"></div>
          
          <div
            className={`w-40 h-40 rounded-full bg-gradient-to-br from-teal-400/40 via-emerald-500/30 to-cyan-500/40 border border-teal-300/40 flex flex-col items-center justify-center transition-transform ease-in-out shadow-lg shadow-teal-500/20 ${scaleClass}`}
          >
            <span className="text-xs font-bold text-teal-200 uppercase tracking-widest">
              {phase === 'inhale' ? '吸 气' : phase === 'hold' ? '屏 息' : '呼 气'}
            </span>
            <span className="text-3xl font-black text-white my-1">
              {phaseSeconds}s
            </span>
          </div>
        </div>

        {/* Phase Instruction */}
        <div className="h-10 flex items-center justify-center">
          <p className={`font-medium text-emerald-200 transition-all ${isLargeFont ? 'text-base' : 'text-sm'}`}>
            {phaseText}
          </p>
        </div>

        {/* Timer display */}
        <div className="text-2xl font-mono text-slate-300 my-4 font-bold">
          {timeFormatted}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => {
              setSecondsLeft(300);
              setPhase('inhale');
              setPhaseSeconds(4);
              setIsRunning(true);
            }}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition"
            title="重新开始"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-4 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30 hover:scale-105 active:scale-95 transition"
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-teal-800/40 flex items-center justify-center gap-1.5 text-xs text-teal-300/70">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>建议每天睡前或测糖感到疲倦时练习一次</span>
        </div>
      </div>
    </div>
  );
};
