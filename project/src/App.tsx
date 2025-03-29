import React, { useState, useCallback, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
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
import { Download } from 'lucide-react';

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
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const totalCompletedCredits = completedCourses.reduce(
    (sum, id) => sum + (csCourses[id]?.credits || 0),
    0
  );

  const requirements = [
    { type: 'major', credits: 43, completed: totalCompletedCredits },
    { type: 'math', credits: 14, completed: 0 },
    { type: 'general', credits: 42, completed: 0 }
  ];

  const onNodeClick = useCallback(
    (_, node) => {
      const courseId = node.id;
      const course = csCourses[courseId];

      const prerequisitesMet = course.prerequisites.every(prereq =>
        completedCourses.includes(prereq)
      );

      if (!prerequisitesMet) {
        toast.error(`Prerequisites not met for ${course.code}`, {
          icon: '⚠️'
        });
        return;
      }

      setCompletedCourses(prev =>
        prev.includes(courseId)
          ? prev.filter(id => id !== courseId)
          : [...prev, courseId]
      );

      setSelectedCourse(course);
    },
    [completedCourses]
  );

  useEffect(() => {
    const updatedNodes = Object.values(csCourses).map((course, index) => {
      const prerequisitesMet = course.prerequisites.every(prereq =>
        completedCourses.includes(prereq)
      );

      return {
        id: course.id,
        type: 'courseNode',
        position: {
          x: 200 + (index % 5) * 200,
          y: 100 + Math.floor(index / 5) * 150
        },
        data: {
          ...course,
          completed: completedCourses.includes(course.id),
          prerequisitesMet
        },
        style: {
          backgroundColor: completedCourses.includes(course.id)
            ? '#bbf7d0'
            : '#ffffff',
          color: completedCourses.includes(course.id)
            ? '#064e3b'
            : '#1f2937',
          transition: 'all 0.2s ease-in-out'
        }
      };
    });

    setNodes(updatedNodes);
  }, [completedCourses]);

  const exportToPDF = useCallback(() => {
    console.log('Exporting to PDF...');
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-80 p-4 border-r border-gray-200 overflow-y-auto">
        <ProgressTracker
          requirements={requirements}
          gpa={0.0}
          completedCredits={totalCompletedCredits}
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

      {/* ✅ This is where Toaster goes */}
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
