
import React, { useState, useEffect, useRef } from 'react';
import { Property } from '../types';
import { PROPERTIES } from '../constants';

interface DemonstrationStepsProps {
  hypotheses: string;
  property: string;
  conclusion: string;
  isConverse: boolean;
  onChange: (field: string, value: any) => void;
}

export const DemonstrationSteps: React.FC<DemonstrationStepsProps> = ({
  hypotheses,
  property,
  conclusion,
  isConverse,
  onChange
}) => {
  const [showHelper, setShowHelper] = useState(false);
  const [suggestion, setSuggestion] = useState<Property | null>(null);
  const helperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const text = property.toLowerCase().trim();
    if (text.length < 3) {
      setSuggestion(null);
      return;
    }
    const found = PROPERTIES.find(p => 
      p.name.toLowerCase().includes(text) || 
      text.includes(p.name.toLowerCase().split(' ')[0])
    );
    if (found && text !== found.statement.toLowerCase().trim() && text.length > 3) {
      setSuggestion(found);
    } else {
      setSuggestion(null);
    }
  }, [property]);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* 1. Données */}
      <div className="bg-math-50 p-5 rounded-[2rem] border-l-8 border-math-500 shadow-sm relative group transition-all hover:shadow-md">
        <label className="block text-[10px] font-black text-math-800 uppercase tracking-widest mb-3">
          1. Données (On sait que...)
        </label>
        <textarea
          value={hypotheses}
          onChange={(e) => onChange('hypotheses', e.target.value)}
          placeholder="Ex: ABC est un triangle rectangle en A..."
          className="w-full p-4 rounded-2xl border-2 border-math-100 focus:border-math-500 focus:bg-white focus:ring-0 outline-none min-h-[100px] text-gray-700 font-medium transition-all"
        />
      </div>

      {/* 2. Propriété avec Toggle Directe/Réciproque */}
      <div className="bg-logic-50 p-5 rounded-[2rem] border-l-8 border-logic-500 shadow-sm relative transition-all hover:shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <label className="block text-[10px] font-black text-logic-600 uppercase tracking-widest">
            2. Propriété (Or...)
          </label>
          
          {/* Toggle Directe / Réciproque */}
          <div className="flex p-1 bg-white rounded-xl border border-logic-100 shadow-inner">
            <button
              onClick={() => onChange('isConverse', false)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                !isConverse ? 'bg-logic-500 text-white shadow-md' : 'text-gray-400 hover:text-logic-600'
              }`}
            >
              Directe
            </button>
            <button
              onClick={() => onChange('isConverse', true)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                isConverse ? 'bg-orange-500 text-white shadow-md' : 'text-gray-400 hover:text-orange-600'
              }`}
            >
              Réciproque
            </button>
          </div>
        </div>

        {suggestion && !showHelper && (
          <div className="absolute -top-12 left-0 right-0 mx-auto w-full px-4 animate-in slide-in-from-bottom-2 z-20 pointer-events-none">
            <button 
              onClick={() => onChange('property', suggestion.statement)}
              className="w-full bg-math-700 hover:bg-math-800 text-white text-xs py-2 px-4 rounded-full shadow-xl flex items-center justify-between pointer-events-auto transition-all"
            >
              <span className="font-bold"><i className="fas fa-magic mr-2"></i> {suggestion.name}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-[9px] font-black">Utiliser</span>
            </button>
          </div>
        )}

        <textarea
          value={property}
          onChange={(e) => onChange('property', e.target.value)}
          placeholder="Ex: Si un triangle est rectangle alors..."
          className="w-full p-4 rounded-2xl border-2 border-logic-100 focus:border-logic-500 focus:bg-white focus:ring-0 outline-none min-h-[120px] text-gray-700 font-medium transition-all"
        />
        
        <button 
          onClick={() => setShowHelper(!showHelper)}
          className="mt-3 text-logic-500 hover:text-logic-700 text-[10px] font-black uppercase flex items-center gap-2"
        >
          <i className="fas fa-book-bookmark"></i> Consulter le catalogue des propriétés
        </button>

        {showHelper && (
          <div className="mt-4 bg-white rounded-2xl shadow-xl border border-logic-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-3 bg-logic-50 border-b flex justify-between items-center">
              <span className="text-[10px] font-black text-logic-600 uppercase">Bibliothèque</span>
              <button onClick={() => setShowHelper(false)} className="text-gray-400"><i className="fas fa-times"></i></button>
            </div>
            <div className="max-h-48 overflow-y-auto p-2 grid gap-1 custom-scrollbar">
              {PROPERTIES.map(p => (
                <button
                  key={p.id}
                  onClick={() => { onChange('property', p.statement); setShowHelper(false); }}
                  className="text-left p-3 hover:bg-logic-50 rounded-xl transition-colors text-xs text-gray-600 border border-transparent hover:border-logic-100"
                >
                  <span className="font-bold text-logic-700 block text-[10px] uppercase mb-1">{p.name}</span>
                  <span className="italic">"{p.statement}"</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Conclusion */}
      <div className="bg-blue-50 p-5 rounded-[2rem] border-l-8 border-blue-500 shadow-sm transition-all hover:shadow-md">
        <label className="block text-[10px] font-black text-blue-800 uppercase tracking-widest mb-3">
          3. Conclusion (Donc...)
        </label>
        <textarea
          value={conclusion}
          onChange={(e) => onChange('conclusion', e.target.value)}
          placeholder="Ex: Le triangle ABC est rectangle en A."
          className="w-full p-4 rounded-2xl border-2 border-blue-100 focus:border-blue-500 focus:bg-white focus:ring-0 outline-none min-h-[80px] text-gray-700 font-medium transition-all"
        />
      </div>
    </div>
  );
};
