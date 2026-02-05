
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
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
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 ${bg} text-white px-6 py-3 rounded-2xl shadow-2xl z-[100] animate-in slide-in-from-bottom-4 flex items-center gap-3 font-bold`}>
      <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}`}></i>
      {message}
    </div>
  );
};

// --- Mock Data ---
const MOCK_PROGRESS: StudentProgress = {
  userId: 'user-123',
  completedExercises: ['ex-001', 'ex-002'],
  points: 450,
  lastGrade: '4ème'
};

// --- Home Component ---
const HomePage: React.FC = () => {
  const grades: GradeLevel[] = ['6ème', '5ème', '4ème', '3ème'];
  
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-20">
      <header className="text-center space-y-6">
        <div className="inline-block px-4 py-1.5 bg-math-100 text-math-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          ✨ Nouvelle Ère de l'Apprentissage
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-math-900 tracking-tighter leading-tight">
          Devenez un <span className="text-transparent bg-clip-text bg-gradient-to-r from-math-600 to-logic-500">Génie de la Géo</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
          Démontrer n'a jamais été aussi simple. Apprenez la logique, pas seulement les formules, avec notre tuteur IA.
        </p>
      </header>

      {/* Grid of Grades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {grades.map((grade) => (
          <Link
            key={grade}
            to={`/grade/${grade}`}
            className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-transparent hover:border-math-500 transition-all hover:-translate-y-2 overflow-hidden flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-math-50 rounded-3xl flex items-center justify-center text-math-600 mb-6 group-hover:scale-110 group-hover:bg-math-600 group-hover:text-white transition-all shadow-inner">
              <span className="text-3xl font-black">{grade[0]}</span>
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">{grade}</h3>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-4">Parcours Scolaire</p>
            <div className="w-10 h-1 bg-gray-100 rounded-full group-hover:w-20 group-hover:bg-math-200 transition-all"></div>
          </Link>
        ))}
      </div>

      {/* Features Showcase */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-math-800 to-math-900 rounded-5xl p-10 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform"></div>
          <h3 className="text-3xl font-black mb-4 relative z-10">Tuteur IA Gemini 3</h3>
          <p className="text-math-100 text-lg mb-8 relative z-10 opacity-90">Analyse chirurgicale de vos démonstrations en temps réel. Pas de réponses, juste du guidage.</p>
          <Link to="/astuces" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-math-900 rounded-2xl font-black hover:bg-math-100 transition-all relative z-10">
            Explorer les astuces <i className="fas fa-magic"></i>
          </Link>
        </div>
        
        <div className="bg-white rounded-5xl p-10 border border-gray-100 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">Progression Tactique</h3>
            <p className="text-gray-500 text-lg mb-8 font-medium">Suivez votre montée en grade, gagnez des points d'excellence et débloquez de nouveaux défis.</p>
          </div>
          <Link to="/progression" className="inline-flex items-center gap-3 px-8 py-4 bg-logic-500 text-white rounded-2xl font-black hover:bg-logic-600 transition-all self-start">
            Mon Tableau de Bord <i className="fas fa-chart-line"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

// --- Main App Layout ---
const App: React.FC = () => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        
        <nav className="bg-white/80 backdrop-blur-xl border-b px-6 md:px-12 py-4 flex justify-between items-center sticky top-0 z-[60] shadow-sm">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-math-700 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-math-200 group-hover:rotate-12 transition-transform">
              GΔ
            </div>
            <div className="hidden sm:block">
              <h2 className="text-2xl font-black text-math-900 tracking-tighter leading-none">GéoDémon</h2>
              <span className="text-[9px] font-black text-math-500 uppercase tracking-widest">Logic & Excellence</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-4 md:gap-8">
            <Link to="/astuces" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-math-600 transition-colors">Astuces</Link>
            <Link to="/progression" className="bg-math-50 text-math-700 px-5 py-2.5 rounded-2xl hover:bg-math-600 hover:text-white transition-all font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-inner">
              <i className="fas fa-bolt text-orange-500"></i>
              <span>{MOCK_PROGRESS.points} <span className="opacity-50">pts</span></span>
            </Link>
          </div>
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/astuces" element={<TipsPage />} />
            <Route path="/progression" element={<ProgressionPage />} />
            <Route path="/grade/:grade" element={<GradeRouteWrapper />} />
            <Route path="/exercise/:id" element={<ExerciseRouteWrapper showToast={showToast} />} />
          </Routes>
        </main>

        <footer className="bg-white py-12 px-12 border-t mt-20">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">GΔ</div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">GéoDémon Collège © 2025</p>
            </div>
            <div className="flex gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <a href="#" className="hover:text-math-600 transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-math-600 transition-colors">Mentions Légales</a>
              <a href="#" className="hover:text-math-600 transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

// --- Sub-components (Simplified Wrappers for XML brevity but fully functional) ---

const TipsPage: React.FC = () => (
  <div className="max-w-5xl mx-auto py-12 px-4">
    <GeometrySearch />
  </div>
);

const ProgressionPage: React.FC = () => {
  const completed = EXERCISES.filter(ex => MOCK_PROGRESS.completedExercises.includes(ex.id));
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-12">
      <div className="bg-white p-12 rounded-5xl shadow-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-8">
          <div className="w-32 h-32 bg-math-50 rounded-full flex items-center justify-center text-6xl shadow-inner text-math-600">
            <i className="fas fa-award"></i>
          </div>
          <div>
            <h2 className="text-4xl font-black text-gray-900">Elite Junior</h2>
            <p className="text-math-500 font-bold uppercase tracking-widest">Rang Actuel : Expert Logique</p>
          </div>
        </div>
        <div className="text-center md:text-right">
          <p className="text-sm font-black text-gray-300 uppercase mb-2">Total Points</p>
          <p className="text-6xl font-black text-math-700">{MOCK_PROGRESS.points}</p>
        </div>
      </div>

      <div className="grid gap-6">
        <h3 className="text-2xl font-black text-gray-800 border-b pb-4">Exercices Validés</h3>
        {completed.map(ex => (
          <div key={ex.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm group hover:shadow-xl transition-all">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-logic-50 text-logic-600 rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:bg-logic-500 group-hover:text-white transition-all">
                 <i className="fas fa-check"></i>
               </div>
               <div>
                 <span className="text-[10px] font-black text-math-500 uppercase tracking-widest">{ex.grade} • {ex.theme}</span>
                 <h4 className="text-xl font-black text-gray-800">{ex.title}</h4>
               </div>
            </div>
            <Link to={`/exercise/${ex.id}`} className="px-6 py-3 bg-gray-50 text-math-600 font-black rounded-xl hover:bg-math-600 hover:text-white transition-all">Revoir</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const GradePage: React.FC<{ grade: string }> = ({ grade }) => {
  const filtered = EXERCISES.filter(e => e.grade === grade);
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
       <header className="mb-12">
         <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">Niveau {grade}</h2>
         <p className="text-lg text-gray-400 font-medium italic">Choisis ton défi de démonstration.</p>
       </header>
       <div className="grid gap-4">
         {filtered.map(ex => (
           <Link key={ex.id} to={`/exercise/${ex.id}`} className="group bg-white p-8 rounded-4xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl text-gray-300 group-hover:bg-math-100 group-hover:text-math-600 transition-all">
                  <i className="fas fa-puzzle-piece"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-math-600 transition-colors">{ex.title}</h3>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">{ex.theme}</p>
                </div>
              </div>
              <i className="fas fa-chevron-right text-gray-200 group-hover:text-math-600 transition-all"></i>
           </Link>
         ))}
       </div>
    </div>
  );
};

const ExercisePage: React.FC<{ id: string; showToast: any }> = ({ id, showToast }) => {
  const navigate = useNavigate();
  const exercise = EXERCISES.find(e => e.id === id);
  const [steps, setSteps] = useState({ hypotheses: '', property: '', conclusion: '' });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!exercise) return null;

  const handleVerify = async () => {
    setLoading(true);
    const res = await geminiService.analyzeDemonstration(exercise.statement, JSON.stringify(steps), exercise.solution);
    setFeedback(res);
    setLoading(false);
    showToast("Analyse terminée !");
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 grid lg:grid-cols-2 gap-12">
      <div className="space-y-8">
        <button onClick={() => navigate(-1)} className="text-math-600 font-black uppercase tracking-widest text-sm flex items-center gap-2">
          <i className="fas fa-arrow-left"></i> Retour
        </button>
        <div className="bg-white p-10 rounded-5xl shadow-2xl border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-math-600"></div>
          <h2 className="text-3xl font-black mb-6">{exercise.title}</h2>
          <div className="text-xl leading-relaxed text-gray-700 italic border-l-4 border-math-100 pl-6 py-4">
            {exercise.statement}
          </div>
        </div>
        {exercise.geogebraId && <GeoGebraViewer materialId={exercise.geogebraId} />}
      </div>
      
      <div className="space-y-8">
        <div className="bg-white p-10 rounded-5xl shadow-2xl border border-gray-100">
           <h3 className="text-2xl font-black mb-10 flex items-center gap-4">
             <div className="w-10 h-10 bg-math-100 rounded-xl flex items-center justify-center text-math-600"><i className="fas fa-pen"></i></div>
             Ta Démonstration
           </h3>
           <DemonstrationSteps
             hypotheses={steps.hypotheses}
             property={steps.property}
             conclusion={steps.conclusion}
             onChange={(f, v) => setSteps(s => ({...s, [f]: v}))}
           />
           <button 
             onClick={handleVerify}
             disabled={loading || !steps.conclusion}
             className="w-full mt-10 py-5 bg-math-700 text-white rounded-2xl font-black text-xl hover:bg-math-800 transition-all shadow-xl shadow-math-100 disabled:opacity-50"
           >
             {loading ? <i className="fas fa-circle-notch fa-spin mr-3"></i> : <i className="fas fa-brain mr-3"></i>}
             Analyser ma preuve
           </button>
        </div>

        {feedback && (
          <div className="bg-math-900 p-8 rounded-4xl text-white animate-in zoom-in-95 duration-500 shadow-2xl">
            <h4 className="text-math-300 font-black uppercase tracking-widest text-xs mb-4">Conseils du Tuteur IA</h4>
            <div className="text-lg leading-relaxed font-medium whitespace-pre-wrap opacity-90">{feedback}</div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helpers
const GradeRouteWrapper = () => {
  const { grade } = useParams<{ grade: string }>();
  return <GradePage grade={grade!} />;
};

const ExerciseRouteWrapper = ({ showToast }: { showToast: any }) => {
  const { id } = useParams<{ id: string }>();
  return <ExercisePage id={id!} showToast={showToast} />;
};

export default App;
