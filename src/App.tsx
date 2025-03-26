import { useState, useEffect } from 'react';
import { PlusCircle, Trash2, GraduationCap, Sun, Moon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';
import { Semester, Subject, GRADES, CREDITS } from './types';
import { calculateSemesterGPA, calculateCGPA, calculateGradeDistribution } from './utils';

const DEFAULT_SEMESTERS: Semester[] = [
  {
    id: '1',
    number: 1,
    subjects: [
      { id: '1', name: 'CP', credits: 4, grade: 'O' },
      { id: '2', name: 'OCW', credits: 4, grade: 'O' },
      { id: '3', name: 'DLD', credits: 4, grade: 'O' },
      { id: '4', name: 'DSMA', credits: 4, grade: 'O' },
      { id: '5', name: 'EEN', credits: 2, grade: 'O' },
    ],
  },
  {
    id: '2',
    number: 2,
    subjects: [
      { id: '6', name: 'CA', credits: 4, grade: 'O' },
      { id: '7', name: 'DSA', credits: 4, grade: 'O' },
      { id: '8', name: 'SS', credits: 4, grade: 'O' },
      { id: '9', name: 'PS', credits: 4, grade: 'O' },
      { id: '10', name: 'FHVE', credits: 2, grade: 'O' },
      { id: '11', name: 'OPC', credits: 2, grade: 'O' },
    ],
  },
  {
    id: '3',
    number: 3,
    subjects: [
      { id: '12', name: 'OS', credits: 4, grade: 'O' },
      { id: '13', name: 'ADSA', credits: 4, grade: 'O' },
      { id: '14', name: 'OOPS', credits: 4, grade: 'O' },
      { id: '15', name: 'RANAC', credits: 4, grade: 'O' },
      { id: '16', name: 'DBMS', credits: 4, grade: 'O' },
      { id: '17', name: 'CCI', credits: 2, grade: 'O' },
      { id: '18', name: 'PC', credits: 2, grade: 'O' },
    ],
  },
  {
    id: '4',
    number: 4,
    subjects: [
      { id: '19', name: 'CCN', credits: 4, grade: 'O' },
      { id: '20', name: 'TOC', credits: 4, grade: 'O' },
      { id: '21', name: 'FFSD', credits: 4, grade: 'O' },
      { id: '22', name: 'AI', credits: 4, grade: 'O' },
      { id: '23', name: 'ACS', credits: 2, grade: 'O' },
      { id: '24', name: 'SE', credits: 2, grade: 'O' },
    ],
  },
  {
    id: '5',
    number: 5,
    subjects: [
      { id: '25', name: 'FDFED', credits: 4, grade: 'O' },
      { id: '26', name: 'CC', credits: 3, grade: 'O' },
      { id: '27', name: 'ICS', credits: 3, grade: 'O' },
      { id: '28', name: 'NLP', credits: 3, grade: 'O' },
      { id: '29', name: 'ML', credits: 3, grade: 'O' },
      { id: '30', name: 'PGP', credits: 2, grade: 'O' },
      { id: '31', name: 'QRA', credits: 2, grade: 'O' },
    ],
  },
  {
    id: '6',
    number: 6,
    subjects: [
      { id: '32', name: 'WBD', credits: 4, grade: 'O' },
      { id: '33', name: 'CGC', credits: 3, grade: 'O' },
      { id: '34', name: 'IS', credits: 3, grade: 'O' },
      { id: '35', name: 'GTA', credits: 3, grade: 'O' },
      { id: '36', name: 'GEOTA', credits: 2, grade: 'O' },
      { id: '37', name: 'IAE', credits: 2, grade: 'O' },
    ],
  },
];


function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true; // Default to dark mode
  });

  const [semesters, setSemesters] = useState<Semester[]>(() => {
    const saved = localStorage.getItem('semesters');
    if (saved) {
      return JSON.parse(saved);
    }
    return DEFAULT_SEMESTERS;
  });

  useEffect(() => {
    localStorage.setItem('semesters', JSON.stringify(semesters));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [semesters, darkMode]);

  const addSemester = () => {
    setSemesters(prev => [...prev, {
      id: Date.now().toString(),
      number: prev.length + 1,
      subjects: []
    }]);
  };

  const deleteSemester = (semesterId: string) => {
    setSemesters(prev => prev.filter(sem => sem.id !== semesterId));
  };

  const addSubject = (semesterId: string) => {
    setSemesters(prev => prev.map(sem => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          subjects: [...sem.subjects, {
            id: Date.now().toString(),
            name: '',
            credits: 4,
            grade: 'O'
          }]
        };
      }
      return sem;
    }));
  };

  const updateSubject = (semesterId: string, subjectId: string, field: keyof Subject, value: string | number) => {
    setSemesters(prev => prev.map(sem => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          subjects: sem.subjects.map(sub => {
            if (sub.id === subjectId) {
              return { ...sub, [field]: value };
            }
            return sub;
          })
        };
      }
      return sem;
    }));
  };

  const deleteSubject = (semesterId: string, subjectId: string) => {
    setSemesters(prev => prev.map(sem => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          subjects: sem.subjects.filter(sub => sub.id !== subjectId)
        };
      }
      return sem;
    }));
  };

  const chartData = semesters.map(semester => ({
    name: `Semester ${semester.number}`,
    gpa: calculateSemesterGPA(semester.subjects),
  }));

  const gradeDistribution = calculateGradeDistribution(semesters);
  const cgpa = calculateCGPA(semesters);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <GraduationCap className={`w-8 h-8 ${darkMode ? 'text-purple-400' : 'text-indigo-600'}`} />
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>CGPA Calculator</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition-colors duration-300 ${
                darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-indigo-600'}`}>
              CGPA: {cgpa.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className={`p-4 rounded-lg shadow-lg transition-colors duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              CGPA Progression
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="name" stroke={darkMode ? '#9CA3AF' : '#4B5563'} />
                  <YAxis domain={[0, 10]} stroke={darkMode ? '#9CA3AF' : '#4B5563'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                      borderColor: darkMode ? '#374151' : '#E5E7EB',
                      color: darkMode ? '#FFFFFF' : '#000000'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gpa"
                    stroke={darkMode ? '#A78BFA' : '#4F46E5'}
                    strokeWidth={2}
                    dot={{ fill: darkMode ? '#A78BFA' : '#4F46E5' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`p-4 rounded-lg shadow-lg transition-colors duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Grade Distribution
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="grade" stroke={darkMode ? '#9CA3AF' : '#4B5563'} />
                  <YAxis stroke={darkMode ? '#9CA3AF' : '#4B5563'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                      borderColor: darkMode ? '#374151' : '#E5E7EB',
                      color: darkMode ? '#FFFFFF' : '#000000'
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill={darkMode ? '#A78BFA' : '#4F46E5'}
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {semesters.map((semester) => (
            <div
              key={semester.id}
              className={`rounded-lg shadow-lg p-6 transition-all duration-300 transform hover:scale-[1.01] ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Semester {semester.number}
                </h2>
                <div className="flex items-center gap-4">
                  <span className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    GPA: {calculateSemesterGPA(semester.subjects).toFixed(2)}
                  </span>
                  {semesters.length > 1 && (
                    <button
                      onClick={() => deleteSemester(semester.id)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {semester.subjects.map((subject) => (
                  <div key={subject.id} className="flex gap-4 items-center">
                    <input
                      type="text"
                      value={subject.name}
                      onChange={(e) => updateSubject(semester.id, subject.id, 'name', e.target.value)}
                      placeholder="Subject Name"
                      className={`flex-1 rounded-md shadow-sm transition-colors duration-300 ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-offset-2 ${
                        darkMode ? 'focus:ring-purple-500' : 'focus:ring-indigo-500'
                      }`}
                    />
                    <select
                      value={subject.credits}
                      onChange={(e) => updateSubject(semester.id, subject.id, 'credits', Number(e.target.value))}
                      className={`rounded-md shadow-sm transition-colors duration-300 ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-offset-2 ${
                        darkMode ? 'focus:ring-purple-500' : 'focus:ring-indigo-500'
                      }`}
                    >
                      {CREDITS.map(credit => (
                        <option key={credit} value={credit}>{credit} Credits</option>
                      ))}
                    </select>
                    <select
                      value={subject.grade}
                      onChange={(e) => updateSubject(semester.id, subject.id, 'grade', e.target.value)}
                      className={`rounded-md shadow-sm transition-colors duration-300 ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-offset-2 ${
                        darkMode ? 'focus:ring-purple-500' : 'focus:ring-indigo-500'
                      }`}
                    >
                      {Object.entries(GRADES).map(([grade, points]) => (
                        <option key={grade} value={grade}>
                          {grade} ({points})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => deleteSubject(semester.id, subject.id)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addSubject(semester.id)}
                className={`mt-4 inline-flex items-center gap-2 transition-colors duration-300 ${
                  darkMode
                    ? 'text-purple-400 hover:text-purple-300'
                    : 'text-indigo-600 hover:text-indigo-800'
                }`}
              >
                <PlusCircle className="w-5 h-5" />
                Add Subject
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addSemester}
          className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 ${
            darkMode
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <PlusCircle className="w-5 h-5" />
          Add Semester
        </button>
      </div>
    </div>
  );
}

export default App;