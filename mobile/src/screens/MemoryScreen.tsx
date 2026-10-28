import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import {
  Search,
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Heart,
  Briefcase,
  Utensils,
  Sparkles,
  X,
  Check,
} from 'lucide-react-native';
import { useTheme, ThemeColors } from '../theme/colors';
import { VoiceService } from '../services/voiceService';
import { ProfileModal } from '../components/ProfileModal';

interface MemoryItem {
  id: string;
  category: 'food' | 'work' | 'family';
  text: string;
}

const INITIAL_MEMORIES: MemoryItem[] = [
  { id: '1', category: 'food', text: 'Allergic to peanuts and shellfish' },
  { id: '2', category: 'food', text: 'Prefers oat milk over dairy' },
  { id: '3', category: 'food', text: 'Always order sourdough bread' },
  { id: '4', category: 'work', text: 'Do not book meetings before 10:00 AM' },
  { id: '5', category: 'work', text: 'Preferred seat on flights: Window seat' },
  { id: '6', category: 'family', text: "Mom's birthday is October 14" },
  { id: '7', category: 'family', text: "Son's school pickup is 3:30 PM on weekdays" },
];

export const MemoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [searchQuery, setSearchQuery] = useState('');
  const [memories, setMemories] = useState<MemoryItem[]>(INITIAL_MEMORIES);
  const [isTeachModalOpen, setIsTeachModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // New Memory Inputs
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState<'food' | 'work' | 'family'>('work');
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredMemories = memories.filter(m =>
    m.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const foodMemories = filteredMemories.filter(m => m.category === 'food');
  const workMemories = filteredMemories.filter(m => m.category === 'work');
  const familyMemories = filteredMemories.filter(m => m.category === 'family');

  const handleForget = (id: string) => {
    VoiceService.triggerHaptic('medium');
    setMemories(prev => prev.filter(m => m.id !== id));
    VoiceService.speak("Memory forgotten and erased from your profile.");
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
      setMemories(prev =>
        prev.map(m => (m.id === editingId ? { ...m, text: newText.trim(), category: newCategory } : m))
      );
      VoiceService.speak(`Memory updated: ${newText.trim()}`);
    } else {
      const newItem: MemoryItem = {
        id: Date.now().toString(),
        category: newCategory,
        text: newText.trim(),
      };
      setMemories(prev => [newItem, ...prev]);
      VoiceService.speak(`Learned and saved to memory: ${newText.trim()}`);
    }

    setNewText('');
    setEditingId(null);
    setIsTeachModalOpen(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.brandRow}>
          <Text style={styles.brandText}>MIRAS</Text>
        </View>
        <TouchableOpacity style={styles.avatar} onPress={() => setIsProfileOpen(true)}>
          <Text style={styles.avatarText}>A</Text>
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>What MIRAS Remembers</Text>
        <Text style={styles.subtitle}>
          Things I've learned about you to help you better.
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchBar}>
        <Search size={16} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search what MIRAS knows..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <X size={15} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Transparency Guarantee Card */}
      <View style={styles.transparentCard}>
        <View style={styles.sparkleIconWrapper}>
          <Sparkles size={16} color={colors.primary} />
        </View>
        <View style={styles.transparentDetails}>
          <Text style={styles.transparentTitle}>Always transparent</Text>
          <Text style={styles.transparentSubtitle}>
            You are always in control. Tap edit to update details, or ask MIRAS to forget anytime.
          </Text>
        </View>
      </View>

      {/* Category 1: Food & Groceries */}
      {foodMemories.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithIcon}>
              <Utensils size={15} color={colors.primary} />
              <Text style={styles.sectionTitle}>Food & Groceries</Text>
            </View>
            <Text style={styles.countBadge}>{foodMemories.length} facts</Text>
          </View>

          {foodMemories.map(item => (
            <View key={item.id} style={styles.memoryCard}>
              <Text style={styles.memoryText}>{item.text}</Text>
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleOpenEdit(item)}
                >
                  <Edit2 size={12} color={colors.primary} />
                  <Text style={[styles.actionBtnText, { color: colors.primary }]}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleForget(item.id)}
                >
                  <Trash2 size={12} color={colors.textMuted} />
                  <Text style={styles.actionBtnText}>Forget this</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Category 2: Work & Schedule */}
      {workMemories.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithIcon}>
              <Briefcase size={15} color={colors.primary} />
              <Text style={styles.sectionTitle}>Work & Schedule</Text>
            </View>
            <Text style={styles.countBadge}>{workMemories.length} facts</Text>
          </View>

          {workMemories.map(item => (
            <View key={item.id} style={styles.memoryCard}>
              <Text style={styles.memoryText}>{item.text}</Text>
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleOpenEdit(item)}
                >
                  <Edit2 size={12} color={colors.primary} />
                  <Text style={[styles.actionBtnText, { color: colors.primary }]}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleForget(item.id)}
                >
                  <Trash2 size={12} color={colors.textMuted} />
                  <Text style={styles.actionBtnText}>Forget this</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Category 3: Family & Friends */}
      {familyMemories.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithIcon}>
              <Heart size={15} color={colors.primary} />
              <Text style={styles.sectionTitle}>Family & Friends</Text>
            </View>
            <Text style={styles.countBadge}>{familyMemories.length} facts</Text>
          </View>

          {familyMemories.map(item => (
            <View key={item.id} style={styles.memoryCard}>
              <Text style={styles.memoryText}>{item.text}</Text>
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleOpenEdit(item)}
                >
                  <Edit2 size={12} color={colors.primary} />
                  <Text style={[styles.actionBtnText, { color: colors.primary }]}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleForget(item.id)}
                >
                  <Trash2 size={12} color={colors.textMuted} />
                  <Text style={styles.actionBtnText}>Forget this</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Teach MIRAS Button */}
      <TouchableOpacity style={styles.teachButton} onPress={handleOpenAdd}>
        <Plus size={16} color={colors.buttonTextDark} />
        <Text style={styles.teachButtonText}>Teach MIRAS something new</Text>
      </TouchableOpacity>

      {/* Modal: Add / Edit Memory */}
      <Modal visible={isTeachModalOpen} transparent animationType="slide" onRequestClose={() => setIsTeachModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{editingId ? 'Edit Memory' : 'Teach MIRAS Something'}</Text>
              <TouchableOpacity onPress={() => setIsTeachModalOpen(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              MIRAS uses this to customize reservations, flights, and dietary alerts.
            </Text>

            {/* Category Selector */}
            <View style={styles.catSelectorRow}>
              <TouchableOpacity
                style={[styles.catOption, newCategory === 'food' && styles.catOptionActive]}
                onPress={() => setNewCategory('food')}
              >
                <Text style={[styles.catOptionText, newCategory === 'food' && styles.catOptionTextActive]}>
                  🥗 Food
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.catOption, newCategory === 'work' && styles.catOptionActive]}
                onPress={() => setNewCategory('work')}
              >
                <Text style={[styles.catOptionText, newCategory === 'work' && styles.catOptionTextActive]}>
                  💼 Work
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.catOption, newCategory === 'family' && styles.catOptionActive]}
                onPress={() => setNewCategory('family')}
              >
                <Text style={[styles.catOptionText, newCategory === 'family' && styles.catOptionTextActive]}>
                  ❤️ Family
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Always reserve booth seating for dinner..."
              placeholderTextColor={colors.textMuted}
              value={newText}
              onChangeText={setNewText}
              multiline
              autoFocus
            />

            <TouchableOpacity
              style={[styles.saveBtn, !newText.trim() && styles.saveBtnDisabled]}
              onPress={handleSaveMemory}
              disabled={!newText.trim()}
            >
              <Check size={16} color={newText.trim() ? colors.buttonTextDark : colors.textMuted} />
              <Text style={[styles.saveBtnText, !newText.trim() && styles.saveBtnTextDisabled]}>
                {editingId ? 'Update Memory' : 'Save Memory'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Profile Modal */}
      <ProfileModal visible={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </ScrollView>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.buttonTextDark,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: colors.textPrimary,
  },
  transparentCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: `${colors.primary}0D`,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: `${colors.primary}26`,
  },
  sparkleIconWrapper: {
    marginTop: 2,
  },
  transparentDetails: {
    flex: 1,
  },
  transparentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  transparentSubtitle: {
    fontSize: 11.5,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  countBadge: {
    fontSize: 11,
    color: colors.textMuted,
  },
  memoryCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  memoryText: {
    fontSize: 13.5,
    lineHeight: 18,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtnText: {
    fontSize: 11,
    color: colors.textMuted,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    backgroundColor: colors.cardBgElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: `${colors.primary}40`,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 14,
  },
  catSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  catOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  catOptionActive: {
    backgroundColor: `${colors.primary}26`,
    borderColor: colors.primary,
  },
  catOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  catOptionTextActive: {
    color: colors.primary,
  },
  modalInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
    marginBottom: 16,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 13,
  },
  saveBtnDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.buttonTextDark,
  },
  saveBtnTextDisabled: {
    color: colors.textMuted,
  },
});
