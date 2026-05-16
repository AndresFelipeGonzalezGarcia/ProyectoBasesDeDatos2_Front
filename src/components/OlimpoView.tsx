import { useState } from "react";
import type { Challenge } from "../Types";

// ─── Design Tokens (Sincronizados) ─────────────────────────────────────────
const T = {
  bg: "#0a0a0a",
  surface: "#111111",
  elevated: "#181818",
  border: "#222222",
  red: "#e63946",
  redDim: "#7f1d1d",
  gold: "#c9a84c",
  goldDim: "#78580e",
  cyan: "#38bdf8",
  cyanDim: "#0c4a6e",
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
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 3,
      textTransform: "uppercase",
      color,
      border: `1px solid ${color}44`,
      padding: "2px 10px",
      borderRadius: 2,
    }}
  >
    {children}
  </span>
);

interface GlowBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "red" | "gold" | "cyan" | "ghost";
  size?: "sm" | "md" | "lg";
}

const GlowBtn = ({
  children,
  variant = "red",
  size = "md",
  style,
  ...props
}: GlowBtnProps) => {
  const map = {
    red: { color: T.red, bg: `${T.red}18`, hover: `${T.red}30` },
    gold: { color: T.gold, bg: `${T.gold}18`, hover: `${T.gold}30` },
    cyan: { color: T.cyan, bg: `${T.cyan}18`, hover: `${T.cyan}30` },
    ghost: { color: T.text, bg: "transparent", hover: "#ffffff0d" },
  };
  const v = map[variant];
  const sz =
    size === "sm"
      ? { padding: "6px 18px", fontSize: 11 }
      : size === "lg"
        ? { padding: "14px 40px", fontSize: 14 }
        : { padding: "10px 28px", fontSize: 12 };

  return (
    <button
      {...props}
      style={{
        fontFamily: T.font,
        fontWeight: 700,
        letterSpacing: 3,
        textTransform: "uppercase",
        color: v.color,
        background: v.bg,
        border: `1px solid ${v.color}55`,
        borderRadius: 2,
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: `0 0 16px ${v.color}22`,
        ...sz,
        ...style,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = v.hover;
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          `0 0 28px ${v.color}55`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = v.bg;
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          `0 0 16px ${v.color}22`;
      }}
    >
      {children}
    </button>
  );
};

// ─── Componente Principal ──────────────────────────────────────────────────
interface OlimpoProps {
  userName: string;
  challenges: Challenge[];
  setChallenges: (ch: Challenge[]) => void;
  onWinChallenge: () => void;
}

function OlimpoView({
  userName,
  challenges,
  setChallenges,
  onWinChallenge,
}: OlimpoProps) {
  // LÓGICA INTACTA
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newType, setNewType] = useState("FUERZA");
  const [newDescription, setNewDescription] = useState("");
  const [newBet, setNewBet] = useState("");
  const [newDeadline, setNewDeadline] = useState("24 Horas");

  const handleAcceptChallenge = (challengeId: number) => {
    setChallenges(
      challenges.map((ch) => {
        if (ch.id === challengeId && !ch.participants?.includes(userName)) {
          return {
            ...ch,
            participants: [...(ch.participants || []), userName],
          };
        }
        return ch;
      }),
    );
  };

  const handleClaimVictory = (challengeId: number) => {
    onWinChallenge();
    const updatedChallenges = challenges.filter((ch) => ch.id !== challengeId);
    setChallenges(updatedChallenges);
    alert("¡VICTORIA REGISTRADA! El reto ha sido retirado de la arena.");
  };

  const handleTimeOut = (challengeId: number) => {
    const updatedChallenges = challenges.filter((ch) => ch.id !== challengeId);
    setChallenges(updatedChallenges);
  };

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    const newChallenge: Challenge = {
      id: Date.now(),
      creator: userName,
      type: newType,
      description: newDescription,
      bet: newBet,
      status: "Abierto",
      deadline: newDeadline,
      participants: [userName],
    };
    setChallenges([newChallenge, ...challenges]);
    setNewDescription("");
    setNewBet("");
    setShowCreateForm(false);
  };

  return (
    <div className="container mt-4 mb-5 animate__animated animate__fadeIn">
      {/* ─── Estilos Inyectados para Formularios ─── */}
      <style>{`
        .buggy-input {
          background: ${T.surface}; border: 1px solid ${T.border}; color: ${T.text};
          font-family: ${T.font}; font-size: 14px; font-weight: 600; letter-spacing: 1px;
          padding: 10px 14px; border-radius: 2px; width: 100%; outline: none; transition: all 0.2s;
        }
        .buggy-input:focus { border-color: ${T.red}88; box-shadow: 0 0 12px ${T.red}22; background: ${T.elevated}; }
        .buggy-input::placeholder { color: ${T.muted}; font-weight: 400; }
        .buggy-label {
          font-family: ${T.font}; font-size: 11px; font-weight: 700; letter-spacing: 3px;
          color: ${T.muted}; text-transform: uppercase; margin-bottom: 6px; display: block;
        }
      `}</style>

      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <Tag color={T.gold}>LA ARENA GLOBAL</Tag>
        <h1
          style={{
            fontFamily: T.serif,
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 700,
            color: T.text,
            margin: "12px 0 4px",
            letterSpacing: -1,
            lineHeight: 1,
          }}
        >
          El <em style={{ fontStyle: "italic", color: T.red }}>Olimpo</em>
        </h1>
        <p
          style={{
            fontFamily: T.font,
            color: T.muted,
            fontSize: 13,
            letterSpacing: 3,
            marginTop: 8,
            textTransform: "uppercase",
          }}
        >
          BIENVENIDO,{" "}
          <span style={{ color: T.text, fontWeight: 700 }}>{userName}</span>. LA
          ARENA ESPERA.
        </p>
        <div style={{ marginTop: 24 }}>
          <Divider color={T.red} />
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          {!showCreateForm ? (
            <>
              {/* Controles del Olimpo */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3
                  style={{
                    fontFamily: T.font,
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: 2,
                    color: T.text,
                    margin: 0,
                  }}
                >
                  RETOS EN JUEGO
                </h3>
                <GlowBtn variant="red" onClick={() => setShowCreateForm(true)}>
                  + FORJAR RETO
                </GlowBtn>
              </div>

              {challenges.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 0",
                    border: `1px dashed ${T.border}`,
                    borderRadius: 4,
                    background: T.surface,
                  }}
                >
                  <div
                    style={{
                      fontSize: 40,
                      color: T.muted,
                      opacity: 0.3,
                      marginBottom: 16,
                    }}
                  >
                    ⚔️
                  </div>
                  <h4
                    style={{
                      fontFamily: T.font,
                      fontWeight: 700,
                      letterSpacing: 4,
                      fontSize: 16,
                      color: T.muted,
                      marginBottom: 8,
                    }}
                  >
                    LA ARENA ESTÁ EN SILENCIO
                  </h4>
                  <p
                    style={{ fontFamily: T.font, fontSize: 13, color: T.muted }}
                  >
                    Sé el primero en derramar sangre.
                  </p>
                </div>
              ) : (
                challenges.map((challenge) => {
                  const isUserParticipating =
                    challenge.participants?.includes(userName);
                  const isCreator = challenge.creator === userName;
                  const accent = isUserParticipating ? T.red : T.gold;

                  return (
                    <div
                      key={challenge.id}
                      className="mb-4 animate__animated animate__fadeInUp"
                      style={{
                        background: T.surface,
                        border: `1px solid ${T.border}`,
                        borderLeft: `4px solid ${accent}`,
                        borderRadius: 4,
                        padding: "24px 32px",
                        boxShadow: `0 4px 24px #00000088`,
                        position: "relative",
                        overflow: "hidden",
                        transition: "transform 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "translateY(-3px)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "translateY(0)")
                      }
                    >
                      {/* Brillo de fondo */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          background: `radial-gradient(circle at top left, ${accent}11 0%, transparent 60%)`,
                          pointerEvents: "none",
                        }}
                      />

                      <div style={{ position: "relative", zIndex: 1 }}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="d-flex gap-2">
                            <Tag color={T.muted}>{challenge.type}</Tag>
                            <Tag color={T.gold}>⏳ {challenge.deadline}</Tag>
                          </div>
                          <div
                            style={{
                              fontFamily: T.font,
                              fontSize: 12,
                              letterSpacing: 2,
                              color: T.muted,
                              textTransform: "uppercase",
                            }}
                          >
                            Líder:{" "}
                            <span style={{ color: T.text, fontWeight: 700 }}>
                              {challenge.creator}
                            </span>
                          </div>
                        </div>

                        <h4
                          style={{
                            fontFamily: T.serif,
                            fontSize: 24,
                            fontWeight: 700,
                            color: T.text,
                            margin: "16px 0",
                            letterSpacing: 0.5,
                          }}
                        >
                          {challenge.description}
                        </h4>

                        {/* Caja de Apuesta */}
                        <div
                          className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4"
                          style={{
                            background: T.elevated,
                            border: `1px solid ${T.border}`,
                            padding: "16px 20px",
                            borderRadius: 2,
                          }}
                        >
                          <div>
                            <span
                              style={{
                                fontFamily: T.font,
                                fontSize: 10,
                                letterSpacing: 3,
                                color: T.muted,
                                textTransform: "uppercase",
                                display: "block",
                                marginBottom: 4,
                              }}
                            >
                              BOTÍN / APUESTA
                            </span>
                            <span
                              style={{
                                fontFamily: T.font,
                                fontSize: 18,
                                fontWeight: 700,
                                color: T.red,
                                textTransform: "uppercase",
                                letterSpacing: 1,
                              }}
                            >
                              {challenge.bet}
                            </span>
                          </div>
                          <div className="text-md-end">
                            <span
                              style={{
                                fontFamily: T.font,
                                fontSize: 10,
                                letterSpacing: 3,
                                color: T.muted,
                                textTransform: "uppercase",
                                display: "block",
                                marginBottom: 4,
                              }}
                            >
                              ESTADO
                            </span>
                            <span
                              style={{
                                fontFamily: T.font,
                                fontSize: 14,
                                fontWeight: 700,
                                color: T.gold,
                                textTransform: "uppercase",
                                letterSpacing: 2,
                              }}
                            >
                              EN COMBATE
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <span
                            style={{
                              fontFamily: T.font,
                              fontSize: 11,
                              letterSpacing: 2,
                              color: T.muted,
                              textTransform: "uppercase",
                              display: "block",
                              marginBottom: 8,
                            }}
                          >
                            GUERREROS ({challenge.participants?.length || 0}):
                          </span>
                          <div className="d-flex flex-wrap gap-2">
                            {challenge.participants?.map((p, index) => (
                              <span
                                key={index}
                                style={{
                                  fontFamily: T.font,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  letterSpacing: 1,
                                  padding: "4px 12px",
                                  borderRadius: 2,
                                  background:
                                    p === userName ? `${T.red}22` : T.elevated,
                                  color: p === userName ? T.red : T.muted,
                                  border: `1px solid ${p === userName ? T.red : T.border}`,
                                }}
                              >
                                {p === userName ? "TÚ" : p}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="d-flex flex-column gap-2">
                          {isUserParticipating ? (
                            <GlowBtn
                              variant="cyan"
                              size="lg"
                              onClick={() => handleClaimVictory(challenge.id)}
                            >
                              ✓ RECLAMAR VICTORIA
                            </GlowBtn>
                          ) : (
                            <GlowBtn
                              variant="gold"
                              size="lg"
                              onClick={() =>
                                handleAcceptChallenge(challenge.id)
                              }
                            >
                              ⚔️ ENTRAR A LA ARENA
                            </GlowBtn>
                          )}
                          {isCreator && (
                            <GlowBtn
                              variant="ghost"
                              size="sm"
                              onClick={() => handleTimeOut(challenge.id)}
                              style={{ marginTop: 8 }}
                            >
                              ✕ Cerrar por tiempo agotado
                            </GlowBtn>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          ) : (
            /* ─── Formulario de Creación ────────────────────────────────────── */
            <div
              className="animate__animated animate__zoomIn"
              style={{
                background: T.elevated,
                border: `1px solid ${T.border}`,
                borderTop: `3px solid ${T.red}`,
                padding: "32px",
                borderRadius: 4,
                boxShadow: `0 16px 48px #000000`,
              }}
            >
              <div
                className="d-flex justify-content-between align-items-center mb-4"
                style={{
                  borderBottom: `1px solid ${T.border}`,
                  paddingBottom: 16,
                }}
              >
                <h3
                  style={{
                    fontFamily: T.font,
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: 2,
                    color: T.text,
                    margin: 0,
                  }}
                >
                  FORJAR NUEVO RETO
                </h3>
                <GlowBtn
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                >
                  ✕ CANCELAR
                </GlowBtn>
              </div>

              <form onSubmit={handleCreateChallenge}>
                <div className="row mb-3 gx-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label className="buggy-label">DISCIPLINA</label>
                    <select
                      className="buggy-input"
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                    >
                      <option value="FUERZA">FUERZA BRUTA</option>
                      <option value="RESISTENCIA">RESISTENCIA</option>
                      <option value="VOLUMEN">VOLUMEN</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="buggy-label">PLAZO</label>
                    <select
                      className="buggy-input"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                    >
                      <option value="HOY">HOY MISMO</option>
                      <option value="24 Horas">24 HORAS</option>
                      <option value="3 Días">3 DÍAS</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="buggy-label">MISIÓN</label>
                  <textarea
                    className="buggy-input"
                    rows={2}
                    required
                    placeholder="Ej: Lograr 100 flexiones estrictas sin descansar..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    style={{ resize: "none" }}
                  />
                </div>

                <div className="mb-5">
                  <label className="buggy-label">BOTÍN / APUESTA</label>
                  <input
                    type="text"
                    className="buggy-input"
                    required
                    placeholder="Ej: El perdedor paga el mes del gimnasio"
                    value={newBet}
                    onChange={(e) => setNewBet(e.target.value)}
                    style={{
                      color: T.red,
                      borderColor: `${T.red}55`,
                      fontWeight: 700,
                    }}
                  />
                </div>

                <GlowBtn
                  variant="red"
                  size="lg"
                  style={{ width: "100%" }}
                  type="submit"
                >
                  🔥 LANZAR A LA ARENA
                </GlowBtn>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OlimpoView;
