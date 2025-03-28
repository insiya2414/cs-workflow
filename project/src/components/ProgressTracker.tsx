import React from 'react';
import { PieChart, GraduationCap, Award } from 'lucide-react';
import type { Requirement } from '../types';

interface ProgressTrackerProps {
  requirements: Requirement[];
  gpa: number;
}

export function ProgressTracker({ requirements, gpa }: ProgressTrackerProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Academic Progress</h2>
      
      <div className="space-y-4">
        {requirements.map((req) => (
          <div key={req.type} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {req.type === 'major' && <GraduationCap className="text-blue-500" />}
                {req.type === 'minor' && <Award className="text-purple-500" />}
                {req.type === 'general' && <PieChart className="text-green-500" />}
                <span className="font-medium capitalize">{req.type} Requirements</span>
              </div>
              <span className="text-sm text-gray-600">
                {req.completed}/{req.credits} credits
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(req.completed / req.credits) * 100}%` }}
              />
            </div>
          </div>
        ))}
        
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