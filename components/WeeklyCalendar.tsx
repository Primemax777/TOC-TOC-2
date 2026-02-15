import React, { useState } from 'react';
import { ScheduleEvent, FamilyMember, AppMode } from '../types';
import { Clock, Plus, X, Check } from 'lucide-react';

interface WeeklyCalendarProps {
  events: ScheduleEvent[];
  members: FamilyMember[];
  currentUser: FamilyMember;
  mode: AppMode;
  onAddEvent: (event: Omit<ScheduleEvent, 'id'>) => void;
  onUpdateEvent: (event: ScheduleEvent) => void;
}

// Mock days for the calendar
const DAYS = [
  { day: 'Wed', date: 28 },
  { day: 'Thu', date: 29 },
  { day: 'Fri', date: 30 },
  { day: 'Sat', date: 31 },
  { day: 'Sun', date: 1 },
  { day: 'Mon', date: 2 },
  { day: 'Tue', date: 3 },
];

const ICONS = ['🏊‍♂️', '🦷', '⚽', '🎹', '🎨', '🎬', '🍽️', '⛺', '🏥', '🎉'];
const COLORS = ['#6BCB77', '#A29BFE', '#FFD93D', '#FF6B6B', '#4D96FF'];

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ events, members, currentUser, mode, onAddEvent, onUpdateEvent }) => {
  const [selectedDate, setSelectedDate] = useState(31);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('12:00');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [assigneeId, setAssigneeId] = useState<string>('');

  const openModal = (event?: ScheduleEvent) => {
    if (event) {
        setEditingId(event.id);
        setTitle(event.title);
        setTime(event.time);
        setIcon(event.icon);
        setColor(event.color);
        setAssigneeId(event.assigneeId[0] || '');
    } else {
        setEditingId(null);
        setTitle('');
        setTime('12:00');
        setIcon(ICONS[0]);
        setColor(COLORS[0]);
        setAssigneeId(members[0].id);
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!title || !assigneeId) return;
    
    const dayObj = DAYS.find(d => d.date === selectedDate);

    const eventData = {
        title,
        time,
        icon,
        color,
        assigneeId: [assigneeId],
        date: selectedDate,
        day: dayObj ? dayObj.day : 'Unknown'
    };

    if (editingId) {
        onUpdateEvent({ ...eventData, id: editingId });
    } else {
        onAddEvent(eventData);
    }
    setIsModalOpen(false);
  };

  const filteredEvents = events.filter(e => e.date === selectedDate);
  const selectedDayName = DAYS.find(d => d.date === selectedDate)?.day;

  return (
    <div className="flex flex-col h-full relative">
      {/* Title Header */}
      <div className="flex justify-between items-end mb-6 px-2">
        <div>
          <h2 className="text-3xl font-bold text-[#2D3436] tracking-tight">Family Rhythm</h2>
          <p className="text-[#FF6B6B] font-bold text-lg mt-1">
            {selectedDayName}, January {selectedDate}
          </p>
        </div>
        
        {/* Only Parents can add events */}
        {currentUser.role === 'parent' && (
          <button 
            onClick={() => openModal()}
            className="w-12 h-12 bg-[#2D3436] rounded-full flex items-center justify-center text-white shadow-xl active:scale-90 transition-transform"
          >
            <Plus size={24} />
          </button>
        )}
      </div>

      {/* Date Strip */}
      <div className="flex gap-2 overflow-x-auto pb-8 px-1 custom-scrollbar snap-x no-scrollbar">
        {DAYS.map((d) => {
          const isSelected = d.date === selectedDate;
          return (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={`
                snap-center shrink-0 w-16 h-24 rounded-[20px] flex flex-col items-center justify-center transition-all duration-300 border-2
                ${isSelected 
                  ? 'bg-[#FF6B6B] border-[#FF6B6B] text-white shadow-[0_10px_20px_rgba(255,107,107,0.3)] scale-110 z-10' 
                  : 'bg-white border-transparent text-gray-400 hover:border-gray-200'
                }
              `}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">{d.day}</span>
              <span className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-gray-700'}`}>{d.date}</span>
              {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full mt-2" />}
            </button>
          );
        })}
      </div>

      {/* Events Timeline */}
      <div className="flex-1 overflow-y-auto space-y-0 px-2 pb-24 relative">
        {filteredEvents.length > 0 && (
            <div className="absolute left-[26px] top-4 bottom-0 w-0.5 bg-gray-200 z-0" />
        )}

        {filteredEvents.length === 0 ? (
          <div className="text-center py-10 opacity-40">
            <span className="text-6xl block mb-2 grayscale">🍃</span>
            <p className="font-bold text-gray-400">All quiet today.</p>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const assignee = members.find(m => m.id === event.assigneeId[0]);
            
            return (
              <div key={event.id} className="relative z-10 flex gap-4 mb-6 group">
                {/* Time Column */}
                <div className="flex flex-col items-center pt-2 min-w-[50px]">
                    <div className="w-3 h-3 rounded-full border-2 border-white ring-2 ring-[#4D96FF] bg-[#4D96FF] mb-2" />
                    <span className="text-xs font-bold text-gray-400">{event.time}</span>
                </div>

                {/* Event Card (Clickable for parents) */}
                <div 
                    onClick={() => currentUser.role === 'parent' && openModal(event)}
                    className="flex-1 bg-white rounded-[20px] p-4 shadow-sm border border-gray-100 flex items-center justify-between transition-transform active:scale-95 hover:shadow-md cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div 
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner"
                            style={{ backgroundColor: `${event.color}20` }}
                        >
                            {event.icon}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-700 leading-tight">{event.title}</h3>
                            <div className="flex items-center gap-1 mt-1">
                                {assignee && (
                                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-md">
                                        <span className="text-xs">{assignee.avatar}</span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">{assignee.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-1.5 h-8 rounded-full opacity-50" style={{ backgroundColor: event.color }} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl flex flex-col gap-4 animate-slide-up">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-700">{editingId ? 'Edit Event' : 'New Event'}</h3>
                    <button onClick={() => setIsModalOpen(false)} className="bg-gray-100 p-2 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-2">What?</label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Piano Class..."
                            className="w-full bg-gray-50 rounded-xl px-4 py-3 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="flex-1">
                             <label className="text-xs font-bold text-gray-400 uppercase ml-2">When?</label>
                             <input 
                                type="time" 
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-gray-50 rounded-xl px-4 py-3 font-bold text-gray-700 outline-none"
                             />
                        </div>
                        <div className="flex-1">
                             <label className="text-xs font-bold text-gray-400 uppercase ml-2">Who?</label>
                             <select 
                                value={assigneeId}
                                onChange={(e) => setAssigneeId(e.target.value)}
                                className="w-full bg-gray-50 rounded-xl px-4 py-3 font-bold text-gray-700 outline-none appearance-none"
                             >
                                 {members.map(m => (
                                     <option key={m.id} value={m.id}>{m.avatar} {m.name}</option>
                                 ))}
                             </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-2">Icon</label>
                        <div className="flex gap-2 overflow-x-auto py-2">
                            {ICONS.map(i => (
                                <button 
                                    key={i} 
                                    onClick={() => setIcon(i)}
                                    className={`text-2xl p-2 rounded-xl transition-all ${icon === i ? 'bg-gray-200 scale-110' : 'hover:bg-gray-50'}`}
                                >
                                    {i}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-2">Color</label>
                        <div className="flex gap-3 py-2">
                            {COLORS.map(c => (
                                <button 
                                    key={c} 
                                    onClick={() => setColor(c)}
                                    className={`w-8 h-8 rounded-full transition-all border-2 ${color === c ? 'border-gray-500 scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleSave}
                    className="w-full py-4 mt-2 bg-[#2D3436] text-white rounded-[1.5rem] font-bold text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                    <Check size={20} /> Save Event
                </button>
            </div>
        </div>
      )}
      <style>{`
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default WeeklyCalendar;