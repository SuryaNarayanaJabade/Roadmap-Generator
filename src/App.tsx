import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Edit3, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Rocket, 
  Layout, 
  Save 
} from 'lucide-react';

/**
 * UTILITY: Markdown Parser
 * Simple logic to extract headers and list items into a structured Roadmap object.
 */
const parseMarkdownToRoadmap = (markdown) => {
  const lines = markdown.split('\n');
  const items = [];
  let currentCategory = "General";

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Detect Headers (Categories)
    if (trimmed.startsWith('#')) {
      currentCategory = trimmed.replace(/^#+\s*/, '');
    } 
    // Detect List Items (Topics)
    else if (trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) {
      const label = trimmed.replace(/^[-*\d.]+\s*/, '');
      items.push({
        id: crypto.randomUUID(),
        category: currentCategory,
        label,
        completed: false
      });
    }
  });

  // Group by category for rendering
  const groups = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return Object.keys(groups).map(name => ({
    name,
    topics: groups[name]
  }));
};

// INITIAL MOCK DATA
const DEFAULT_MARKDOWN = `# Frontend Mastery
- Learn HTML & CSS Basics
- Master Flexbox and Grid
- JavaScript ES6+ Features

# React Framework
- Hooks (useState, useEffect)
- Component Lifecycle
- State Management (Signals/Context)

# Advanced Tools
- Tailwind CSS
- Unit Testing with Vitest
- Performance Optimization`;

export default function App() {
  const [view, setView] = useState('input'); // 'input' or 'roadmap'
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [roadmapData, setRoadmapData] = useState([]);

  // Load roadmap data when moving to display view
  const handleGenerate = () => {
    const parsed = parseMarkdownToRoadmap(markdown);
    setRoadmapData(parsed);
    setView('roadmap');
  };

  const toggleComplete = (categoryId, topicId) => {
    setRoadmapData(prev => prev.map(cat => ({
      ...cat,
      topics: cat.topics.map(topic => 
        topic.id === topicId ? { ...topic, completed: !topic.completed } : topic
      )
    })));
  };

  const calculateProgress = () => {
    const allTopics = roadmapData.flatMap(c => c.topics);
    if (allTopics.length === 0) return 0;
    const completed = allTopics.filter(t => t.completed).length;
    return Math.round((completed / allTopics.length) * 100);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 font-sans selection:bg-purple-500/30">
      {/* Navigation Header */}
      <nav className="border-b border-white/5 bg-[#0d0d10]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center border-2 border-white/10 shadow-[4px_4px_0px_0px_rgba(124,58,237,0.3)]">
              <Rocket size={18} className="text-white" />
            </div>
            <span className="font-bold tracking-tight text-white text-lg">PathWay</span>
          </div>
          
          <button 
            onClick={() => setView(view === 'input' ? 'roadmap' : 'input')}
            className="flex items-center gap-2 text-sm font-medium hover:text-purple-400 transition-colors px-4 py-2 rounded-full bg-white/5"
          >
            {view === 'input' ? (
              <><Layout size={16} /> View Roadmap</>
            ) : (
              <><Edit3 size={16} /> Edit Path</>
            )}
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {view === 'input' ? (
          /* INPUT PAGE */
          <div className="space-y-8 animate-in fade-in duration-700">
            <header className="space-y-2">
              <h1 className="text-4xl font-black text-white">Design Your Journey</h1>
              <p className="text-slate-400">Paste your roadmap in Markdown format below. Use headers (#) for milestones and lists (-) for topics.</p>
            </header>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-[#121217] border-2 border-white/10 rounded-2xl p-1 shadow-2xl">
                <textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="# Milestone Name\n- Topic A\n- Topic B"
                  className="w-full h-96 bg-transparent text-slate-300 p-6 focus:outline-none font-mono text-sm resize-none"
                />
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-lg transition-all transform active:scale-[0.98] border-b-4 border-purple-800 shadow-xl flex items-center justify-center gap-2"
            >
              <Sparkles size={20} />
              Build Interactive Roadmap
            </button>
          </div>
        ) : (
          /* DISPLAY PAGE (CARTOON DARK UI) */
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#16161d] border-2 border-purple-500/30 p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(139,92,246,0.1)]">
                <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Total Progress</span>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-4xl font-black text-white">{calculateProgress()}%</span>
                  <div className="w-full h-3 bg-white/5 rounded-full mb-2 overflow-hidden border border-white/10">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000"
                      style={{ width: `${calculateProgress()}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-[#16161d] border-2 border-white/5 p-6 rounded-2xl flex flex-col justify-center">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Milestones</span>
                <span className="text-2xl font-bold text-white mt-1">{roadmapData.length} stages</span>
              </div>

              <div className="bg-[#16161d] border-2 border-white/5 p-6 rounded-2xl flex flex-col justify-center">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Total Topics</span>
                <span className="text-2xl font-bold text-white mt-1">
                  {roadmapData.reduce((acc, curr) => acc + curr.topics.length, 0)} items
                </span>
              </div>
            </div>

            {/* Visual Roadmap */}
            <div className="relative">
              {/* Connecting Line (Vertical) */}
              <div className="absolute left-[27px] top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500/50 via-blue-500/20 to-transparent hidden md:block"></div>

              <div className="space-y-16 relative">
                {roadmapData.map((category, catIdx) => (
                  <section key={catIdx} className="relative md:pl-20">
                    {/* Circle Milestone Marker */}
                    <div className="absolute left-0 top-0 hidden md:flex w-14 h-14 bg-[#1a1a23] border-4 border-purple-600 rounded-full items-center justify-center z-10 shadow-[0_0_20px_rgba(124,58,237,0.4)]">
                      <span className="font-black text-white text-xl">{catIdx + 1}</span>
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-2xl font-black text-white inline-block px-4 py-1 bg-white/5 rounded-lg border-l-4 border-purple-500">
                        {category.name}
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {category.topics.map((topic) => (
                          <div
                            key={topic.id}
                            onClick={() => toggleComplete(category.name, topic.id)}
                            className={`
                              group cursor-pointer relative p-5 rounded-2xl border-2 transition-all duration-300
                              ${topic.completed 
                                ? 'bg-purple-600/10 border-purple-500 shadow-[4px_4px_0px_0px_rgba(139,92,246,0.3)] scale-[0.98]' 
                                : 'bg-[#121217] border-white/10 hover:border-white/30 hover:translate-y-[-2px] hover:shadow-xl'}
                            `}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`
                                shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors
                                ${topic.completed ? 'bg-purple-500 border-purple-400' : 'border-white/20 group-hover:border-purple-500/50'}
                              `}>
                                {topic.completed ? (
                                  <CheckCircle2 size={16} className="text-white" />
                                ) : (
                                  <Circle size={16} className="text-slate-600 group-hover:text-purple-500/50" />
                                )}
                              </div>
                              <span className={`font-bold transition-colors ${topic.completed ? 'text-white' : 'text-slate-400'}`}>
                                {topic.label}
                              </span>
                            </div>
                            
                            {/* Decorative Corner */}
                            <div className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                ))}
              </div>
            </div>

            {/* Footer Finish */}
            <div className="pt-20 pb-10 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 rounded-full border border-white/10 text-slate-500 text-sm">
                    <Save size={14} />
                    Progress is saved in session memory
                </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}