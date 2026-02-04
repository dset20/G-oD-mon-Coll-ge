
import React from 'react';

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
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="bg-math-50 p-4 md:p-5 rounded-xl md:rounded-2xl border-l-8 border-math-500 shadow-sm">
        <label className="block text-[10px] md:text-xs font-black text-math-800 uppercase tracking-widest mb-3">
          1. Données (On sait que...)
        </label>
        <textarea
          value={hypotheses}
          onChange={(e) => onChange('hypotheses', e.target.value)}
          placeholder="Listez les informations données par l'énoncé ou la figure..."
          className="w-full p-4 rounded-xl border-2 border-math-100 focus:border-math-500 focus:ring-0 outline-none min-h-[100px] md:min-h-[120px] text-gray-700 font-medium transition-all"
        />
      </div>

      <div className="bg-logic-50 p-4 md:p-5 rounded-xl md:rounded-2xl border-l-8 border-logic-500 shadow-sm">
        <label className="block text-[10px] md:text-xs font-black text-logic-600 uppercase tracking-widest mb-3">
          2. Propriété (Or si... alors...)
        </label>
        <textarea
          value={property}
          onChange={(e) => onChange('property', e.target.value)}
          placeholder="Quelle règle mathématique permet de passer des données à la conclusion ?"
          className="w-full p-4 rounded-xl border-2 border-logic-100 focus:border-logic-500 focus:ring-0 outline-none min-h-[100px] md:min-h-[120px] text-gray-700 font-medium transition-all"
        />
      </div>

      <div className="bg-blue-50 p-4 md:p-5 rounded-xl md:rounded-2xl border-l-8 border-blue-500 shadow-sm">
        <label className="block text-[10px] md:text-xs font-black text-blue-800 uppercase tracking-widest mb-3">
          3. Conclusion (Donc...)
        </label>
        <textarea
          value={conclusion}
          onChange={(e) => onChange('conclusion', e.target.value)}
          placeholder="Qu'est-ce qu'on a prouvé ?"
          className="w-full p-4 rounded-xl border-2 border-blue-100 focus:border-blue-500 focus:ring-0 outline-none min-h-[80px] md:min-h-[100px] text-gray-700 font-medium transition-all"
        />
      </div>
    </div>
  );
};
