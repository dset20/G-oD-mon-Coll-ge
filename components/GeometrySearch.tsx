
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';

export const GeometrySearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; sources: { title: string; uri: string }[] } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    const res = await geminiService.getGeometryTips(query);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 mb-8">
        <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
          <i className="fas fa-lightbulb text-orange-400"></i>
          Bibliothèque d'Astuces IA
        </h3>
        
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: Comment prouver que deux droites sont parallèles ?"
            className="w-full pl-6 pr-32 py-5 bg-gray-50 border-2 border-transparent focus:border-math-500 rounded-2xl outline-none transition-all text-lg font-medium shadow-inner"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-3 top-2.5 bottom-2.5 px-6 bg-math-600 text-white rounded-xl font-black hover:bg-math-700 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
            <span className="hidden sm:inline">Chercher</span>
          </button>
        </form>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {['Pythagore', 'Thalès', 'Parallélisme', 'Cercle circonscrit'].map(tag => (
            <button 
              key={tag}
              onClick={() => setQuery(`Astuces pour ${tag}`)}
              className="text-xs font-bold px-3 py-1 bg-math-50 text-math-600 rounded-full hover:bg-math-100 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border-l-8 border-math-600 animate-in slide-in-from-bottom-4 duration-500">
          <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
            {result.text}
          </div>
          
          {result.sources.length > 0 && (
            <div className="mt-10 pt-8 border-t border-gray-100">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Sources vérifiées pour toi :</p>
              <div className="flex flex-wrap gap-3">
                {result.sources.map((source, i) => (
                  <a
                    key={i}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl hover:bg-math-50 hover:border-math-200 transition-all group"
                  >
                    <i className="fas fa-link text-math-400 group-hover:text-math-600 text-xs"></i>
                    <span className="text-sm font-bold text-gray-600 group-hover:text-math-800">{source.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
