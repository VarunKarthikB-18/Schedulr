import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    // Appearance
    theme: 'light', // 'light', 'dark', 'system'
    
    // Task Management
    defaultPriority: 'medium',
    autoCompleteRecurring: false,
    showCompletedTasks: true,
    taskSortBy: 'deadline',
    
    // Notifications
    enableNotifications: true,
    reminderTime: 60, // minutes before deadline
    dailyDigest: true,
    dailyDigestTime: '09:00',
    
    // Calendar
    weekStartsOn: 'Monday', // 'Sunday', 'Monday'
    defaultView: 'month',
    showWeekends: true,
    
    // Data & Privacy
    autoSave: true,
    dataRetention: 365, // days
    
    // Advanced
    enableAnalytics: false,
    enableBetaFeatures: false,
    language: 'en'
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('schedulr-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('schedulr-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateMultipleSettings = (updates) => {
    setSettings(prev => ({
      ...prev,
      ...updates
    }));
  };

  const resetSettings = () => {
    localStorage.removeItem('schedulr-settings');
    setSettings({
      theme: 'light',
      defaultPriority: 'medium',
      autoCompleteRecurring: false,
      showCompletedTasks: true,
      taskSortBy: 'deadline',
      enableNotifications: true,
      reminderTime: 60,
      dailyDigest: true,
      dailyDigestTime: '09:00',
      weekStartsOn: 'Monday',
      defaultView: 'month',
      showWeekends: true,
      autoSave: true,
      dataRetention: 365,
      enableAnalytics: false,
      enableBetaFeatures: false,
      language: 'en'
    });
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schedulr-settings.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importSettings = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings(prev => ({ ...prev, ...importedSettings }));
          resolve(importedSettings);
        } catch (error) {
          reject(new Error('Invalid settings file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const contextValue = {
    settings,
    updateSetting,
    updateMultipleSettings,
    resetSettings,
    exportSettings,
    importSettings
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};