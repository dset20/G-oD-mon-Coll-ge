
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
    <div className="space-y-6">
      <div className="bg-math-50 p-4 rounded-lg border-l-4 border-math-500">
        <label className="block text-sm font-bold text-math-800 uppercase tracking-wider mb-2">
          1. Données (On sait que...)
        </label>
        <textarea
          value={hypotheses}
          onChange={(e) => onChange('hypotheses', e.target.value)}
          placeholder="Listez les informations données par l'énoncé ou la figure..."
          className="w-full p-3 rounded border border-math-200 focus:ring-2 focus:ring-math-500 outline-none min-h-[80px]"
        />
      </div>

      <div className="bg-logic-50 p-4 rounded-lg border-l-4 border-logic-500">
        <label className="block text-sm font-bold text-logic-600 uppercase tracking-wider mb-2">
          2. Propriété (Or si... alors...)
        </label>
        <textarea
          value={property}
          onChange={(e) => onChange('property', e.target.value)}
          placeholder="Quelle règle mathématique permet de passer des données à la conclusion ?"
          className="w-full p-3 rounded border border-logic-200 focus:ring-2 focus:ring-logic-500 outline-none min-h-[80px]"
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
        <label className="block text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">
          3. Conclusion (Donc...)
        </label>
        <textarea
          value={conclusion}
          onChange={(e) => onChange('conclusion', e.target.value)}
          placeholder="Qu'est-ce qu'on a prouvé ?"
          className="w-full p-3 rounded border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[60px]"
        />
      </div>
    </div>
  );
};
