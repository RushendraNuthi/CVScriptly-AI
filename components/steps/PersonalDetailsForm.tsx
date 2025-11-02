import React from 'react';
import type { PersonalDetails } from '../../types';
import Input from '../ui/Input';

interface Props {
  data: PersonalDetails;
  updateData: (data: PersonalDetails) => void;
}

const PersonalDetailsForm: React.FC<Props> = ({ data, updateData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-neutral-900">Personal Details</h2>
       <p className="text-sm text-neutral-600">This information will appear at the top of your resume.</p>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Full Name" id="name" name="name" value={data.name} onChange={handleChange} />
        <Input label="Location" id="location" name="location" placeholder="e.g., San Francisco, CA" value={data.location} onChange={handleChange} />
        <Input label="Email" id="email" name="email" type="email" value={data.email} onChange={handleChange} />
        <Input label="Phone Number" id="phone" name="phone" type="tel" value={data.phone} onChange={handleChange} />
        <Input label="Website" id="website" name="website" placeholder="yourwebsite.com" value={data.website} onChange={handleChange} />
        <Input label="LinkedIn" id="linkedin" name="linkedin" placeholder="linkedin.com/in/yourusername" value={data.linkedin} onChange={handleChange} />
        <Input label="GitHub" id="github" name="github" placeholder="github.com/yourusername" value={data.github} onChange={handleChange} />
      </div>
    </div>
  );
};

export default PersonalDetailsForm;