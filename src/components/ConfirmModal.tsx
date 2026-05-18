interface ConfirmModalProps {
  message: string;
  subMessage?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

function ConfirmModal({
  message,
  subMessage,
  confirmLabel = "Confirmar",
  onConfirm,
  onCancel,
  danger = true,
}: ConfirmModalProps) {
  const accentColor = danger ? "#e63946" : "#c9a84c";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "#111111",
          border: `1px solid #222222`,
          borderTop: `3px solid ${accentColor}`,
          borderRadius: 4,
          padding: "32px 28px 24px",
          maxWidth: 440,
          width: "100%",
          boxShadow: `0 24px 64px #00000099, 0 0 40px ${accentColor}22`,
          animation: "modal-in 0.2s ease-out",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Icono */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 3,
            background: `${accentColor}15`,
            border: `1px solid ${accentColor}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            marginBottom: 20,
          }}
        >
          {danger ? "⚠" : "?"}
        </div>

        {/* Mensaje principal */}
        <p
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 1,
            color: "#f0ede8",
            margin: "0 0 8px",
            lineHeight: 1.3,
          }}
        >
          {message}
        </p>

        {/* Submensaje */}
        {subMessage && (
          <p
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 13,
              color: "#5a5a5a",
              margin: "0 0 28px",
              letterSpacing: 1,
            }}
          >
            {subMessage}
          </p>
        )}
        {!subMessage && <div style={{ marginBottom: 28 }} />}

        {/* Divisor */}
        <div
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, #22222288, transparent)`,
            marginBottom: 20,
          }}
        />

        {/* Botones */}
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          {/* Cancelar */}
          <button
            onClick={onCancel}
            style={{
              background: "none",
              border: "1px solid #333333",
              borderRadius: 2,
              color: "#5a5a5a",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              padding: "8px 20px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "#555555";
              e.currentTarget.style.color = "#f0ede8";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "#333333";
              e.currentTarget.style.color = "#5a5a5a";
            }}
          >
            Cancelar
          </button>

          {/* Confirmar */}
          <button
            onClick={() => { onConfirm(); onCancel(); }}
            style={{
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}66`,
              borderRadius: 2,
              color: accentColor,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              padding: "8px 20px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${accentColor}30`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = `${accentColor}18`;
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);     }
        }
      `}</style>
    </div>
  );
}

export default ConfirmModal;
