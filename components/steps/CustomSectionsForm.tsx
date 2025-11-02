import React, { useState } from 'react';
import type { CustomSection } from '../../types';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import ConfirmationModal from '../ui/ConfirmationModal';

interface Props {
  data: CustomSection[];
  updateData: (data: CustomSection[]) => void;
}

const CustomSectionsForm: React.FC<Props> = ({ data, updateData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const handleChange = (index: number, field: keyof CustomSection, value: string | string[]) => {
    const newData = [...data];
    if (field === 'content') {
      newData[index][field] = Array.isArray(value) ? value : value.split('\n');
    } else {
      (newData[index] as any)[field] = value;
    }
    updateData(newData);
  };

  const addSection = () => {
    updateData([
      ...data,
      { id: `custom${Date.now()}`, title: '', content: [''] },
    ]);
  };

  const requestDelete = (index: number) => {
    setItemToDelete(index);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete !== null) {
      updateData(data.filter((_, i) => i !== itemToDelete));
    }
    setIsModalOpen(false);
    setItemToDelete(null);
  };
  
  const cancelDelete = () => {
    setIsModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="space-y-8">
       <div>
         <h2 className="text-2xl font-bold text-neutral-900">Custom Sections</h2>
         <p className="text-sm text-neutral-600">Add any extra sections you need, like "Awards" or "Certifications".</p>
       </div>
      {data.map((section, index) => (
        <div key={section.id} className="p-6 border border-neutral-300 rounded-lg space-y-4 relative">
          <Input 
            label="Section Title" 
            id={`custom-title-${index}`} 
            value={section.title} 
            onChange={(e) => handleChange(index, 'title', e.target.value)} 
            placeholder="e.g., Awards and Honors"
          />
          <Textarea
            label="Content"
            id={`custom-content-${index}`}
            value={section.content.join('\n')}
            onChange={(e) => handleChange(index, 'content', e.target.value)}
            rows={5}
            placeholder="Enter each item on a new line."
          />
           <button onClick={() => requestDelete(index)} className="absolute top-2 right-2 text-neutral-400 hover:text-danger-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
      ))}
      <button
        onClick={addSection}
        className="w-full py-2 px-4 border-2 border-dashed border-neutral-300 rounded-lg text-sm font-semibold text-primary-500 hover:bg-neutral-100"
      >
        + Add Custom Section
      </button>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this custom section?"
      />
    </div>
  );
};

export default CustomSectionsForm;
