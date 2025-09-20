import React from "react";

function ModalContainer({ isOpen, onClose, children, title }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 transition-all bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-[999]`}
      onClick={onClose}
    >
      <div
        className={`relative bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-lg duration-300 ${
          isOpen ? "scale-100" : "scale-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-5">
          {title && (
            <header className="flex justify-between items-center">
              <h1 className="text-xl font-semibold">{title}</h1>
              <button
                onClick={onClose}
                className=" text-2xl text-gray-500 hover:text-gray-800 transition-colors duration-300"
                aria-label="Tutup Modal"
              >
                &times;{" "}
              </button>
            </header>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}

export default ModalContainer;
