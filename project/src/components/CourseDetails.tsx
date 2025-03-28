import React from 'react';
import { BarChart2, Users, Clock } from 'lucide-react';
import type { Course } from '../types';

interface CourseDetailsProps {
  course: Course;
  onClose: () => void;
}

export function CourseDetails({ course, onClose }: CourseDetailsProps) {
  const totalStudents = Object.values(course.gradeDistribution).reduce((a, b) => a + b, 0);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{course.title}</h2>
          <p className="text-gray-600">{course.code}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
      
      <p className="text-gray-700 mb-4">{course.description}</p>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
            <BarChart2 size={18} />
            Grade Distribution
          </h3>
          <div className="space-y-2">
            {Object.entries(course.gradeDistribution).map(([grade, count]) => (
              <div key={grade} className="flex items-center gap-2">
                <span className="w-8 font-medium">{grade}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(count / totalStudents) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {((count / totalStudents) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {course.prerequisites.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
              <Clock size={18} />
              Prerequisites
            </h3>
            <ul className="list-disc list-inside text-gray-700">
              {course.prerequisites.map((prereq) => (
                <li key={prereq}>{prereq}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}