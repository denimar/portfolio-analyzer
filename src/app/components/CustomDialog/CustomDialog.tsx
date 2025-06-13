import { FC, ReactNode } from "react";

interface CustomDialogProps {
  className?: string;
  title: string;
  message: ReactNode;
  open: boolean;
  actionButtons?: ReactNode;
  onClose?: () => void;
}

const CustomDialog: FC<CustomDialogProps> = ({
  className = '',
  title,
  message,
  open,
  actionButtons,
  onClose,
}) => {

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/35">
      <div className={`bg-white w-96 rounded-md shadow-xl animate-fade-in border border-gray-500 ${className}`}>
        <div className="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-600 opacity-80 rounded-t-md flex justify-between items-center">
          <h2 className="text-white font-semibold">{title}</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 font-semibold"
            >
              &times;
            </button>
          )}
        </div>
        <div className="text-gray-600 text-sm py-7 px-4">
          {message}
        </div>
        {actionButtons && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex flex-row justify-end gap-2">
            {actionButtons}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDialog;