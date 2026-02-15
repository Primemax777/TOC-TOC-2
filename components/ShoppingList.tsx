import React, { useState } from 'react';
import { ShoppingItem, AppMode, COLORS } from '../types';

interface ShoppingListProps {
  items: ShoppingItem[];
  mode: AppMode;
  onToggleItem: (id: string) => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ items, mode, onToggleItem }) => {
  return (
    <div className="h-full flex flex-col">
       {mode === AppMode.ADULT && (
          <div className="mb-4 flex justify-between items-center">
             <h2 className="text-2xl font-bold text-gray-800">Shopping</h2>
          </div>
       )}

      <div className={`grid ${mode === AppMode.KID ? 'grid-cols-2 gap-4' : 'grid-cols-1 gap-2'} overflow-y-auto pb-20`}>
        {items.map(item => (
          <div 
            key={item.id}
            onClick={() => onToggleItem(item.id)}
            className={`
                relative overflow-hidden transition-all cursor-pointer
                ${mode === AppMode.KID 
                    ? 'aspect-square rounded-[2rem] flex flex-col items-center justify-center bg-white shadow-lg border-4' 
                    : 'flex items-center p-3 rounded-xl bg-white border border-gray-100 shadow-sm'
                }
                ${item.checked 
                    ? (mode === AppMode.KID ? 'border-green-400 opacity-50 bg-green-50' : 'opacity-50') 
                    : (mode === AppMode.KID ? 'border-transparent hover:border-[#FF6B6B]' : '')
                }
            `}
          >
            {/* Visual Checkmark for Kid Mode */}
            {mode === AppMode.KID && item.checked && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span className="text-6xl drop-shadow-lg">✅</span>
                </div>
            )}

            <span className={`transition-transform duration-300 ${mode === AppMode.KID ? (item.checked ? 'scale-75 blur-sm text-7xl' : 'scale-100 text-8xl') : 'text-3xl mr-4'}`}>
                {item.emoji}
            </span>
            
            <span className={`font-bold text-gray-700 ${mode === AppMode.KID ? 'mt-2 text-xl' : 'text-lg'}`}>
                {item.name}
            </span>
          </div>
        ))}
        
        {/* Add Item Placeholder */}
        <div className={`
            border-2 border-dashed border-gray-300 rounded-[2rem] flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50
            ${mode === AppMode.KID ? 'aspect-square' : 'p-4'}
        `}>
            <span className="text-4xl">+</span>
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;