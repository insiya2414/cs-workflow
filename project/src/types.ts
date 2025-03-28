export interface Course {
  id: string;
  title: string;
  code: string;
  credits: number;
  department: string;
  prerequisites: string[];
  description: string;
  gradeDistribution: {
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
  };
}

export interface StudentProgress {
  completedCourses: string[];
  currentGPA: number;
  totalCredits: number;
  majorCredits: number;
  minorCredits: number;
  generalEdCredits: number;
}

export interface Requirement {
  type: 'major' | 'math' | 'general';
  credits: number;
  completed: number;
}