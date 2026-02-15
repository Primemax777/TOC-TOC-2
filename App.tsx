import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AppMode, Tab, FamilyMember, Task, ShoppingItem, ScheduleEvent, Reward, HistoryEntry, COLORS } from './types';
import { INITIAL_MEMBERS, INITIAL_TASKS, INITIAL_SHOPPING, INITIAL_EVENTS, INITIAL_REWARDS, INITIAL_HISTORY } from './constants';
import MoodBoard from './components/MoodBoard';
import TaskBoard from './components/TaskBoard';
import ShoppingList from './components/ShoppingList';
import WeeklyCalendar from './components/WeeklyCalendar';
import RewardShop from './components/RewardShop';
import HistoryLog from './components/HistoryLog';
import NavBar from './components/NavBar';
import ProfileSelector from './components/ProfileSelector';
import { Settings, Bell, Coins, Calendar, CheckCircle2 } from 'lucide-react';

// Helper for LocalStorage
function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

const App: React.FC = () => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<FamilyMember | null>(null);

  // App State
  const [mode, setMode] = useState<AppMode>(AppMode.ADULT);
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.HOME);
  
  // Data State with Persistence
  const [members, setMembers] = useStickyState<FamilyMember[]>(INITIAL_MEMBERS, 'toc-toc-members');
  const [tasks, setTasks] = useStickyState<Task[]>(INITIAL_TASKS, 'toc-toc-tasks');
  const [shoppingItems, setShoppingItems] = useStickyState<ShoppingItem[]>(INITIAL_SHOPPING, 'toc-toc-shopping');
  const [events, setEvents] = useStickyState<ScheduleEvent[]>(INITIAL_EVENTS, 'toc-toc-events');
  const [rewards, setRewards] = useStickyState<Reward[]>(INITIAL_REWARDS, 'toc-toc-rewards');
  const [history, setHistory] = useStickyState<HistoryEntry[]>(INITIAL_HISTORY, 'toc-toc-history');

  // Handlers
  const handleLogin = (member: FamilyMember) => {
    setCurrentUser(member);
    setMode(member.role === 'child' ? AppMode.KID : AppMode.ADULT);
    setCurrentTab(Tab.HOME); // Land on Dashboard
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setMode(AppMode.ADULT);
  };

  const updateMood = (id: string, mood: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, mood } : m));
  };

  const toggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (currentUser?.role === 'child' && task.assigneeId && task.assigneeId !== currentUser.id) {
       return;
    }

    const isNowCompleted = !task.isCompleted;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: isNowCompleted } : t));

    // Logic for Points and History
    if (task.assigneeId) {
      // Award Points
      setMembers(prevMembers => prevMembers.map(m => {
        if (m.id === task.assigneeId) {
          const pointsChange = isNowCompleted ? task.points : -task.points;
          // Update current user if it matches to show immediate feedback in UI
          if (currentUser?.id === m.id) {
             setCurrentUser(prev => prev ? { ...prev, points: Math.max(0, m.points + pointsChange) } : null);
          }
          return { ...m, points: Math.max(0, m.points + pointsChange) };
        }
        return m;
      }));

      // Log to History if completed
      if (isNowCompleted) {
         const performer = members.find(m => m.id === task.assigneeId);
         if (performer) {
             const newEntry: HistoryEntry = {
                 id: Date.now().toString(),
                 taskTitle: task.title,
                 taskIcon: task.icon,
                 performerName: performer.name,
                 performerAvatar: performer.avatar,
                 points: task.points,
                 timestamp: Date.now()
             };
             setHistory(prev => [newEntry, ...prev]);
         }
      }
    }
  };

  const addTask = (title: string, assigneeId: string, icon: string = '📌') => {
    const newTask: Task = {
        id: Date.now().toString(),
        title,
        assigneeId: assigneeId || null,
        isCompleted: false,
        points: 10,
        icon: icon
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  // Event Handlers
  const addEvent = (eventData: Omit<ScheduleEvent, 'id'>) => {
      const newEvent: ScheduleEvent = {
          ...eventData,
          id: Date.now().toString()
      };
      setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (updatedEvent: ScheduleEvent) => {
      setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  // Reward Handlers
  const addReward = (rewardData: Omit<Reward, 'id'>) => {
      const newReward: Reward = {
          ...rewardData,
          id: Date.now().toString()
      };
      setRewards(prev => [...prev, newReward]);
  };

  const deleteReward = (id: string) => {
      setRewards(prev => prev.filter(r => r.id !== id));
  };

  const redeemReward = (reward: Reward): boolean => {
      if (!currentUser) return false;

      if (currentUser.points >= reward.cost) {
          // Deduct points
          const newPoints = currentUser.points - reward.cost;
          const newInventory = [...(currentUser.inventory || []), reward.id];

          // Update Member State
          setMembers(prev => prev.map(m => m.id === currentUser.id ? { ...m, points: newPoints, inventory: newInventory } : m));
          
          // Update Current User State (for UI reflection)
          setCurrentUser(prev => prev ? { ...prev, points: newPoints, inventory: newInventory } : null);
          
          return true;
      }
      return false;
  };

  // --- RENDER LOGIN SCREEN IF NO USER ---
  if (!currentUser) {
    return <ProfileSelector members={members} onSelect={handleLogin} />;
  }

  const visibleTasks = mode === AppMode.KID
    ? tasks.filter(t => t.assigneeId === currentUser.id || !t.assigneeId)
    : tasks;

  // Helpers for Home Dashboard
  const myPendingTasksCount = visibleTasks.filter(t => !t.isCompleted && (t.assigneeId === currentUser.id || !t.assigneeId)).length;
  // Simple check for next upcoming event (assuming today is Sat 31 for demo)
  const myNextEvent = events.find(e => e.date === 31 && e.assigneeId.includes(currentUser.id));

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 ${mode === AppMode.KID ? 'bg-[#FFF9C4]' : 'bg-[#FDF6E3]'}`}>
      
      {/* Dynamic Header */}
      <div className="px-6 pt-8 pb-2 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-40 mb-2">
        <div className="flex items-center gap-3" onClick={handleLogout}>
             <div className="w-12 h-12 rounded-full border-2 border-white shadow-md flex items-center justify-center text-2xl bg-white cursor-pointer active:scale-95 transition-transform">
                {currentUser.avatar}
             </div>
             <div>
                 <p className="text-xs text-gray-400 font-bold uppercase">Hi,</p>
                 <h2 className="text-xl font-bold text-gray-700 leading-none">{currentUser.name}</h2>
             </div>
        </div>
        
        <div className="flex items-center gap-3">
             {/* Points Widget */}
             {mode === AppMode.KID && (
                 <div className="bg-[#FFD93D] px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm text-white font-bold animate-bounce-slow">
                    <Coins size={16} fill="white" />
                    <span>{currentUser.points}</span>
                 </div>
             )}
             
             <button className="bg-white p-2 rounded-full text-gray-400 shadow-sm active:scale-90 transition-transform">
                <Bell size={20} />
             </button>
             {mode === AppMode.ADULT && (
                 <button className="bg-white p-2 rounded-full text-gray-400 shadow-sm active:scale-90 transition-transform">
                    <Settings size={20} />
                 </button>
             )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="px-4 pb-32 max-w-md mx-auto h-[calc(100vh-100px)] overflow-hidden">
        <div className="h-full glass-panel rounded-[2.5rem] shadow-xl overflow-hidden relative">
            
            <div className="h-full w-full p-2 overflow-y-auto custom-scrollbar">
                
                {/* Home Dashboard Tab */}
                {currentTab === Tab.HOME && (
                    <div className="animate-fade-in p-2 space-y-6">
                        {/* 1. Mood Board */}
                        <MoodBoard members={members} mode={mode} onUpdateMood={updateMood} />
                        
                        {/* 2. Quick Status Summary */}
                        <div className="grid grid-cols-2 gap-4">
                            <div 
                                onClick={() => setCurrentTab(Tab.TASKS)}
                                className="bg-white p-4 rounded-[2rem] shadow-sm active:scale-95 transition-transform cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <span className="text-3xl font-bold text-gray-800">{myPendingTasksCount}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-400">Pending Tasks</span>
                            </div>

                            <div 
                                onClick={() => setCurrentTab(Tab.CALENDAR)}
                                className="bg-white p-4 rounded-[2rem] shadow-sm active:scale-95 transition-transform cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="bg-blue-100 p-2 rounded-full text-blue-500">
                                        <Calendar size={20} />
                                    </div>
                                    <span className="text-3xl font-bold text-gray-800">{events.filter(e => e.date === 31).length}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-400">Events Today</span>
                            </div>
                        </div>

                        {/* 3. Up Next Card */}
                        <div className="bg-[#4D96FF] rounded-[2.5rem] p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-bold opacity-80 mb-4 uppercase tracking-widest text-xs">Up Next</h3>
                                {myNextEvent ? (
                                    <div className="flex items-center gap-4">
                                        <div className="text-5xl">{myNextEvent.icon}</div>
                                        <div>
                                            <h4 className="text-2xl font-bold">{myNextEvent.title}</h4>
                                            <span className="font-bold opacity-80">{myNextEvent.time} • Today</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4 opacity-80">
                                        <div className="text-4xl">😴</div>
                                        <div>
                                            <h4 className="text-xl font-bold">Free time!</h4>
                                            <span className="text-sm">Nothing scheduled for you.</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Decorative Background Circles */}
                            <div className="absolute -right-4 -bottom-10 w-32 h-32 bg-white opacity-20 rounded-full" />
                            <div className="absolute top-10 right-10 w-16 h-16 bg-white opacity-10 rounded-full" />
                        </div>
                    </div>
                )}
                
                {/* Ritmo Familiar Tab */}
                {currentTab === Tab.CALENDAR && (
                    <div className="animate-fade-in h-full">
                       <WeeklyCalendar 
                          events={events} 
                          members={members} 
                          currentUser={currentUser} 
                          mode={mode} 
                          onAddEvent={addEvent}
                          onUpdateEvent={updateEvent}
                       />
                    </div>
                )}
                
                {/* Tasks Tab */}
                {currentTab === Tab.TASKS && (
                    <TaskBoard 
                        tasks={visibleTasks} 
                        members={members}
                        currentUser={currentUser}
                        mode={mode} 
                        onToggleTask={toggleTask} 
                        onAddTask={addTask}
                        onDeleteTask={deleteTask}
                    />
                )}
                
                {currentTab === Tab.SHOPPING && (
                    <ShoppingList 
                        items={shoppingItems} 
                        mode={mode} 
                        onToggleItem={toggleShoppingItem} 
                    />
                )}

                {currentTab === Tab.REWARDS && (
                    <RewardShop 
                        rewards={rewards}
                        currentUser={currentUser}
                        mode={mode}
                        onAddReward={addReward}
                        onDeleteReward={deleteReward}
                        onRedeemReward={redeemReward}
                    />
                )}

                {currentTab === Tab.HISTORY && (
                    <HistoryLog history={history} />
                )}
            </div>
        </div>
      </main>

      <NavBar currentTab={currentTab} mode={mode} onTabChange={setCurrentTab} />
      
      <style>{`
        .animate-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce-slow {
            animation: bounce 2s infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 0px; 
            height: 0px;
        }
      `}</style>
    </div>
  );
};

export default App;