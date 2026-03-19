
import { Sidebar } from './components/Sidebar';
import { VideoPreview } from './components/VideoPreview';
import { Timeline } from './components/Timeline';
import { useUIStore } from './store/useUIStore';
import { Menu, Wand2, Download, Settings, Github } from 'lucide-react';

function App() {
  const { isChatSidebarOpen, toggleChatSidebar } = useUIStore();

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-50 overflow-hidden font-sans">

      {/* Top Header */}
      <header className="h-14 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-4 shrink-0 z-20 shadow-sm relative">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleChatSidebar}
            className="p-2 hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-zinc-100"
            title={isChatSidebarOpen ? "Close AI Sidebar" : "Open AI Sidebar"}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 border-r border-zinc-800 pr-4">
             <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
                <Wand2 className="w-4 h-4 text-indigo-400" />
             </div>
             <span className="font-semibold text-zinc-100 tracking-tight text-lg leading-none">AI Native Editor</span>
          </div>

          <nav className="flex items-center gap-1 text-sm font-medium text-zinc-400 ml-2">
            <button className="px-3 py-1.5 hover:bg-zinc-800 hover:text-zinc-100 rounded-md transition-colors">File</button>
            <button className="px-3 py-1.5 hover:bg-zinc-800 hover:text-zinc-100 rounded-md transition-colors">Edit</button>
            <button className="px-3 py-1.5 hover:bg-zinc-800 hover:text-zinc-100 rounded-md transition-colors">View</button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center justify-center p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-md transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <a href="#" className="hidden sm:flex items-center justify-center p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-md transition-colors" title="View Source on GitHub">
            <Github className="w-4 h-4" />
          </a>
          <button className="ml-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-1.5 rounded-md transition-colors flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">

        {/* Workspace Container (Preview + Timeline) */}
        <div
          className="flex-1 flex flex-col transition-all duration-300 relative z-0"
          style={{ marginRight: isChatSidebarOpen ? '20rem' : '0' }}
        >
          <VideoPreview />
          <Timeline />
        </div>

        {/* AI Chat Sidebar */}
        <Sidebar />

      </main>

    </div>
  );
}

export default App;
