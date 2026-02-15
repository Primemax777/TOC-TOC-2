import React from 'react';
import { HistoryEntry } from '../types';
import { Clock } from 'lucide-react';

interface HistoryLogProps {
  history: HistoryEntry[];
}

const HistoryLog: React.FC<HistoryLogProps> = ({ history }) => {
  // Helper to format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
  };

  return (
    <div className="h-full flex flex-col p-2">
        <div className="flex items-center gap-2 mb-4 px-2">
            <h2 className="text-2xl font-bold text-gray-800">History</h2>
        </div>

        <div className="flex-1 overflow-y-auto pb-24 custom-scrollbar space-y-3">
            {history.length === 0 ? (
                <div className="text-center py-10 opacity-40">
                    <Clock size={48} className="mx-auto mb-2 text-gray-300" />
                    <p className="font-bold text-gray-400">No activity yet.</p>
                </div>
            ) : (
                history.map((entry) => (
                    <div key={entry.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 animate-fade-in">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl shadow-inner border-2 border-white">
                            {entry.performerAvatar}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-700">{entry.performerName}</span>
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md font-bold">completed</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xl">{entry.taskIcon}</span>
                                <span className="font-bold text-gray-600 leading-tight">{entry.taskTitle}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                                {formatDate(entry.timestamp)}
                            </span>
                            <span className="bg-[#FFD93D] text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                                +{entry.points} pts
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
        <style>{`
            .animate-fade-in { animation: fadeIn 0.3s ease-out; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
    </div>
  );
};

export default HistoryLog;