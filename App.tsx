
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { EXERCISES, PROPERTIES } from './constants';
import { GradeLevel, Exercise, StudentProgress } from './types';
import { GeoGebraViewer } from './components/GeoGebraViewer';
import { DemonstrationSteps } from './components/DemonstrationSteps';
import { GeometrySearch } from './components/GeometrySearch';
import { geminiService } from './services/geminiService';

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
  const completed = EXERCISES.filter(ex => MOCK_PROGRESS.completedExercises.includes(ex.id));

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-math-800 mb-6 tracking-tighter italic">GéoDémon</h1>
        <p className="text-lg md:text-2xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Le tuteur intelligent qui transforme chaque élève en <span className="text-math-600 font-bold underline decoration-math-200">maître de la logique</span> géométrique.
        </p>
      </div>

      {/* Quick Search Section */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-math-600 to-logic-600 p-1 rounded-[2rem] md:rounded-[3rem] shadow-2xl">
          <div className="bg-white p-6 md:p-10 rounded-[1.8rem] md:rounded-[2.8rem] flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Un doute sur une méthode ?</h2>
              <p className="text-gray-500 font-medium text-base md:text-lg">Demande au tuteur IA une astuce basée sur les meilleurs sites de maths.</p>
              <Link to="/astuces" className="mt-6 inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-math-600 text-white rounded-2xl font-black hover:bg-math-700 transition-all shadow-lg shadow-math-200">
                <i className="fas fa-search"></i> Lancer une recherche d'astuces
              </Link>
            </div>
            <div className="hidden md:flex w-48 h-48 bg-math-50 rounded-full items-center justify-center text-8xl text-math-200">
               <i className="fas fa-robot animate-bounce"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access: Completed Exercises Section */}
      {completed.length > 0 && (
        <section className="mb-16 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 flex items-center gap-3">
              <i className="fas fa-history text-logic-500"></i>
              Tes Dernières Réussites
            </h2>
            <Link to="/progression" className="text-math-600 font-bold hover:underline flex items-center gap-2 text-xs md:text-sm uppercase tracking-widest">
              Voir tout <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completed.slice(0, 3).map((ex) => (
              <div key={ex.id} className="bg-white p-6 rounded-2xl border border-logic-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3">
                  <i className="fas fa-check-circle text-logic-500 text-xl"></i>
                </div>
                <span className="text-xs font-black text-math-500 uppercase mb-2 block">{ex.grade} • {ex.theme}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-1">{ex.title}</h3>
                <Link 
                  to={`/exercise/${ex.id}`} 
                  className="inline-flex items-center gap-2 text-math-600 font-bold text-sm group-hover:gap-3 transition-all"
                >
                  Revoir l'exercice <i className="fas fa-chevron-right"></i>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {grades.map((grade) => (
          <Link
            key={grade}
            to={`/grade/${grade}`}
            className="group p-8 md:p-10 bg-white rounded-3xl shadow-xl border-4 border-transparent hover:border-math-500 transition-all transform hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-math-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="text-4xl md:text-5xl font-black text-math-600 tracking-tighter">{grade}</span>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mt-2">Niveau Collège</h3>
                <p className="text-gray-500 mt-2 font-medium text-sm md:text-base">Explorer les théorèmes et démonstrations de {grade}.</p>
              </div>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-math-100 rounded-2xl flex items-center justify-center text-math-600 group-hover:bg-math-600 group-hover:text-white transition-all shadow-inner">
                <i className="fas fa-compass text-xl md:text-2xl"></i>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// --- Tips Search Page ---
const TipsPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <Link to="/" className="text-math-600 hover:underline mb-8 inline-flex items-center font-bold uppercase tracking-widest text-sm">
        <i className="fas fa-arrow-left mr-2"></i> Accueil
      </Link>
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter">Bibliothèque d'Astuces</h2>
        <p className="text-lg md:text-xl text-gray-500 font-medium">Recherche une technique de démonstration guidée par l'IA.</p>
      </div>
      <GeometrySearch />
    </div>
  );
};

// --- Progression Page ---
const ProgressionPage: React.FC = () => {
  const completed = EXERCISES.filter(ex => MOCK_PROGRESS.completedExercises.includes(ex.id));
  const totalExercises = EXERCISES.length;
  const progressPercent = Math.round((completed.length / totalExercises) * 100);

  const getRank = (points: number) => {
    if (points > 1000) return { label: 'Maître Géomètre', color: 'text-purple-600', icon: 'fa-crown', bg: 'bg-purple-50' };
    if (points > 400) return { label: 'Expert Logique', color: 'text-math-600', icon: 'fa-award', bg: 'bg-math-50' };
    return { label: 'Apprenti Démonstrateur', color: 'text-gray-600', icon: 'fa-book-reader', bg: 'bg-gray-50' };
  };

  const rank = getRank(MOCK_PROGRESS.points);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
          <div className={`w-24 h-24 md:w-32 md:h-32 ${rank.bg} rounded-full flex items-center justify-center text-4xl md:text-6xl shadow-inner border-4 border-white`}>
            <i className={`fas ${rank.icon} ${rank.color}`}></i>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-1">Tableau de Bord</h2>
            <p className={`font-black uppercase tracking-[0.2em] text-xs md:text-sm ${rank.color}`}>{rank.label}</p>
          </div>
        </div>
        <div className="flex gap-6">
           <div className="text-center">
             <p className="text-xs font-black text-gray-400 uppercase mb-1">Score Total</p>
             <p className="text-3xl md:text-4xl font-black text-math-600">{MOCK_PROGRESS.points} <span className="text-lg">pts</span></p>
           </div>
           <div className="h-12 w-[2px] bg-gray-100 self-center"></div>
           <div className="text-center">
             <p className="text-xs font-black text-gray-400 uppercase mb-1">Exercices</p>
             <p className="text-3xl md:text-4xl font-black text-logic-600">{completed.length}</p>
           </div>
        </div>
      </div>

      <div className="mb-16">
        <div className="flex justify-between mb-4 items-end">
          <h3 className="text-lg md:text-xl font-bold text-gray-800">Maîtrise Globale</h3>
          <span className="text-xl md:text-2xl font-black text-math-600">{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-5 md:h-6 p-1 overflow-hidden shadow-inner border border-gray-200">
          <div 
            className="bg-gradient-to-r from-math-500 to-logic-500 h-full rounded-full transition-all duration-1000 relative" 
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,transparent_70%)] animate-pulse"></div>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Exercices Terminés</h3>
          <span className="bg-logic-100 text-logic-700 px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-bold">{completed.length} succès</span>
        </div>
        
        <div className="grid gap-4">
          {completed.length > 0 ? (
            completed.map((ex) => (
              <div key={ex.id} className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-md transition-all group gap-4">
                <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-logic-50 text-logic-600 rounded-2xl flex items-center justify-center text-lg md:text-xl shadow-inner group-hover:bg-logic-500 group-hover:text-white transition-colors">
                    <i className="fas fa-check"></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-math-100 text-math-700 rounded text-[9px] md:text-[10px] font-bold uppercase">{ex.grade}</span>
                      <span className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">{ex.theme}</span>
                    </div>
                    <h4 className="text-lg md:text-xl font-bold text-gray-800">{ex.title}</h4>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-gray-400 uppercase">Validé avec succès</p>
                    <p className="text-xs text-logic-500 font-bold italic">Excellent travail !</p>
                  </div>
                  <Link 
                    to={`/exercise/${ex.id}`} 
                    className="w-full md:w-auto text-center px-6 py-3 bg-gray-50 text-math-600 rounded-xl hover:bg-math-600 hover:text-white transition-all font-bold text-sm shadow-sm"
                  >
                    Revoir <i className="fas fa-external-link-alt ml-2"></i>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 p-12 md:p-20 rounded-3xl text-center border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6 text-2xl md:text-3xl">
                <i className="fas fa-tasks"></i>
              </div>
              <h4 className="text-lg md:text-xl font-bold text-gray-400">Aucun exercice terminé pour l'instant</h4>
              <p className="text-gray-400 mt-2 text-sm md:text-base">Choisis ton niveau sur l'accueil et commence à pratiquer !</p>
              <Link to="/" className="mt-8 inline-block px-8 py-3 bg-math-600 text-white rounded-xl font-bold hover:bg-math-700 transition-colors shadow-lg">
                Voir les exercices
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// --- Grade Exercises Component ---
const GradePage: React.FC<{ grade: string }> = ({ grade }) => {
  const filtered = EXERCISES.filter((e) => e.grade === grade);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link to="/" className="text-math-600 hover:underline mb-8 inline-flex items-center font-bold uppercase tracking-widest text-xs md:text-sm">
        <i className="fas fa-arrow-left mr-2"></i> Retour à l'accueil
      </Link>
      
      <div className="bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-gray-100 mb-12 relative overflow-hidden text-center md:text-left">
        <div className="absolute top-0 right-0 w-64 h-64 bg-math-50 rounded-full -mr-20 -mt-20 opacity-30"></div>
        <div className="relative z-10">
           <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter">Parcours {grade}</h2>
           <p className="text-base md:text-lg text-gray-500 font-medium">Sélectionne un défi pour tester ta rigueur mathématique.</p>
        </div>
      </div>
      
      {filtered.length === 0 ? (
        <div className="bg-yellow-50 p-10 rounded-3xl text-yellow-800 border-2 border-yellow-200 flex flex-col items-center gap-4 text-center">
          <i className="fas fa-hammer text-4xl mb-2"></i>
          <div>
            <p className="text-xl font-black">Travaux en cours !</p>
            <p className="font-medium text-yellow-700/80">Nous préparons de nouveaux exercices pour le niveau {grade}.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {filtered.map((ex) => {
            const isCompleted = MOCK_PROGRESS.completedExercises.includes(ex.id);
            return (
              <Link
                key={ex.id}
                to={`/exercise/${ex.id}`}
                className={`group block p-6 md:p-8 bg-white rounded-3xl shadow-sm border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${isCompleted ? 'border-logic-200 bg-logic-50/10' : 'border-transparent'}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl transition-all ${isCompleted ? 'bg-logic-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-math-500 group-hover:text-white'}`}>
                      {isCompleted ? <i className="fas fa-check"></i> : <i className="fas fa-puzzle-piece"></i>}
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-math-600 transition-colors leading-tight">{ex.title}</h3>
                      <div className="flex items-center gap-3 mt-1 md:mt-2">
                        <span className="text-gray-400 text-[10px] md:text-sm font-bold uppercase tracking-wider">{ex.theme}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-orange-400 text-xs md:text-sm font-bold">
                          {'★'.repeat(ex.difficulty)}{'☆'.repeat(3 - ex.difficulty)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     {isCompleted && <span className="hidden md:inline-block text-logic-600 font-black text-xs uppercase bg-logic-100 px-3 py-1 rounded-full">Réussi</span>}
                     <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-math-100 group-hover:text-math-600 transition-all">
                        <i className="fas fa-arrow-right text-sm"></i>
                     </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- Exercise Solver Component ---
const ExercisePage: React.FC<{ id: string }> = ({ id }) => {
  const navigate = useNavigate();
  const exercise = EXERCISES.find((e) => e.id === id);
  const [steps, setSteps] = useState({ hypotheses: '', property: '', conclusion: '' });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!exercise) return <div className="p-10 text-center">Exercice introuvable.</div>;

  const handleStepChange = (field: string, value: string) => {
    setSteps(prev => ({ ...prev, [field]: value }));
  };

  const handleVerify = async () => {
    setLoading(true);
    const studentFullText = `On sait que: ${steps.hypotheses}. Or si ${steps.property} alors... Donc: ${steps.conclusion}.`;
    const res = await geminiService.analyzeDemonstration(
      exercise.statement,
      studentFullText,
      exercise.solution
    );
    setFeedback(res);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 md:py-8 px-4">
      <button onClick={() => navigate(-1)} className="text-math-600 hover:underline mb-6 md:mb-8 flex items-center font-bold uppercase tracking-widest text-xs md:text-sm">
        <i className="fas fa-arrow-left mr-2"></i> Quitter
      </button>

      <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
        {/* Left: Statement & Figure */}
        <div className="space-y-6 md:space-y-8 order-1">
          <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 md:p-8 text-math-50 text-6xl md:text-8xl opacity-20 -mr-4 -mt-4">
              <i className="fas fa-shapes"></i>
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 md:mb-6">{exercise.title}</h2>
              <div className="text-lg md:text-xl leading-relaxed text-gray-700 bg-math-50/50 p-6 md:p-8 rounded-2xl md:rounded-3xl border-2 border-dashed border-math-200">
                <i className="fas fa-quote-left text-math-300 mb-2 md:mb-4 block text-xl md:text-2xl"></i>
                {exercise.statement}
              </div>
            </div>
          </div>
          
          {exercise.geogebraId && (
            <div className="shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden border-4 md:border-8 border-white bg-white">
              <GeoGebraViewer materialId={exercise.geogebraId} />
            </div>
          )}
          
          <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100">
            <h3 className="font-black text-gray-800 mb-4 md:mb-6 flex items-center text-lg md:text-xl">
              <i className="fas fa-toolbox text-math-500 mr-3"></i> Aide Mémoire
            </h3>
            <div className="space-y-4">
              {PROPERTIES.filter(p => p.id === exercise.solution.propertyId).map(p => (
                <div key={p.id} className="p-4 md:p-6 bg-math-50 rounded-xl md:rounded-2xl border-l-8 border-math-400">
                  <p className="text-[10px] md:text-xs font-black text-math-700 uppercase mb-1 md:mb-2 tracking-widest">{p.name}</p>
                  <p className="text-base md:text-lg italic text-gray-700 leading-snug">"{p.statement}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Redaction & AI */}
        <div className="space-y-6 md:space-y-8 order-2">
          <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gray-100 ring-1 ring-gray-200">
            <div className="flex justify-between items-center mb-6 md:mb-10">
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center">
                <i className="fas fa-pen-nib text-math-600 mr-3 md:mr-4"></i> Rédaction
              </h3>
              <div className="flex gap-1.5 md:gap-2">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-400"></div>
              </div>
            </div>
            
            <DemonstrationSteps
              hypotheses={steps.hypotheses}
              property={steps.property}
              conclusion={steps.conclusion}
              onChange={handleStepChange}
            />
            
            <button
              onClick={handleVerify}
              disabled={loading || !steps.hypotheses || !steps.property || !steps.conclusion}
              className="mt-8 md:mt-10 w-full py-4 md:py-5 bg-gradient-to-r from-math-600 to-math-800 text-white font-black text-lg md:text-xl rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3 md:gap-4"
            >
              {loading ? (
                <><i className="fas fa-circle-notch fa-spin"></i> Analyse...</>
              ) : (
                <><i className="fas fa-brain"></i> Soumettre</>
              )}
            </button>
          </div>

          {feedback && (
            <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl border-4 border-math-100 animate-in zoom-in-95 duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-math-600"></div>
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-math-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl shadow-lg shadow-math-200">
                  <i className="fas fa-user-graduate"></i>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-math-800 tracking-tight">Conseils du Tuteur</h3>
                  <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Feedback instantané</p>
                </div>
              </div>
              <div className="text-base md:text-lg text-gray-700 leading-relaxed bg-math-50/80 p-5 md:p-8 rounded-2xl md:rounded-3xl border border-math-100 italic font-medium whitespace-pre-wrap">
                {feedback}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Layout Wrapper ---
const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-math-200 selection:text-math-900">
        <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b px-4 md:px-8 py-3 md:py-5 flex justify-between items-center sticky top-0 z-50">
          <Link to="/" className="flex items-center gap-3 md:gap-4 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-math-600 to-math-800 rounded-xl md:rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl font-black group-hover:scale-110 transition-transform shadow-lg shadow-math-200">
              GΔ
            </div>
            <div>
              <span className="text-xl md:text-2xl font-black text-math-800 tracking-tighter block leading-none">GéoDémon</span>
              <span className="text-[8px] md:text-[10px] font-black text-math-500 uppercase tracking-[0.3em]">Collège Elite</span>
            </div>
          </Link>
          <div className="flex gap-4 md:gap-10 items-center">
            <Link to="/astuces" className="text-[10px] md:text-sm font-black text-gray-500 uppercase tracking-widest hover:text-math-600 transition-colors">Astuces</Link>
            <Link to="/progression" className="group flex items-center gap-2 md:gap-3 bg-math-50 text-math-700 px-3 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl hover:bg-math-600 hover:text-white transition-all font-black text-[9px] md:text-xs uppercase tracking-widest shadow-sm">
              <i className="fas fa-fire-alt text-orange-500 group-hover:text-white transition-colors"></i> <span className="hidden sm:inline">Progression</span>
            </Link>
          </div>
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/astuces" element={<TipsPage />} />
            <Route path="/progression" element={<ProgressionPage />} />
            <Route path="/grade/:grade" element={<GradeRouteWrapper />} />
            <Route path="/exercise/:id" element={<ExerciseRouteWrapper />} />
          </Routes>
        </main>

        <footer className="bg-white border-t py-12 md:py-16 px-6 md:px-8 mt-12 md:mt-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 md:gap-12 text-center md:text-left">
            <div>
              <div className="flex items-center gap-3 mb-4 md:mb-6 justify-center md:justify-start">
                 <div className="w-8 h-8 bg-math-800 rounded-lg flex items-center justify-center text-white font-bold">GΔ</div>
                 <span className="text-lg md:text-xl font-black text-math-800 tracking-tight">GéoDémon</span>
              </div>
              <p className="text-gray-400 font-medium leading-relaxed text-sm">L'excellence mathématique accessible à tous, guidée par une intelligence artificielle bienveillante.</p>
            </div>
            <div className="flex flex-col gap-3 md:gap-4">
              <h4 className="text-xs md:text-sm font-black text-gray-800 uppercase tracking-widest mb-2">Ressources</h4>
              <a href="https://fr.khanacademy.org/math/college-geom" target="_blank" className="text-xs md:text-sm text-gray-400 hover:text-math-600 font-bold transition-colors">Khan Academy</a>
              <a href="https://www.monclasseurdemaths.fr/c4" target="_blank" className="text-xs md:text-sm text-gray-400 hover:text-math-600 font-bold transition-colors">Mon Classeur de Maths</a>
              <a href="https://www.maths-et-tiques.fr/" target="_blank" className="text-xs md:text-sm text-gray-400 hover:text-math-600 font-bold transition-colors">Maths et Tiques</a>
            </div>
            <div className="flex flex-col gap-3 md:gap-4">
              <h4 className="text-xs md:text-sm font-black text-gray-800 uppercase tracking-widest mb-2">Communauté</h4>
              <a href="#" className="text-xs md:text-sm text-gray-400 hover:text-math-600 font-bold transition-colors">Forum d'entraide</a>
              <a href="#" className="text-xs md:text-sm text-gray-400 hover:text-math-600 font-bold transition-colors">Guide Enseignants</a>
              <div className="flex justify-center md:justify-start gap-4 mt-2">
                 <i className="fab fa-twitter text-gray-300 hover:text-math-600 cursor-pointer text-xl"></i>
                 <i className="fab fa-github text-gray-300 hover:text-math-600 cursor-pointer text-xl"></i>
              </div>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-12 md:mt-16 pt-8 border-t text-center">
            <p className="text-gray-300 text-[10px] md:text-xs font-bold uppercase tracking-widest">© 2025 GéoDémon Collège • Conçu pour la réussite scolaire</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

// Route Helpers to handle params
const GradeRouteWrapper = () => {
  const { grade } = useParams<{ grade: string }>();
  return <GradePage grade={grade!} />;
};

const ExerciseRouteWrapper = () => {
  const { id } = useParams<{ id: string }>();
  return <ExercisePage id={id!} />;
};

export default App;
