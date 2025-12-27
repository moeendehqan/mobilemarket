import React from "react";

interface LabelInputProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string | null;
}

export const LabelInput: React.FC<LabelInputProps> = ({ label, children, required, error }) => (
  <div className="flex flex-col gap-3">
    <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
      <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
      {label}
      {required && <span className="text-red-500 mr-1 text-lg">*</span>}
    </label>
    {children}
    {error && (
      <span className="text-red-500 text-sm mt-1 font-medium flex items-center gap-1">
        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
        {error}
      </span>
    )}
  </div>
);