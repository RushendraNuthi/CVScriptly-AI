import React, { useState } from 'react';
import type { Experience } from '../../types';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import ConfirmationModal from '../ui/ConfirmationModal';

interface Props {
  data: Experience[];
  updateData: (data: Experience[]) => void;
}

const ExperienceForm: React.FC<Props> = ({ data, updateData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const handleChange = (index: number, field: keyof Experience, value: string | string[]) => {
    const newData = [...data];
    if (field === 'highlights') {
      newData[index][field] = Array.isArray(value) ? value : value.split('\n');
    } else {
      (newData[index] as any)[field] = value;
    }
    updateData(newData);
  };

  const addExperience = () => {
    updateData([
      ...data,
      { id: `exp${Date.now()}`, role: '', company: '', location: '', startDate: '', endDate: '', highlights: [''] },
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
         <h2 className="text-2xl font-bold text-neutral-900">Work Experience</h2>
         <p className="text-sm text-neutral-600">Detail your professional history. Use action verbs and quantify your achievements.</p>
       </div>
      {data.map((exp, index) => (
        <div key={exp.id} className="p-6 border border-neutral-300 rounded-lg space-y-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Role" id={`role-${index}`} value={exp.role} onChange={(e) => handleChange(index, 'role', e.target.value)} />
            <Input label="Company" id={`company-${index}`} value={exp.company} onChange={(e) => handleChange(index, 'company', e.target.value)} />
            <Input label="Location" id={`location-${index}`} value={exp.location} onChange={(e) => handleChange(index, 'location', e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
                 <Input label="Start Date" id={`startDate-${index}`} value={exp.startDate} onChange={(e) => handleChange(index, 'startDate', e.target.value)} />
                 <Input label="End Date" id={`endDate-${index}`} value={exp.endDate} onChange={(e) => handleChange(index, 'endDate', e.target.value)} />
            </div>
          </div>
          <Textarea
            label="Highlights / Achievements"
            id={`highlights-${index}`}
            value={exp.highlights.join('\n')}
            onChange={(e) => handleChange(index, 'highlights', e.target.value)}
            rows={5}
            placeholder="Enter each highlight on a new line."
          />
           <button onClick={() => requestDelete(index)} className="absolute top-2 right-2 text-neutral-400 hover:text-danger-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
      ))}
      <button
        onClick={addExperience}
        className="w-full py-2 px-4 border-2 border-dashed border-neutral-300 rounded-lg text-sm font-semibold text-primary-500 hover:bg-neutral-100"
      >
        + Add Experience
      </button>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this experience entry?"
      />
    </div>
  );
};

export default ExperienceForm;
