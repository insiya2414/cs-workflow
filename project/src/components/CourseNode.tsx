import React from 'react';
import { Handle, Position } from 'reactflow';
import {
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  Hourglass,
  Info,
} from 'lucide-react';
import type { Course } from '../types';

interface CourseNodeProps {
  data: Course & { prerequisitesMet: boolean };
  isSelected: boolean;
}

export function CourseNode({ data, isSelected }: CourseNodeProps) {
  const { completed, prerequisitesMet } = data;

  const borderColor = prerequisitesMet ? 'border-green-500' : 'border-red-500';

  return (
    <div
      className={`rounded-lg shadow-lg p-4 border-2 relative cursor-${
        prerequisitesMet ? 'pointer' : 'not-allowed'
      } ${borderColor} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        backgroundColor: completed ? '#bbf7d0' : '#ffffff',
        color: completed ? '#064e3b' : '#1f2937',
        transition: 'all 0.2s ease-in-out',
      }}
      title={
        data.prerequisites?.length > 0 && !prerequisitesMet
          ? `You must complete: ${data.prerequisites.join(', ')}`
          : completed
          ? 'Completed ✅'
          : 'Click to mark complete'
      }
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

      {data.prerequisites?.length > 0 && !prerequisitesMet && (
        <div className="flex items-center gap-1 text-xs text-red-600 mt-2">
          <AlertCircle size={14} />
          <span>Prerequisites not met</span>
        </div>
      )}

      <div className="absolute top-2 right-2">
        {completed ? (
          <CheckCircle2 size={16} className="text-green-600" />
        ) : prerequisitesMet ? (
          <Hourglass size={16} className="text-yellow-500" />
        ) : (
          <Info size={16} className="text-gray-400" />
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
