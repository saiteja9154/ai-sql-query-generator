import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HomeView from './components/HomeView';
import ResultsView from './components/ResultsView';
import SchemasView from './components/SchemasView';
import HistoryView from './components/HistoryView';
import TemplatesView from './components/TemplatesView';
import SettingsView from './components/SettingsView';
import HelpView from './components/HelpView';
import { AlertCircle } from 'lucide-react';

import { schemaMetadata } from './schemaData';
import * as api from './api';

export default function App() {
  // --- UI States ---
  const [activeView, setActiveView] = useState('home');
  const [theme, setTheme] = useState(localStorage.getItem('sql-theme') || 'dark');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Translation States ---
  const [englishInput, setEnglishInput] = useState('');
  const [translationResult, setTranslationResult] = useState(null);

  // --- Persistent Settings ---
  const [settings, setSettings] = useState({
    aiModel: localStorage.getItem('set-aiModel') || 'gemini',
    defaultSchema: localStorage.getItem('set-defaultSchema') || 'college',
    dialect: localStorage.getItem('set-dialect') || 'mysql',
    showOpt: localStorage.getItem('set-showOpt') !== 'false',
    saveHistory: localStorage.getItem('set-saveHistory') !== 'false'
  });

  // --- History State ---
  const [historyList, setHistoryList] = useState([]);

  // Apply Theme on load & toggle
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('sql-theme', theme);
  }, [theme]);

  // Load history from API on start
  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = async () => {
    setHistoryLoading(true);
    try {
      const data = await api.getHistory();
      setHistoryList(data);
    } catch (err) {
      console.error("Failed to fetch history logs:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleUpdateSetting = (key, val) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: val };
      localStorage.setItem(`set-${key}`, String(val));
      return updated;
    });
  };

  // Generate translation handler
  const handleGenerateSQL = async (textToTranslate, overrideSchema, overrideDialect) => {
    const promptText = textToTranslate || englishInput;
    if (!promptText.trim()) return;

    const schemaToUse = overrideSchema || settings.defaultSchema;
    const dialectToUse = overrideDialect || settings.dialect;

    setLoading(true);
    setError(null);
    try {
      // Call translate API
      const result = await api.translateQuery(promptText, schemaToUse, dialectToUse);
      
      // Inject the original question in the result object for UI display
      const enrichedResult = {
        ...result,
        question: promptText
      };
      
      setTranslationResult(enrichedResult);

      // Save to history if configured
      if (settings.saveHistory) {
        await api.addHistory(
          promptText,
          result.sql,
          result.detectedSchema,
          dialectToUse
        );
        // Refresh local history lists
        loadHistoryData();
      }

      // Route to results dashboard view
      setActiveView('results');
    } catch (err) {
      setError("Error generating query: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Star Toggle
  const handleToggleStar = async (id) => {
    setError(null);
    try {
      await api.toggleStarHistory(id);
      loadHistoryData();
    } catch (err) {
      setError("Error toggling favorite: " + err.message);
    }
  };

  // Delete Single History entry
  const handleDeleteHistoryItem = async (id) => {
    setError(null);
    try {
      await api.deleteHistoryItem(id);
      loadHistoryData();
    } catch (err) {
      setError("Error deleting entry: " + err.message);
    }
  };

  // Clear all History entries
  const handleClearHistory = async () => {
    setError(null);
    try {
      await api.clearHistory();
      setHistoryList([]);
    } catch (err) {
      setError("Error clearing history logs: " + err.message);
    }
  };

  // Load a query back from history tab into the console inputs
  const handleLoadHistoryItem = (item) => {
    setEnglishInput(item.english_query);
    handleUpdateSetting('defaultSchema', item.schema_name);
    handleUpdateSetting('dialect', item.dialect);
    handleGenerateSQL(item.english_query, item.schema_name, item.dialect);
  };

  // Load standard preloaded templates
  const handleLoadTemplate = (query, category) => {
    setEnglishInput(query);
    handleUpdateSetting('defaultSchema', category);
    handleGenerateSQL(query, category);
  };

  // Render subviews based on SPA router state
  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return (
          <HomeView
            englishInput={englishInput}
            setEnglishInput={setEnglishInput}
            aiModel={settings.aiModel}
            setAiModel={(val) => handleUpdateSetting('aiModel', val)}
            activeSchema={settings.defaultSchema}
            onGenerate={handleGenerateSQL}
            loading={loading}
          />
        );
      case 'results':
        return (
          <ResultsView
            result={translationResult}
            schemaMetadata={schemaMetadata}
          />
        );
      case 'schemas':
        return (
          <SchemasView
            schemaMetadata={schemaMetadata}
            defaultSchema={settings.defaultSchema}
          />
        );
      case 'history':
        return (
          <HistoryView
            historyList={historyList}
            onLoadHistoryItem={handleLoadHistoryItem}
            onDeleteHistoryItem={handleDeleteHistoryItem}
            onToggleStar={handleToggleStar}
            onClearHistory={handleClearHistory}
            schemaMetadata={schemaMetadata}
            loading={historyLoading}
          />
        );
      case 'templates':
        return (
          <TemplatesView
            onLoadTemplate={handleLoadTemplate}
          />
        );
      case 'settings':
        return (
          <SettingsView
            settings={settings}
            onUpdateSetting={handleUpdateSetting}
          />
        );
      case 'help':
        return <HelpView />;
      default:
        return <div className="text-center p-8">View not found.</div>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">
      
      {/* Sidebar Panel */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        theme={theme}
        toggleTheme={toggleTheme}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Viewport Content Area */}
      <main className="flex-grow p-6 md:p-10 pt-20 md:pt-10 overflow-y-auto max-h-screen">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 flex items-center justify-between gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium shadow-md animate-fade-in">
              <div className="flex items-center gap-2.5">
                <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
              <button 
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-300 font-bold px-2 py-1 rounded transition-colors duration-150"
              >
                ✕
              </button>
            </div>
          )}
          {renderActiveView()}
        </div>
      </main>

    </div>
  );
}
