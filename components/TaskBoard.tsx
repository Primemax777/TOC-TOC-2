import React, { useState } from 'react';
import { Task, AppMode, FamilyMember } from '../types';
import { Check, Plus, Trash2, User, Star } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  members: FamilyMember[];
  currentUser: FamilyMember;
  mode: AppMode;
  onToggleTask: (id: string) => void;
  onAddTask: (title: string, assigneeId: string, icon: string) => void;
  onDeleteTask: (id: string) => void;
}

const EMOJI_PALETTE = ['🧹', '🛏️', '🧸', '📚', '🪴', '🐕', '👕', '🍽️'];

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, members, currentUser, mode, onToggleTask, onAddTask, onDeleteTask }) => {
  // State for Adult Mode input
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>(''); // Empty means "Anyone"

  // State for Kid Mode input
  const [isKidAdding, setIsKidAdding] = useState(false);
  const [kidSelectedEmoji, setKidSelectedEmoji] = useState('⭐');
  const [kidTaskTitle, setKidTaskTitle] = useState('');

  const handleAdultAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle, selectedAssignee, '📌');
      setNewTaskTitle('');
      setSelectedAssignee('');
    }
  };

  const handleKidAddTask = () => {
    if (kidTaskTitle.trim()) {
        // Assign to SELF (currentUser) if kid mode
        onAddTask(kidTaskTitle, currentUser.id, kidSelectedEmoji);
        setIsKidAdding(false);
        setKidTaskTitle('');
        setKidSelectedEmoji('⭐');
    }
  };

  // --- KIDS MODE: Swipe Cards & New Mission ---
  if (mode === AppMode.KID) {
    const kidTasks = tasks.filter(t => !t.isCompleted);
    const completedTasks = tasks.filter(t => t.isCompleted);

    return (
      <div className="p-4 space-y-8 pb-64 w-full">
        <h2 className="text-4xl text-[#2D3436] text-center mb-8 font-extrabold tracking-tight">My Missions</h2>
        
        {/* Add New Mission Button (Kid Friendly) */}
        {!isKidAdding ? (
             <button 
                onClick={() => setIsKidAdding(true)}
                className="w-full py-6 rounded-[2.5rem] border-4 border-dashed border-[#4D96FF]/40 text-[#4D96FF] font-bold text-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform hover:bg-blue-50/50 hover:border-[#4D96FF]"
             >
                <Plus size={36} strokeWidth={3} /> New Mission
             </button>
        ) : (
            <div className="bg-white rounded-[3rem] p-6 shadow-xl border-4 border-[#FFD93D] animate-fade-in relative z-10">
                <h3 className="text-center font-bold text-gray-600 mb-6 text-xl">Pick a sticker!</h3>
                <div className="grid grid-cols-4 gap-3 mb-6">
                    {EMOJI_PALETTE.map(emoji => (
                        <button 
                            key={emoji}
                            onClick={() => setKidSelectedEmoji(emoji)}
                            className={`text-4xl p-3 rounded-2xl transition-all duration-300 ${kidSelectedEmoji === emoji ? 'bg-[#FFD93D]/20 scale-125 rotate-12' : 'hover:bg-gray-50 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:scale-110'}`}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
                <input 
                    type="text"
                    value={kidTaskTitle}
                    onChange={(e) => setKidTaskTitle(e.target.value)}
                    placeholder="Name your mission..."
                    className="w-full bg-gray-50 text-gray-800 rounded-2xl px-6 py-4 text-xl mb-6 outline-none border-4 border-transparent focus:border-[#4D96FF]/30 font-bold placeholder-gray-300 transition-colors"
                />
                <div className="flex gap-3">
                    <button onClick={() => setIsKidAdding(false)} className="flex-1 py-4 rounded-2xl bg-gray-100 font-bold text-gray-500 text-lg active:scale-95 transition-transform">Cancel</button>
                    <button onClick={handleKidAddTask} className="flex-1 py-4 rounded-2xl bg-[#4D96FF] text-white font-bold text-lg shadow-[0_4px_0_#2b6cb0] active:shadow-none active:translate-y-1 transition-all">Let's Go!</button>
                </div>
            </div>
        )}

        {/* Active Tasks Grid */}
        <div className="grid grid-cols-1 gap-6">
          {kidTasks.length === 0 && !isKidAdding && completedTasks.length === 0 && (
             <div className="text-center py-20 opacity-40">
                <span className="text-8xl block mb-6 animate-pulse">🌟</span>
                <p className="font-bold text-gray-400 text-2xl">No missions yet!</p>
             </div>
          )}
          
          {kidTasks.map(task => (
            <div 
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className="bg-white rounded-[3.5rem] p-6 shadow-[0_15px_30px_rgba(77,150,255,0.15)] border-4 border-transparent hover:border-[#4D96FF] active:scale-95 transition-all cursor-pointer flex items-center justify-between relative overflow-hidden group"
            >
              <div className="flex items-center gap-6 z-10 pl-2">
                <span className="text-7xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">{task.icon}</span>
                <div className="flex flex-col gap-1">
                    <span className="text-3xl font-extrabold text-gray-700 block leading-none">{task.title}</span>
                    <span className="text-sm font-bold text-[#F59E0B] uppercase tracking-wider bg-[#FEF3C7] px-3 py-1.5 rounded-xl self-start mt-2 flex items-center gap-1">
                        <Star size={12} fill="currentColor" /> +{task.points} Stars
                    </span>
                </div>
              </div>
              <div className="w-20 h-20 rounded-full border-[6px] border-gray-100 flex items-center justify-center bg-gray-50 group-hover:bg-[#4D96FF] group-hover:border-[#4D96FF] transition-colors duration-300 z-10 mr-2 shadow-inner">
                 <div className="w-8 h-8 rounded-full bg-gray-200 group-hover:bg-white transition-all duration-300 scale-100 group-hover:scale-125" />
              </div>
              
              {/* Background Decoration */}
              <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Completed "Badge" Grid */}
        {completedTasks.length > 0 && (
            <div className="mt-16 pt-10 border-t-4 border-dashed border-[#E0E0E0]">
                <div className="flex items-center justify-center gap-3 mb-8 opacity-70">
                    <Star size={24} fill="#FFD93D" className="text-[#FFD93D]" />
                    <h3 className="text-center font-extrabold text-gray-400 uppercase tracking-[0.2em] text-sm">Mission Accomplished</h3>
                    <Star size={24} fill="#FFD93D" className="text-[#FFD93D]" />
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                    {completedTasks.map(t => (
                        <div 
                            key={t.id} 
                            onClick={() => onToggleTask(t.id)}
                            className="bg-[#F1F8E9] rounded-[2.5rem] p-6 flex flex-col items-center justify-center border-4 border-[#DCEDC8] relative active:scale-95 transition-all cursor-pointer shadow-sm group hover:shadow-md h-48"
                        >
                            <div className="text-6xl mb-3 grayscale-[0.3] group-hover:scale-110 group-hover:grayscale-0 transition-all duration-300">{t.icon}</div>
                            <span className="text-sm font-bold text-[#558B2F] text-center leading-tight px-2">{t.title}</span>
                            
                            {/* Visual "Sticker" shine */}
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/60 via-transparent to-transparent rounded-[2.3rem] pointer-events-none" />
                            
                            {/* Checkmark Badge */}
                            <div className="absolute top-3 right-3 bg-[#4CAF50] text-white rounded-full p-2 border-[3px] border-white shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform">
                                <Check size={18} strokeWidth={4} />
                            </div>
                        </div>
                    ))}
                </div>
                {/* Extra space at bottom to ensure easy scrolling */}
                <div className="h-12" />
            </div>
        )}
      </div>
    );
  }

  // --- ADULT MODE: Efficient List ---
  return (
    <div className="p-2 h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
      </div>

      {/* 
         Fixed Layout: flex-1 ensures this container takes available space.
         overflow-y-auto enables internal scrolling.
         pb-36 ensures the last item isn't hidden behind the absolute input box.
      */}
      <div className="flex-1 min-h-0 overflow-y-auto pb-36 custom-scrollbar space-y-3">
        {tasks.length === 0 && (
             <div className="text-center py-10 text-gray-400">
                No tasks yet. Add one below!
             </div>
        )}
        {tasks.map(task => {
          const assignee = members.find(m => m.id === task.assigneeId);
          return (
            <div key={task.id} className={`group flex items-center p-4 rounded-2xl border transition-all ${task.isCompleted ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-200 shadow-sm'}`}>
                <button 
                    onClick={() => onToggleTask(task.id)}
                    className={`w-8 h-8 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${task.isCompleted ? 'bg-green-400 border-green-400' : 'border-gray-300 hover:border-blue-400'}`}
                >
                    {task.isCompleted && <Check size={16} className="text-white" />}
                </button>
                
                <span className="text-2xl mr-3">{task.icon}</span>
                
                <div className="flex-1 flex flex-col">
                    <span className={`text-lg leading-tight ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.title}</span>
                    {/* Assignee Indicator */}
                    {assignee && (
                        <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-gray-400">for</span>
                            <span className="text-sm">{assignee.avatar}</span>
                            <span className="text-xs font-bold text-gray-500">{assignee.name}</span>
                        </div>
                    )}
                </div>
                
                <button onClick={() => onDeleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 size={18} />
                </button>
            </div>
          );
        })}
      </div>

      {/* Add Task Input Area (Pinned to bottom of TaskBoard container) */}
      <div className="absolute bottom-2 left-2 right-2 glass-panel p-3 rounded-[2rem] flex flex-col gap-2 z-10 shadow-2xl">
         {/* Assignee Selector */}
         <div className="flex gap-2 overflow-x-auto pb-2 px-1">
            <button 
                onClick={() => setSelectedAssignee('')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${selectedAssignee === '' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white border-gray-200 text-gray-500'}`}
            >
                <User size={12}/> Anyone
            </button>
            {members.map(m => (
                <button
                    key={m.id}
                    onClick={() => setSelectedAssignee(m.id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${selectedAssignee === m.id ? 'bg-[#4D96FF] text-white border-[#4D96FF]' : 'bg-white border-gray-200 text-gray-500'}`}
                >
                    <span>{m.avatar}</span> {m.name}
                </button>
            ))}
         </div>

         {/* Input Row */}
         <div className="flex items-center gap-2">
            <input 
                type="text" 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 bg-transparent px-4 py-2 outline-none text-lg text-gray-800 placeholder-gray-400"
                onKeyDown={(e) => e.key === 'Enter' && handleAdultAddTask()}
            />
            <button 
                onClick={handleAdultAddTask}
                className="w-12 h-12 bg-[#FF6B6B] text-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
            >
                <Plus size={24} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default TaskBoard;