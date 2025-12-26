export enum Category {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  THIRD = 'THIRD',
  FOURTH = 'FOURTH',
  FIFTH = 'FIFTH',
  SIXTH = 'SIXTH',
  SEVENTH = 'SEVENTH',
  DONE = 'DONE'
}

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.FIRST]: 'Nouveau',
  [Category.SECOND]: 'Jour 1',
  [Category.THIRD]: 'Jour 3',
  [Category.FOURTH]: 'Semaine 1',
  [Category.FIFTH]: 'Semaine 2',
  [Category.SIXTH]: 'Mois 1',
  [Category.SEVENTH]: 'Mois 4',
  [Category.DONE]: 'Maîtrisé'
};

export const getCategoryLabel = (category: Category): string => {
  return CATEGORY_LABELS[category];
};
