

import React, { useState } from 'react';
import { 
  BookOpen, 
  Share2, 
  Code, 
  Brain, 
  Sparkles, 
  Feather,
  ArrowRight,
  Library,
  Search,
  Eye,
  EyeOff,
  CheckCircle2,
  Compass // Icon for Techniques
} from 'lucide-react';
import { TabId, QuizQuestion } from './types';
import { CodeBlock } from './components/CodeBlock';
import { TrieVisualizer } from './components/TrieVisualizer';
import { AlgorithmLab } from './components/AlgorithmLab';
import { TechniqueLab } from './components/TechniqueLab'; // New Import
import { GeminiAssistant } from './components/GeminiAssistant'; // New Import
import { 
  VisualRoot, 
  VisualNode, 
  VisualEdge, 
  VisualMarker,
  VisualWhat,
  VisualWhy,
  VisualHow 
} from './components/VisualConcepts';
import { AutocompleteSimulator, VisualSearchConcept, VisualAutocompleteConcept } from './components/VisualApplications';
import { 
  ANATOMY_CODE_ROOT,
  ANATOMY_CODE_NODE,
  ANATOMY_CODE_EDGE,
  ANATOMY_CODE_MARKER,
  CODE_AUTOCOMPLETE_LOGIC,
  CODE_SEARCH_LOGIC,
  QUIZ_DATA 
} from './data/content';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>(TabId.INTRO);

  const renderContent = () => {
    switch (activeTab) {
      case TabId.INTRO:
        return <IntroTab onChangeTab={setActiveTab} />;
      case TabId.EXPLANATION:
        return <ExplanationTab />;
      case TabId.APPLICATIONS:
        return <ApplicationsTab />;
      case TabId.IMPLEMENTATION:
        return <ImplementationTab />;
      case TabId.TECHNIQUES: // New Case
        return <TechniquesTab />;
      case TabId.MENTAL_MODELS:
        return <MentalModelsTab />;
      case TabId.QUIZZES:
        return <QuizzesTab />;
      case TabId.SUMMARY:
        return <SummaryTab />;
      default:
        return <IntroTab onChangeTab={setActiveTab} />;
    }
  };

  const isFullScreenTab = activeTab === TabId.IMPLEMENTATION || activeTab === TabId.TECHNIQUES;

  return (
    <div className="min-h-screen pb-20 transition-colors duration-500 relative">
      {/* Cozy Header */}
      <header className="sticky top-0 z-50 bg-[#fdf6e3]/90 backdrop-blur-md border-b border-[#e7e5e4] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between overflow-x-auto no-scrollbar">
          <div 
             className="flex items-center space-x-3 mr-8 flex-shrink-0 cursor-pointer group" 
             onClick={() => setActiveTab(TabId.INTRO)}
          >
            <div className="w-10 h-10 rounded-lg bg-[#433422] flex items-center justify-center shadow-md group-hover:bg-[#5c4d43] transition-colors relative overflow-hidden">
               <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Library size={20} className="text-[#fdf6e3]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-[#433422] text-lg leading-none group-hover:text-[#d97706] transition-colors">Hidden Archive</span>
              <span className="text-xs text-[#78716c] font-serif italic">of Prefix Paths</span>
            </div>
          </div>
          
          <nav className="flex space-x-2 h-full items-center">
            <NavButton id={TabId.INTRO} label="Entrance" icon={<Sparkles size={16} />} active={activeTab} set={setActiveTab} />
            <NavButton id={TabId.EXPLANATION} label="Fundamentals" icon={<BookOpen size={16} />} active={activeTab} set={setActiveTab} />
            <NavButton id={TabId.APPLICATIONS} label="Journal" icon={<Share2 size={16} />} active={activeTab} set={setActiveTab} />
            <NavButton id={TabId.IMPLEMENTATION} label="Scripts" icon={<Code size={16} />} active={activeTab} set={setActiveTab} />
            {/* New Button */}
            <NavButton id={TabId.TECHNIQUES} label="Mastery" icon={<Compass size={16} />} active={activeTab} set={setActiveTab} />
            <NavButton id={TabId.MENTAL_MODELS} label="Vision" icon={<Brain size={16} />} active={activeTab} set={setActiveTab} />
            <NavButton id={TabId.QUIZZES} label="Trials" icon={<CheckCircle2 size={16} />} active={activeTab} set={setActiveTab} />
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main 
        className={`mx-auto px-4 py-8 animate-fade-in relative z-10 transition-all duration-500 ${
          isFullScreenTab ? 'max-w-[98vw]' : 'max-w-7xl px-6 py-12'
        }`}
      >
        {renderContent()}
      </main>

      {/* Floating Gemini Assistant */}
      <GeminiAssistant />
    </div>
  );
};

/* --- Sub-Components --- */

const NavButton = ({ id, label, icon, active, set }: { id: TabId, label: string, icon: React.ReactNode, active: TabId, set: (t: TabId) => void }) => (
  <button
    onClick={() => set(id)}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-serif transition-all duration-300 ${
      active === id 
        ? 'bg-[#433422] text-[#fdf6e3] shadow-md transform scale-105' 
        : 'text-[#57534e] hover:bg-[#e7e5e4] hover:text-[#433422]'
    }`}
  >
    <span className="hidden md:inline">{icon}</span>
    <span>{label}</span>
  </button>
);

/* --- Content Tabs --- */

const IntroTab = ({ onChangeTab }: { onChangeTab: (t: TabId) => void }) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-12">
    <div className="relative group cursor-pointer" onClick={() => onChangeTab(TabId.EXPLANATION)}>
      <div className="absolute -inset-8 bg-[#fef3c7] rounded-full blur-3xl opacity-60 animate-pulse"></div>
      <Library size={120} className="text-[#433422] relative z-10 animate-float drop-shadow-lg" strokeWidth={1} />
    </div>
    
    <div className="text-center space-y-6 max-w-3xl">
      <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#433422] leading-tight drop-shadow-sm">
        The Hidden Archive
      </h1>
      <p className="text-xl md:text-2xl text-[#8c5e3c] font-serif italic">
        "Where words are not scattered, but grown from the same root."
      </p>
    </div>

    <div className="watercolor-card p-10 max-w-2xl text-center leading-relaxed font-serif text-[#57534e] text-lg">
      <p className="mb-4">
        Welcome, Traveler. You have found the old wooden library in the heart of the autumn woods.
        Here, we do not store books in random piles. We store them by their <strong>Beginnings</strong>.
      </p>
      <p>
        Imagine a hallway labeled 'C'. Walk down it, and you find a door 'A'. Open it, and you see 'R' (Car) 
        and 'T' (Cat). This is the secret of the <strong>Trie</strong>—a way to organize the world so you never 
        walk the same path twice.
      </p>
    </div>

    <button 
      onClick={() => onChangeTab(TabId.EXPLANATION)}
      className="mt-8 group relative inline-flex items-center justify-center px-10 py-5 font-serif font-bold text-[#fdf6e3] transition-all duration-300 bg-[#433422] text-xl rounded-full hover:bg-[#5c4d43] hover:shadow-xl hover:-translate-y-1 focus:outline-none ring-offset-2 focus:ring-2 ring-[#d97706]"
    >
      <span>Enter the Archive</span>
      <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

const ExplanationTab = () => (
  <div className="space-y-32">
    <SectionHeader title="The Foundation" subtitle="Before we build, we must understand the ground." />

    <div className="space-y-24">
      <ConceptSectionLarge 
        title="What is it?" 
        desc="It is a Tree of Prefixes. Instead of storing 'TEA', 'TED', and 'TEN' as three separate strings (consuming 9 characters of space), we merge them. They all share the path T-E. We only branch out when they differ. This structural sharing is the heart of the Trie."
        visual={<VisualWhat />}
      />
      <ConceptSectionLarge 
        title="Why do we need it?" 
        desc="For efficiency. In a standard list, finding a word requires scanning every single entry (O(N)). In a Trie, the time it takes depends ONLY on the length of the word (L). Searching for 'CAT' takes 3 steps, whether the library has 10 books or 10 million books."
        visual={<VisualWhy />}
      />
      <ConceptSectionLarge 
        title="How does it look?" 
        desc="It looks like an inverted tree. The Root is at the top. Each level down represents the next character in the sequence. To spell a word, you simply climb down from parent to child, character by character, until you reach the end."
        visual={<VisualHow />}
      />
    </div>

    <div className="h-px bg-[#d97706] w-1/3 mx-auto opacity-30 rounded-full"></div>

    <SectionHeader title="Anatomy of the Archive" subtitle="The technical pieces that build the whole" />
    
    <div className="grid md:grid-cols-2 gap-12">
      <ConceptCard 
        title="The Root"
        metaphor="The Entry Point"
        technical="The starting node of the tree. It is unique because it holds no character value itself. Its only purpose is to hold references (pointers) to the first characters of all words in the dictionary."
        visual={<VisualRoot />}
        code={ANATOMY_CODE_ROOT}
      />
      
      <ConceptCard 
        title="The Node"
        metaphor="The Container"
        technical="The fundamental building block. Each Node represents a single character state. It contains a Dictionary (Hash Map) of children and a Boolean flag."
        visual={<VisualNode />}
        code={ANATOMY_CODE_NODE}
      />

      <ConceptCard 
        title="The Edge"
        metaphor="The Reference"
        technical="The connection between nodes. In implementation, this isn't a separate object, but a key-value pair in the parent node's 'children' dictionary. It points to the next node in the sequence."
        visual={<VisualEdge />}
        code={ANATOMY_CODE_EDGE}
      />

      <ConceptCard 
        title="The Marker"
        metaphor="The Boolean Flag"
        technical="A crucial property (is_end_of_word) on the Node. It differentiates between a prefix and a complete word. 'CA' is a prefix in 'CAT', so at 'A', the marker is False. But 'CAT' is a word, so at 'T', the marker is True. Without this, we couldn't distinguish words hidden within longer words."
        visual={<VisualMarker />}
        code={ANATOMY_CODE_MARKER}
      />
    </div>
  </div>
);

const ApplicationsTab = () => (
  <div className="space-y-24">
    <SectionHeader title="The Journal" subtitle="Practical applications recorded by scholars" />

    <div className="p-8 bg-[#fffbeb] border border-[#d6d3d1] rounded-lg shadow-sm">
        <div className="flex gap-4 items-start">
            <Feather className="text-[#d97706] flex-shrink-0 mt-1" />
            <div className="space-y-4">
                <h3 className="font-serif font-bold text-xl text-[#433422]">Teacher's Note: Entry #402</h3>
                <p className="font-serif text-[#57534e] italic text-lg leading-relaxed">
                  "Tries are special trees (prefix trees) that make searching and storing strings more efficient. 
                  Tries have many practical applications, such as conducting searches and providing autocomplete. 
                  It is helpful to know these common applications so that you can easily identify when a problem 
                  can be efficiently solved using a trie."
                </p>
            </div>
        </div>
    </div>

    <div className="space-y-32">
        <ApplicationCard 
          title="Conducting Searches"
          desc="The primary purpose of the structure. Unlike a Linear Search which checks every book, or a Binary Search which requires sorted books, the Trie Search walks the specific path of the letters. If the path exists and the final node is marked, the word exists."
          visual={<VisualSearchConcept />}
          code={CODE_SEARCH_LOGIC}
        />

        <ApplicationCard 
          title="Providing Autocomplete"
          desc="The most famous spell of the Trie. Because words sharing a prefix share the same physical path in memory, we can travel to the end of the user's input (e.g., 'MA') and then 'harvest' all the sub-branches (Magic, Map, Mars) instantly."
          visual={<VisualAutocompleteConcept />}
          code={CODE_AUTOCOMPLETE_LOGIC}
        />
    </div>

    <SectionHeader title="Interactive Divination" subtitle="Experience the autocomplete magic" />
    <AutocompleteSimulator />
  </div>
);

const ImplementationTab = () => (
  <AlgorithmLab />
);

const TechniquesTab = () => (
  <TechniqueLab />
);

const MentalModelsTab = () => (
  <div className="space-y-12">
    <SectionHeader title="The Living Garden" subtitle="Plant seeds (words) and watch them grow." />
    <TrieVisualizer />
  </div>
);

const QuizzesTab = () => (
  <div className="max-w-3xl mx-auto space-y-12">
    <SectionHeader title="The Trials" subtitle="Test your knowledge of the Archive" />
    
    <div className="space-y-8">
      {QUIZ_DATA.map((q, index) => (
        <QuizCard key={q.id} question={q} index={index} />
      ))}
    </div>
  </div>
);

const SummaryTab = () => (
  <div className="max-w-4xl mx-auto py-12">
    <div className="bg-[#fefce8] p-12 rounded-lg shadow-2xl border-2 border-[#e7e5e4] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-[#d97706]"></div>
      <div className="absolute bottom-0 left-0 w-full h-2 bg-[#d97706]"></div>
      
      <div className="text-center space-y-8 relative z-10">
        <Feather size={48} className="mx-auto text-[#433422]" />
        <h2 className="text-4xl font-serif font-bold text-[#433422]">The Sacred Scroll</h2>
        
        <div className="space-y-6 text-lg font-serif text-[#57534e] leading-relaxed italic">
          <p>
            You have walked the <strong>Forest of Prefix Paths</strong>.
          </p>
          <p>
            Remember: A Trie is not a list of separate words, but a single, 
            unified structure where shared beginnings are stored only once.
          </p>
          <p>
            Use it when you need to <strong>Search</strong> quickly (O(L)), 
            when you need to <strong>Autocomplete</strong> based on a prefix, 
            or when you need to filter through a dictionary efficiently.
          </p>
          <p>
            The path is the key. The destination is the value.
          </p>
        </div>

        <div className="pt-8 border-t border-[#d6d3d1]/50">
          <p className="text-sm text-[#a8a29e] font-serif">End of Entry.</p>
        </div>
      </div>
    </div>
  </div>
);

export default App;

/* --- Helper Components --- */

const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="text-center space-y-3 mb-12">
    <h2 className="text-4xl font-serif font-bold text-[#433422]">{title}</h2>
    <p className="text-lg text-[#8c5e3c] italic font-serif relative inline-block">
      <span className="relative z-10 px-4 bg-transparent">{subtitle}</span>
    </p>
  </div>
);

const ConceptSectionLarge = ({ title, desc, visual }: { title: string, desc: string, visual: React.ReactNode }) => (
  <div className="flex flex-col md:flex-row gap-8 items-center bg-[#fffbeb] p-8 rounded-xl shadow-md border border-[#e7e5e4] h-[600px]">
     <div className="md:w-1/3 space-y-4">
        <h3 className="text-3xl font-serif font-bold text-[#433422]">{title}</h3>
        <p className="text-lg text-[#57534e] font-serif leading-relaxed">{desc}</p>
     </div>
     <div className="md:w-2/3 h-full bg-white rounded-lg border border-[#e7e5e4] shadow-inner p-4 flex items-center justify-center">
        {visual}
     </div>
  </div>
);

const ConceptCard = ({ title, metaphor, technical, visual, code }: { title: string, metaphor: string, technical: string, visual: React.ReactNode, code: string }) => (
  <div className="watercolor-card p-6 flex flex-col h-full hover:scale-[1.01] transition-transform duration-300">
    <div className="mb-4">
      <h3 className="text-2xl font-serif font-bold text-[#433422]">{title}</h3>
      <span className="text-sm font-serif italic text-[#d97706]">{metaphor}</span>
    </div>
    <div className="h-[300px] mb-6 bg-[#fafaf9] rounded-lg border border-[#e7e5e4] overflow-hidden p-2">
      {visual}
    </div>
    <div className="flex-grow space-y-4">
        <p className="text-[#57534e] font-serif leading-relaxed">{technical}</p>
        <CodeBlock code={code} title={`${title} Implementation`} />
    </div>
  </div>
);

const ApplicationCard = ({ title, desc, visual, code }: { title: string, desc: string, visual: React.ReactNode, code: string }) => {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="bg-[#fffbeb] border border-[#d6d3d1] rounded-xl shadow-md overflow-hidden">
       <div className="grid md:grid-cols-2">
          <div className="p-8 flex flex-col justify-center space-y-6">
             <h3 className="text-3xl font-serif font-bold text-[#433422]">{title}</h3>
             <p className="text-lg font-serif text-[#57534e] leading-relaxed">{desc}</p>
             <button 
               onClick={() => setShowCode(!showCode)}
               className="flex items-center space-x-2 text-[#d97706] font-bold hover:text-[#b45309] transition-colors"
             >
               {showCode ? <EyeOff size={20} /> : <Eye size={20} />}
               <span>{showCode ? "Hide Logic" : "Reveal Logic"}</span>
             </button>
             {showCode && (
               <div className="animate-fade-in mt-4">
                 <CodeBlock code={code} title="Algorithm Logic" />
               </div>
             )}
          </div>
          <div className="bg-white border-l border-[#d6d3d1] p-4 h-[500px] flex items-center justify-center">
             {visual}
          </div>
       </div>
    </div>
  );
};

const QuizCard: React.FC<{ question: QuizQuestion, index: number }> = ({ question, index }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const isCorrect = selected === question.correctIndex;

  return (
    <div className="watercolor-card p-8">
      <div className="flex items-start space-x-4 mb-6">
        <span className="bg-[#433422] text-[#fdf6e3] font-bold font-serif w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0">
          {index + 1}
        </span>
        <h3 className="text-xl font-serif font-bold text-[#433422]">{question.question}</h3>
      </div>

      <div className="space-y-3 pl-12">
        {question.options.map((option, i) => (
          <button
            key={i}
            disabled={selected !== null}
            onClick={() => setSelected(i)}
            className={`w-full text-left p-4 rounded-lg font-serif text-lg transition-all ${
              selected === null 
                ? 'bg-[#fffbeb] hover:bg-[#fef3c7] border border-[#e7e5e4]' 
                : selected === i 
                  ? i === question.correctIndex 
                    ? 'bg-[#dcfce7] border-[#86efac] text-[#166534]' 
                    : 'bg-[#fee2e2] border-[#fca5a5] text-[#991b1b]'
                  : i === question.correctIndex
                    ? 'bg-[#dcfce7] border-[#86efac] text-[#166534]'
                    : 'bg-gray-50 text-gray-400 opacity-50'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {selected !== null && (
        <div className={`mt-6 ml-12 p-4 rounded-lg animate-fade-in ${isCorrect ? 'bg-[#f0fdf4] text-[#166534]' : 'bg-[#fef2f2] text-[#991b1b]'}`}>
          <p className="font-serif font-bold mb-1">{isCorrect ? "Correct!" : "Not quite."}</p>
          <p className="font-sans text-sm">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};
