import React from 'react';
import { PieChart, GraduationCap, Award } from 'lucide-react';
import type { Requirement } from '../types';

interface ProgressTrackerProps {
  requirements: Requirement[];
  gpa: number;
  completedCredits: number;
}

export function ProgressTracker({ requirements, gpa, completedCredits }: ProgressTrackerProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Academic Progress</h2>
      
      <div className="space-y-4">
      {requirements.map((req) => {
  const actualCompleted =
    req.type === 'major' ? completedCredits : req.completed;

  return (
    <div key={req.type} className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
        {req.type === 'computer science' && <GraduationCap className="text-blue-500" />}
        {req.type === 'math' && <Award className="text-purple-500" />}
        {req.type === 'general' && <PieChart className="text-green-500" />}
        {req.type === 'elective' && <PieChart className="text-yellow-500" />}

          <span className="font-medium capitalize">{req.type} Requirements</span>
        </div>
        <span className="text-sm text-gray-600">
          {actualCompleted}/{req.credits} credits
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${(actualCompleted / req.credits) * 100}%` }}
        />
      </div>
    </div>
  );
})}


        {/* ✅ New: Total Completed */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
          <span>Total Completed Credits</span>
          <span className="font-semibold text-gray-900">{completedCredits}/120</span>
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="font-medium">Current GPA</span>
            <span className="text-2xl font-bold text-blue-600">{gpa.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
