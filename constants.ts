import { FamilyMember, Task, ShoppingItem, ScheduleEvent, Reward, HistoryEntry, COLORS } from './types';

export const INITIAL_MEMBERS: FamilyMember[] = [
  { id: 'm1', name: 'Mom', avatar: '👩', color: COLORS.sunsetOrange, mood: '⚡️', role: 'parent', points: 120, inventory: [] },
  { id: 'm2', name: 'Dad', avatar: '👨', color: COLORS.electricBlue, mood: '☕️', role: 'parent', points: 85, inventory: [] },
  { id: 'k1', name: 'Leo', avatar: '👦', color: COLORS.softGreen, mood: '🦖', role: 'child', points: 50, inventory: [] },
  { id: 'k2', name: 'Mia', avatar: '👧', color: COLORS.butterYellow, mood: '🎨', role: 'child', points: 320, inventory: [] },
];

export const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Make Bed', assigneeId: 'k1', isCompleted: false, points: 10, icon: '🛏️' },
  { id: 't2', title: 'Brush Teeth', assigneeId: 'k1', isCompleted: true, points: 5, icon: '🪥' },
  { id: 't3', title: 'Feed Cat', assigneeId: 'k2', isCompleted: false, points: 15, icon: '🐱' },
  { id: 't4', title: 'Homework', assigneeId: 'k2', isCompleted: false, points: 30, icon: '📚' },
  { id: 't5', title: 'Dishes', assigneeId: 'm1', isCompleted: false, points: 0, icon: '🍽️' },
];

export const INITIAL_SHOPPING: ShoppingItem[] = [
  { id: 's1', name: 'Milk', emoji: '🥛', checked: false, category: 'Dairy' },
  { id: 's2', name: 'Bananas', emoji: '🍌', checked: true, category: 'Produce' },
  { id: 's3', name: 'Bread', emoji: '🍞', checked: false, category: 'Bakery' },
  { id: 's4', name: 'Eggs', emoji: '🥚', checked: false, category: 'Dairy' },
];

export const INITIAL_EVENTS: ScheduleEvent[] = [
  { id: 'e1', title: 'Swimming Class', time: '16:00', day: 'Sat', date: 31, icon: '🏊‍♂️', color: '#6BCB77', assigneeId: ['k1'] },
  { id: 'e2', title: 'Dentist', time: '10:30', day: 'Sat', date: 31, icon: '🦷', color: '#A29BFE', assigneeId: ['k1', 'k2'] },
  { id: 'e3', title: 'Soccer', time: '17:00', day: 'Sun', date: 1, icon: '⚽', color: '#FFD93D', assigneeId: ['k1'] },
  { id: 'e4', title: 'Piano', time: '15:00', day: 'Mon', date: 2, icon: '🎹', color: '#FF6B6B', assigneeId: ['k2'] },
];

export const INITIAL_REWARDS: Reward[] = [
  { id: 'r1', title: 'Ice Cream', cost: 50, icon: '🍦' },
  { id: 'r2', title: 'Movie Night', cost: 100, icon: '🎬' },
  { id: 'r3', title: 'New Toy', cost: 500, icon: '🤖' },
  { id: 'r4', title: 'Park Trip', cost: 30, icon: '🛝' },
];

export const INITIAL_HISTORY: HistoryEntry[] = [];