import { useEffect } from "react";

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL CONTENT */}
      <div className="relative z-50">
        {children}
      </div>
    </div>
  );
};

export default Modal;
