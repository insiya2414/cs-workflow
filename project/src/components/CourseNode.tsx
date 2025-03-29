import React from 'react';
import { Handle, Position } from 'reactflow';
import { GraduationCap, AlertCircle } from 'lucide-react';
import type { Course } from '../types';

interface CourseNodeProps {
  data: Course;
  isSelected: boolean;
  isPrerequisiteMet: boolean;
}

export function CourseNode({ data, isSelected, isPrerequisiteMet }: CourseNodeProps) {
  const borderColor = isPrerequisiteMet ? 'border-green-500' : 'border-red-500';

  const completed = data.completed;

  return (
    <div
      className={`rounded-lg shadow-lg p-4 border-2 ${borderColor} ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{
        backgroundColor: completed ? '#bbf7d0' : '#ffffff', // ✅ Green if completed
        color: completed ? '#064e3b' : '#1f2937',            // ✅ Dark green text if completed
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <Handle type="target" position={Position.Top} />

      <div className="flex items-center justify-between mb-2">
        <span className="font-bold">{data.code}</span>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {data.credits} credits
        </span>
      </div>

      <h3 className="text-sm font-medium mb-2">{data.title}</h3>

      <div className="flex items-center gap-2 text-xs">
        <GraduationCap size={14} />
        <span>{data.department}</span>
      </div>

      {!isPrerequisiteMet && (
        <div className="flex items-center gap-1 text-xs text-red-600 mt-2">
          <AlertCircle size={14} />
          <span>Prerequisites not met</span>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
