
import React, { useState, useEffect, useRef } from 'react';
import { Property } from '../types';
import { appDataService } from '../services/appDataService'; // Use the new appDataService

interface DemonstrationStepsProps {
  hypotheses: string;
  properties: Property[]; // Now passed as a prop
  property: string;
  conclusion: string;
  isConverse: boolean;
  onChange: (field: string, value: any) => void;
}

export const DemonstrationSteps: React.FC<DemonstrationStepsProps> = ({
  hypotheses,
  properties, // Destructure properties prop
  property,
  conclusion,
  isConverse,
  onChange
}) => {
  const [showHelper, setShowHelper] = useState(false);
  const [suggestion, setSuggestion] = useState<Property | null>(null);

  useEffect(() => {
    const text = property.toLowerCase().trim();
    if (text.length < 3) {
      setSuggestion(null);
      return;
    }
    const found = properties.find(p => // Use properties prop
      p.name.toLowerCase().includes(text) || 
      text.includes(p.name.toLowerCase().split(' ')[0])
    );
    if (found && text !== found.statement.toLowerCase().trim() && text.length > 3) {
      setSuggestion(found);
    } else {
      setSuggestion(null);
    }
  }, [property, properties]); // Add properties to dependency array

  return (
    <div className="space-y-10">
      {/* 1. Données */}
      <div className="relative group">
        <div className="absolute -left-4 top-0 bottom-0 w-1.5 bg-math-500 rounded-full group-focus-within:h-full transition-all"></div>
        <label className="block text-[10px] font-black text-math-800 uppercase tracking-[0.2em] mb-4 ml-2">
          I. Prémisses (On sait que...)
        </label>
        <textarea
          value={hypotheses}
          onChange={(e) => onChange('hypotheses', e.target.value)}
          placeholder="Listez les faits connus..."
          className="w-full p-6 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-math-200 focus:bg-white outline-none min-h-[120px] text-gray-700 font-bold text-lg transition-all shadow-inner"
        />
      </div>

      {/* 2. Propriété */}
      <div className="relative group">
        <div className="absolute -left-4 top-0 bottom-0 w-1.5 bg-logic-500 rounded-full group-focus-within:h-full transition-all"></div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6 ml-2">
          <label className="block text-[10px] font-black text-logic-700 uppercase tracking-[0.2em]">
            II. Loi de Passage (Or...)
          </label>
          
          <div className="flex p-1.5 bg-gray-100 rounded-[1.2rem] shadow-inner w-full sm:w-auto">
            <button
              onClick={() => onChange('isConverse', false)}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                !isConverse ? 'bg-math-700 text-white shadow-xl' : 'text-gray-400 hover:text-math-600'
              }`}
            >
              Directe
            </button>
            <button
              onClick={() => onChange('isConverse', true)}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                isConverse ? 'bg-orange-600 text-white shadow-xl' : 'text-gray-400 hover:text-orange-600'
              }`}
            >
              Réciproque
            </button>
          </div>
        </div>

        <div className="relative">
          {suggestion && !showHelper && (
            <div className="absolute -top-14 left-0 right-0 animate-slide-in z-20">
              <button 
                onClick={() => onChange('property', suggestion.statement)}
                className="mx-auto bg-math-950 text-white text-[11px] font-black py-3 px-6 rounded-2xl shadow-2xl flex items-center gap-4 hover:scale-105 transition-transform"
              >
                <i className="fas fa-sparkles text-yellow-400"></i>
                <span>Appliquer : "{suggestion.name}"</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-[8px]">Entrée</span>
              </button>
            </div>
          )}

          <textarea
            value={property}
            onChange={(e) => onChange('property', e.target.value)}
            placeholder="Énoncez la règle mathématique..."
            className="w-full p-6 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-logic-200 focus:bg-white outline-none min-h-[140px] text-gray-700 font-bold text-lg transition-all shadow-inner"
          />
        </div>
        
        <button 
          onClick={() => setShowHelper(!showHelper)}
          className="mt-4 ml-2 text-logic-600 hover:text-logic-800 text-[10px] font-black uppercase flex items-center gap-2 group"
        >
          <div className="w-6 h-6 rounded-lg bg-logic-50 flex items-center justify-center group-hover:rotate-12 transition-all">
            <i className="fas fa-book"></i>
          </div>
          Consulter le Codex des Lois
        </button>

        {showHelper && (
          <div className="mt-6 bg-white rounded-4xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-in">
            <div className="p-5 bg-gray-50 border-b flex justify-between items-center">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Base de Données Logicielle</span>
              <button onClick={() => setShowHelper(false)} className="w-8 h-8 rounded-full hover:bg-gray-200 text-gray-400 flex items-center justify-center transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {properties.map(p => ( // Use properties prop
                <button
                  key={p.id}
                  onClick={() => { onChange('property', p.statement); setShowHelper(false); }}
                  className="w-full text-left p-5 hover:bg-math-50 rounded-3xl transition-all border border-transparent hover:border-math-100 group"
                >
                  <span className="font-black text-math-900 block text-xs uppercase mb-2 group-hover:text-math-600 transition-colors">{p.name}</span>
                  <span className="text-sm text-gray-500 italic leading-relaxed">"{p.statement}"</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Conclusion */}
      <div className="relative group">
        <div className="absolute -left-4 top-0 bottom-0 w-1.5 bg-blue-500 rounded-full group-focus-within:h-full transition-all"></div>
        <label className="block text-[10px] font-black text-blue-800 uppercase tracking-[0.2em] mb-4 ml-2">
          III. Finalité (Donc...)
        </label>
        <textarea
          value={conclusion}
          onChange={(e) => onChange('conclusion', e.target.value)}
          placeholder="Affirmez votre résultat..."
          className="w-full p-6 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-blue-200 focus:bg-white outline-none min-h-[100px] text-gray-700 font-bold text-lg transition-all shadow-inner"
        />
      </div>
    </div>
  );
};
    