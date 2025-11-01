import React, { useState } from 'react';
import type { Education } from '../../types';
import Input from '../ui/Input';
import ConfirmationModal from '../ui/ConfirmationModal';

interface Props {
  data: Education[];
  updateData: (data: Education[]) => void;
}

const EducationForm: React.FC<Props> = ({ data, updateData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const handleChange = (index: number, field: keyof Education, value: string | string[]) => {
    const newData = [...data];
    if (field === 'coursework') {
      newData[index][field] = Array.isArray(value) ? value : value.split(',').map(s => s.trim());
    } else {
      (newData[index] as any)[field] = value;
    }
    updateData(newData);
  };

  const addEducation = () => {
    updateData([
      ...data,
      { id: `edu${Date.now()}`, university: '', degree: '', startDate: '', endDate: '', gpa: '', coursework: [] },
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
         <h2 className="text-2xl font-bold text-neutral-900">Education</h2>
         <p className="text-sm text-neutral-600">List your academic achievements and relevant coursework.</p>
       </div>
      {data.map((edu, index) => (
        <div key={edu.id} className="p-6 border border-neutral-300 rounded-lg space-y-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="University / School" id={`university-${index}`} value={edu.university} onChange={(e) => handleChange(index, 'university', e.target.value)} />
            <Input label="Degree" id={`degree-${index}`} value={edu.degree} onChange={(e) => handleChange(index, 'degree', e.target.value)} />
            <Input label="Start Date" id={`startDate-${index}`} value={edu.startDate} onChange={(e) => handleChange(index, 'startDate', e.target.value)} />
            <Input label="End Date" id={`endDate-${index}`} value={edu.endDate} onChange={(e) => handleChange(index, 'endDate', e.target.value)} />
            <Input label="GPA" id={`gpa-${index}`} value={edu.gpa} onChange={(e) => handleChange(index, 'gpa', e.target.value)} />
            <Input label="Relevant Coursework (comma-separated)" id={`coursework-${index}`} value={edu.coursework.join(', ')} onChange={(e) => handleChange(index, 'coursework', e.target.value)} />
          </div>
          <button onClick={() => requestDelete(index)} className="absolute top-2 right-2 text-neutral-400 hover:text-danger-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
          </button>
        </div>
      ))}
      <button
        onClick={addEducation}
        className="w-full py-2 px-4 border-2 border-dashed border-neutral-300 rounded-lg text-sm font-semibold text-primary-500 hover:bg-neutral-100"
      >
        + Add Education
      </button>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this education entry?"
      />
    </div>
  );
};

export default EducationForm;
