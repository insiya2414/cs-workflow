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

  const creditsByType = {
    cs: 0,
    math: 0,
    general: 0,
    elective: 0
  };
  
  completedCourses.forEach(id => {
    const course = csCourses[id];
    if (!course) return;
  
    const title = course.title.toLowerCase();
  
    // Elective check: anything with internship, research, co-op, or independent study
    const isElective = /internship|cooperative|research|independent|elective/i.test(title);
  
    if (isElective) {
      creditsByType.elective += course.credits;
    } else if (course.department === 'Computer Science') {
      creditsByType.cs += course.credits;
    } else if (course.department === 'Mathematics') {
      creditsByType.math += course.credits;
    } else {
      creditsByType.general += course.credits;
    }
  });
  
  const requirements = [
    { type: 'computer science', credits: 43, completed: creditsByType.cs },
    { type: 'math', credits: 14, completed: creditsByType.math },
    { type: 'general', credits: 42, completed: creditsByType.general },
    { type: 'elective', credits: 9, completed: creditsByType.elective } // You can adjust this total
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
    const levels = {
      1000: [],
      2000: [],
      3000: [],
      4000: [],
      other: []
    };
  
    Object.values(csCourses).forEach(course => {
      const level = parseInt(course.code.match(/\d{4}/)?.[0] || '0', 10);
  
      if (level >= 1000 && level < 2000) levels[1000].push(course);
      else if (level >= 2000 && level < 3000) levels[2000].push(course);
      else if (level >= 3000 && level < 4000) levels[3000].push(course);
      else if (level >= 4000) levels[4000].push(course);
      else levels.other.push(course);
    });
  
    const spacingX = 270;
    const spacingY = 260;
    let updatedNodes: any[] = [];
  
    Object.entries(levels).forEach(([level, courses], rowIndex) => {
      courses.forEach((course, colIndex) => {
        const prerequisitesMet = course.prerequisites.every(prereq =>
          completedCourses.includes(prereq)
        );
  
        updatedNodes.push({
          id: course.id,
          type: 'courseNode',
          position: {
            x: colIndex * spacingX,
            y: rowIndex * spacingY
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
        });
      });
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
