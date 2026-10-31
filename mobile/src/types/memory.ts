export type MemoryCategory = 'food' | 'work' | 'family';

export interface MemoryItem {
  id: string;
  category: MemoryCategory;
  text: string;
}
