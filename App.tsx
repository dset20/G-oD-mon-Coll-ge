
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { EXERCISES, PROPERTIES } from './constants';
import { GradeLevel, Exercise, StudentProgress } from './types';
import { GeoGebraViewer } from './components/GeoGebraViewer';
import { DemonstrationSteps } from './components/DemonstrationSteps';
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
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-math-800 mb-4 tracking-tight">GéoDémon Collège</h1>
        <p className="text-xl text-gray-600">Maîtrisez l'art de la démonstration logique pas à pas.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {grades.map((grade) => (
          <Link
            key={grade}
            to={`/grade/${grade}`}
            className="group p-8 bg-white rounded-2xl shadow-md border-2 border-transparent hover:border-math-500 transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold text-math-600">{grade}</span>
                <p className="text-gray-500 mt-2">Accéder aux exercices de géométrie de {grade}.</p>
              </div>
              <div className="w-12 h-12 bg-math-100 rounded-full flex items-center justify-center text-math-600 group-hover:bg-math-500 group-hover:text-white transition-colors">
                <i className="fas fa-chevron-right"></i>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// --- Progression Page ---
const ProgressionPage: React.FC = () => {
  const completed = EXERCISES.filter(ex => MOCK_PROGRESS.completedExercises.includes(ex.id));
  const totalExercises = EXERCISES.length;
  const progressPercent = Math.round((completed.length / totalExercises) * 100);

  const getRank = (points: number) => {
    if (points > 1000) return { label: 'Maître Géomètre', color: 'text-purple-600', icon: 'fa-crown' };
    if (points > 400) return { label: 'Expert Logique', color: 'text-math-600', icon: 'fa-award' };
    return { label: 'Apprenti Démonstrateur', color: 'text-gray-600', icon: 'fa-book-reader' };
  };

  const rank = getRank(MOCK_PROGRESS.points);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Ma Progression</h2>
          <p className="text-gray-500">Continue tes efforts pour devenir un expert !</p>
        </div>
        <div className={`text-right ${rank.color}`}>
          <i className={`fas ${rank.icon} text-4xl mb-2`}></i>
          <p className="font-bold uppercase tracking-widest text-sm">{rank.label}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-sm font-bold text-gray-400 uppercase mb-2">Points Gagnés</p>
          <p className="text-4xl font-black text-math-600">{MOCK_PROGRESS.points}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-sm font-bold text-gray-400 uppercase mb-2">Exercices Réussis</p>
          <p className="text-4xl font-black text-logic-600">{completed.length} / {totalExercises}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-sm font-bold text-gray-400 uppercase mb-2">Complétion</p>
          <p className="text-4xl font-black text-blue-600">{progressPercent}%</p>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-bold text-gray-600">Avancement global</span>
          <span className="text-sm font-bold text-gray-600">{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-r from-math-500 to-logic-500 h-full transition-all duration-1000" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-6">Historique des réussites</h3>
      <div className="space-y-4">
        {completed.length > 0 ? (
          completed.map((ex) => (
            <div key={ex.id} className="bg-white p-5 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-logic-100 text-logic-600 rounded-full flex items-center justify-center">
                  <i className="fas fa-check"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{ex.title}</h4>
                  <p className="text-xs text-gray-500">{ex.theme} • {ex.grade}</p>
                </div>
              </div>
              <Link to={`/exercise/${ex.id}`} className="text-math-600 hover:text-math-800 font-bold text-sm">
                Revoir <i className="fas fa-external-link-alt ml-1"></i>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic text-center py-10">Tu n'as pas encore validé d'exercices. À toi de jouer !</p>
        )}
      </div>
    </div>
  );
};

// --- Grade Exercises Component ---
const GradePage: React.FC<{ grade: string }> = ({ grade }) => {
  const filtered = EXERCISES.filter((e) => e.grade === grade);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link to="/" className="text-math-600 hover:underline mb-6 inline-block font-semibold">
        <i className="fas fa-arrow-left mr-2"></i> Retour à l'accueil
      </Link>
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8">Niveau {grade}</h2>
      
      {filtered.length === 0 ? (
        <div className="bg-yellow-50 p-8 rounded-2xl text-yellow-800 border border-yellow-200 flex items-center gap-4">
          <i className="fas fa-exclamation-circle text-2xl"></i>
          <p className="font-medium">Aucun exercice disponible pour ce niveau pour le moment.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((ex) => {
            const isCompleted = MOCK_PROGRESS.completedExercises.includes(ex.id);
            return (
              <Link
                key={ex.id}
                to={`/exercise/${ex.id}`}
                className={`block p-6 bg-white rounded-2xl shadow-sm border-2 transition-all hover:shadow-md ${isCompleted ? 'border-logic-200' : 'border-transparent'}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {isCompleted && <i className="fas fa-check-circle text-logic-500 text-xl"></i>}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{ex.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">{ex.theme} • Difficulté : <span className="text-orange-400">{'★'.repeat(ex.difficulty)}</span></p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-math-100 text-math-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {ex.type}
                  </span>
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
    <div className="max-w-7xl mx-auto py-8 px-4">
      <button onClick={() => navigate(-1)} className="text-math-600 hover:underline mb-6 flex items-center font-semibold">
        <i className="fas fa-arrow-left mr-2"></i> Retour aux exercices
      </button>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Left: Statement & Figure */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{exercise.title}</h2>
            <div className="text-lg leading-relaxed text-gray-700 bg-math-50 p-6 rounded-2xl border-2 border-dashed border-math-200">
              <i className="fas fa-quote-left text-math-200 mr-2"></i>
              {exercise.statement}
            </div>
          </div>
          {exercise.geogebraId && <GeoGebraViewer materialId={exercise.geogebraId} />}
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-book-open text-math-500 mr-2"></i> Boîte à outils : Propriétés utiles
            </h3>
            <div className="space-y-3">
              {PROPERTIES.filter(p => p.id === exercise.solution.propertyId).map(p => (
                <div key={p.id} className="p-4 bg-math-50 rounded-xl border-l-4 border-math-400">
                  <p className="text-xs font-bold text-math-700 uppercase mb-1">{p.name}</p>
                  <p className="text-sm italic text-gray-700">"{p.statement}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Redaction & AI */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <i className="fas fa-pen-fancy text-math-600 mr-3"></i> Ma Démonstration
            </h3>
            <DemonstrationSteps
              hypotheses={steps.hypotheses}
              property={steps.property}
              conclusion={steps.conclusion}
              onChange={handleStepChange}
            />
            <button
              onClick={handleVerify}
              disabled={loading || !steps.hypotheses || !steps.property || !steps.conclusion}
              className="mt-8 w-full py-4 bg-math-600 text-white font-bold rounded-2xl hover:bg-math-700 transition-all hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <><i className="fas fa-spinner fa-spin"></i> Analyse en cours...</>
              ) : (
                <><i className="fas fa-robot"></i> Vérifier avec l'IA</>
              )}
            </button>
          </div>

          {feedback && (
            <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-math-100 animate-in fade-in slide-in-from-bottom-6 duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-math-600 rounded-full flex items-center justify-center text-white">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h3 className="text-xl font-bold text-math-800">Conseils du Professeur</h3>
              </div>
              <div className="text-gray-700 leading-relaxed bg-math-50 p-6 rounded-2xl border border-math-100 whitespace-pre-wrap italic">
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
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-math-600 to-math-800 rounded-xl flex items-center justify-center text-white text-xl font-bold group-hover:rotate-12 transition-transform shadow-lg">
              GΔ
            </div>
            <span className="text-2xl font-black text-math-800 tracking-tight">GéoDémon <span className="text-math-500">Collège</span></span>
          </Link>
          <div className="hidden md:flex gap-8 items-center text-sm font-bold text-gray-500 uppercase tracking-widest">
            <Link to="/" className="hover:text-math-600 transition-colors py-2 border-b-2 border-transparent hover:border-math-600">Accueil</Link>
            <a href="https://pi.ac3j.fr/mathematiques-college" target="_blank" rel="noopener noreferrer" className="hover:text-math-600 transition-colors py-2">Méthode pi.ac3j</a>
            <Link to="/progression" className="bg-math-50 text-math-600 px-4 py-2 rounded-lg hover:bg-math-600 hover:text-white transition-all flex items-center gap-2 shadow-sm">
              <i className="fas fa-chart-line"></i> Progression
            </Link>
          </div>
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/progression" element={<ProgressionPage />} />
            <Route path="/grade/:grade" element={<GradeRouteWrapper />} />
            <Route path="/exercise/:id" element={<ExerciseRouteWrapper />} />
          </Routes>
        </main>

        <footer className="bg-white border-t py-12 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-500 font-medium mb-4">© 2025 GéoDémon Collège - Ressources pédagogiques de haute qualité.</p>
            <div className="flex justify-center gap-8 text-sm font-bold text-gray-400 uppercase tracking-widest">
              <a href="#" className="hover:text-math-600 transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-math-600 transition-colors">Accessibilité</a>
              <a href="https://github.com/geodemon-college" className="hover:text-math-600 transition-colors flex items-center gap-2">
                <i className="fab fa-github text-lg"></i> Open Source
              </a>
            </div>
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
