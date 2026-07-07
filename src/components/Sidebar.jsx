import React from 'react';
import { Home, History, Database, FileText, Settings, HelpCircle, Sun, Moon, Menu } from 'lucide-react';

export default function Sidebar({ activeView, setActiveView, theme, toggleTheme, isMobileOpen, setIsMobileOpen }) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'Query History', icon: History },
    { id: 'schemas', label: 'Schemas', icon: Database },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-bg-sidebar border-b border-border-card fixed top-0 left-0 w-full z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-white font-bold text-sm shadow-md">
            AI
          </div>
          <span className="font-outfit font-semibold text-text-primary tracking-wide text-md">SQL Generator</span>
        </div>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)} 
          className="text-text-primary hover:text-brand-purple transition-colors duration-200"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Sidebar Panel */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-bg-sidebar border-r border-border-card flex flex-col justify-between p-6 transition-transform duration-300 md:translate-x-0 md:static md:h-screen
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-white font-bold text-lg shadow-glow">
              AI
            </div>
            <div>
              <h1 className="font-outfit font-bold text-text-primary tracking-wide text-md leading-none">SQL Generator</h1>
              <span className="text-xs text-text-muted">Smart Python Translator</span>
            </div>
          </div>

          {/* Menu Items */}
          <nav>
            <ul className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveView(item.id);
                        setIsMobileOpen(false); // Close sidebar on mobile
                      }}
                      className={`
                        w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
                        ${isActive 
                          ? 'bg-gradient-to-r from-brand-purple/20 to-brand-blue/20 text-brand-purple border-l-2 border-brand-purple shadow-sm' 
                          : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/50'
                        }
                      `}
                    >
                      <Icon size={18} className={isActive ? 'text-brand-purple' : 'text-text-secondary'} />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Footer */}
        <div className="space-y-6">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-border-card text-sm font-medium hover:bg-bg-secondary text-text-secondary hover:text-text-primary transition-all duration-200"
          >
            {theme === 'dark' ? (
              <>
                <Sun size={16} className="text-yellow-500 animate-spin-slow" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={16} className="text-indigo-500" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3.5 pt-4 border-t border-border-card">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold font-outfit shadow-sm">
              AJ
            </div>
            <div>
              <div className="font-semibold text-sm text-text-primary leading-tight">Alex Johnson</div>
              <span className="text-xs text-text-muted">Data Analyst</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}
    </>
  );
}
