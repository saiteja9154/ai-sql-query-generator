import React from 'react';

export default function SettingsView({ settings, onUpdateSetting }) {
  return (
    <div className="space-y-6 max-w-3xl">
      
      {/* Title */}
      <div>
        <h2 className="font-outfit font-extrabold text-2xl text-text-primary tracking-tight">Application Settings</h2>
        <p className="text-xs text-text-muted">Customize model defaults, SQL dialects, and local session preferences.</p>
      </div>

      {/* Settings Panel */}
      <div className="glass-panel rounded-2xl p-6 shadow-lg divide-y divide-border-card">
        
        {/* Model Select */}
        <div className="py-5 first:pt-0 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1 md:max-w-md">
            <label className="font-outfit font-bold text-sm text-text-primary block">AI Model Engine</label>
            <span className="text-xs text-text-secondary leading-relaxed block">
              Choose which machine learning engine model evaluates your English questions to map schemas.
            </span>
          </div>
          <select
            value={settings.aiModel}
            onChange={(e) => onUpdateSetting('aiModel', e.target.value)}
            className="w-full md:w-56 bg-bg-primary border border-border-card text-text-primary rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-purple transition-all duration-200"
          >
            <option value="gpt4">GPT-4 Turbo (Recommended)</option>
            <option value="gemini">Gemini 1.5 Flash</option>
            <option value="claude">Claude 3.5 Sonnet</option>
          </select>
        </div>

        {/* Target Schema */}
        <div className="py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1 md:max-w-md">
            <label className="font-outfit font-bold text-sm text-text-primary block">Default Target Schema</label>
            <span className="text-xs text-text-secondary leading-relaxed block">
              The primary database relational schema catalog used during general query translations.
            </span>
          </div>
          <select
            value={settings.defaultSchema}
            onChange={(e) => onUpdateSetting('defaultSchema', e.target.value)}
            className="w-full md:w-56 bg-bg-primary border border-border-card text-text-primary rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-purple transition-all duration-200"
          >
            <option value="college">College Management</option>
            <option value="ecommerce">E-Commerce</option>
            <option value="hospital">Hospital Management</option>
            <option value="business">Business Sales</option>
          </select>
        </div>

        {/* Dialect Select */}
        <div className="py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1 md:max-w-md">
            <label className="font-outfit font-bold text-sm text-text-primary block">SQL Dialect Language</label>
            <span className="text-xs text-text-secondary leading-relaxed block">
              Formats generation syntax structure for specific database engines.
            </span>
          </div>
          <select
            value={settings.dialect}
            onChange={(e) => onUpdateSetting('dialect', e.target.value)}
            className="w-full md:w-56 bg-bg-primary border border-border-card text-text-primary rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-purple transition-all duration-200"
          >
            <option value="mysql">MySQL Dialect</option>
            <option value="postgres">PostgreSQL Dialect</option>
            <option value="sqlite">SQLite Dialect</option>
            <option value="mssql">Transact-SQL (SQL Server)</option>
          </select>
        </div>

        {/* Toggle Optimization */}
        <div className="py-5 flex items-center justify-between gap-4">
          <div className="space-y-1 max-w-md">
            <label className="font-outfit font-bold text-sm text-text-primary block">Show Optimization Advice</label>
            <span className="text-xs text-text-secondary leading-relaxed block">
              Enable compiler optimization index recommendations for filtered queries.
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={settings.showOpt}
              onChange={(e) => onUpdateSetting('showOpt', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-bg-primary border border-border-card rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-text-secondary peer-checked:after:bg-white after:border-border-card after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>

        {/* Toggle History */}
        <div className="py-5 last:pb-0 flex items-center justify-between gap-4">
          <div className="space-y-1 max-w-md">
            <label className="font-outfit font-bold text-sm text-text-primary block">Save Query History</label>
            <span className="text-xs text-text-secondary leading-relaxed block">
              Persist query translation runs in the SQLite backend database logs.
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={settings.saveHistory}
              onChange={(e) => onUpdateSetting('saveHistory', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-bg-primary border border-border-card rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-text-secondary peer-checked:after:bg-white after:border-border-card after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple" />
          </label>
        </div>

      </div>

    </div>
  );
}
