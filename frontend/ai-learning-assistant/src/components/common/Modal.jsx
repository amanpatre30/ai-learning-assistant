import React from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
 if (!isOpen) {
  return null;
 }

 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
   <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">

    {/* Close Button */}
    <button
     type="button"
     onClick={onClose}
     className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
    >
     <X className="h-5 w-5" />
    </button>

    {/* Header */}
    <div className="border-b border-slate-200 p-6 pr-16">
     <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
      {title}
     </h3>
    </div>

    {/* Content */}
    <div className="p-6 text-slate-700">
     {children}
    </div>

   </div>
  </div>
 );
};

export default Modal;