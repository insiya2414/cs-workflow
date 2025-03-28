import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { CourseNode } from './components/CourseNode';
import { ProgressTracker } from './components/ProgressTracker';
import { CourseDetails } from './components/CourseDetails';
import { Download, ZoomIn, ZoomOut } from 'lucide-react';

// CS Curriculum Data
const csCourses = {
  'CS1428': {
    id: 'CS1428',
    title: 'Foundations of Computer Science I',
    code: 'CS 1428',
    credits: 4,
    department: 'Computer Science',
    prerequisites: [],
    description: 'Introduction to computer science including problem solving, algorithms, programming concepts, and data structures.',
    gradeDistribution: { A: 35, B: 30, C: 20, D: 10, F: 5 }
  },
  'CS2308': {
    id: 'CS2308',
    title: 'Foundations of Computer Science II',
    code: 'CS 2308',
    credits: 3,
    department: 'Computer Science',
    prerequisites: ['CS1428'],
    description: 'Advanced programming concepts including abstract data types, algorithmic efficiency, and software engineering principles.',
    gradeDistribution: { A: 30, B: 35, C: 20, D: 10, F: 5 }
  },
  'CS2318': {
    id: 'CS2318',
    title: 'Assembly Language',
    code: 'CS 2318',
    credits: 3,
    department: 'Computer Science',
    prerequisites: ['CS2308'],
    description: 'Computer organization and assembly language programming.',
    gradeDistribution: { A: 25, B: 35, C: 25, D: 10, F: 5 }
  },
  'MATH2471': {
    id: 'MATH2471',
    title: 'Calculus I',
    code: 'MATH 2471',
    credits: 4,
    department: 'Mathematics',
    prerequisites: [],
    description: 'Limits, continuity, differentiation, integration and applications.',
    gradeDistribution: { A: 20, B: 30, C: 30, D: 15, F: 5 }
  }
};

const initialNodes = [
  {
    id: 'CS1428',
    type: 'courseNode',
    position: { x: 250, y: 100 },
    data: csCourses['CS1428']
  },
  {
    id: 'CS2308',
    type: 'courseNode',
    position: { x: 250, y: 250 },
    data: csCourses['CS2308']
  },
  {
    id: 'CS2318',
    type: 'courseNode',
    position: { x: 450, y: 250 },
    data: csCourses['CS2318']
  },
  {
    id: 'MATH2471',
    type: 'courseNode',
    position: { x: 50, y: 100 },
    data: csCourses['MATH2471']
  }
];

const initialEdges = [
  {
    id: 'CS1428-CS2308',
    source: 'CS1428',
    target: 'CS2308',
    animated: true,
    style: { stroke: '#FF0000' }
  },
  {
    id: 'CS2308-CS2318',
    source: 'CS2308',
    target: 'CS2318',
    animated: true,
    style: { stroke: '#FF0000' }
  }
];

const nodeTypes = {
  courseNode: CourseNode
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  const requirements = [
    { type: 'major', credits: 43, completed: 0 },
    { type: 'math', credits: 14, completed: 0 },
    { type: 'general', credits: 42, completed: 0 }
  ];

  const onNodeClick = useCallback((_, node) => {
    setSelectedCourse(csCourses[node.id]);
  }, []);

  const exportToPDF = useCallback(() => {
    console.log('Exporting to PDF...');
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-80 p-4 border-r border-gray-200 overflow-y-auto">
        <ProgressTracker
          requirements={requirements}
          gpa={0.0}
        />
        
        <div className="mt-4 space-y-2">
          <button
            onClick={exportToPDF}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={18} />
            Export as PDF
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>

        {selectedCourse && (
          <div className="absolute top-4 right-4 z-10">
            <CourseDetails
              course={selectedCourse}
              onClose={() => setSelectedCourse(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;