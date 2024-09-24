import React, { useState } from 'react';
import templatesJson from '../../utils/Templates.json';

interface Template {
  html: string;
  js: string;
  name: string;
}

interface Templates {
  [key: string]: Template;
}

const templates: Templates = templatesJson as Templates;

interface CreateDappProps {
  currentBlinkObject: any; 
  setCurrentBlinkObject: React.Dispatch<React.SetStateAction<any>>; 
  handleNextClick: () => void;
}

export const CreateDapp: React.FC<CreateDappProps> = ({ currentBlinkObject, setCurrentBlinkObject, handleNextClick }) => {
  const [currentBlinkObjectState, setCurrentBlinkObjectState] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  function updateBlinkObjectTemplate(id: number, name: string) {
    const newBlinkObject = { ...currentBlinkObject, templateId: id, templateName: name };
    setCurrentBlinkObject(newBlinkObject);
    setCurrentBlinkObjectState(true);
    setSelectedTemplate(name);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen zoom-70">
      <h4 className="mt-12 text-2xl">Choose A Template For Your Blink</h4>
      <div className="flex flex-row justify-between items-center mt-10">
        {Object.keys(templates).map((template, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center p-5 m-2 rounded-3xl border transition-all cursor-pointer 
              ${selectedTemplate === template ? "bg-gray-100 border-sky-500" : "bg-white border-transparent"}`}
            onClick={() => updateBlinkObjectTemplate(index + 1, template)}
          >
            <span className="mb-5 text-xl font-bold">{templates[template].name}</span>
            <div dangerouslySetInnerHTML={{ __html: templates[template].html }} />
          </div>
        ))}
      </div>
      <button
        className={`mt-2 text-white text-lg py-2 rounded-lg cursor-pointer 
          ${currentBlinkObjectState ? "bg-blue-500" : "bg-black"} w-64 h-12`}
        onClick={handleNextClick}
        disabled={!currentBlinkObjectState}
      >
        {currentBlinkObjectState ? "Next" : "Choose a template"}
      </button>
    </div>
  );
}
