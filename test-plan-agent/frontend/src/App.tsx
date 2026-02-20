import { useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { Settings, Home, FileText, Beaker } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import SettingsPage from './pages/Settings';
import TemplatesPage from './pages/Templates';

function App() {
  useEffect(() => {
    // Load templates on app start
    console.log('Test Plan AI Agent initialized');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Beaker className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">Test Plan AI</h1>
          </div>
          
          <nav className="space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <Home className="h-5 w-5" />
              <span>Generate</span>
            </NavLink>
            
            <NavLink
              to="/templates"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <FileText className="h-5 w-5" />
              <span>Templates</span>
            </NavLink>
            
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </NavLink>
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Test Plan AI Agent v1.0
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by Groq & Ollama
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
