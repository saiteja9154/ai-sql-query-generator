import React from 'react';
import { Lightbulb, Info, AlertTriangle } from 'lucide-react';

export default function HelpView() {
  return (
    <div className="space-y-6 max-w-3xl">
      
      {/* Title */}
      <div>
        <h2 className="font-outfit font-extrabold text-2xl text-text-primary tracking-tight">Help & Guides</h2>
        <p className="text-xs text-text-muted">Learn how to formulate optimal questions and work with database playground schemas.</p>
      </div>

      {/* Guide Cards */}
      <div className="space-y-6">
        
        {/* Card 1: Tips */}
        <div className="glass-panel rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 text-brand-purple pb-2 border-b border-border-card">
            <Lightbulb size={18} />
            <h3 className="font-outfit font-bold text-sm text-text-primary uppercase tracking-wider">Query Syntax Formulation Tips</h3>
          </div>
          
          <p className="text-xs text-text-secondary leading-relaxed">
            To get the highest translation accuracy from the model, structure your English queries to match real-world database filter concepts:
          </p>

          <ul className="space-y-3 pl-4 list-disc text-xs text-text-secondary">
            <li>
              <strong>Be Specific with Field Reference:</strong> Instead of asking "who is doing well?", write 
              <code className="bg-bg-primary px-1.5 py-0.5 rounded text-brand-purple mx-1 font-mono text-[10px] border border-border-card">
                "students who have cgpa &gt; 9"
              </code>.
            </li>
            <li>
              <strong>Include Date or String Constraints:</strong> For example, write 
              <code className="bg-bg-primary px-1.5 py-0.5 rounded text-brand-purple mx-1 font-mono text-[10px] border border-border-card">
                "customers who live in New York"
              </code> or 
              <code className="bg-bg-primary px-1.5 py-0.5 rounded text-brand-purple mx-1 font-mono text-[10px] border border-border-card">
                "orders placed in 2026"
              </code>.
            </li>
            <li>
              <strong>Define Aggregate Fields clearly:</strong> Use words like <strong>total revenue</strong>, <strong>count</strong>, or <strong>average</strong> to prompt correct SQL aggregate functions (SUM, COUNT, AVG).
            </li>
          </ul>
        </div>

        {/* Card 2: Relational Schema Quick Guide */}
        <div className="glass-panel rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 text-brand-blue pb-2 border-b border-border-card">
            <Info size={18} />
            <h3 className="font-outfit font-bold text-sm text-text-primary uppercase tracking-wider">Relational Schemas Quick Guide</h3>
          </div>
          
          <p className="text-xs text-text-secondary leading-relaxed">
            Make sure your default schema focus aligns with the context of your questions.
            For instance:
          </p>

          <ul className="space-y-2 pl-4 list-disc text-xs text-text-secondary">
            <li>Select <strong>College Management</strong> if querying about students, courses, or departments.</li>
            <li>Select <strong>E-Commerce</strong> if querying about customer orders, sales revenues, or inventory stock.</li>
            <li>Select <strong>Hospital Management</strong> if querying patient diagnoses or doctors appointments schedules.</li>
            <li>Select <strong>Business Sales</strong> if querying employee divisions or sales performance revenues.</li>
          </ul>

          <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-xl p-3.5 flex items-start gap-3 mt-4">
            <AlertTriangle size={16} className="text-brand-blue flex-shrink-0 mt-0.5" />
            <span className="text-[11px] text-text-secondary leading-relaxed">
              <strong>Tip:</strong> The translation engine features <em>Auto-Detection</em>. If you ask a student-related question while E-Commerce is active, the engine automatically switches context and queries the Student schema.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
