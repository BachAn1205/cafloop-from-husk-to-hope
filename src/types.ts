export interface ImpactMetric {
  id: string;
  icon: 'recycle' | 'leaf' | 'bike' | 'tv';
  title: string;
  targetValue: number;
  unit: string;
  description?: string;
}

export interface ProgressData {
  targetLabel: string;
  percentage: number;
  completedBikes: number;
  totalBikes: number;
  completedTVs: number;
  totalTVs: number;
  schoolName: string;
  location: string;
}

export interface CascaraFeature {
  title: string;
  desc: string;
  iconName: string;
}
