import React, { createContext, useContext, useState, useCallback } from "react";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiX,
  FiAlertTriangle,
} from "react-icons/fi";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = "info", duration = 3500) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toast = {
    success: (msg, dur) => addToast(msg, "success", dur),
    error: (msg, dur) => addToast(msg, "error", dur),
    info: (msg, dur) => addToast(msg, "info", dur),
    warning: (msg, dur) => addToast(msg, "warning", dur),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              t.type === "success"
                ? "bg-emerald-50/95 border-emerald-200 text-emerald-900"
                : t.type === "error"
                ? "bg-rose-50/95 border-rose-200 text-rose-900"
                : t.type === "warning"
                ? "bg-amber-50/95 border-amber-200 text-amber-900"
                : "bg-slate-900/95 border-slate-700 text-white"
            }`}
          >
            <span className="text-xl flex-shrink-0 mt-0.5">
              {t.type === "success" && <FiCheckCircle className="text-emerald-600" />}
              {t.type === "error" && <FiAlertCircle className="text-rose-600" />}
              {t.type === "warning" && <FiAlertTriangle className="text-amber-600" />}
              {t.type === "info" && <FiInfo className="text-blue-400" />}
            </span>
            <div className="flex-1 text-sm font-medium leading-relaxed">
              {t.message}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 rounded-md hover:bg-black/5 transition text-current opacity-70 hover:opacity-100"
            >
              <FiX className="text-base" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context.toast;
};

