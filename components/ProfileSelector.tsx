import React from 'react';
import { FamilyMember } from '../types';

interface ProfileSelectorProps {
  members: FamilyMember[];
  onSelect: (member: FamilyMember) => void;
}

const ProfileSelector: React.FC<ProfileSelectorProps> = ({ members, onSelect }) => {
  return (
    <div className="min-h-screen bg-[#FDF6E3] flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#FF6B6B] mb-2 tracking-wide">TOC-TOC</h1>
        <p className="text-xl text-gray-500 font-bold">Who is playing today?</p>
      </div>

      <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
        {members.map(member => (
          <button
            key={member.id}
            onClick={() => onSelect(member)}
            className="flex flex-col items-center group"
          >
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-xl border-4 border-white transition-transform group-hover:scale-110 group-active:scale-95"
              style={{ backgroundColor: member.color }}
            >
              {member.avatar}
            </div>
            <span className="mt-4 text-xl font-bold text-gray-700">{member.name}</span>
            <span className="text-sm text-gray-400 font-bold uppercase">{member.role}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileSelector;