import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

export default function TemplatesView({ onLoadTemplate }) {
  const [filterCategory, setFilterCategory] = useState('all');

  const templates = [
    { id: 1, title: "Students Rank Listing", desc: "List students in computer science with high CGPA, ordered from highest to lowest.", category: "college", query: "Show top 10 students by CGPA in Computer Science" },
    { id: 2, title: "Aggregated Course Counts", desc: "Count how many courses are active in each department.", category: "college", query: "Count courses in computer science" },
    { id: 3, title: "Low Stock Inventory Alerts", desc: "Scan product catalog for low stock count (under 20 items) to notify purchasing.", category: "ecommerce", query: "Products with low stock" },
    { id: 4, title: "Customer Location Profiling", desc: "Filter active customers residing in New York city.", category: "ecommerce", query: "Customers who live in New York" },
    { id: 5, title: "Today's Appointments Calendar", desc: "Review daily appointments for patients visiting clinic today.", category: "hospital", query: "Appointments scheduled for today" },
    { id: 6, title: "Senior Patient Demographics", desc: "Filter patient records to identify individuals over 50 for senior care programs.", category: "hospital", query: "Patients older than 50" },
    { id: 7, title: "Sales Performance Rankings", desc: "Rank employee sales records by revenue collection in descending order.", category: "business", query: "Sales ordered by highest revenue" },
    { id: 8, title: "Department Employees Registry", desc: "Fetch a list of active staff employed in the Sales division.", category: "business", query: "Employees in Sales department" }
  ];

  const filterTabs = [
    { id: 'all', label: 'All Templates' },
    { id: 'college', label: 'College' },
    { id: 'ecommerce', label: 'E-Commerce' },
    { id: 'hospital', label: 'Hospital' },
    { id: 'business', label: 'Business' },
  ];

  const filteredTemplates = templates.filter(t => 
    filterCategory === 'all' || t.category === filterCategory
  );

  const getBadgeColors = (category) => {
    switch (category) {
      case 'college': return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      case 'ecommerce': return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
      case 'hospital': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'business': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="font-outfit font-extrabold text-2xl text-text-primary tracking-tight">SQL Query Templates</h2>
        <p className="text-xs text-text-muted">Quickly load pre-defined analytical queries for testing and learning database queries.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border-card pb-3">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id)}
            className={`
              px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200
              ${filterCategory === tab.id
                ? 'bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-glow'
                : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-border-card'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((t) => (
          <div 
            key={t.id} 
            className="glass-panel rounded-2xl p-5 shadow-lg border border-border-card flex flex-col justify-between items-start gap-4 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="space-y-2.5 w-full">
              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${getBadgeColors(t.category)}`}>
                {t.category}
              </span>
              <h3 className="font-outfit font-bold text-sm text-text-primary block leading-snug">
                {t.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {t.desc}
              </p>
            </div>

            <button
              onClick={() => onLoadTemplate(t.query, t.category)}
              className="w-full mt-auto flex items-center justify-center gap-1.5 bg-bg-secondary hover:bg-bg-primary hover:text-brand-purple border border-border-card text-text-primary text-xs font-semibold py-2.5 rounded-xl transition-all duration-200"
            >
              <BookOpen size={12} />
              <span>Load Template</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
