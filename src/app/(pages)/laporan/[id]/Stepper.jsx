"use client";

import React from "react";
import { Check } from "lucide-react";

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-between items-center w-full">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center w-full">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full border-4 ${
              index === currentStep ? "bg-primary text-white border-primary" : "bg-white text-gray-500 border-primary"
            }`}
          >
            {index === currentStep ? <Check className="text-white" /> : ""}
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-2 bg-gray-300 mx-2 relative">
              <div
                className="absolute top-0 left-0 h-full bg-primary"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
          )}
          <p className="mt-2 text-center">{step}</p>
        </div>
      ))}
    </div>
  );
};

export default Stepper;