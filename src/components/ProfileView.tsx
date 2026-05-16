import pesa from "../assets/pesa.png";
import mano from "../assets/mano.png";
import torre from "../assets/torre.png";
import copa from "../assets/copa.png";

// ─── Design Tokens (Sincronizados) ─────────────────────────────────────────
const T = {
  bg: "#0a0a0a",
  surface: "#111111",
  elevated: "#181818",
  border: "#222222",
  red: "#e63946",
  redDim: "#7f1d1d",
  gold: "#c9a84c",
  cyan: "#38bdf8",
  text: "#f0ede8",
  muted: "#5a5a5a",
  font: "'Barlow Condensed', sans-serif",
  serif: "'Playfair Display', serif",
};

// ─── Micro-componentes UI ──────────────────────────────────────────────────
const Divider = ({ color = T.red }: { color?: string }) => (
  <div
    style={{
      height: 1,
      background: `linear-gradient(90deg, transparent, ${color}88, transparent)`,
      margin: "0 auto",
      width: "100%",
    }}
  />
);

const Tag = ({
  children,
  color = T.red,
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <span
    style={{
      fontFamily: T.font,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 3,
      textTransform: "uppercase",
      color,
      border: `1px solid ${color}44`,
      padding: "4px 12px",
      borderRadius: 2,
      background: `${color}11`,
    }}
  >
    {children}
  </span>
);

interface ProfileProps {
  userName: string;
  totalWorkouts: number;
  challengesWon: number;
  totalVolumeKg: number;
}

function ProfileView({
  userName,
  totalWorkouts,
  challengesWon,
  totalVolumeKg,
}: ProfileProps) {
  // ─── LÓGICA INTACTA ───
  const stats = {
    totalWorkouts: totalWorkouts,
    totalVolumeKg: totalVolumeKg,
    challengesWon: challengesWon,
    level: totalWorkouts > 10 ? "GUERRERO DE ÉLITE" : "INICIADO DEL OLIMPO",
  };

  const achievements = [
    {
      id: 1,
      name: "PRIMER LEVANTAMIENTO",
      desc: "Completaste tu primer entrenamiento.",
      image: pesa,
      unlocked: totalWorkouts >= 1,
    },
    {
      id: 2,
      name: "TITÁN DE ACERO",
      desc: "Levantaste más de 10,000 kg en total.",
      image: mano,
      unlocked: totalVolumeKg >= 10000,
    },
    {
      id: 3,
      name: "TORRE DE HIERRO",
      desc: "Lograste ganar 5 retos.",
      image: torre,
      unlocked: challengesWon >= 5,
    },
    {
      id: 4,
      name: "DISCIPLINA",
      desc: "Completaste 10 entrenamientos consecutivos.",
      image: copa,
      unlocked: totalWorkouts >= 10,
    },
  ];

  return (
    <div className="container mt-4 mb-5 animate__animated animate__fadeIn">
      {/* ─── Encabezado del Perfil ─── */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div
          style={{
            width: 120,
            height: 120,
            margin: "0 auto 24px",
            borderRadius: "50%",
            background: `${T.red}15`,
            border: `2px solid ${T.red}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 56,
            fontFamily: T.serif,
            color: T.red,
            boxShadow: `0 0 40px ${T.red}33`,
            textShadow: `0 0 16px ${T.red}88`,
          }}
        >
          {userName.charAt(0).toUpperCase()}
        </div>

        <h1
          style={{
            fontFamily: T.serif,
            fontSize: "clamp(40px, 6vw, 64px)",
            fontWeight: 700,
            color: T.text,
            margin: "0 0 16px",
            letterSpacing: -1,
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          {userName}
        </h1>

        <Tag color={totalWorkouts > 10 ? T.gold : T.red}>{stats.level}</Tag>

        <div style={{ marginTop: 40 }}>
          <Divider color={T.red} />
        </div>
      </div>

      <div className="row">
        {/* ─── Columna de Estadísticas ─── */}
        <div className="col-md-5 mb-5 mb-md-0">
          <h3
            style={{
              fontFamily: T.font,
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 2,
              color: T.text,
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            ESTADÍSTICAS{" "}
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </h3>

          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderLeft: `3px solid ${T.cyan}`,
              borderRadius: 4,
              padding: "24px",
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: `0 8px 24px #00000066`,
            }}
          >
            <span
              style={{
                fontFamily: T.font,
                fontSize: 13,
                letterSpacing: 2,
                color: T.muted,
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              RUTINAS COMPLETADAS
            </span>
            <span
              style={{
                fontFamily: T.font,
                fontSize: 28,
                fontWeight: 700,
                color: T.cyan,
              }}
            >
              {stats.totalWorkouts}
            </span>
          </div>

          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderLeft: `3px solid ${T.red}`,
              borderRadius: 4,
              padding: "24px",
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: `0 8px 24px #00000066`,
            }}
          >
            <span
              style={{
                fontFamily: T.font,
                fontSize: 13,
                letterSpacing: 2,
                color: T.muted,
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              VOLUMEN TOTAL
            </span>
            <span
              style={{
                fontFamily: T.font,
                fontSize: 28,
                fontWeight: 700,
                color: T.red,
              }}
            >
              {stats.totalVolumeKg.toLocaleString()}{" "}
              <span style={{ fontSize: 14, color: T.muted }}>KG</span>
            </span>
          </div>

          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderLeft: `3px solid ${T.gold}`,
              borderRadius: 4,
              padding: "24px",
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: `0 8px 24px #00000066`,
            }}
          >
            <span
              style={{
                fontFamily: T.font,
                fontSize: 13,
                letterSpacing: 2,
                color: T.muted,
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              RETOS GANADOS
            </span>
            <span
              style={{
                fontFamily: T.font,
                fontSize: 28,
                fontWeight: 700,
                color: T.gold,
              }}
            >
              {stats.challengesWon}
            </span>
          </div>
        </div>

        {/* ─── Columna de Logros ─── */}
        <div className="col-md-7">
          <h3
            style={{
              fontFamily: T.font,
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 2,
              color: T.text,
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            MEDALLAS DE GUERRA{" "}
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </h3>

          <div className="row gx-3 gy-3">
            {achievements.map((ach) => (
              <div key={ach.id} className="col-sm-6">
                <div
                  style={{
                    height: "100%",
                    background: T.surface,
                    border: `1px solid ${ach.unlocked ? T.red : T.border}`,
                    borderRadius: 4,
                    padding: "32px 24px",
                    textAlign: "center",
                    opacity: ach.unlocked ? 1 : 0.4,
                    filter: ach.unlocked ? "none" : "grayscale(100%)",
                    transition: "all 0.3s",
                    boxShadow: ach.unlocked ? `0 8px 32px ${T.red}15` : "none",
                  }}
                >
                  <div style={{ marginBottom: 20 }}>
                    {ach.image && (
                      <img
                        src={ach.image}
                        alt={ach.name}
                        style={{
                          width: 64,
                          height: 64,
                          objectFit: "contain",
                          filter: ach.unlocked
                            ? "drop-shadow(0 0 12px rgba(230, 57, 70, 0.6))"
                            : "none",
                        }}
                      />
                    )}
                  </div>
                  <h5
                    style={{
                      fontFamily: T.font,
                      fontSize: 16,
                      fontWeight: 700,
                      letterSpacing: 2,
                      color: ach.unlocked ? T.text : T.muted,
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    {ach.name}
                  </h5>
                  <p
                    style={{
                      fontFamily: T.font,
                      fontSize: 12,
                      letterSpacing: 1,
                      color: T.muted,
                      marginBottom: ach.unlocked ? 24 : 0,
                    }}
                  >
                    {ach.desc}
                  </p>

                  {ach.unlocked && (
                    <div style={{ display: "inline-block" }}>
                      <Tag color={T.red}>DESBLOQUEADO</Tag>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
