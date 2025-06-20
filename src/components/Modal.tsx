'use client';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-75" onClick={onClose}></div>

      <div className="flex flex-col max-w-md w-full p-4 bg-white rounded relative z-10">
        <button title="Закрыть" className="px-2 self-end font-bold hover:text-red-500" onClick={onClose}>
          ✕
        </button>
        <h2 className="text-xl mb-2 font-bold text-center">{title}</h2>

        {children}
      </div>
    </div>
  );
}