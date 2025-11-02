import React from 'react';
import type { StylingOptions, FontStyle } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { themePresets } from '../../constants';

interface Props {
  data: StylingOptions;
  updateData: (data: StylingOptions) => void;
}

const fontOptions = [
  { value: 'Helvetica', label: 'Helvetica (Sans-Serif)' },
  { value: 'Arial', label: 'Arial (Sans-Serif)' },
  { value: 'Roboto', label: 'Roboto (Sans-Serif)' },
  { value: 'Lato', label: 'Lato (Sans-Serif)' },
  { value: 'Calibri', label: 'Calibri (Sans-Serif)' },
  { value: 'Charter', label: 'Charter (Serif)' },
  { value: 'Georgia', label: 'Georgia (Serif)' },
  { value: 'Times New Roman', label: 'Times New Roman (Serif)' },
  { value: 'Garamond', label: 'Garamond (Serif)' },
];

const StyleEditor: React.FC<{ title: string; style: FontStyle; onChange: (newStyle: FontStyle) => void; showWeightControl?: boolean }> = ({ title, style, onChange, showWeightControl = false }) => {
  return (
    <div className="p-4 border border-neutral-200 rounded-lg">
      <h3 className="font-semibold text-neutral-800 mb-3">{title}</h3>
      <div className={`grid grid-cols-1 sm:grid-cols-${showWeightControl ? '4' : '3'} gap-4 items-end`}>
        <Select
          label="Font Family"
          id={`${title}-family`}
          options={fontOptions}
          value={style.family}
          onChange={(e) => onChange({ ...style, family: e.target.value })}
        />
        <Input
          label="Font Size (pt)"
          id={`${title}-size`}
          type="number"
          value={style.size}
          onChange={(e) => onChange({ ...style, size: Number(e.target.value) })}
        />
        {showWeightControl && (
            <Select
                label="Font Weight"
                id={`${title}-weight`}
                options={[{value: 'normal', label: 'Normal'}, {value: 'bold', label: 'Bold'}]}
                value={style.weight}
                onChange={(e) => onChange({ ...style, weight: e.target.value as 'normal' | 'bold' })}
            />
        )}
        <div className="flex flex-col">
           <label htmlFor={`${title}-color`} className="block text-sm font-medium text-neutral-700 mb-1">Color</label>
            <input
                id={`${title}-color`}
                type="color"
                value={style.color}
                onChange={(e) => onChange({ ...style, color: e.target.value })}
                className="w-full h-10 px-1 py-1 bg-white border border-neutral-300 rounded-md shadow-sm cursor-pointer"
            />
        </div>
      </div>
    </div>
  );
};


const StylingForm: React.FC<Props> = ({ data, updateData }) => {
  const handleStyleChange = (key: keyof StylingOptions, newStyle: FontStyle) => {
    updateData({ ...data, [key]: newStyle });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Customize Appearance</h2>
        <p className="text-sm text-neutral-600">
          Fine-tune the typography of your resume. Select a preset theme or customize every detail, from fonts and colors to line spacing.
        </p>
         <p className="mt-2 text-sm text-neutral-600">
          <span className="font-semibold">Pro Tip:</span> You can also change the layout of your resume! Just go back to any previous step and drag-and-drop the sections in the progress bar at the top to reorder them.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">Theme Presets</h3>
            <div className="flex flex-wrap gap-2">
                {themePresets.map(preset => (
                    <button
                        key={preset.name}
                        onClick={() => updateData(preset.styling)}
                        className="px-4 py-2 text-sm font-semibold text-primary-700 bg-primary-100 rounded-md hover:bg-primary-200 transition-colors"
                    >
                        {preset.name}
                    </button>
                ))}
            </div>
        </div>

        <div className="p-4 border border-neutral-200 rounded-lg">
            <h3 className="font-semibold text-neutral-800 mb-3">Global Styles</h3>
            <div className="max-w-xs">
                <Input
                    label="Line Spacing"
                    id="lineHeight"
                    type="number"
                    step="0.05"
                    min="1"
                    max="2"
                    value={data.lineHeight}
                    onChange={(e) => updateData({ ...data, lineHeight: Number(e.target.value) })}
                />
            </div>
        </div>
        
        <StyleEditor
          title="Main Body Font"
          style={data.font}
          onChange={(newStyle) => handleStyleChange('font', newStyle)}
          showWeightControl={true}
        />
        <StyleEditor
          title="Main Heading (Your Name)"
          style={data.heading}
          onChange={(newStyle) => handleStyleChange('heading', newStyle)}
          showWeightControl={true}
        />
        <StyleEditor
          title="Sub-Headings (Role, University)"
          style={data.subheading}
          onChange={(newStyle) => handleStyleChange('subheading', newStyle)}
          showWeightControl={true}
        />
        <StyleEditor
          title="Section Titles (Experience, Education)"
          style={data.sectionTitle}
          onChange={(newStyle) => handleStyleChange('sectionTitle', newStyle)}
          showWeightControl={true}
        />
      </div>
    </div>
  );
};

export default StylingForm;