
import { Property, Exercise } from './types';

export const PROPERTIES: Property[] = [
  {
    id: 'perp-parallel',
    name: 'Droites perpendiculaires et parallèles',
    statement: "Si deux droites sont perpendiculaires à une même troisième, alors elles sont parallèles entre elles."
  },
  {
    id: 'pythagore',
    name: 'Théorème de Pythagore',
    statement: "Dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés."
  },
  {
    id: 'somme-angles-triangle',
    name: 'Somme des angles',
    statement: "La somme des mesures des angles d'un triangle est égale à 180°."
  },
  {
    id: 'parallelogramme-diagonales',
    name: 'Diagonales du parallélogramme',
    statement: "Si un quadrilatère est un parallélogramme, alors ses diagonales se coupent en leur milieu."
  }
];

export const EXERCISES: Exercise[] = [
  {
    id: 'ex-001',
    title: 'Parallélisme et Perpendiculaires',
    grade: '6ème',
    theme: 'Droites',
    statement: "On sait que la droite (d1) est perpendiculaire à (L) et que la droite (d2) est aussi perpendiculaire à (L). Démontre que (d1) et (d2) sont parallèles.",
    geogebraId: 'mre66v8e',
    difficulty: 1,
    type: 'FILL_IN_THE_BLANKS',
    solution: {
      hypotheses: ['(d1) ⊥ (L)', '(d2) ⊥ (L)'],
      propertyId: 'perp-parallel',
      conclusion: '(d1) // (d2)'
    }
  },
  {
    id: 'ex-002',
    title: 'Calcul de longueur avec Pythagore',
    grade: '4ème',
    theme: 'Triangle Rectangle',
    statement: "ABC est un triangle rectangle en A tel que AB = 3 cm et AC = 4 cm. Calcule la longueur de l'hypoténuse BC.",
    geogebraId: 'vmyaypbt',
    difficulty: 2,
    type: 'STEP_BY_STEP',
    solution: {
      hypotheses: ['ABC est rectangle en A', 'AB = 3', 'AC = 4'],
      propertyId: 'pythagore',
      conclusion: 'BC = 5'
    }
  },
  {
    id: 'ex-003',
    title: 'Angles dans un triangle',
    grade: '5ème',
    theme: 'Angles',
    statement: "Dans un triangle RST, l'angle R mesure 50° et l'angle S mesure 70°. Calcule la mesure de l'angle T.",
    difficulty: 1,
    type: 'FREE_REDACTION',
    solution: {
      hypotheses: ['R = 50°', 'S = 70°'],
      propertyId: 'somme-angles-triangle',
      conclusion: 'T = 60°'
    }
  }
];
