import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const ICONS: Record<ToastType, string> = {
  success: "✓",
  error:   "✕",
  info:    "⚡",
};

const COLORS: Record<ToastType, { border: string; glow: string; icon: string }> = {
  success: { border: "#c9a84c", glow: "#c9a84c33", icon: "#c9a84c" },
  error:   { border: "#e63946", glow: "#e6394633", icon: "#e63946" },
  info:    { border: "#38bdf8", glow: "#38bdf833", icon: "#38bdf8" },
};

function Toast({ message, type, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);
  const c = COLORS[type];

  useEffect(() => {
    // Slide in
    const t1 = setTimeout(() => setVisible(true), 10);
    // Auto-close after 3.5s
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 350);
    }, 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: 80,
        right: visible ? 24 : -420,
        zIndex: 9999,
        transition: "right 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        maxWidth: 380,
        width: "calc(100vw - 48px)",
      }}
    >
      <div
        style={{
          background: "#111111",
          border: `1px solid ${c.border}`,
          borderLeft: `4px solid ${c.border}`,
          borderRadius: 4,
          boxShadow: `0 8px 32px #00000088, 0 0 24px ${c.glow}`,
          padding: "16px 20px",
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
        }}
      >
        {/* Icono */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 2,
            background: `${c.border}18`,
            border: `1px solid ${c.border}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 700,
            color: c.icon,
            flexShrink: 0,
            fontFamily: "monospace",
          }}
        >
          {ICONS[type]}
        </div>

        {/* Mensaje */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: c.border,
              marginBottom: 4,
            }}
          >
            {type === "success" ? "VICTORIA" : type === "error" ? "ERROR" : "SISTEMA"}
          </div>
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              color: "#f0ede8",
              lineHeight: 1.3,
            }}
          >
            {message}
          </div>
        </div>

        {/* Botón cerrar */}
        <button
          onClick={() => { setVisible(false); setTimeout(onClose, 350); }}
          style={{
            background: "none",
            border: "none",
            color: "#5a5a5a",
            cursor: "pointer",
            fontSize: 16,
            padding: 0,
            lineHeight: 1,
            flexShrink: 0,
            transition: "color 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#f0ede8")}
          onMouseLeave={e => (e.currentTarget.style.color = "#5a5a5a")}
        >
          ✕
        </button>
      </div>

      {/* Barra de progreso */}
      <div
        style={{
          height: 2,
          background: c.border,
          borderRadius: "0 0 4px 4px",
          animation: "toast-progress 3.5s linear forwards",
          transformOrigin: "left",
        }}
      />
      <style>{`
        @keyframes toast-progress {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}

export default Toast;
