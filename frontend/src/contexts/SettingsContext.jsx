import { useState, useEffect } from 'react';
import { SettingsContext } from './settingsContext.js';
import { 
  defaultSettings,
  loadSettingsFromStorage,
  saveSettingsToStorage
} from '../utils/settingsUtils.js';

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = loadSettingsFromStorage();
    if (Object.keys(savedSettings).length > 0) {
      setSettings(prev => ({ ...prev, ...savedSettings }));
    }
  }, []);

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    saveSettingsToStorage(settings);
  }, [settings]);

  // Apply theme to the document element so UI can react to theme changes.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.document) return;

    const apply = (theme) => {
      const root = document.documentElement;

      const setLight = () => {
        root.setAttribute('data-theme', 'light');
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      };

      const setDark = () => {
        root.setAttribute('data-theme', 'dark');
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      };

      if (theme === 'light') {
        setLight();
      } else if (theme === 'dark') {
        setDark();
      } else if (theme === 'system') {
        // follow OS preference
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        (prefersDark ? setDark : setLight)();
      }
    };

    apply(settings.theme);

    // If system, listen for changes
    let mq;
    if (settings.theme === 'system' && window.matchMedia) {
      mq = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e) => {
        const root = document.documentElement;
        if (e.matches) {
          root.setAttribute('data-theme', 'dark');
          root.classList.add('dark');
          root.style.colorScheme = 'dark';
        } else {
          root.setAttribute('data-theme', 'light');
          root.classList.remove('dark');
          root.style.colorScheme = 'light';
        }
      };
      try {
        mq.addEventListener('change', listener);
      } catch (err) {
        // fallback for older browsers
        mq.addListener(listener);
      }

      return () => {
        try { mq.removeEventListener('change', listener); } catch (e) { try { mq.removeListener(listener); } catch (e) {} }
      };
    }

    // no cleanup necessary if we didn't register a listener
    return () => {};
  }, [settings.theme]);

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
    setSettings(defaultSettings);
  };

  const contextValue = {
    settings,
    updateSetting,
    updateMultipleSettings,
    resetSettings,
    setSettings
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};