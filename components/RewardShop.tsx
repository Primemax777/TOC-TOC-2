import React, { useState } from 'react';
import { Reward, AppMode, FamilyMember } from '../types';
import { Plus, Trash2, Coins, Gift, ShoppingBag, X, Check } from 'lucide-react';

interface RewardShopProps {
  rewards: Reward[];
  currentUser: FamilyMember;
  mode: AppMode;
  onAddReward: (reward: Omit<Reward, 'id'>) => void;
  onDeleteReward: (id: string) => void;
  onRedeemReward: (reward: Reward) => boolean;
}

const EMOJI_PALETTE = ['🍦', '🎮', '🎬', '🍕', '🧸', '🎨', '⚽', '📱', '🚲', '🍭'];

const RewardShop: React.FC<RewardShopProps> = ({ rewards, currentUser, mode, onAddReward, onDeleteReward, onRedeemReward }) => {
  // State
  const [view, setView] = useState<'shop' | 'stash'>('shop');
  const [isAdding, setIsAdding] = useState(false);
  
  // Selection & Modal State
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  
  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCost, setNewCost] = useState(50);
  const [newIcon, setNewIcon] = useState(EMOJI_PALETTE[0]);

  // Celebration State
  const [showCelebration, setShowCelebration] = useState(false);

  const handleAdd = () => {
    if (newTitle.trim()) {
      onAddReward({
        title: newTitle,
        cost: newCost,
        icon: newIcon
      });
      setIsAdding(false);
      setNewTitle('');
      setNewCost(50);
      setNewIcon(EMOJI_PALETTE[0]);
    }
  };

  const initiatePurchase = (reward: Reward) => {
    if (currentUser.points >= reward.cost) {
        setSelectedReward(reward);
    }
  };

  const confirmPurchase = () => {
    if (selectedReward) {
        const success = onRedeemReward(selectedReward);
        if (success) {
            setSelectedReward(null);
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 2000);
        }
    }
  };

  return (
    <div className="h-full flex flex-col p-2 relative">
      
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="animate-bounce-slow text-9xl">🎉</div>
            <div className="absolute inset-0 confetti-bg opacity-50" />
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Gift className="text-[#FF6B6B]" /> Rewards
        </h2>
        
        {/* Points Display for Kid */}
        {mode === AppMode.KID && (
            <div className="bg-[#FFD93D] px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm text-white font-bold">
                <Coins size={18} fill="white" />
                <span>{currentUser.points}</span>
            </div>
        )}

        {/* Add Button for Parent */}
        {mode === AppMode.ADULT && !isAdding && (
            <button 
                onClick={() => setIsAdding(true)}
                className="w-10 h-10 bg-[#2D3436] rounded-full flex items-center justify-center text-white shadow-lg active:scale-95"
            >
                <Plus size={20} />
            </button>
        )}
      </div>

      {/* Kid Toggle: Shop vs Stash */}
      {mode === AppMode.KID && (
          <div className="flex p-1 bg-gray-100 rounded-xl mb-4">
              <button 
                onClick={() => setView('shop')}
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${view === 'shop' ? 'bg-white shadow-sm text-[#4D96FF]' : 'text-gray-400'}`}
              >
                  Shop
              </button>
              <button 
                onClick={() => setView('stash')}
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${view === 'stash' ? 'bg-white shadow-sm text-[#FF6B6B]' : 'text-gray-400'}`}
              >
                  My Stash
              </button>
          </div>
      )}

      {/* Parent: Add Form */}
      {isAdding && (
        <div className="bg-white p-4 rounded-[2rem] shadow-xl mb-6 border-2 border-gray-100 animate-fade-in relative z-20">
            <h3 className="font-bold text-gray-600 mb-3 text-center">Create New Reward</h3>
            <div className="space-y-3">
                <input 
                    type="text" 
                    placeholder="Reward Name" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-gray-50 rounded-xl px-4 py-2 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100"
                />
                <div className="flex gap-4 items-center">
                    <div className="flex-1 bg-gray-50 rounded-xl px-4 py-2 flex items-center gap-2">
                        <Coins size={16} className="text-[#FFD93D]" />
                        <input 
                            type="number" 
                            value={newCost}
                            onChange={(e) => setNewCost(Number(e.target.value))}
                            className="w-full bg-transparent font-bold text-gray-700 outline-none"
                        />
                    </div>
                    <div className="flex-1 overflow-x-auto flex gap-2">
                        {EMOJI_PALETTE.map(icon => (
                            <button 
                                key={icon}
                                onClick={() => setNewIcon(icon)}
                                className={`p-1 rounded-lg text-xl transition-all ${newIcon === icon ? 'bg-blue-100 scale-125' : 'grayscale opacity-50'}`}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2 mt-2">
                    <button onClick={() => setIsAdding(false)} className="flex-1 py-2 rounded-xl bg-gray-100 font-bold text-gray-500">Cancel</button>
                    <button onClick={handleAdd} className="flex-1 py-2 rounded-xl bg-[#4D96FF] text-white font-bold shadow-md">Create</button>
                </div>
            </div>
        </div>
      )}

      {/* Rewards Grid */}
      <div className="grid grid-cols-2 gap-4 pb-24 overflow-y-auto custom-scrollbar">
        {/* -- MY STASH VIEW -- */}
        {view === 'stash' && mode === AppMode.KID ? (
             currentUser.inventory && currentUser.inventory.length > 0 ? (
                currentUser.inventory.map((rewardId, index) => {
                    const reward = rewards.find(r => r.id === rewardId) || { id: 'unknown', title: 'Mystery', icon: '❓', cost: 0 };
                    return (
                        <div key={`${reward.id}-${index}`} className="bg-white rounded-[2rem] p-4 flex flex-col items-center justify-center gap-2 shadow-sm border-2 border-gray-100 opacity-80">
                            <div className="text-5xl filter grayscale-[0.2]">{reward.icon}</div>
                            <span className="font-bold text-gray-500 text-sm">{reward.title}</span>
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">Owned</span>
                        </div>
                    );
                })
             ) : (
                <div className="col-span-2 text-center py-10 opacity-50">
                    <span className="text-6xl block mb-2">🕸️</span>
                    <p>Your stash is empty!</p>
                </div>
             )
        ) : (
            /* -- SHOP VIEW -- */
            rewards.length === 0 ? (
                 <div className="col-span-2 text-center py-10 opacity-50">
                    <span className="text-6xl block mb-2">🎁</span>
                    <p>No rewards yet!</p>
                 </div>
            ) : (
                rewards.map(reward => {
                    const canAfford = currentUser.points >= reward.cost;
                    return (
                        <div 
                            key={reward.id}
                            onClick={() => mode === AppMode.KID && canAfford ? initiatePurchase(reward) : null}
                            className={`
                                relative bg-white rounded-[2rem] p-4 flex flex-col items-center justify-between gap-2 shadow-sm border-b-4
                                transition-all duration-300
                                ${mode === AppMode.KID 
                                    ? (canAfford 
                                        ? 'border-[#4D96FF] cursor-pointer hover:scale-105 active:scale-95' 
                                        : 'border-gray-200 opacity-50 grayscale cursor-not-allowed')
                                    : 'border-gray-100'
                                }
                            `}
                        >
                            <div className="text-6xl filter drop-shadow-sm mt-2">{reward.icon}</div>
                            
                            <div className="text-center w-full">
                                <h3 className="font-bold text-gray-700 leading-tight mb-1">{reward.title}</h3>
                                <div className={`
                                    inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold
                                    ${canAfford ? 'bg-[#FFD93D] text-white' : 'bg-gray-200 text-gray-500'}
                                `}>
                                    <Coins size={12} fill="currentColor" />
                                    {reward.cost}
                                </div>
                            </div>

                            {mode === AppMode.ADULT && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onDeleteReward(reward.id); }}
                                    className="absolute top-2 right-2 p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    );
                })
            )
        )}
      </div>

      {/* Purchase Confirmation Modal */}
      {selectedReward && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl flex flex-col items-center animate-bloop-animation">
                  <h3 className="text-xl font-bold text-gray-500 mb-2">Buy this?</h3>
                  <div className="text-8xl mb-4 animate-bounce-slow">{selectedReward.icon}</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">{selectedReward.title}</h2>
                  
                  <div className="flex gap-4 w-full">
                      <button 
                        onClick={() => setSelectedReward(null)}
                        className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-500 font-bold flex items-center justify-center gap-2"
                      >
                          <X size={20} /> No
                      </button>
                      <button 
                        onClick={confirmPurchase}
                        className="flex-1 py-3 rounded-2xl bg-[#FFD93D] text-white font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                      >
                          <span className="flex items-center gap-1">
                             <Coins size={16} fill="white" /> {selectedReward.cost}
                          </span>
                          Yes!
                      </button>
                  </div>
              </div>
          </div>
      )}

      <style>{`
        .confetti-bg {
            background-image: radial-gradient(#FFD93D 20%, transparent 20%), radial-gradient(#FF6B6B 20%, transparent 20%);
            background-size: 20px 20px;
            background-position: 0 0, 10px 10px;
        }
      `}</style>
    </div>
  );
};

export default RewardShop;