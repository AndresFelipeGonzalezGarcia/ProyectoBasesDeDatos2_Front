import bug from "../assets/bug.png";

interface NavBarProps {
  currentView: "routines" | "workout" | "olimpo" | "profile" | "admin" | "historial";
  onViewChange: (
    view: "routines" | "workout" | "olimpo" | "profile" | "admin" | "historial",
  ) => void;
  onLogout: () => void;
  userName: string;
}

// ─── Design tokens (mirror App.tsx) ─────────────────────────────────────────
const T = {
  bg: "#0a0a0a",
  surface: "#111111",
  border: "#1e1e1e",
  red: "#e63946",
  gold: "#c9a84c",
  text: "#f0ede8",
  muted: "#5a5a5a",
  font: "'Barlow Condensed', sans-serif",
  serif: "'Playfair Display', serif",
};

type View = "routines" | "workout" | "olimpo" | "profile" | "admin" | "historial";

interface NavItemProps {
  label: React.ReactNode;
  view: View;
  currentView: View;
  onViewChange: (v: View) => void;
  accent?: string;
}

const NavItem = ({
  label,
  view,
  currentView,
  onViewChange,
  accent = T.red,
}: NavItemProps) => {
  const active = currentView === view;
  return (
    <button
      onClick={() => onViewChange(view)}
      style={{
        background: "none",
        border: "none",
        borderBottom: active ? `2px solid ${accent}` : "2px solid transparent",
        color: active ? accent : T.muted,
        fontFamily: T.font,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: 3,
        textTransform: "uppercase",
        cursor: "pointer",
        padding: "6px 2px",
        transition: "color 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!active)
          (e.currentTarget as HTMLButtonElement).style.color = T.text;
      }}
      onMouseLeave={(e) => {
        if (!active)
          (e.currentTarget as HTMLButtonElement).style.color = T.muted;
      }}
    >
      {label}
    </button>
  );
};

function NavBar({
  currentView,
  onViewChange,
  onLogout,
  userName,
}: NavBarProps) {
  return (
    <>
      {/* Google Fonts (guard: only injected if not already in App.tsx) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');
      `}</style>

      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: T.bg,
          borderBottom: `1px solid ${T.border}`,
          boxShadow: "0 4px 32px #00000099",
        }}
      >
        {/* thin red top accent line */}
        <div
          style={{
            height: 2,
            background: `linear-gradient(90deg, transparent, ${T.red}, transparent)`,
          }}
        />

        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          {/* ── Brand ──────────────────────────────────────────────────── */}
          <button
            onClick={() => onViewChange("routines")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: 0,
              flexShrink: 0,
            }}
          >
            <img
              src={bug}
              alt="Logo"
              width={44}
              height={44}
              style={{ filter: "drop-shadow(0 0 6px #e6394644)" }}
            />
            <span
              style={{
                fontFamily: T.serif,
                fontWeight: 700,
                fontSize: 20,
                color: T.text,
                letterSpacing: 1,
                lineHeight: 1,
              }}
            >
              Buggy's <em style={{ fontStyle: "italic", color: T.red }}>Fit</em>
            </span>
          </button>

          {/* ── Nav links ──────────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              flexWrap: "wrap",
            }}
          >
            <NavItem
              label="Rutinas"
              view="routines"
              currentView={currentView}
              onViewChange={onViewChange}
            />
            <NavItem
              label="Entrenar"
              view="workout"
              currentView={currentView}
              onViewChange={onViewChange}
            />
            <NavItem
              label={
                <>
                  👑 <span style={{ color: T.gold }}>Olimpo</span>
                </>
              }
              view="olimpo"
              currentView={currentView}
              onViewChange={onViewChange}
              accent={T.gold}
            />
            <NavItem
              label="Historial"
              view="historial"
              currentView={currentView}
              onViewChange={onViewChange}
            />
            <NavItem
              label="Perfil"
              view="profile"
              currentView={currentView}
              onViewChange={onViewChange}
            />

            {userName.toUpperCase() === "ADMIN" && (
              <>
                {/* vertical divider */}
                <div style={{ width: 1, height: 18, background: T.border }} />
                <NavItem
                  label="Admin"
                  view="admin"
                  currentView={currentView}
                  onViewChange={onViewChange}
                  accent={T.red}
                />
              </>
            )}

            {/* vertical divider */}
            <div style={{ width: 1, height: 18, background: T.border }} />

            {/* Logout */}
            <button
              onClick={onLogout}
              style={{
                background: "none",
                border: "none",
                fontFamily: T.font,
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: 3,
                color: T.muted,
                cursor: "pointer",
                padding: 0,
                textTransform: "uppercase",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = T.text)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = T.muted)
              }
            >
              Salir
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
