import React from 'react';
import { Tab, AppMode, COLORS } from '../types';
import { Home, ListChecks, ShoppingCart, CalendarDays, Gift, History } from 'lucide-react';

interface NavBarProps {
  currentTab: Tab;
  mode: AppMode;
  onTabChange: (tab: Tab) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentTab, mode, onTabChange }) => {
  const isKid = mode === AppMode.KID;
  const height = isKid ? 'h-24' : 'h-20';
  const iconSize = isKid ? 32 : 24;

  let tabs = [
    { id: Tab.HOME, icon: Home, label: 'Home' },
    { id: Tab.CALENDAR, icon: CalendarDays, label: 'Plan' },
    { id: Tab.TASKS, icon: ListChecks, label: 'Tasks' },
  ];

  if (isKid) {
    // Kids see Rewards instead of Shopping
    tabs.push({ id: Tab.REWARDS, icon: Gift, label: 'Rewards' });
  } else {
    // Adults see Shopping, Rewards and History
    tabs.push({ id: Tab.SHOPPING, icon: ShoppingCart, label: 'Shop' });
    tabs.push({ id: Tab.REWARDS, icon: Gift, label: 'Rewards' });
    tabs.push({ id: Tab.HISTORY, icon: History, label: 'History' });
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${height} bg-white/80 backdrop-blur-lg border-t border-white shadow-2xl flex justify-around items-center px-2 pb-2 z-50`}>
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = currentTab === t.id;
        
        return (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={`
                relative flex flex-col items-center justify-center transition-all duration-300 w-14
                ${isActive ? 'text-[#4D96FF] -translate-y-4' : 'text-gray-400'}
            `}
          >
            <div className={`
                ${isActive ? 'bg-white shadow-lg shadow-blue-200' : 'bg-transparent'} 
                rounded-3xl p-3 transition-all duration-300
            `}>
                <Icon size={iconSize} strokeWidth={isKid ? 3 : 2} />
            </div>
            {!isKid && <span className="text-[10px] font-bold mt-1">{t.label}</span>}
            {isActive && isKid && <div className="absolute -bottom-2 w-2 h-2 bg-[#4D96FF] rounded-full" />}
          </button>
        );
      })}
    </div>
  );
};

export default NavBar;