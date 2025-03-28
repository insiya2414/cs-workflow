import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import csCourses from './data/cs_course_data.json';


import { CourseNode } from './components/CourseNode';
import { ProgressTracker } from './components/ProgressTracker';
import { CourseDetails } from './components/CourseDetails';
import { Download, ZoomIn, ZoomOut } from 'lucide-react';

const initialNodes = Object.values(csCourses).map((course, index) => ({
  id: course.id,
  type: 'courseNode',
  position: {
    x: 200 + (index % 5) * 200,
    y: 100 + Math.floor(index / 5) * 150
  },
  data: course
}));

const initialEdges = Object.values(csCourses).flatMap(course =>
  course.prerequisites.map(prereq => ({
    id: `${prereq}-${course.id}`,
    source: prereq,
    target: course.id,
    animated: true,
    style: { stroke: '#FF0000' }
  }))
);

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