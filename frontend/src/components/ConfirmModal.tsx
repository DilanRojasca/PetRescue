/**
 * ConfirmModal
 * ------------
 * Animated confirmation modal component
 */

import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmColor = "var(--status-open)",
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              overflow: "auto",
            }}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                position: "relative",
                background: "rgba(255, 255, 255, 0.98)",
                backdropFilter: "blur(20px)",
                borderRadius: "var(--border-radius-xl)",
                padding: "2rem",
                maxWidth: "400px",
                width: "100%",
                maxHeight: "90vh",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                zIndex: 10000,
                border: "1px solid rgba(255, 255, 255, 0.2)",
                margin: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${confirmColor} 0%, ${confirmColor}dd 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                margin: "0 auto 1.5rem",
                boxShadow: `0 8px 20px ${confirmColor}40`,
              }}
            >
              ⚠️
            </motion.div>

            {/* Title */}
            <h3
              style={{
                margin: "0 0 0.75rem 0",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                textAlign: "center",
              }}
            >
              {title}
            </h3>

            {/* Message */}
            <p
              style={{
                margin: "0 0 2rem 0",
                fontSize: "var(--font-size-base)",
                color: "var(--text-secondary)",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              {message}
            </p>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end",
              }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="btn btn-outline"
                style={{
                  minWidth: "100px",
                }}
              >
                {cancelText}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                className="btn"
                style={{
                  minWidth: "100px",
                  background: confirmColor,
                  color: "white",
                  border: "none",
                }}
              >
                {confirmText}
              </motion.button>
            </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

