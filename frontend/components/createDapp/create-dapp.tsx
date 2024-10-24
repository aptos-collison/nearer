import React, { useState } from "react";
import templatesJson from "../../utils/template.json";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReviewDisplay from "../templates/review";

interface Template {
  html: string;
  js: string;
  name: string;
  category: string;
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

export const CreateDapp: React.FC<CreateDappProps> = ({
  currentBlinkObject,
  setCurrentBlinkObject,
  handleNextClick,
}) => {
  const [currentBlinkObjectState, setCurrentBlinkObjectState] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogComponent, setDialogComponent] = useState<JSX.Element | null>(null);

  function updateBlinkObjectTemplate(id: number, name: string) {
    const newBlinkObject = { ...currentBlinkObject, templateId: id, templateName: name };
    setCurrentBlinkObject(newBlinkObject);
    setCurrentBlinkObjectState(true);
    setSelectedTemplate(name);
  }

  const openDialog = (component: JSX.Element) => {
    setDialogComponent(component);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-between">
      <div className="grid grid-cols-3 gap-4 mt-10 w-full">
        {Object.keys(templates).map((template, index) => (
          <div key={index}>
            <p className="font-medium text-base ml-6 text-gray-400">
              <span className="mr-1 text-sm">category:</span> {templates[template].category}
            </p>
            <div
              className={`flex flex-col items-center justify-center px-2 py-4 m-2 rounded-3xl border transition-all cursor-pointer 
              ${selectedTemplate === template ? "bg-gray-100 border-2 border-green-500" : "bg-white border-transparent"}`}
              onClick={() => updateBlinkObjectTemplate(index + 1, template)}
            >
              <span className="mb-4 text-xl font-bold">{templates[template].name}</span>
              <div dangerouslySetInnerHTML={{ __html: templates[template].html }} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-3 w-full mt-8">
        {selectedTemplate === "review" && (
          <Button
            className="bg-[#12383E] hover:bg-[#12383E] text-lg text-white font-semibold py-2 px-10 rounded-lg "
            onClick={() => openDialog(<ReviewDisplay />)}
          >
            View Past Reviews
          </Button>
        )}

        <Button
          className={`text-black font-semibold text-lg py-2 rounded-lg cursor-pointer 
          ${currentBlinkObjectState ? "bg-gradient-to-r from-[#24FE41] to-[#fdfc47]" : "bg-black text-white"} px-16`}
          onClick={handleNextClick}
          disabled={!currentBlinkObjectState}
        >
          {currentBlinkObjectState ? "Next" : "Select a template"}
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="h-2/4">
          <DialogHeader>
            <DialogTitle>Reviews Received</DialogTitle>
          </DialogHeader>
          {dialogComponent}
        </DialogContent>
      </Dialog>
    </div>
  );
};
