
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { EXERCISES, PROPERTIES } from './constants';
import { GradeLevel, Exercise, StudentProgress } from './types';
import { GeoGebraViewer } from './components/GeoGebraViewer';
import { DemonstrationSteps } from './components/DemonstrationSteps';
import { GeometrySearch } from './components/GeometrySearch';
import { geminiService } from './services/geminiService';

// --- Toast Component ---
const Toast: React.FC<{ message: string; type: 'success' | 'info' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg = type === 'success' ? 'bg-logic-600' : type === 'error' ? 'bg-red-600' : 'bg-math-700';
  
  return (
    <div className={`fixed bottom-8 right-8 ${bg} text-white px-6 py-3 rounded-2xl shadow-2xl z-[100] animate-in slide-in-from-right-4 flex items-center gap-3 font-bold border border-white/20 backdrop-blur-md`}>
      <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}`}></i>
      {message}
    </div>
  );
};

// --- NavItem Component ---
const NavItem: React.FC<{ to: string; icon: string; label: string; active?: boolean; onClick?: () => void }> = ({ to, icon, label, active, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
      active 
        ? 'bg-math-600 text-white shadow-lg shadow-math-200 translate-x-1' 
        : 'text-gray-500 hover:bg-math-50 hover:text-math-700'
    }`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
      active ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-math-100'
    }`}>
      <i className={`fas ${icon} text-lg`}></i>
    </div>
    <span className="font-bold text-sm tracking-tight">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>}
  </Link>
);

// --- Sidebar Component ---
const Sidebar: React.FC<{ isOpen: boolean; close: () => void }> = ({ isOpen, close }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-math-900/40 backdrop-blur-sm z-[70] lg:hidden transition-opacity"
          onClick={close}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-72 bg-white/90 backdrop-blur-2xl border-r border-gray-100 z-[80] flex flex-col transition-transform duration-500 ease-out transform lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-8">
          <Link to="/" onClick={close} className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-math-700 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-math-200 group-hover:rotate-12 transition-transform">
              GΔ
            </div>
            <div>
              <h2 className="text-xl font-black text-math-900 tracking-tighter leading-none">GéoDémon</h2>
              <span className="text-[9px] font-black text-math-500 uppercase tracking-widest">Elite Math Tutor</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 mt-2">Menu Principal</p>
          <NavItem to="/" icon="fa-house" label="Accueil" active={currentPath === '/'} onClick={close} />
          <NavItem to="/astuces" icon="fa-lightbulb" label="Bibliothèque" active={currentPath === '/astuces'} onClick={close} />
          <NavItem to="/progression" icon="fa-chart-line" label="Mon Progrès" active={currentPath === '/progression'} onClick={close} />
          
          <div className="pt-8">
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Collège</p>
            <div className="grid grid-cols-2 gap-2 px-2">
              {['6ème', '5ème', '4ème', '3ème'].map(grade => (
                <Link 
                  key={grade}
                  to={`/grade/${grade}`} 
                  onClick={close}
                  className={`py-3 rounded-xl font-black text-xs text-center transition-all ${
                    currentPath.includes(`/grade/${grade}`) 
                      ? 'bg-math-100 text-math-700 ring-2 ring-math-200' 
                      : 'bg-gray-50 text-gray-500 hover:bg-math-50'
                  }`}
                >
                  {grade}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-8 opacity-60">
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Lycée (Bientôt)</p>
            <div className="grid grid-cols-1 gap-2 px-2 pb-6">
              {['2nde', '1ère', 'Terminale'].map(grade => (
                <div 
                  key={grade}
                  className="py-3 px-4 rounded-xl font-black text-xs text-gray-400 bg-gray-50 border border-transparent flex justify-between items-center cursor-not-allowed"
                >
                  <span>{grade}</span>
                  <span className="text-[8px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full uppercase">Soon</span>
                </div>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 mt-auto border-t border-gray-100">
          <div className="bg-math-900 rounded-3xl p-5 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 bg-math-700 rounded-full flex items-center justify-center border-2 border-math-600 shadow-xl">
                <i className="fas fa-user text-sm"></i>
              </div>
              <div>
                <p className="text-[10px] font-black text-math-300 uppercase tracking-widest">Points d'élite</p>
                <p className="text-xl font-black">{MOCK_PROGRESS.points} <span className="text-xs opacity-50">PTS</span></p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

// --- Mock Data ---
const MOCK_PROGRESS: StudentProgress = {
  userId: 'user-123',
  completedExercises: ['ex-001', 'ex-002'],
  points: 450,
  lastGrade: '4ème'
};

const HomePage: React.FC = () => {
  const grades: GradeLevel[] = ['6ème', '5ème', '4ème', '3ème'];
  const lyceeGrades = ['2nde', '1ère', 'Terminale'];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 md:px-12 space-y-20">
      <header className="text-center space-y-6">
        <div className="inline-block px-4 py-1.5 bg-math-100 text-math-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
          ✨ Nouvelle Ère de l'Apprentissage
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-math-900 tracking-tighter leading-tight">
          Devenez un <span className="text-transparent bg-clip-text bg-gradient-to-r from-math-600 to-logic-500">Génie de la Géo</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
          Démontrer n'a jamais été aussi simple. Apprenez la logique avec notre tuteur IA nouvelle génération.
        </p>
      </header>

      {/* Grid of College Grades */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Cycle Collège</h2>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {grades.map((grade) => (
            <Link key={grade} to={`/grade/${grade}`} className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:border-math-500 transition-all hover:-translate-y-2 overflow-hidden flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-math-50 rounded-3xl flex items-center justify-center text-math-600 mb-6 group-hover:scale-110 group-hover:bg-math-600 group-hover:text-white transition-all shadow-inner">
                <span className="text-3xl font-black">{grade[0]}</span>
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-1">{grade}</h3>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4">Parcours Scolaire</p>
              <div className="w-10 h-1 bg-gray-100 rounded-full group-hover:w-20 group-hover:bg-math-200 transition-all"></div>
            </Link>
          ))}
        </div>
      </section>

      {/* Grid of High School Grades (Disabled/Soon) */}
      <section className="opacity-60 grayscale-[0.5]">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-black text-gray-400 tracking-tight">Cycle Secondaire</h2>
          <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Bientôt disponible</span>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {lyceeGrades.map((grade) => (
            <div key={grade} className="relative bg-white/50 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center cursor-not-allowed group">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-4 transition-all">
                <i className="fas fa-lock text-xl"></i>
              </div>
              <h3 className="text-xl font-black text-gray-500">{grade}</h3>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2 italic">Démonstrations avancées</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const App: React.FC = () => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50 font-sans selection:bg-math-100">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
          <header className="sticky top-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-gray-100 lg:hidden px-6 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-math-700 rounded-xl flex items-center justify-center text-white text-xl font-black">GΔ</div>
              <h2 className="text-xl font-black text-math-900 tracking-tighter">GéoDémon</h2>
            </Link>
            <button onClick={() => setSidebarOpen(true)} className="w-12 h-12 flex items-center justify-center text-math-700 bg-math-50 rounded-xl hover:bg-math-100 transition-colors">
              <i className="fas fa-bars-staggered text-xl"></i>
            </button>
          </header>
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/astuces" element={<TipsPage />} />
              <Route path="/progression" element={<ProgressionPage />} />
              <Route path="/grade/:grade" element={<GradeRouteWrapper />} />
              <Route path="/exercise/:id" element={<ExerciseRouteWrapper showToast={showToast} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

const TipsPage: React.FC = () => (
  <div className="max-w-5xl mx-auto py-12 px-6"><GeometrySearch /></div>
);

const ProgressionPage: React.FC = () => {
  const completed = EXERCISES.filter(ex => MOCK_PROGRESS.completedExercises.includes(ex.id));
  return (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-12">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-8 text-center md:text-left flex-col md:flex-row">
          <div className="w-32 h-32 bg-math-50 rounded-full flex items-center justify-center text-6xl shadow-inner text-math-600 border-4 border-white"><i className="fas fa-award"></i></div>
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Elite Junior</h2>
            <p className="text-math-500 font-bold uppercase tracking-widest text-xs mt-1">Rang Actuel : Expert Logique</p>
          </div>
        </div>
        <div className="text-center md:text-right">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Total Points</p>
          <p className="text-7xl font-black text-math-700 tracking-tighter leading-none">{MOCK_PROGRESS.points}</p>
        </div>
      </div>
      <div className="grid gap-6">
        <h3 className="text-2xl font-black text-gray-800 border-b pb-4 px-2">Exercices Validés</h3>
        {completed.map(ex => (
          <div key={ex.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between shadow-sm group hover:shadow-xl hover:border-math-200 transition-all gap-6">
            <div className="flex items-center gap-6 w-full">
               <div className="w-14 h-14 bg-logic-50 text-logic-600 rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:bg-logic-500 group-hover:text-white transition-all shrink-0"><i className="fas fa-check"></i></div>
               <div className="flex-grow">
                 <span className="text-[10px] font-black text-math-400 uppercase tracking-widest">{ex.grade} • {ex.theme}</span>
                 <h4 className="text-xl font-black text-gray-800 tracking-tight">{ex.title}</h4>
               </div>
            </div>
            <Link to={`/exercise/${ex.id}`} className="w-full sm:w-auto px-8 py-3 bg-gray-50 text-math-600 font-black rounded-xl hover:bg-math-600 hover:text-white transition-all text-center">Revoir</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const GradePage: React.FC<{ grade: string }> = ({ grade }) => {
  const filtered = EXERCISES.filter(e => e.grade === grade);
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12">
       <header className="mb-12">
         <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Niveau {grade}</h2>
         <p className="text-xl text-gray-400 font-medium italic leading-relaxed">Prouvez vos compétences à travers ces défis de démonstration.</p>
       </header>
       <div className="grid gap-6">
         {filtered.map(ex => (
           <Link key={ex.id} to={`/exercise/${ex.id}`} className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl text-gray-300 group-hover:bg-math-100 group-hover:text-math-600 transition-all shadow-inner"><i className="fas fa-puzzle-piece"></i></div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-math-600 transition-colors tracking-tight">{ex.title}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{ex.theme}</p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-200 group-hover:border-math-200 group-hover:text-math-600 transition-all"><i className="fas fa-arrow-right"></i></div>
           </Link>
         ))}
       </div>
    </div>
  );
};

const ExercisePage: React.FC<{ id: string; showToast: any }> = ({ id, showToast }) => {
  const navigate = useNavigate();
  const exercise = EXERCISES.find(e => e.id === id);
  const [steps, setSteps] = useState({ hypotheses: '', property: '', conclusion: '', isConverse: false });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!exercise) return null;

  const handleVerify = async () => {
    setLoading(true);
    const { hypotheses, property, conclusion, isConverse } = steps;
    const res = await geminiService.analyzeDemonstration(
      exercise.statement, 
      JSON.stringify({ hypotheses, property, conclusion }), 
      exercise.solution,
      isConverse
    );
    setFeedback(res);
    setLoading(false);
    showToast("Analyse terminée !");
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 grid lg:grid-cols-2 gap-12">
      <div className="space-y-8">
        <button onClick={() => navigate(-1)} className="text-math-600 font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:gap-4 transition-all"><i className="fas fa-arrow-left"></i> Retour</button>
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-math-600"></div>
          <h2 className="text-3xl font-black mb-6 tracking-tight">{exercise.title}</h2>
          <div className="text-xl leading-relaxed text-gray-700 italic border-l-4 border-math-100 pl-6 py-4">{exercise.statement}</div>
        </div>
        {exercise.geogebraId && <GeoGebraViewer materialId={exercise.geogebraId} />}
      </div>
      <div className="space-y-8">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100">
           <h3 className="text-2xl font-black mb-10 flex items-center gap-4">
             <div className="w-12 h-12 bg-math-100 rounded-2xl flex items-center justify-center text-math-600 shadow-inner"><i className="fas fa-pen-nib"></i></div>
             Rédaction de la Preuve
           </h3>
           <DemonstrationSteps
             hypotheses={steps.hypotheses}
             property={steps.property}
             conclusion={steps.conclusion}
             isConverse={steps.isConverse}
             onChange={(f, v) => setSteps(s => ({...s, [f]: v}))}
           />
           <button onClick={handleVerify} disabled={loading || !steps.conclusion} className="w-full mt-10 py-5 bg-math-700 text-white rounded-3xl font-black text-xl hover:bg-math-800 transition-all shadow-xl shadow-math-200 disabled:opacity-50 flex items-center justify-center">
             {loading ? <i className="fas fa-circle-notch fa-spin mr-3"></i> : <i className="fas fa-brain mr-3"></i>}
             Valider avec l'IA
           </button>
        </div>
        {feedback && (
          <div className="bg-math-900 p-8 rounded-[2.5rem] text-white animate-in zoom-in-95 duration-500 shadow-2xl relative overflow-hidden">
            <h4 className="text-math-300 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Diagnostic du Tuteur IA</h4>
            <div className="text-lg leading-relaxed font-medium whitespace-pre-wrap opacity-95">{feedback}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const GradeRouteWrapper = () => {
  const { grade } = useParams<{ grade: string }>();
  return <GradePage grade={grade!} />;
};

const ExerciseRouteWrapper = ({ showToast }: { showToast: any }) => {
  const { id } = useParams<{ id: string }>();
  return <ExercisePage id={id!} showToast={showToast} />;
};

export default App;
