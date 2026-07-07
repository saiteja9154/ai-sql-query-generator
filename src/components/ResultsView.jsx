import React, { useState, useEffect } from 'react';
import { Copy, Download, Play, AlertCircle, CheckCircle } from 'lucide-react';
import { executeQuery } from '../api';

export default function ResultsView({ result, schemaMetadata }) {
  const [sqlCode, setSqlCode] = useState(result?.sql || '');
  const [executeResults, setExecuteResults] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reset local SQL code whenever a new translation result arrives
  useEffect(() => {
    if (result) {
      setSqlCode(result.sql);
      setExecuteResults(null); // Clear previous runs
    }
  }, [result]);

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([sqlCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query_${Date.now()}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExecute = async () => {
    setExecuting(true);
    setExecuteResults(null);
    try {
      const data = await executeQuery(sqlCode, result.detectedSchema);
      setExecuteResults(data);
    } catch (err) {
      setExecuteResults({
        success: false,
        columns: [],
        rows: [],
        error: err.message || 'Execution error'
      });
    } finally {
      setExecuting(false);
    }
  };

  if (!result) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center text-text-secondary">
        No query translated yet. Go to Home to generate SQL!
      </div>
    );
  }

  const schemaDisplayName = schemaMetadata[result.detectedSchema]?.name || result.detectedSchema;

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="font-outfit font-extrabold text-2xl text-text-primary tracking-tight">Results Dashboard</h2>
        <p className="text-xs text-text-muted">Analyze generated SQL script, view compiler insights, and execute queries in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Metadata Panel - Left */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-6 shadow-lg">
            
            {/* Question */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-text-muted block uppercase tracking-wider">Your Question</span>
              <div className="bg-bg-primary/50 text-text-primary rounded-xl px-4 py-3 text-sm font-semibold border border-border-card leading-relaxed">
                "{result.question}"
              </div>
            </div>

            {/* Explanation */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-text-muted block uppercase tracking-wider">AI Explanation</span>
              <div className="bg-bg-primary/50 text-text-secondary rounded-xl px-4 py-3.5 text-xs border border-border-card leading-relaxed">
                {result.explanation}
              </div>
            </div>

            {/* Active Schema */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-text-muted block uppercase tracking-wider">Active Schema</span>
              <div className="bg-bg-primary/50 text-text-secondary rounded-xl px-4 py-3.5 text-xs border border-border-card">
                {schemaDisplayName}
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-text-muted uppercase tracking-wider">AI Confidence</span>
                <span className="text-brand-purple">{result.confidence}%</span>
              </div>
              <div className="w-full bg-bg-primary/80 h-2.5 rounded-full overflow-hidden border border-border-card">
                <div 
                  className="bg-gradient-to-r from-brand-purple to-brand-blue h-full rounded-full transition-all duration-500" 
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* SQL Panel & Execution - Right */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SQL Editor Code Block */}
          <div className="glass-panel rounded-2xl overflow-hidden shadow-lg border border-border-card">
            
            {/* Editor Header */}
            <div className="flex items-center justify-between px-6 py-3.5 bg-bg-sidebar/60 border-b border-border-card">
              <span className="font-outfit font-bold text-sm text-text-primary">Generated SQL</span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border-card hover:bg-bg-primary transition-all duration-200 ${copied ? 'text-brand-green border-brand-green' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  <Copy size={13} />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border-card hover:bg-bg-primary text-text-secondary hover:text-text-primary transition-all duration-200"
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>

                <button
                  onClick={handleExecute}
                  disabled={executing || !sqlCode.trim()}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-brand-purple hover:bg-brand-purple/90 hover:shadow-glow text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play size={13} fill="white" />
                  <span>{executing ? 'Running...' : 'Execute'}</span>
                </button>
              </div>
            </div>

            {/* Editor Textarea */}
            <div className="p-4 bg-bg-primary/20">
              <textarea
                value={sqlCode}
                onChange={(e) => setSqlCode(e.target.value)}
                className="w-full h-44 bg-transparent text-text-primary border-none outline-none resize-none font-mono text-xs leading-relaxed focus:ring-0 focus:border-none p-2"
                style={{ fontFamily: "'Fira Code', monospace" }}
              />
            </div>
          </div>

          {/* Optimization Suggestions */}
          <div className="glass-panel rounded-2xl p-6 shadow-lg space-y-4">
            
            {/* Index suggestion */}
            {result.optimization && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-brand-purple block uppercase tracking-wider">Optimization Suggestion</span>
                <div className="bg-brand-purple/5 text-text-secondary rounded-xl px-4 py-3.5 text-xs border border-brand-purple/20 border-l-4 border-l-brand-purple leading-relaxed">
                  {result.optimization}
                </div>
              </div>
            )}

            {/* Alternatives */}
            {result.otherSuggestions && result.otherSuggestions.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-text-muted block uppercase tracking-wider">Alternative Options (Click to load)</span>
                <div className="space-y-2">
                  {result.otherSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSqlCode(suggestion)}
                      className="w-full text-left bg-bg-primary/50 text-text-secondary hover:text-text-primary hover:border-brand-purple rounded-xl px-4 py-3 text-xs font-mono border border-border-card block truncate transition-all duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mock Database Output Table */}
          {executeResults && (
            <div className="glass-panel rounded-2xl p-6 shadow-lg space-y-4 border border-border-card">
              <div className="flex items-center gap-2 pb-2 border-b border-border-card">
                {executeResults.success ? (
                  <>
                    <CheckCircle size={16} className="text-brand-green" />
                    <span className="font-outfit font-bold text-sm text-brand-green">Query Execution Success</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} className="text-red-500" />
                    <span className="font-outfit font-bold text-sm text-red-500">Query Execution Failed</span>
                  </>
                )}
              </div>

              {executeResults.success ? (
                executeResults.rows.length === 0 ? (
                  <div className="text-center py-6 text-text-muted text-xs font-mono">
                    Empty set (0 rows returned)
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border-card max-h-72">
                    <table className="w-full border-collapse text-left text-xs text-text-secondary">
                      <thead className="bg-bg-sidebar/80 text-text-primary border-b border-border-card font-semibold sticky top-0">
                        <tr>
                          {executeResults.columns.map((col, idx) => (
                            <th key={idx} className="px-4 py-3 capitalize">
                              {col.replace('_', ' ')}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-card bg-bg-primary/20">
                        {executeResults.rows.map((row, rowIdx) => (
                          <tr key={rowIdx} className="hover:bg-bg-secondary/40 transition-colors duration-150">
                            {executeResults.columns.map((col, colIdx) => (
                              <td key={colIdx} className="px-4 py-3 font-mono text-xs">
                                {row[col] !== null && row[col] !== undefined ? String(row[col]) : 'NULL'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                <div className="bg-red-500/5 text-red-400 font-mono text-xs border border-red-500/20 rounded-xl p-4 leading-relaxed overflow-x-auto">
                  {executeResults.error}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
