export interface Activity {
  id: string;
  name: string;
  emoji: string;
  description: string;
  materials: string[];
  steps: string[];
  timeMinutes: number;
  category: CategoryType;
}

export type CategoryType = 'learning' | 'physical' | 'creative';

export const CATEGORY_INFO: Record<CategoryType, { label: string; emoji: string; description: string }> = {
  learning: {
    label: 'Learning',
    emoji: '🧠',
    description: 'Educational activities that develop cognitive skills',
  },
  physical: {
    label: 'Physical Play',
    emoji: '🏃',
    description: 'Active play that develops motor skills and coordination',
  },
  creative: {
    label: 'Creative Art',
    emoji: '🎨',
    description: 'Artistic activities that encourage self-expression',
  },
};
