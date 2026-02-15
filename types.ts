export enum AppMode {
  ADULT = 'ADULT',
  KID = 'KID'
}

export enum Tab {
  HOME = 'HOME',
  TASKS = 'TASKS',
  CALENDAR = 'CALENDAR',
  SHOPPING = 'SHOPPING',
  REWARDS = 'REWARDS',
  HISTORY = 'HISTORY'
}

export interface FamilyMember {
  id: string;
  name: string;
  avatar: string; // Emoji or URL
  color: string;
  mood: string; // Emoji representing current mood
  role: 'parent' | 'child';
  points: number;
  inventory: string[]; // Array of Reward IDs owned
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string | null;
  isCompleted: boolean;
  points: number;
  icon: string; // Emoji
}

export interface ShoppingItem {
  id: string;
  name: string;
  emoji: string;
  checked: boolean;
  category: string;
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  icon: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  time: string;
  day: string; // e.g., "Mon", "Tue"
  date: number;
  icon: string;
  color: string; // Hex for border/accent
  assigneeId: string[]; // Who is this for?
}

export interface HistoryEntry {
  id: string;
  taskTitle: string;
  taskIcon: string;
  performerName: string;
  performerAvatar: string;
  points: number;
  timestamp: number;
}

export const COLORS = {
  sunsetOrange: '#FF6B6B',
  electricBlue: '#4D96FF',
  butterYellow: '#FFD93D',
  softGreen: '#6BCB77',
  cream: '#FDF6E3',
  text: '#2D3436'
};