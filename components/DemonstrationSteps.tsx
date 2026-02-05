
import React, { useState, useEffect, useRef } from 'react';
import { Property } from '../types';
import { PROPERTIES } from '../constants';

interface DemonstrationStepsProps {
  hypotheses: string;
  property: string;
  conclusion: string;
  onChange: (field: string, value: string) => void;
}

export const DemonstrationSteps: React.FC<DemonstrationStepsProps> = ({
  hypotheses,
  property,
  conclusion,
  onChange
}) => {
  const [showHelper, setShowHelper] = useState(false);
  const [suggestion, setSuggestion] = useState<Property | null>(null);
  const helperRef = useRef<HTMLDivElement>(null);

  // Détection intelligente de propriété pendant la saisie
  useEffect(() => {
    const text = property.toLowerCase().trim();
    if (text.length < 3) {
      setSuggestion(null);
      return;
    }

    // Recherche d'une propriété correspondante
    const found = PROPERTIES.find(p => 
      p.name.toLowerCase().includes(text) || 
      text.includes(p.name.toLowerCase().split(' ')[0])
    );
    
    // On n'affiche la suggestion que si :
    // 1. Une propriété est trouvée
    // 2. Le texte actuel n'est pas déjà identique à l'énoncé de la propriété (évite la boucle de suggestion)
    // 3. La longueur de saisie est suffisante pour être pertinente
    if (found && text !== found.statement.toLowerCase().trim() && text.length > 3) {
      setSuggestion(found);
    } else {
      setSuggestion(null);
    }
  }, [property]);

  const handleApplySuggestion = (stmt: string) => {
    onChange('property', stmt);
    setSuggestion(null);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* 1. Données */}
      <div className="bg-math-50 p-4 md:p-5 rounded-xl md:rounded-2xl border-l-8 border-math-500 shadow-sm relative group">
        <label className="block text-[10px] md:text-xs font-black text-math-800 uppercase tracking-widest mb-3">
          1. Données (On sait que...)
        </label>
        <textarea
          value={hypotheses}
          onChange={(e) => onChange('hypotheses', e.target.value)}
          placeholder="Listez les informations données par l'énoncé ou la figure..."
          className="w-full p-4 rounded-xl border-2 border-math-100 focus:border-math-500 focus:bg-white focus:ring-0 outline-none min-h-[100px] md:min-h-[120px] text-gray-700 font-medium transition-all shadow-inner"
        />
      </div>

      {/* 2. Propriété avec Popover Intelligent */}
      <div className="bg-logic-50 p-4 md:p-5 rounded-xl md:rounded-2xl border-l-8 border-logic-500 shadow-sm relative">
        <div className="flex justify-between items-center mb-3">
          <label className="block text-[10px] md:text-xs font-black text-logic-600 uppercase tracking-widest">
            2. Propriété (Or si... alors...)
          </label>
          <button 
            onClick={() => setShowHelper(!showHelper)}
            className="text-logic-500 hover:text-logic-700 transition-colors flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter bg-white px-2 py-1 rounded-lg border border-logic-100 shadow-sm"
          >
            <i className="fas fa-book-bookmark"></i> Aide
          </button>
        </div>

        {/* Suggestion flottante automatique - Expérience utilisateur améliorée (zone de clic totale) */}
        {suggestion && !showHelper && (
          <div className="absolute -top-12 left-0 right-0 mx-auto w-full px-4 animate-in fade-in slide-in-from-bottom-2 duration-300 z-20 pointer-events-none">
            <button 
              onClick={() => handleApplySuggestion(suggestion.statement)}
              className="w-full bg-math-700 hover:bg-math-800 text-white text-[10px] md:text-xs py-2 px-4 rounded-full shadow-xl flex items-center justify-between pointer-events-auto transition-all transform hover:scale-[1.02] active:scale-[0.98] group"
              title={`Cliquer pour insérer : ${suggestion.name}`}
            >
              <span className="font-bold flex items-center">
                <i className="fas fa-magic mr-2 animate-pulse text-yellow-300"></i> 
                Suggestion : <span className="ml-1 opacity-90">{suggestion.name}</span>
              </span>
              <span className="bg-white/20 group-hover:bg-white/30 px-2 py-0.5 rounded text-[9px] uppercase font-black transition-colors">
                Utiliser <i className="fas fa-check ml-1"></i>
              </span>
            </button>
          </div>
        )}

        {/* Popover Aide / Aide-mémoire */}
        {showHelper && (
          <div className="absolute z-30 bottom-full left-0 right-0 mb-4 animate-in fade-in zoom-in-95 duration-200" ref={helperRef}>
            <div className="bg-white rounded-3xl shadow-2xl border border-logic-100 overflow-hidden ring-4 ring-logic-50">
              <div className="bg-logic-500 p-3 text-white flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest"><i className="fas fa-lightbulb mr-2"></i> Bibliothèque de propriétés</span>
                <button onClick={() => setShowHelper(false)}><i className="fas fa-times"></i></button>
              </div>
              <div className="max-h-60 overflow-y-auto p-2 grid gap-2 custom-scrollbar">
                {PROPERTIES.slice(0, 8).map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onChange('property', p.statement);
                      setShowHelper(false);
                    }}
                    className="text-left p-3 hover:bg-logic-50 rounded-xl transition-colors border border-transparent hover:border-logic-100 group"
                  >
                    <p className="text-[10px] font-black text-logic-600 uppercase mb-1">{p.name}</p>
                    <p className="text-xs text-gray-500 italic line-clamp-2 group-hover:line-clamp-none transition-all">"{p.statement}"</p>
                  </button>
                ))}
              </div>
              <div className="p-2 bg-gray-50 border-t">
                <p className="text-[9px] text-gray-400 font-bold text-center italic">Clique sur une propriété pour l'insérer</p>
              </div>
            </div>
          </div>
        )}

        <textarea
          value={property}
          onChange={(e) => onChange('property', e.target.value)}
          placeholder="Quelle règle mathématique permet de passer des données à la conclusion ?"
          className="w-full p-4 rounded-xl border-2 border-logic-100 focus:border-logic-500 focus:bg-white focus:ring-0 outline-none min-h-[100px] md:min-h-[120px] text-gray-700 font-medium transition-all shadow-inner"
        />
      </div>

      {/* 3. Conclusion */}
      <div className="bg-blue-50 p-4 md:p-5 rounded-xl md:rounded-2xl border-l-8 border-blue-500 shadow-sm">
        <label className="block text-[10px] md:text-xs font-black text-blue-800 uppercase tracking-widest mb-3">
          3. Conclusion (Donc...)
        </label>
        <textarea
          value={conclusion}
          onChange={(e) => onChange('conclusion', e.target.value)}
          placeholder="Qu'est-ce qu'on a prouvé ?"
          className="w-full p-4 rounded-xl border-2 border-blue-100 focus:border-blue-500 focus:bg-white focus:ring-0 outline-none min-h-[80px] md:min-h-[100px] text-gray-700 font-medium transition-all shadow-inner"
        />
      </div>
    </div>
  );
};
