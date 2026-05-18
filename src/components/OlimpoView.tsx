import { useState, useEffect } from "react";
import type { Challenge, TipoRetoBackend, UsuarioBackend } from "../Types";
import {
  getTiposReto,
  createReto,
  joinReto,
  updateRetoEstado,
  declararGanador,
} from "../service/api";
import type { ToastType } from "./Toast";

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

// ─── Utilidad: calcular fechaLimite ────────────────────────────────────────
function calcDeadline(option: string): string {
  const now = new Date();
  switch (option) {
    case "HOY": {
      now.setHours(23, 59, 59, 0);
      break;
    }
    case "24H": {
      now.setHours(now.getHours() + 24);
      break;
    }
    case "3D": {
      now.setDate(now.getDate() + 3);
      break;
    }
    case "1S": {
      now.setDate(now.getDate() + 7);
      break;
    }
    default:
      now.setHours(now.getHours() + 24);
  }
  // Formato LocalDateTime sin zona: "2024-01-15T23:59:59"
  return now.toISOString().slice(0, 19);
}

// ─── Utilidad: formatear fecha límite para mostrar ─────────────────────────
function formatDeadline(iso: string): string {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("es-CO", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

// ─── Componente Principal ──────────────────────────────────────────────────
interface OlimpoProps {
  currentUser: UsuarioBackend;
  challenges: Challenge[];
  onReloadChallenges: () => Promise<void>;
  onWinChallenge: () => void;
  showToast: (message: string, type?: ToastType) => void;
  showConfirm: (message: string, onConfirm: () => void, opts?: { subMessage?: string; confirmLabel?: string; danger?: boolean }) => void;
}

function OlimpoView({
  currentUser,
  challenges,
  onReloadChallenges,
  onWinChallenge,
  showToast,
  showConfirm,
}: OlimpoProps) {
  const userName = currentUser.nombre;

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [tiposReto, setTiposReto] = useState<TipoRetoBackend[]>([]);
  const [selectedTipoReto, setSelectedTipoReto] = useState<number | "">("");
  const [newDescription, setNewDescription] = useState("");
  const [newBet, setNewBet] = useState("");
  const [newDeadline, setNewDeadline] = useState("24H");
  const [actionError, setActionError] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  // Cargar tipos de reto al montar
  useEffect(() => {
    getTiposReto()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setTiposReto(list);
        if (list.length > 0) setSelectedTipoReto(list[0].idTipoReto);
      })
      .catch(() => setTiposReto([]));
  }, []);

  // ─── Unirse a un reto ─────────────────────────────────────────────────────
  const handleAcceptChallenge = async (challengeId: number) => {
    setActionError("");
    setLoadingAction(true);
    try {
      await joinReto(currentUser.idUsuario, challengeId);
      await onReloadChallenges();
    } catch (err: any) {
      setActionError(err.message || "Error al unirse al reto.");
    } finally {
      setLoadingAction(false);
    }
  };

  // ─── Reclamar victoria ────────────────────────────────────────────────────
  const handleClaimVictory = async (challenge: Challenge) => {
    setActionError("");
    setLoadingAction(true);
    try {
      // Buscar el idRetoParticipante del usuario actual en este reto
      const myParticipacion = challenge.participantes.find(
        (p) => p.idUsuario === currentUser.idUsuario,
      );
      if (!myParticipacion) {
        throw new Error("No estás registrado como participante en este reto.");
      }
      await declararGanador(myParticipacion.idRetoParticipante);
      await updateRetoEstado(challenge.id, "FINALIZADO");
      onWinChallenge();
      await onReloadChallenges();
      showToast("¡Victoria registrada! El reto ha sido cerrado.", "success");
    } catch (err: any) {
      setActionError(err.message || "Error al reclamar victoria.");
    } finally {
      setLoadingAction(false);
    }
  };

  // ─── Cerrar reto por tiempo ───────────────────────────────────────────────
  const handleTimeOut = (challengeId: number) => {
    showConfirm(
      "¿Cerrar este reto por tiempo agotado?",
      async () => {
        setActionError("");
        setLoadingAction(true);
        try {
          await updateRetoEstado(challengeId, "FINALIZADO");
          await onReloadChallenges();
          showToast("Reto cerrado por tiempo agotado.", "info");
        } catch (err: any) {
          setActionError(err.message || "Error al cerrar el reto.");
        } finally {
          setLoadingAction(false);
        }
      },
      { subMessage: "El reto quedará como FINALIZADO.", confirmLabel: "Cerrar reto", danger: false }
    );
  };

  // ─── Crear nuevo reto ─────────────────────────────────────────────────────
  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTipoReto) {
      setActionError("Selecciona un tipo de reto.");
      return;
    }
    setActionError("");
    setLoadingAction(true);
    let idRetoCreado: number | null = null;
    try {
      const res = await createReto({
        idUsuario: currentUser.idUsuario,
        idTipoReto: Number(selectedTipoReto),
        descripcion: newDescription,
        apuesta: newBet,
        estado: "PENDIENTE",
        fechaLimite: calcDeadline(newDeadline),
      });

      if (!res?.idReto) throw new Error("El servidor no devolvió el ID del reto.");
      idRetoCreado = res.idReto;

      // El creador se une automáticamente
      await joinReto(currentUser.idUsuario, idRetoCreado);
      idRetoCreado = null; // éxito, no hay rollback

      await onReloadChallenges();
      setNewDescription("");
      setNewBet("");
      setShowCreateForm(false);
    } catch (err: any) {
      setActionError(err.message || "Error al crear el reto.");
    } finally {
      setLoadingAction(false);
    }
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

      {/* ─── Error global de acción ────────────────────────────────────── */}
      {actionError && (
        <div
          className="mb-3"
          style={{
            background: `${T.red}18`,
            border: `1px solid ${T.red}55`,
            borderRadius: 4,
            padding: "12px 20px",
            fontFamily: T.font,
            fontSize: 13,
            color: T.red,
            letterSpacing: 1,
            textAlign: "center",
          }}
        >
          {actionError}
        </div>
      )}

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
                <GlowBtn
                  variant="red"
                  onClick={() => { setShowCreateForm(true); setActionError(""); }}
                >
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
                  const isUserParticipating = challenge.participantes.some(
                    (p) => p.idUsuario === currentUser.idUsuario,
                  );
                  const isCreator = challenge.idCreador === currentUser.idUsuario;
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
                            <Tag color={T.gold}>
                              ⏳ {formatDeadline(challenge.deadline)}
                            </Tag>
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
                                color: challenge.status === "PENDIENTE" ? T.gold : T.cyan,
                                textTransform: "uppercase",
                                letterSpacing: 2,
                              }}
                            >
                              {challenge.status === "PENDIENTE"
                                ? "PENDIENTE"
                                : "EN COMBATE"}
                            </span>
                          </div>
                        </div>

                        {/* Guerreros */}
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
                            GUERREROS ({challenge.participantes.length}):
                          </span>
                          <div className="d-flex flex-wrap gap-2">
                            {challenge.participantes.map((p) => {
                              const esYo = p.idUsuario === currentUser.idUsuario;
                              return (
                                <span
                                  key={p.idRetoParticipante}
                                  style={{
                                    fontFamily: T.font,
                                    fontSize: 11,
                                    fontWeight: 700,
                                    letterSpacing: 1,
                                    padding: "4px 12px",
                                    borderRadius: 2,
                                    background: esYo ? `${T.red}22` : T.elevated,
                                    color: esYo ? T.red : T.muted,
                                    border: `1px solid ${esYo ? T.red : T.border}`,
                                  }}
                                >
                                  {esYo ? "TÚ" : p.nombreUsuario}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="d-flex flex-column gap-2">
                          {isUserParticipating ? (
                            <GlowBtn
                              variant="cyan"
                              size="lg"
                              disabled={loadingAction}
                              onClick={() => handleClaimVictory(challenge)}
                            >
                              ✓ RECLAMAR VICTORIA
                            </GlowBtn>
                          ) : (
                            <GlowBtn
                              variant="gold"
                              size="lg"
                              disabled={loadingAction}
                              onClick={() => handleAcceptChallenge(challenge.id)}
                            >
                              ⚔️ ENTRAR A LA ARENA
                            </GlowBtn>
                          )}
                          {isCreator && (
                            <GlowBtn
                              variant="ghost"
                              size="sm"
                              disabled={loadingAction}
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
                  onClick={() => { setShowCreateForm(false); setActionError(""); }}
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
                      value={selectedTipoReto}
                      onChange={(e) => setSelectedTipoReto(Number(e.target.value))}
                      required
                    >
                      {tiposReto.length === 0 ? (
                        <option value="">Cargando tipos…</option>
                      ) : (
                        tiposReto.map((t) => (
                          <option key={t.idTipoReto} value={t.idTipoReto}>
                            {t.nombre.toUpperCase()}
                          </option>
                        ))
                      )}
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
                      <option value="24H">24 HORAS</option>
                      <option value="3D">3 DÍAS</option>
                      <option value="1S">1 SEMANA</option>
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

                {actionError && (
                  <p
                    style={{
                      fontFamily: T.font,
                      fontSize: 12,
                      color: T.red,
                      letterSpacing: 1,
                      marginBottom: 16,
                      textAlign: "center",
                    }}
                  >
                    {actionError}
                  </p>
                )}

                <GlowBtn
                  variant="red"
                  size="lg"
                  style={{ width: "100%" }}
                  type="submit"
                  disabled={loadingAction || tiposReto.length === 0}
                >
                  {loadingAction ? "ENVIANDO…" : "🔥 LANZAR A LA ARENA"}
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
