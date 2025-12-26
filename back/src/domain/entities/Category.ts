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

export function getCategoryOrder(category: Category): number {
  const order: Record<Category, number> = {
    [Category.FIRST]: 1,
    [Category.SECOND]: 2,
    [Category.THIRD]: 3,
    [Category.FOURTH]: 4,
    [Category.FIFTH]: 5,
    [Category.SIXTH]: 6,
    [Category.SEVENTH]: 7,
    [Category.DONE]: 8
  };
  return order[category];
}

export function getNextCategory(category: Category): Category {
  const order = getCategoryOrder(category);
  if (order >= 8) return Category.DONE;
  
  const categories = [
    Category.FIRST,
    Category.SECOND,
    Category.THIRD,
    Category.FOURTH,
    Category.FIFTH,
    Category.SIXTH,
    Category.SEVENTH,
    Category.DONE
  ];
  
  return categories[order];
}

export function isValidCategory(value: string): value is Category {
  return Object.values(Category).includes(value as Category);
}
