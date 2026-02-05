
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';

export const GeometrySearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; sources: { title: string; uri: string }[] } | null>(null);

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const searchQuery = customQuery || query;
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setResult(null);
    const res = await geminiService.getGeometryTips(searchQuery);
    setResult(res);
    setLoading(false);
  };

  const getSourceIcon = (uri: string) => {
    if (uri.includes('khanacademy')) return 'fa-graduation-cap';
    if (uri.includes('geogebra')) return 'fa-draw-polygon';
    if (uri.includes('maths-et-tiques')) return 'fa-square-root-variable';
    if (uri.includes('mathovore')) return 'fa-book-open';
    if (uri.includes('pi.ac3j.fr')) return 'fa-pi';
    if (uri.includes('jai20enmaths')) return 'fa-star';
    return 'fa-link';
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 md:py-8 px-2">
      {/* Search Header Card */}
      <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-gray-100 mb-8 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-50 rounded-full opacity-50"></div>
        
        <h3 className="text-2xl md:text-3xl font-black text-gray-800 mb-6 flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner">
            <i className="fas fa-lightbulb"></i>
          </div>
          Bibliothèque d'Astuces IA
        </h3>
        
        <form onSubmit={handleSearch} className="relative group z-10">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: Comment prouver que deux droites sont parallèles ?"
            className="w-full pl-6 pr-16 md:pr-40 py-4 md:py-6 bg-gray-50 border-2 border-transparent focus:border-math-500 focus:bg-white rounded-2xl md:rounded-3xl outline-none transition-all text-base md:text-lg font-medium shadow-inner"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 md:right-3 top-2 bottom-2 px-4 md:px-8 bg-math-600 text-white rounded-xl md:rounded-2xl font-black hover:bg-math-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-math-100"
          >
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-magic"></i>}
            <span className="hidden md:inline">Générer l'astuce</span>
          </button>
        </form>
        
        <div className="mt-6 flex flex-wrap gap-2 relative z-10">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest self-center mr-2">Suggestions :</span>
          {['Réciproque Pythagore', 'Thalès', 'Parallélogramme', 'Angles alternes-internes'].map(tag => (
            <button 
              key={tag}
              onClick={() => {
                setQuery(tag);
                handleSearch(undefined, tag);
              }}
              className="text-[11px] md:text-xs font-bold px-4 py-2 bg-math-50 text-math-600 rounded-xl hover:bg-math-600 hover:text-white transition-all border border-math-100 shadow-sm"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {loading && (
        <div className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-gray-100 text-center animate-pulse">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-300 text-2xl">
            <i className="fas fa-brain fa-spin"></i>
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Le tuteur IA analyse les meilleures ressources...</p>
        </div>
      )}

      {result && !loading && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden border border-gray-100">
            {/* Header Result */}
            <div className="bg-gradient-to-r from-math-600 to-math-800 p-6 md:p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <i className="fas fa-bolt text-yellow-300"></i>
                </div>
                <div>
                  <h4 className="font-black text-lg md:text-xl tracking-tight">Solution & Méthodologie</h4>
                  <p className="text-[10px] md:text-xs font-bold opacity-80 uppercase tracking-widest">Conseils personnalisés GéoDémon</p>
                </div>
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(result.text)}
                className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-xl transition-colors flex items-center justify-center"
                title="Copier l'astuce"
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>

            {/* Content Result */}
            <div className="p-8 md:p-12">
              <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap font-medium text-base md:text-lg">
                {/* Visual grouping of sections if text contains common headers */}
                {result.text.split('\n\n').map((paragraph, idx) => {
                  const isHeader = paragraph.startsWith('#') || paragraph.toUpperCase() === paragraph && paragraph.length < 50;
                  return (
                    <div 
                      key={idx} 
                      className={`mb-6 ${isHeader ? 'text-math-800 font-black text-xl border-b-2 border-math-100 pb-2 mt-8' : ''}`}
                    >
                      {paragraph.replace(/^#+\s*/, '')}
                    </div>
                  );
                })}
              </div>
              
              {/* Logic Box Highlight */}
              <div className="mt-10 p-6 md:p-8 bg-logic-50 rounded-3xl border-2 border-dashed border-logic-200 relative">
                <div className="absolute -top-4 left-8 px-4 py-1 bg-logic-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Rappel Rédactionnel
                </div>
                <div className="flex gap-4">
                   <div className="text-3xl text-logic-400 opacity-50"><i className="fas fa-info-circle"></i></div>
                   <p className="text-logic-800 font-bold italic leading-relaxed">
                     N'oublie jamais la structure : "On sait que...", "Or si... alors...", "Donc...". C'est le secret d'une démonstration parfaite !
                   </p>
                </div>
              </div>

              {/* Sources Section */}
              {result.sources.length > 0 && (
                <div className="mt-12 pt-10 border-t border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                      <i className="fas fa-search-nodes"></i>
                    </span>
                    <h5 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Sources de confiance consultées</h5>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.sources.slice(0, 4).map((source, i) => (
                      <a
                        key={i}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-math-50 hover:border-math-200 transition-all group shadow-sm"
                      >
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-math-500 shadow-sm group-hover:bg-math-600 group-hover:text-white transition-all">
                          <i className={`fas ${getSourceIcon(source.uri)}`}></i>
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <span className="text-sm font-black text-gray-700 group-hover:text-math-700 block truncate">{source.title}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase truncate block">Consulter la ressource</span>
                        </div>
                        <i className="fas fa-external-link-alt text-gray-300 text-xs group-hover:text-math-400 transition-colors"></i>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 font-medium">
              Astuces générées avec le moteur Gemini 3 & Google Search Grounding. 
              <br/>Utilisez ces informations pour compléter votre raisonnement.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
