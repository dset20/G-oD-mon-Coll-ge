
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
    <div className={`fixed bottom-8 right-8 ${bg} text-white px-8 py-4 rounded-3xl shadow-2xl z-[100] animate-slide-in flex items-center gap-4 font-bold border border-white/20 backdrop-blur-md`}>
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
    className={`flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-400 group relative ${
      active 
        ? 'bg-math-700 text-white shadow-xl shadow-math-200 -translate-y-0.5' 
        : 'text-gray-500 hover:bg-white hover:shadow-md hover:text-math-700'
    }`}
  >
    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
      active ? 'bg-white/20 rotate-6' : 'bg-gray-100 group-hover:bg-math-50 group-hover:rotate-6'
    }`}>
      <i className={`fas ${icon} text-lg`}></i>
    </div>
    <span className="font-extrabold text-sm tracking-tight">{label}</span>
    {active && (
      <span className="absolute right-4 w-2 h-2 bg-white rounded-full animate-pulse"></span>
    )}
  </Link>
);

// --- Sidebar Component ---
const Sidebar: React.FC<{ isOpen: boolean; close: () => void }> = ({ isOpen, close }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-math-950/30 backdrop-blur-md z-[70] lg:hidden transition-all duration-500"
          onClick={close}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-80 bg-gray-50/80 backdrop-blur-3xl border-r border-white/40 z-[80] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-10">
          <Link to="/" onClick={close} className="flex items-center gap-4 group">
            <div className="w-14 h-14 bg-gradient-to-br from-math-600 to-math-800 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-math-200 group-hover:rotate-12 transition-all">
              GΔ
            </div>
            <div>
              <h2 className="text-2xl font-black text-math-950 tracking-tighter leading-none">GéoDémon</h2>
              <span className="text-[9px] font-black text-math-500 uppercase tracking-[0.2em] mt-1 block">CTO Edition Elite</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-3 overflow-y-auto custom-scrollbar">
          <p className="px-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Explorer</p>
          <NavItem to="/" icon="fa-house" label="Dashboard" active={currentPath === '/'} onClick={close} />
          <NavItem to="/astuces" icon="fa-wand-magic-sparkles" label="Tuteur IA" active={currentPath === '/astuces'} onClick={close} />
          <NavItem to="/progression" icon="fa-trophy" label="Mon Elite" active={currentPath === '/progression'} onClick={close} />
          
          <div className="pt-10">
            <p className="px-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Parcours Collège</p>
            <div className="grid grid-cols-2 gap-3 px-2">
              {['6ème', '5ème', '4ème', '3ème'].map(grade => (
                <Link 
                  key={grade}
                  to={`/grade/${grade}`} 
                  onClick={close}
                  className={`py-4 rounded-2xl font-black text-xs text-center transition-all ${
                    currentPath.includes(`/grade/${grade}`) 
                      ? 'bg-math-600 text-white shadow-lg shadow-math-100 ring-4 ring-math-100' 
                      : 'bg-white text-gray-500 hover:shadow-md hover:text-math-700'
                  }`}
                >
                  {grade}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-10">
            <p className="px-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Cycle Lycée</p>
            <div className="space-y-3 px-2 pb-10">
              {['2nde', '1ère', 'Terminale'].map(grade => (
                <div key={grade} className="flex items-center justify-between p-4 bg-white/40 border border-white/60 rounded-2xl text-gray-400 italic font-bold text-xs cursor-not-allowed opacity-70">
                  <span>{grade}</span>
                  <i className="fas fa-lock text-[10px]"></i>
                </div>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-6">
          <div className="bg-math-950 rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-math-700 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-math-800 rounded-2xl flex items-center justify-center border border-white/10">
                  <i className="fas fa-star text-yellow-400 animate-pulse"></i>
                </div>
                <div>
                   <p className="text-[10px] font-black text-math-400 uppercase tracking-widest">Points</p>
                   <p className="text-2xl font-black">{MOCK_PROGRESS.points}</p>
                </div>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const MOCK_PROGRESS: StudentProgress = {
  userId: 'user-123',
  completedExercises: ['ex-001', 'ex-002'],
  points: 1250,
  lastGrade: '4ème'
};

const HomePage: React.FC = () => {
  const grades: GradeLevel[] = ['6ème', '5ème', '4ème', '3ème'];
  const lyceeGrades = ['2nde', '1ère', 'Terminale'];

  return (
    <div className="max-w-7xl mx-auto py-16 px-6 md:px-12 space-y-24">
      <header className="text-center relative py-10">
        <div className="absolute inset-0 bg-math-100/50 blur-[100px] -z-10 rounded-full scale-50"></div>
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white shadow-sm border border-gray-100 text-math-700 rounded-full text-[11px] font-black uppercase tracking-widest mb-10">
          <span className="flex h-2 w-2 rounded-full bg-math-500 animate-ping"></span>
          Système Élite Géométrie
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-math-950 tracking-tighter leading-[0.9] mb-8">
          Maîtrisez la <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-math-600 via-math-500 to-logic-500">Logique Pure</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-medium">
          Démontrez avec l'élégance d'un mathématicien expert grâce à notre moteur IA d'accompagnement.
        </p>
      </header>

      {/* College Section */}
      <section>
        <div className="flex items-end justify-between mb-12 px-2">
          <div>
            <h2 className="text-4xl font-black text-math-950 tracking-tighter">Parcours Collège</h2>
            <p className="text-gray-400 font-bold mt-1 uppercase text-[10px] tracking-widest">Fondamentaux & Méthodologie</p>
          </div>
          <div className="hidden md:block h-px flex-1 bg-gray-100 mx-8 mb-3"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {grades.map((grade, idx) => {
            const colors = ['bg-blue-50 text-blue-600', 'bg-green-50 text-green-600', 'bg-orange-50 text-orange-600', 'bg-purple-50 text-purple-600'];
            return (
              <Link 
                key={grade} 
                to={`/grade/${grade}`} 
                className="group glass-card p-10 rounded-5xl hover-lift text-center flex flex-col items-center"
              >
                <div className={`w-24 h-24 ${colors[idx]} rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner group-hover:rotate-12 transition-transform duration-500`}>
                  <span className="text-4xl font-black">{grade[0]}</span>
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-2">{grade}</h3>
                <div className="flex gap-1 mb-6">
                   {[1,2,3].map(s => <span key={s} className="w-1.5 h-1.5 rounded-full bg-gray-100"></span>)}
                </div>
                <div className="w-12 h-1.5 bg-gray-100 rounded-full group-hover:w-full group-hover:bg-math-500 transition-all duration-700"></div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* High School Section */}
      <section>
        <div className="flex items-end justify-between mb-12 px-2">
          <div>
             <h2 className="text-4xl font-black text-gray-300 tracking-tighter">Cycle Secondaire</h2>
             <p className="text-amber-500 font-black mt-1 uppercase text-[10px] tracking-widest flex items-center gap-2">
               <i className="fas fa-sparkles"></i> Bientôt Disponible
             </p>
          </div>
          <div className="hidden md:block h-px flex-1 bg-gray-50 mx-8 mb-3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {lyceeGrades.map((grade) => (
            <div key={grade} className="relative group p-12 rounded-5xl bg-white border border-gray-50 flex flex-col items-center text-center overflow-hidden">
               <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-[2px] z-10"></div>
               <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mb-6 z-20">
                 <i className="fas fa-lock"></i>
               </div>
               <h3 className="text-2xl font-black text-gray-400 z-20">{grade}</h3>
               <p className="text-xs text-gray-300 font-bold mt-4 z-20">Analyse complexe & démonstrations vectorielles</p>
               <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-math-100/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
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
        <div className="flex-1 flex flex-col min-w-0 lg:ml-80">
          <header className="sticky top-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-gray-100 lg:hidden px-8 py-5 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-math-700 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-math-200">GΔ</div>
              <h2 className="text-2xl font-black text-math-950 tracking-tighter">GéoDémon</h2>
            </Link>
            <button onClick={() => setSidebarOpen(true)} className="w-12 h-12 flex items-center justify-center text-math-700 bg-math-50 rounded-2xl hover:bg-math-100 transition-colors">
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
  <div className="max-w-6xl mx-auto py-12 px-6"><GeometrySearch /></div>
);

const ProgressionPage: React.FC = () => {
  const completed = EXERCISES.filter(ex => MOCK_PROGRESS.completedExercises.includes(ex.id));
  return (
    <div className="max-w-5xl mx-auto py-16 px-6 space-y-16">
      <div className="bg-white p-12 rounded-5xl shadow-2xl shadow-math-100/50 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-logic-100 rounded-full blur-[100px] -mr-32 -mt-32 opacity-30"></div>
        <div className="flex items-center gap-10 text-center md:text-left flex-col md:flex-row relative z-10">
          <div className="w-40 h-40 bg-gradient-to-tr from-math-50 to-math-100 rounded-full flex items-center justify-center text-7xl shadow-inner text-math-600 border-8 border-white"><i className="fas fa-crown"></i></div>
          <div>
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter">Math Elite</h2>
            <p className="text-math-600 font-bold uppercase tracking-[0.3em] text-xs mt-3 bg-math-50 inline-block px-4 py-1.5 rounded-full">Rang : Maître de la Logique</p>
          </div>
        </div>
        <div className="text-center md:text-right relative z-10">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Points d'Honneur</p>
          <p className="text-8xl font-black text-math-950 tracking-tighter leading-none">{MOCK_PROGRESS.points}</p>
        </div>
      </div>
      <div className="space-y-8">
        <h3 className="text-3xl font-black text-gray-900 px-4">Défis Relevés</h3>
        <div className="grid gap-6">
          {completed.map(ex => (
            <div key={ex.id} className="bg-white p-8 rounded-4xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between shadow-sm hover:shadow-2xl hover:border-math-200 transition-all gap-8">
              <div className="flex items-center gap-8 w-full">
                 <div className="w-16 h-16 bg-logic-50 text-logic-600 rounded-3xl flex items-center justify-center text-2xl shadow-inner"><i className="fas fa-check-double"></i></div>
                 <div className="flex-grow">
                   <div className="flex items-center gap-3 mb-2">
                     <span className="text-[9px] font-black text-math-400 uppercase tracking-widest">{ex.grade}</span>
                     <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                     <span className="text-[9px] font-black text-math-400 uppercase tracking-widest">{ex.theme}</span>
                   </div>
                   <h4 className="text-2xl font-bold text-gray-800 tracking-tight">{ex.title}</h4>
                 </div>
              </div>
              <Link to={`/exercise/${ex.id}`} className="w-full sm:w-auto px-10 py-4 bg-math-950 text-white font-black rounded-2xl hover:bg-math-800 transition-all text-center shadow-xl shadow-math-100">Revoir</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const GradePage: React.FC<{ grade: string }> = ({ grade }) => {
  const filtered = EXERCISES.filter(e => e.grade === grade);
  return (
    <div className="max-w-5xl mx-auto py-16 px-6 space-y-16">
       <header>
         <div className="inline-block px-4 py-1.5 bg-math-100 text-math-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Contenu Officiel</div>
         <h2 className="text-6xl font-black text-math-950 tracking-tighter mb-4">Niveau {grade}</h2>
         <p className="text-2xl text-gray-400 font-medium max-w-2xl leading-relaxed">Préparez-vous à l'excellence. Chaque exercice est une étape vers la maîtrise de la rigueur mathématique.</p>
       </header>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {filtered.map(ex => (
           <Link key={ex.id} to={`/exercise/${ex.id}`} className="group glass-card p-10 rounded-5xl hover-lift border border-gray-100 flex flex-col items-start gap-8">
              <div className="flex items-center justify-between w-full">
                <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-3xl text-gray-300 group-hover:bg-math-600 group-hover:text-white transition-all shadow-inner"><i className="fas fa-brain"></i></div>
                <div className="flex gap-1">
                  {[...Array(ex.difficulty)].map((_, i) => <i key={i} className="fas fa-star text-amber-400 text-[10px]"></i>)}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 group-hover:text-math-700 transition-colors tracking-tight leading-tight">{ex.title}</h3>
                <p className="text-[10px] font-black text-math-400 uppercase tracking-widest mt-3 mb-6 block">{ex.theme}</p>
                <div className="px-6 py-2 bg-gray-50 rounded-full text-[11px] font-black text-gray-500 group-hover:bg-math-50 group-hover:text-math-600 transition-all uppercase tracking-widest inline-block">Commencer <i className="fas fa-arrow-right ml-2"></i></div>
              </div>
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
    showToast("Expertise terminée !");
  };

  return (
    <div className="max-w-[1400px] mx-auto py-16 px-6 grid xl:grid-cols-2 gap-16 items-start">
      <div className="space-y-12">
        <button onClick={() => navigate(-1)} className="group text-math-600 font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:gap-5 transition-all">
          <i className="fas fa-arrow-left"></i> Retour aux exercices
        </button>
        <div className="bg-white p-12 rounded-5xl shadow-2xl border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-3 h-full bg-math-600"></div>
          <span className="text-[10px] font-black text-math-400 uppercase tracking-widest mb-4 block">Énoncé du problème</span>
          <h2 className="text-4xl font-black mb-8 tracking-tighter text-math-950">{exercise.title}</h2>
          <div className="text-2xl leading-relaxed text-gray-700 italic border-l-8 border-math-50 pl-8 py-6 bg-gray-50/50 rounded-r-3xl">{exercise.statement}</div>
        </div>
        {exercise.geogebraId && (
          <div className="rounded-5xl overflow-hidden shadow-2xl border-4 border-white">
            <GeoGebraViewer materialId={exercise.geogebraId} />
          </div>
        )}
      </div>
      <div className="space-y-12 sticky top-24">
        <div className="bg-white p-12 rounded-5xl shadow-2xl border border-gray-100">
           <h3 className="text-3xl font-black mb-12 flex items-center gap-6">
             <div className="w-14 h-14 bg-math-950 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-math-200"><i className="fas fa-feather-pointed"></i></div>
             Démonstration Élite
           </h3>
           <DemonstrationSteps
             hypotheses={steps.hypotheses}
             property={steps.property}
             conclusion={steps.conclusion}
             isConverse={steps.isConverse}
             onChange={(f, v) => setSteps(s => ({...s, [f]: v}))}
           />
           <button 
             onClick={handleVerify} 
             disabled={loading || !steps.conclusion} 
             className="w-full mt-12 py-6 bg-math-600 text-white rounded-[2rem] font-black text-xl hover:bg-math-700 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-math-200 disabled:opacity-50 flex items-center justify-center group"
           >
             {loading ? <i className="fas fa-circle-notch fa-spin mr-4"></i> : <i className="fas fa-brain-circuit mr-4 group-hover:rotate-12 transition-transform"></i>}
             Analyser la Logique
           </button>
        </div>
        {feedback && (
          <div className="bg-math-950 p-10 rounded-5xl text-white animate-slide-in shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-math-700 blur-[80px] opacity-20"></div>
            <h4 className="text-math-400 font-black uppercase tracking-[0.3em] text-[10px] mb-6 flex items-center gap-3">
              <i className="fas fa-user-ninja text-math-500"></i> Correction de l'IA GéoDémon
            </h4>
            <div className="text-xl leading-relaxed font-medium whitespace-pre-wrap opacity-95">{feedback}</div>
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
