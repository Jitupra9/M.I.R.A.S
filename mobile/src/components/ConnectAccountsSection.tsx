import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../theme/colors';
import { VoiceService } from '../services/voiceService';
import {
  ConnectionMethod,
  ConnectionStatus,
  IntegrationCategory,
  IntegrationItem,
} from '../types/integrations';

// Re-export static catalog and presets from data layer for backward compatibility
export {
  INITIAL_CATEGORIES,
  INITIAL_INTEGRATIONS,
  POPULAR_PLATFORM_CATALOG,
  PlatformPreset,
} from '../data/integrationsData';
import {
  INITIAL_CATEGORIES,
  INITIAL_INTEGRATIONS,
  POPULAR_PLATFORM_CATALOG,
  PlatformPreset,
} from '../data/integrationsData';

// Modular Sub-Components
import { CategoryCard } from './integrations/CategoryCard';
import { CategoryEditModal } from './integrations/CategoryEditModal';
import { CustomAppModal } from './integrations/CustomAppModal';
import { AddAccountModal } from './integrations/AddAccountModal';
import { ManageIntegrationModal } from './integrations/ManageIntegrationModal';
import { SetupIntegrationModal } from './integrations/SetupIntegrationModal';

interface ConnectAccountsSectionProps {
  onShowToast?: (message: string) => void;
}

export const ConnectAccountsSection: React.FC<ConnectAccountsSectionProps> = ({ onShowToast }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  // Categories and integrations state
  const [categories, setCategories] = useState<IntegrationCategory[]>(INITIAL_CATEGORIES);
  const [integrations, setIntegrations] = useState<Record<string, IntegrationItem>>(INITIAL_INTEGRATIONS);

  // Expand / collapse state per category
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    personal_productivity: true,
    professional_engineering: false,
    cloud_infrastructure: false,
    team_communication: false,
  });

  // Dialog states
  const [addAccountCategory, setAddAccountCategory] = useState<IntegrationCategory | null>(null);
  const [setupIntegration, setSetupIntegration] = useState<IntegrationItem | null>(null);
  const [manageIntegration, setManageIntegration] = useState<IntegrationItem | null>(null);

  // Category CRUD states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<IntegrationCategory | null>(null);
  const [categoryFormName, setCategoryFormName] = useState('');
  const [categoryFormDesc, setCategoryFormDesc] = useState('');
  const [categoryFormIcon, setCategoryFormIcon] = useState<IntegrationCategory['iconType']>('code');

  // Setup modal form state
  const [activeSetupMethod, setActiveSetupMethod] = useState<ConnectionMethod>('mcp');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [isSimulatingConnect, setIsSimulatingConnect] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [simulateFailToggle, setSimulateFailToggle] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    title: string;
    details: string[];
    timestamp: string;
  } | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Custom Application / Platform Modal state
  const [isCustomAppModalOpen, setIsCustomAppModalOpen] = useState(false);
  const [customAppName, setCustomAppName] = useState('');
  const [customAppUrl, setCustomAppUrl] = useState('');
  const [customAppDesc, setCustomAppDesc] = useState('');
  const [customAppCategory, setCustomAppCategory] = useState<string>('personal_productivity');
  const [customAppIcon, setCustomAppIcon] = useState<string>('briefcase');
  const [customAppMethod, setCustomAppMethod] = useState<ConnectionMethod>('api');

  // Toggle Category Expand/Collapse
  const toggleCategory = (categoryId: string) => {
    VoiceService.triggerHaptic('light');
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Open "Add Account" dialog for a specific category
  const handleOpenAddAccount = (category: IntegrationCategory) => {
    VoiceService.triggerHaptic('light');
    setAddAccountCategory(category);
  };

  // Open Custom Platform/App Modal
  const handleOpenCustomAppModal = (categoryId?: string, prefillName = '') => {
    VoiceService.triggerHaptic('light');
    const targetCatId = categoryId || addAccountCategory?.id || categories[0]?.id || 'personal_productivity';
    setAddAccountCategory(null);
    setCustomAppName(prefillName);
    setCustomAppUrl('');
    setCustomAppDesc('');
    setCustomAppCategory(targetCatId);
    setCustomAppIcon('briefcase');
    setCustomAppMethod('api');
    setIsCustomAppModalOpen(true);
  };

  // Save and launch setup for custom application
  const handleSaveCustomApp = () => {
    if (!customAppName.trim()) return;

    VoiceService.triggerHaptic('medium');
    const slug = customAppName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const customId = `app_${slug}_${Date.now()}`;
    const targetCatId = customAppCategory || addAccountCategory?.id || categories[0]?.id;

    const newItem: IntegrationItem = {
      id: customId,
      name: customAppName.trim(),
      categoryId: targetCatId,
      description: customAppDesc.trim() || `${customAppName.trim()} custom service integration`,
      iconType: customAppIcon,
      status: 'not_connected',
      activeMethod: customAppMethod,
      credentials: {
        accountHandle: 'alexmorgan-ai',
        customEndpoint: customAppUrl.trim(),
        mcpServerUrl: customAppMethod === 'mcp' ? (customAppUrl.trim() || `sse://${slug}.miras.internal/v1`) : '',
        apiKey: '',
        scope: 'read, write, tools',
      },
    };

    setIntegrations(prev => ({
      ...prev,
      [customId]: newItem,
    }));

    setCategories(prev =>
      prev.map(cat =>
        cat.id === targetCatId
          ? {
              ...cat,
              integrationIds: cat.integrationIds.includes(customId)
                ? cat.integrationIds
                : [...cat.integrationIds, customId],
            }
          : cat
      )
    );

    setExpandedCategories(prev => ({ ...prev, [targetCatId]: true }));
    setIsCustomAppModalOpen(false);
    setAddAccountCategory(null);

    if (onShowToast) {
      onShowToast(`Added "${customAppName.trim()}" to workspace`);
    }

    handleOpenSetup(newItem, customAppMethod);
  };

  // Select platform directly from catalog
  const handleSelectCatalogPreset = (preset: PlatformPreset, targetCategory: IntegrationCategory) => {
    VoiceService.triggerHaptic('medium');
    const newId = `${preset.id}_${Date.now()}`;
    const newItem: IntegrationItem = {
      id: newId,
      name: preset.name,
      categoryId: targetCategory.id,
      description: preset.description,
      iconType: preset.iconType,
      status: 'not_connected',
      activeMethod: preset.defaultMethod,
      credentials: {
        accountHandle: 'alexmorgan-ai',
        customEndpoint: preset.defaultEndpoint,
        mcpServerUrl: preset.defaultMethod === 'mcp' ? preset.defaultEndpoint : '',
        scope: preset.suggestedScope || 'read, write, tools',
        apiKey: '',
      },
    };

    setIntegrations(prev => ({
      ...prev,
      [newId]: newItem,
    }));

    setCategories(prev =>
      prev.map(cat =>
        cat.id === targetCategory.id
          ? {
              ...cat,
              integrationIds: cat.integrationIds.includes(newId)
                ? cat.integrationIds
                : [...cat.integrationIds, newId],
            }
          : cat
      )
    );

    setExpandedCategories(prev => ({ ...prev, [targetCategory.id]: true }));
    setAddAccountCategory(null);

    if (onShowToast) {
      onShowToast(`Added "${preset.name}" to ${targetCategory.name}`);
    }

    handleOpenSetup(newItem, preset.defaultMethod);
  };

  // Remove integration completely from category/workspace
  const handleDeleteIntegrationFromCategory = (integrationId: string) => {
    VoiceService.triggerHaptic('heavy');
    const target = integrations[integrationId];
    setCategories(prev =>
      prev.map(cat => ({
        ...cat,
        integrationIds: cat.integrationIds.filter(id => id !== integrationId),
      }))
    );
    setIntegrations(prev => {
      const copy = { ...prev };
      delete copy[integrationId];
      return copy;
    });
    setManageIntegration(null);
    if (onShowToast) {
      onShowToast(`Removed ${target ? target.name : 'Integration'} from workspace`);
    }
  };

  // Open "Create New Category" modal
  const handleOpenCreateCategory = () => {
    VoiceService.triggerHaptic('medium');
    setEditingCategory(null);
    setCategoryFormName('');
    setCategoryFormDesc('');
    setCategoryFormIcon('briefcase');
    setIsCategoryModalOpen(true);
  };

  // Open "Edit Category" modal
  const handleOpenEditCategory = (category: IntegrationCategory) => {
    VoiceService.triggerHaptic('light');
    setEditingCategory(category);
    setCategoryFormName(category.name);
    setCategoryFormDesc(category.description);
    setCategoryFormIcon(category.iconType);
    setIsCategoryModalOpen(true);
  };

  // Save Category (Create or Update)
  const handleSaveCategory = () => {
    if (!categoryFormName.trim()) return;

    VoiceService.triggerHaptic('medium');

    if (editingCategory) {
      setCategories(prev =>
        prev.map(cat =>
          cat.id === editingCategory.id
            ? {
                ...cat,
                name: categoryFormName.trim(),
                description: categoryFormDesc.trim() || 'Custom workspace integrations category',
                iconType: categoryFormIcon,
              }
            : cat
        )
      );
      if (onShowToast) onShowToast(`Category updated to "${categoryFormName.trim()}"`);
    } else {
      const newCatId = `custom_cat_${Date.now()}`;
      const newCategory: IntegrationCategory = {
        id: newCatId,
        name: categoryFormName.trim(),
        description: categoryFormDesc.trim() || 'Custom workspace integrations category',
        iconType: categoryFormIcon,
        integrationIds: [],
      };

      setCategories(prev => [...prev, newCategory]);
      setExpandedCategories(prev => ({ ...prev, [newCatId]: true }));
      if (onShowToast) onShowToast(`Created new category "${categoryFormName.trim()}"`);
    }

    setIsCategoryModalOpen(false);
  };

  // Delete Category
  const handleDeleteCategory = (categoryId: string) => {
    VoiceService.triggerHaptic('heavy');
    const target = categories.find(c => c.id === categoryId);
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    setIsCategoryModalOpen(false);
    if (onShowToast) onShowToast(`Removed category "${target ? target.name : 'Category'}"`);
  };

  // Open Connection Setup modal for an integration
  const handleOpenSetup = (integration: IntegrationItem, defaultMethod?: ConnectionMethod) => {
    VoiceService.triggerHaptic('medium');
    setSetupIntegration(integration);
    const initialMethod = defaultMethod || integration.activeMethod || 'mcp';
    setActiveSetupMethod(initialMethod);
    setConnectionError(null);
    setTestResult(null);
    setSimulateFailToggle(false);

    const creds = integration.credentials || {};
    setFormData({
      mcpServerUrl:
        creds.mcpServerUrl ||
        (initialMethod === 'mcp' ? `sse://${integration.id}-mcp.internal/v1` : ''),
      mcpTransport: creds.mcpTransport || 'sse',
      mcpAuthToken: creds.mcpAuthToken || `token_${integration.id}_auth_9841`,
      autoDiscoverTools: creds.autoDiscoverTools ?? true,
      apiKey: creds.apiKey || creds.personalAccessToken || `key_${integration.id}_89104`,
      accountHandle: creds.accountHandle || 'alexmorgan-ai',
      scope: creds.scope || 'read, write, tools',
    });
  };

  // Open Manage Connection modal for an already connected integration
  const handleOpenManage = (integration: IntegrationItem) => {
    VoiceService.triggerHaptic('light');
    setManageIntegration(integration);
  };

  // Test Connection
  const handleTestConnection = async () => {
    VoiceService.triggerHaptic('light');
    setIsTesting(true);
    setTestResult(null);
    setConnectionError(null);

    await new Promise(resolve => setTimeout(resolve, 800));
    setIsTesting(false);

    if (simulateFailToggle) {
      setTestResult({
        success: false,
        title: 'Connection Test Failed',
        details: [
          `Server reached: 502 Bad Gateway at ${formData.mcpServerUrl || 'API endpoint'}`,
          'Authentication failed: Invalid credentials or token expired',
          'Tip: Try switching to the other connection method below',
        ],
        timestamp: new Date().toLocaleTimeString(),
      });
      setConnectionError(
        `Could not verify ${activeSetupMethod.toUpperCase()} connection. Please check credentials or switch connection methods.`
      );
    } else {
      setTestResult({
        success: true,
        title: `${activeSetupMethod.toUpperCase()} Connection Verified`,
        details: [
          `Latency: ${Math.floor(Math.random() * 35 + 35)}ms (Optimal)`,
          activeSetupMethod === 'mcp'
            ? 'MCP Protocol: Server-Sent Events (SSE) active • 5 tools discovered'
            : 'API Scopes: Read, Write & Tool Dispatch verified',
          'Local AES-256 Vault: Securely staged for connection',
        ],
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  };

  // Complete Connection Process
  const handleCompleteConnection = async () => {
    if (!setupIntegration) return;

    VoiceService.triggerHaptic('medium');
    setIsSimulatingConnect(true);
    setConnectionError(null);

    setIntegrations(prev => ({
      ...prev,
      [setupIntegration.id]: {
        ...prev[setupIntegration.id],
        status: 'connecting',
      },
    }));

    await new Promise(resolve => setTimeout(resolve, 1100));
    setIsSimulatingConnect(false);

    if (simulateFailToggle) {
      VoiceService.triggerHaptic('heavy');
      setIntegrations(prev => ({
        ...prev,
        [setupIntegration.id]: {
          ...prev[setupIntegration.id],
          status: 'failed',
          failureReason: `${activeSetupMethod.toUpperCase()} connection handshake timed out.`,
        },
      }));
      setConnectionError(
        `Connection failed via ${activeSetupMethod.toUpperCase()}. You can retry or try the other connection method.`
      );
      if (onShowToast) {
        onShowToast(`${setupIntegration.name} connection failed`);
      }
    } else {
      VoiceService.triggerHaptic('heavy');
      const newStatus: ConnectionStatus =
        activeSetupMethod === 'mcp' ? 'connected_mcp' : 'connected_api';

      setIntegrations(prev => ({
        ...prev,
        [setupIntegration.id]: {
          ...prev[setupIntegration.id],
          status: newStatus,
          activeMethod: activeSetupMethod,
          lastConnectedAt: 'Just now',
          toolsDiscovered: activeSetupMethod === 'mcp' ? 5 : 4,
          failureReason: undefined,
          credentials: {
            ...prev[setupIntegration.id].credentials,
            ...formData,
          },
        },
      }));

      if (onShowToast) {
        onShowToast(`${setupIntegration.name} connected via ${activeSetupMethod.toUpperCase()}`);
      }

      setSetupIntegration(null);
      setAddAccountCategory(null);
    }
  };

  // Disconnect an account
  const handleDisconnect = (integrationId: string) => {
    VoiceService.triggerHaptic('heavy');
    const target = integrations[integrationId];
    setIntegrations(prev => ({
      ...prev,
      [integrationId]: {
        ...prev[integrationId],
        status: 'not_connected',
        activeMethod: undefined,
        lastConnectedAt: undefined,
        failureReason: undefined,
      },
    }));

    setManageIntegration(null);
    if (onShowToast) {
      onShowToast(`${target ? target.name : 'Account'} disconnected`);
    }
  };

  // Switch Connection Method
  const handleSwitchMethod = (targetMethod: ConnectionMethod, integration: IntegrationItem) => {
    VoiceService.triggerHaptic('medium');
    setManageIntegration(null);
    handleOpenSetup(integration, targetMethod);
  };

  return (
    <View style={styles.container}>
      {/* Top Action Bar */}
      <View style={styles.topActionBar}>
        <View style={styles.categoryCountInfo}>
          <Text style={styles.categoryCountText}>
            {categories.length} Categories • Organized Workspace
          </Text>
        </View>

        <TouchableOpacity
          style={styles.newCategoryBtn}
          onPress={handleOpenCreateCategory}
          activeOpacity={0.8}
        >
          <Plus size={12} color={colors.buttonTextDark} />
          <Text style={styles.newCategoryBtnText}>New Category</Text>
        </TouchableOpacity>
      </View>

      {/* Category List */}
      {categories.map(category => (
        <CategoryCard
          key={category.id}
          category={category}
          isExpanded={!!expandedCategories[category.id]}
          integrations={integrations}
          onToggleExpand={toggleCategory}
          onOpenEditCategory={handleOpenEditCategory}
          onOpenAddAccount={handleOpenAddAccount}
          onOpenManage={handleOpenManage}
          onOpenSetup={handleOpenSetup}
        />
      ))}

      {/* Modal: Create or Edit Category */}
      <CategoryEditModal
        visible={isCategoryModalOpen}
        editingCategory={editingCategory}
        categoryFormName={categoryFormName}
        categoryFormDesc={categoryFormDesc}
        categoryFormIcon={categoryFormIcon}
        onChangeName={setCategoryFormName}
        onChangeDesc={setCategoryFormDesc}
        onChangeIcon={setCategoryFormIcon as any}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        onDelete={handleDeleteCategory}
      />

      {/* Modal: Add Account Dialog */}
      <AddAccountModal
        addAccountCategory={addAccountCategory}
        integrations={integrations}
        catalog={POPULAR_PLATFORM_CATALOG}
        onClose={() => setAddAccountCategory(null)}
        onOpenCustomAppModal={handleOpenCustomAppModal}
        onSelectCatalogPreset={handleSelectCatalogPreset}
      />

      {/* Modal: Connection Setup Dialog */}
      <SetupIntegrationModal
        setupIntegration={setupIntegration}
        activeSetupMethod={activeSetupMethod}
        formData={formData}
        showSecrets={showSecrets}
        isTesting={isTesting}
        testResult={testResult}
        simulateFailToggle={simulateFailToggle}
        connectionError={connectionError}
        isSimulatingConnect={isSimulatingConnect}
        onClose={() => setSetupIntegration(null)}
        onChangeMethod={method => {
          VoiceService.triggerHaptic('light');
          setActiveSetupMethod(method);
          setTestResult(null);
          setConnectionError(null);
        }}
        onChangeFormData={setFormData}
        onToggleShowSecret={key =>
          setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }))
        }
        onTestConnection={handleTestConnection}
        onToggleSimulateFail={setSimulateFailToggle}
        onCompleteConnection={handleCompleteConnection}
      />

      {/* Modal: Manage Connection Dialog */}
      <ManageIntegrationModal
        manageIntegration={manageIntegration}
        onClose={() => setManageIntegration(null)}
        onSwitchMethod={handleSwitchMethod}
        onDisconnect={handleDisconnect}
        onDeleteIntegration={handleDeleteIntegrationFromCategory}
      />

      {/* Modal: Custom Platform & App Connector */}
      <CustomAppModal
        visible={isCustomAppModalOpen}
        customAppName={customAppName}
        customAppUrl={customAppUrl}
        customAppDesc={customAppDesc}
        customAppCategory={customAppCategory}
        customAppIcon={customAppIcon}
        customAppMethod={customAppMethod}
        categories={categories}
        onChangeName={setCustomAppName}
        onChangeUrl={setCustomAppUrl}
        onChangeDesc={setCustomAppDesc}
        onChangeCategory={setCustomAppCategory}
        onChangeIcon={setCustomAppIcon}
        onChangeMethod={setCustomAppMethod}
        onClose={() => setIsCustomAppModalOpen(false)}
        onSave={handleSaveCustomApp}
      />
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      gap: 12,
    },
    topActionBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 2,
      marginBottom: 2,
    },
    categoryCountInfo: {
      flex: 1,
    },
    categoryCountText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    newCategoryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 11,
      paddingVertical: 5.5,
      borderRadius: 9,
      backgroundColor: colors.primary,
    },
    newCategoryBtnText: {
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.buttonTextDark,
    },
  });
