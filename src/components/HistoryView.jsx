import React, { useState } from 'react';
import { Trash2, Star, Search, RefreshCw, ExternalLink } from 'lucide-react';

export default function HistoryView({ 
  historyList, 
  onLoadHistoryItem, 
  onDeleteHistoryItem, 
  onToggleStar, 
  onClearHistory,
  schemaMetadata,
  loading
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter lists based on search
  const filteredList = historyList.filter(item => 
    item.english_query.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sql_query.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Title & Clear Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-text-primary tracking-tight">Query History</h2>
          <p className="text-xs text-text-muted">Review, star, and reload previously generated SQL translations stored in SQLite.</p>
        </div>
        
        {historyList.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete all history entries from the SQLite database?")) {
                onClearHistory();
              }
            }}
            className="self-start sm:self-center px-4 py-2 border border-red-500/20 text-red-500 hover:bg-red-500/5 rounded-xl text-xs font-semibold transition-all duration-200"
          >
            Clear History
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="glass-panel rounded-2xl p-3 shadow-lg flex items-center gap-3">
        <Search size={18} className="text-text-muted ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by english query or SQL code..."
          className="bg-transparent border-none outline-none text-sm text-text-primary placeholder-text-muted w-full focus:ring-0"
        />
      </div>

      {/* Main List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-text-muted text-xs flex items-center justify-center gap-2">
            <RefreshCw size={14} className="animate-spin" />
            <span>Loading database logs...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center text-text-muted text-xs">
            {searchQuery ? 'No queries match your search filter.' : 'No query history found in SQLite database.'}
          </div>
        ) : (
          filteredList.map((item) => {
            const schemaName = schemaMetadata[item.schema_name]?.name || item.schema_name;
            return (
              <div 
                key={item.id} 
                className="glass-panel rounded-2xl p-5 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-border-card hover:border-brand-purple/35 transition-all duration-200"
              >
                
                {/* Info Text */}
                <div className="space-y-2 flex-grow min-w-0">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => onToggleStar(item.id)}
                      className={`text-sm ${item.starred ? 'text-yellow-500 hover:text-yellow-600' : 'text-text-muted hover:text-text-primary'} transition-colors duration-200`}
                    >
                      <Star size={16} fill={item.starred ? 'currentColor' : 'none'} />
                    </button>
                    <span className="font-semibold text-text-primary text-sm truncate block leading-none">
                      {item.english_query}
                    </span>
                  </div>

                  {/* SQL Snippet preview */}
                  <div className="bg-bg-primary/40 rounded-lg p-2.5 border border-border-card/50">
                    <code className="font-mono text-[11px] text-text-secondary whitespace-pre-wrap block">
                      {item.sql_query}
                    </code>
                  </div>

                  {/* Badges metadata */}
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-text-muted">
                    <span className="bg-bg-primary border border-border-card px-2 py-0.5 rounded">
                      Schema: {schemaName}
                    </span>
                    <span className="bg-bg-primary border border-border-card px-2 py-0.5 rounded uppercase font-semibold">
                      Dialect: {item.dialect}
                    </span>
                    <span>
                      Time: {item.timestamp}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 self-end md:self-center">
                  <button
                    onClick={() => onLoadHistoryItem(item)}
                    className="flex items-center gap-1.5 bg-bg-secondary hover:bg-bg-primary border border-border-card text-text-primary hover:text-brand-purple px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200"
                  >
                    <ExternalLink size={12} />
                    <span>Load Query</span>
                  </button>

                  <button
                    onClick={() => onDeleteHistoryItem(item.id)}
                    className="text-text-muted hover:text-red-500 border border-border-card hover:border-red-500/25 p-2 rounded-xl transition-all duration-200"
                    title="Delete history item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
