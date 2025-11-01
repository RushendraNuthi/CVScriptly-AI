import React, { useState } from 'react';

interface Step {
  id: number;
  name: string;
  key: string;
}
interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
  onReorder: (keys: string[]) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep, onStepClick, onReorder }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const draggableStartIndex = 2;
  const draggableEndIndex = steps.length - 2;

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
  };
  
  const handleDragEnter = (index: number) => {
    if (index >= draggableStartIndex && index <= draggableEndIndex) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    if (dropIndex < draggableStartIndex || dropIndex > draggableEndIndex) return;

    const draggableSteps = steps.slice(draggableStartIndex, draggableEndIndex + 1);
    
    const dragIndexInSlice = draggedIndex - draggableStartIndex;
    const dropIndexInSlice = dropIndex - draggableStartIndex;

    const [draggedItem] = draggableSteps.splice(dragIndexInSlice, 1);
    draggableSteps.splice(dropIndexInSlice, 0, draggedItem);
    
    onReorder(draggableSteps.map(s => s.key));
  };
  
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <nav aria-label="Progress">
      <div className="overflow-x-auto pb-2 -mb-2">
        <ol role="list" className="flex items-start space-x-4 sm:space-x-8">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isDraggable = index >= draggableStartIndex && index <= draggableEndIndex;

            return (
              <li 
                key={step.key} 
                className="flex-shrink-0"
                draggable={isDraggable}
                onDragStart={(e) => isDraggable && handleDragStart(e, index)}
                onDragOver={(e) => isDraggable && handleDragOver(e)}
                onDrop={() => isDraggable && handleDrop(index)}
                onDragEnd={handleDragEnd}
                onDragEnter={() => handleDragEnter(index)}
                onDragLeave={() => setDragOverIndex(null)}
              >
                <button
                  onClick={() => onStepClick(step.id)}
                  className={`group flex flex-col items-start py-2 transition-all duration-200 border-b-4 focus:outline-none
                    ${isCurrent ? 'border-primary-500' : isCompleted ? 'border-primary-500' : 'border-transparent'}
                    ${isDraggable ? 'cursor-grab hover:border-primary-300' : ''}
                    ${draggedIndex === index ? 'opacity-50' : ''}
                    ${dragOverIndex === index ? 'border-primary-300' : ''}
                  `}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  <span className={`text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    isCurrent || isCompleted ? 'text-primary-600 font-bold' : 'text-neutral-500 group-hover:text-neutral-700'
                  }`}>{`Step ${step.id}`}</span>
                  <span className={`text-sm sm:text-base font-medium whitespace-nowrap ${
                      isCurrent ? 'text-neutral-900' : 'text-neutral-800'
                  }`}>{step.name}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default ProgressBar;
