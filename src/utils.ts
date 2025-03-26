import { Semester, Subject, GRADES, GradeDistribution } from './types';

export const calculateSemesterGPA = (subjects: Subject[]): number => {
  if (subjects.length === 0) return 0;

  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
  const totalPoints = subjects.reduce((sum, subject) => 
    sum + (subject.credits * GRADES[subject.grade as keyof typeof GRADES]), 0);

  return totalPoints / totalCredits;
};

export const calculateCGPA = (semesters: Semester[]): number => {
  if (semesters.length === 0) return 0;

  const totalCredits = semesters.reduce((sum, semester) => 
    sum + semester.subjects.reduce((semSum, subject) => semSum + subject.credits, 0), 0);

  const totalPoints = semesters.reduce((sum, semester) => 
    sum + semester.subjects.reduce((semSum, subject) => 
      semSum + (subject.credits * GRADES[subject.grade as keyof typeof GRADES]), 0), 0);

  return totalPoints / totalCredits;
};

export const calculateGradeDistribution = (semesters: Semester[]): GradeDistribution[] => {
  const distribution = Object.entries(GRADES).map(([grade, points]) => ({
    grade,
    count: 0,
    points
  }));

  semesters.forEach(semester => {
    semester.subjects.forEach(subject => {
      const gradeEntry = distribution.find(d => d.grade === subject.grade);
      if (gradeEntry) {
        gradeEntry.count++;
      }
    });
  });

  return distribution;
};