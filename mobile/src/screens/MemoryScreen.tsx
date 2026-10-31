import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Utensils, Briefcase, Heart, Plus } from 'lucide-react-native';
import { useTheme, ThemeColors } from '../theme/colors';
import { VoiceService } from '../services/voiceService';
import { ProfileModal } from '../components/ProfileModal';

import { MemoryCategory, MemoryItem } from '../types/memory';
import { INITIAL_MEMORIES } from '../data/memoryData';
import { MemoryHeader } from '../components/memory/MemoryHeader';
import { MemorySearchBar } from '../components/memory/MemorySearchBar';
import { TransparencyCard } from '../components/memory/TransparencyCard';
import { MemoryCategorySection } from '../components/memory/MemoryCategorySection';
import { TeachMemoryModal } from '../components/memory/TeachMemoryModal';

export type { MemoryCategory, MemoryItem };

export const MemoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [searchQuery, setSearchQuery] = useState('');
  const [memories, setMemories] = useState<MemoryItem[]>(INITIAL_MEMORIES);
  const [isTeachModalOpen, setIsTeachModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // New Memory Inputs
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryCategory>('work');
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredMemories = useMemo(
    () =>
      memories.filter((m) =>
        m.text.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [memories, searchQuery]
  );

  const foodMemories = useMemo(
    () => filteredMemories.filter((m) => m.category === 'food'),
    [filteredMemories]
  );
  const workMemories = useMemo(
    () => filteredMemories.filter((m) => m.category === 'work'),
    [filteredMemories]
  );
  const familyMemories = useMemo(
    () => filteredMemories.filter((m) => m.category === 'family'),
    [filteredMemories]
  );

  const handleForget = (id: string) => {
    VoiceService.triggerHaptic('medium');
    setMemories((prev) => prev.filter((m) => m.id !== id));
    VoiceService.speak('Memory forgotten and erased from your profile.');
  };

  const handleOpenAdd = () => {
    VoiceService.triggerHaptic('light');
    setEditingId(null);
    setNewText('');
    setNewCategory('work');
    setIsTeachModalOpen(true);
  };

  const handleOpenEdit = (item: MemoryItem) => {
    VoiceService.triggerHaptic('light');
    setEditingId(item.id);
    setNewText(item.text);
    setNewCategory(item.category);
    setIsTeachModalOpen(true);
  };

  const handleSaveMemory = () => {
    if (!newText.trim()) return;
    VoiceService.triggerHaptic('success');

    if (editingId) {
      setMemories((prev) =>
        prev.map((m) =>
          m.id === editingId
            ? { ...m, text: newText.trim(), category: newCategory }
            : m
        )
      );
      VoiceService.speak(`Memory updated: ${newText.trim()}`);
    } else {
      const newItem: MemoryItem = {
        id: Date.now().toString(),
        category: newCategory,
        text: newText.trim(),
      };
      setMemories((prev) => [newItem, ...prev]);
      VoiceService.speak(`Learned and saved to memory: ${newText.trim()}`);
    }

    setNewText('');
    setEditingId(null);
    setIsTeachModalOpen(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header and Branding */}
      <MemoryHeader onOpenProfile={() => setIsProfileOpen(true)} />

      {/* Search Input */}
      <MemorySearchBar
        searchQuery={searchQuery}
        onChangeSearchQuery={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />

      {/* Transparency Guarantee Card */}
      <TransparencyCard />

      {/* Category 1: Food & Groceries */}
      <MemoryCategorySection
        title="Food & Groceries"
        items={foodMemories}
        icon={<Utensils size={15} color={colors.primary} />}
        onEdit={handleOpenEdit}
        onForget={handleForget}
      />

      {/* Category 2: Work & Schedule */}
      <MemoryCategorySection
        title="Work & Schedule"
        items={workMemories}
        icon={<Briefcase size={15} color={colors.primary} />}
        onEdit={handleOpenEdit}
        onForget={handleForget}
      />

      {/* Category 3: Family & Friends */}
      <MemoryCategorySection
        title="Family & Friends"
        items={familyMemories}
        icon={<Heart size={15} color={colors.primary} />}
        onEdit={handleOpenEdit}
        onForget={handleForget}
      />

      {/* Teach MIRAS Button */}
      <TouchableOpacity style={styles.teachButton} onPress={handleOpenAdd}>
        <Plus size={16} color={colors.buttonTextDark} />
        <Text style={styles.teachButtonText}>Teach MIRAS something new</Text>
      </TouchableOpacity>

      {/* Modal: Add / Edit Memory */}
      <TeachMemoryModal
        visible={isTeachModalOpen}
        editingId={editingId}
        category={newCategory}
        text={newText}
        onChangeCategory={setNewCategory}
        onChangeText={setNewText}
        onSave={handleSaveMemory}
        onClose={() => setIsTeachModalOpen(false)}
      />

      {/* Profile Modal */}
      <ProfileModal visible={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </ScrollView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 18,
      paddingBottom: 40,
    },
    teachButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 14,
      marginTop: 10,
      marginBottom: 20,
    },
    teachButtonText: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
  });
