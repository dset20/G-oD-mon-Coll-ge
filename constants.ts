
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
  },
  {
    id: 'inegalite-triangulaire',
    name: 'Inégalité triangulaire',
    statement: "Dans un triangle, la longueur d'un côté est toujours inférieure à la somme des longueurs des deux autres côtés."
  },
  {
    id: 'angles-alternes-internes',
    name: 'Angles alternes-internes',
    statement: "Si deux droites parallèles sont coupées par une sécante, alors les angles alternes-internes qu'elles forment sont de même mesure."
  },
  {
    id: 'angles-correspondants',
    name: 'Angles correspondants',
    statement: "Si deux droites parallèles sont coupées par une sécante, alors les angles correspondants qu'elles forment sont de même mesure."
  },
  {
    id: 'symetrie-centrale-longueur',
    name: 'Conservation des longueurs',
    statement: "La symétrie centrale conserve les longueurs (le segment image a la même longueur que le segment de départ)."
  },
  {
    id: 'symetrie-centrale-angle',
    name: 'Conservation des angles',
    statement: "La symétrie centrale conserve la mesure des angles (l'angle image a la même mesure que l'angle de départ)."
  },
  {
    id: 'symetrie-centrale-parallele',
    name: 'Symétrie et Parallélisme',
    statement: "L'image d'une droite par une symétrie centrale est une droite qui lui est parallèle."
  },
  {
    id: 'parallelogramme-cotes',
    name: 'Côtés opposés du parallélogramme',
    statement: "Si un quadrilatère est un parallélogramme, alors ses côtés opposés ont la même longueur."
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
    id: 'ex-501',
    title: 'Le triangle mystère',
    grade: '5ème',
    theme: 'Angles',
    statement: "Dans un triangle ABC, on sait que l'angle BAC mesure 45° et que l'angle ABC mesure 85°. Calcule la mesure de l'angle ACB pour compléter la figure.",
    geogebraId: 'v8jht7zv',
    difficulty: 1,
    type: 'FREE_REDACTION',
    solution: {
      hypotheses: ['BAC = 45°', 'ABC = 85°'],
      propertyId: 'somme-angles-triangle',
      conclusion: 'ACB = 50°'
    }
  },
  {
    id: 'ex-502',
    title: 'Défi : Peut-on construire ce triangle ?',
    grade: '5ème',
    theme: 'Inégalité triangulaire',
    statement: "Un élève veut construire un triangle dont les côtés mesurent 12 cm, 5 cm et 6 cm. En utilisant l'inégalité triangulaire, démontre que la construction de ce triangle est impossible.",
    difficulty: 2,
    type: 'STEP_BY_STEP',
    solution: {
      hypotheses: ['Côté 1 = 12cm', 'Somme des deux autres = 5 + 6 = 11cm'],
      propertyId: 'inegalite-triangulaire',
      conclusion: '12 > 11 donc triangle impossible'
    }
  },
  {
    id: 'ex-503',
    title: 'Les secrets du Parallélogramme',
    grade: '5ème',
    theme: 'Parallélogramme',
    statement: "ABCD est un parallélogramme de centre O. On sait que la longueur OA mesure 3,5 cm. Démontre que la diagonale AC mesure 7 cm.",
    geogebraId: 'u7f5z8qg',
    difficulty: 2,
    type: 'FREE_REDACTION',
    solution: {
      hypotheses: ['ABCD est un parallélogramme', 'O est le centre', 'OA = 3,5 cm'],
      propertyId: 'parallelogramme-diagonales',
      conclusion: 'AC = 2 * OA = 7 cm'
    }
  },
  {
    id: 'ex-504',
    title: 'Angles et Parallèles',
    grade: '5ème',
    theme: 'Angles',
    statement: "Les droites (d) et (d') sont parallèles. Une sécante (s) coupe (d) en A et (d') en B. L'un des angles alternes-internes formés mesure 62°. Quelle est la mesure de son partenaire alterne-interne ?",
    difficulty: 1,
    type: 'FREE_REDACTION',
    solution: {
      hypotheses: ['(d) // (d\')', 'Angle 1 = 62°', 'Ils sont alternes-internes'],
      propertyId: 'angles-alternes-internes',
      conclusion: 'Angle 2 = 62°'
    }
  },
  {
    id: 'ex-505',
    title: 'Symétrie et Longueurs',
    grade: '5ème',
    theme: 'Symétrie Centrale',
    statement: "Soit un segment [AB] de longueur 4 cm. On construit son symétrique [A'B'] par rapport à un point O. Démontre que la longueur A'B' est égale à 4 cm.",
    difficulty: 1,
    type: 'FREE_REDACTION',
    solution: {
      hypotheses: ['AB = 4 cm', '[A\'B\'] est le symétrique de [AB]'],
      propertyId: 'symetrie-centrale-longueur',
      conclusion: 'A\'B\' = 4 cm'
    }
  },
  {
    id: 'ex-506',
    title: 'Sécante, Symétrie et Parallélisme',
    grade: '5ème',
    theme: 'Mixte : Symétrie & Parallèles',
    statement: "On considère une droite (d) et un point O n'appartenant pas à (d). On trace la droite (d'), symétrique de (d) par rapport au point O. Démontre que les droites (d) et (d') sont parallèles.",
    difficulty: 2,
    type: 'FREE_REDACTION',
    solution: {
      hypotheses: ['(d\') est la symétrique de (d) par rapport à O'],
      propertyId: 'symetrie-centrale-parallele',
      conclusion: '(d) // (d\')'
    }
  },
  {
    id: 'ex-507',
    title: 'Angles Correspondants et Parallélisme',
    grade: '5ème',
    theme: 'Angles',
    statement: "Sur une figure, les droites (xy) et (zt) sont parallèles. Une sécante (uv) les coupe en E et F. On sait que l'angle correspondant xEu mesure 115°. Démontre que l'angle zFu mesure également 115°.",
    difficulty: 1,
    type: 'FREE_REDACTION',
    solution: {
      hypotheses: ['(xy) // (zt)', 'xEu = 115°', 'xEu et zFu sont correspondants'],
      propertyId: 'angles-correspondants',
      conclusion: 'zFu = 115°'
    }
  },
  {
    id: 'ex-508',
    title: 'Conservation de l\'angle par symétrie',
    grade: '5ème',
    theme: 'Symétrie Centrale',
    statement: "Un angle ABC mesure 37°. On construit son symétrique A'B'C' par rapport à un point S. Démontre que l'angle A'B'C' mesure aussi 37°.",
    difficulty: 1,
    type: 'FREE_REDACTION',
    solution: {
      hypotheses: ['ABC = 37°', 'A\'B\'C\' est le symétrique de ABC'],
      propertyId: 'symetrie-centrale-angle',
      conclusion: 'A\'B\'C\' = 37°'
    }
  },
  {
    id: 'ex-509',
    title: 'Le Défi Final : La Double Preuve',
    grade: '5ème',
    theme: 'Mixte : Angles & Symétrie',
    statement: "Soit un triangle ABC. On construit son symétrique A'B'C' par rapport au milieu de [BC]. On sait que l'angle BAC mesure 60°. En utilisant les propriétés de la symétrie, démontre que l'angle B'A'C' mesure 60° et que la droite (AB) est parallèle à (A'B').",
    difficulty: 3,
    type: 'FREE_REDACTION',
    solution: {
      hypotheses: ['BAC = 60°', 'A\'B\'C\' est le symétrique de ABC par rapport au milieu de [BC]'],
      propertyId: 'symetrie-centrale-angle',
      conclusion: 'B\'A\'C\' = 60° et (AB) // (A\'B\')'
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
  }
];
