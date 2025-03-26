export interface Subject {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

export interface Semester {
  id: string;
  number: number;
  subjects: Subject[];
}

export interface GradeDistribution {
  grade: string;
  count: number;
  points: number;
}

export const GRADES = {
  'O': 10,
  'A': 9,
  'B': 8,
  'C': 7,
  'D': 6,
  'P': 5,
  'F': 0
} as const;

export const CREDITS = [2, 3, 4] as const;