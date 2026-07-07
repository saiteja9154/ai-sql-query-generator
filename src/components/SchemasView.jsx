import React, { useState } from 'react';
import { Key, Link2 } from 'lucide-react';

export default function SchemasView({ schemaMetadata, defaultSchema }) {
  const [activeTab, setActiveTab] = useState(defaultSchema || 'college');

  const tabs = [
    { id: 'college', label: 'College Management' },
    { id: 'ecommerce', label: 'E-Commerce' },
    { id: 'hospital', label: 'Hospital Management' },
    { id: 'business', label: 'Business Sales' },
  ];

  const currentSchema = schemaMetadata[activeTab];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="font-outfit font-extrabold text-2xl text-text-primary tracking-tight">Database Schemas</h2>
        <p className="text-xs text-text-muted">Inspect structured schemas and table relations for different data domains.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border-card pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-glow'
                : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-border-card'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tables Grid */}
      {currentSchema && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(currentSchema.tables).map((tableName) => {
            const tableData = currentSchema.tables[tableName];
            return (
              <div 
                key={tableName} 
                className="glass-panel rounded-2xl overflow-hidden shadow-lg border border-border-card flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
              >
                
                {/* Table Header */}
                <div className="px-5 py-4 bg-bg-sidebar/40 border-b border-border-card flex items-center justify-between">
                  <div>
                    <h3 className="font-outfit font-bold text-sm text-text-primary tracking-wider uppercase">
                      {tableName}
                    </h3>
                    <span className="text-[10px] text-text-muted leading-none">
                      {tableData.description || 'Relational schema table'}
                    </span>
                  </div>
                  <span className="bg-bg-primary border border-border-card text-text-secondary px-2 py-0.5 rounded text-[10px] font-semibold">
                    {tableData.columns.length} columns
                  </span>
                </div>

                {/* Columns List */}
                <div className="p-5 divide-y divide-border-card/40">
                  {tableData.columns.map((col, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                      
                      {/* Left: Name and Key Icons */}
                      <div className="flex items-center gap-2">
                        {col.key === 'PRI' && (
                          <Key size={12} className="text-yellow-500 fill-yellow-500/10 flex-shrink-0" title="Primary Key" />
                        )}
                        {col.key === 'MUL' && (
                          <Link2 size={12} className="text-brand-blue flex-shrink-0" title="Foreign Key" />
                        )}
                        <span 
                          className="text-xs font-semibold text-text-primary hover:text-brand-purple cursor-help"
                          title={col.desc}
                        >
                          {col.name}
                        </span>
                      </div>

                      {/* Right: Type */}
                      <span className="text-[10px] font-mono text-text-muted uppercase bg-bg-primary/50 px-1.5 py-0.5 rounded border border-border-card/50">
                        {col.type}
                      </span>

                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
