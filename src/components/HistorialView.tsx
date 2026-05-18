import { useState } from "react";
import type { HistorialBackend } from "../Types";
import { deleteHistorial } from "../service/api";
import type { ToastType } from "./Toast";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  bg: "#0a0a0a",
  surface: "#111111",
  elevated: "#181818",
  border: "#222222",
  red: "#e63946",
  gold: "#c9a84c",
  cyan: "#38bdf8",
  text: "#f0ede8",
  muted: "#5a5a5a",
  font: "'Barlow Condensed', sans-serif",
  serif: "'Playfair Display', serif",
};

const Divider = ({ color = T.red }: { color?: string }) => (
  <div
    style={{
      height: 1,
      background: `linear-gradient(90deg, transparent, ${color}88, transparent)`,
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
      background: `${color}11`,
    }}
  >
    {children}
  </span>
);

interface HistorialViewProps {
  historial: HistorialBackend[];
  onReloadHistorial: () => Promise<void>;
  showToast: (message: string, type?: ToastType) => void;
  showConfirm: (message: string, onConfirm: () => void, opts?: { subMessage?: string; confirmLabel?: string; danger?: boolean }) => void;
}

function formatFecha(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatDescanso(segundos: number) {
  if (segundos < 60) return `${segundos}s`;
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

function HistorialView({ historial, onReloadHistorial, showToast, showConfirm }: HistorialViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Ordenar del más reciente al más antiguo
  const sorted = [...historial].sort(
    (a, b) => new Date(b.fechaFin).getTime() - new Date(a.fechaFin).getTime(),
  );

  const handleDelete = (id: string) => {
    showConfirm(
      "¿Eliminar este registro del historial?",
      async () => {
        setDeletingId(id);
        try {
          await deleteHistorial(id);
          await onReloadHistorial();
          showToast("Registro eliminado del historial.", "info");
        } catch (err: any) {
          showToast(err.message || "Error al eliminar el registro.", "error");
        } finally {
          setDeletingId(null);
        }
      },
      { subMessage: "Esta sesión no podrá recuperarse.", confirmLabel: "Eliminar", danger: true }
    );
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px 80px" }}>
      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <Tag color={T.muted}>CRÓNICAS DEL OLIMPO</Tag>
        <h1
          style={{
            fontFamily: T.serif,
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 700,
            color: T.text,
            margin: "12px 0 4px",
            letterSpacing: -1,
            lineHeight: 1,
          }}
        >
          Mi{" "}
          <em style={{ fontStyle: "italic", color: T.red }}>Historial</em>
        </h1>
        <p
          style={{
            fontFamily: T.font,
            color: T.muted,
            fontSize: 12,
            letterSpacing: 3,
            marginTop: 8,
          }}
        >
          {sorted.length} SESIÓN{sorted.length !== 1 ? "ES" : ""} REGISTRADA
          {sorted.length !== 1 ? "S" : ""}
        </p>
        <div style={{ marginTop: 24 }}>
          <Divider color={T.red} />
        </div>
      </div>

      {/* ── Empty state ── */}
      {sorted.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "80px 0",
            color: T.muted,
          }}
        >
          <div
            style={{ fontSize: 80, opacity: 0.12, lineHeight: 1, marginBottom: 24 }}
          >
            ⏱
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
            SIN BATALLAS REGISTRADAS
          </h4>
          <p
            style={{
              fontFamily: T.font,
              fontSize: 13,
              color: T.muted,
            }}
          >
            Completa un entrenamiento para comenzar a forjar tu legado.
          </p>
        </div>
      )}

      {/* ── Historial cards ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {sorted.map((entrada, idx) => {
          const isExpanded = expandedId === entrada.id;
          const totalSeries = entrada.ejercicios.reduce(
            (sum, e) => sum + (e.series?.length || 0),
            0,
          );

          return (
            <div
              key={entrada.id}
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderLeft: `3px solid ${idx === 0 ? T.gold : T.red}`,
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 8px 24px #00000055",
                transition: "box-shadow 0.2s",
              }}
            >
              {/* ── Card header ── */}
              <div
                style={{
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() =>
                  setExpandedId(isExpanded ? null : entrada.id)
                }
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    {idx === 0 && <Tag color={T.gold}>ÚLTIMA SESIÓN</Tag>}
                    <span
                      style={{
                        fontFamily: T.font,
                        fontSize: 11,
                        letterSpacing: 2,
                        color: T.muted,
                      }}
                    >
                      {formatFecha(entrada.fechaFin)}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: T.font,
                      fontSize: 22,
                      fontWeight: 700,
                      letterSpacing: 2,
                      color: T.text,
                      textTransform: "uppercase",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {entrada.nombreRutina || "BATALLA LIBRE"}
                  </h3>
                </div>

                {/* Stats pills */}
                <div
                  style={{
                    display: "flex",
                    gap: 20,
                    flexShrink: 0,
                    alignItems: "center",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontFamily: T.font,
                        fontSize: 24,
                        fontWeight: 700,
                        color: T.red,
                        lineHeight: 1,
                      }}
                    >
                      {entrada.volumenTotalKG.toLocaleString()}
                    </div>
                    <div
                      style={{
                        fontFamily: T.font,
                        fontSize: 10,
                        letterSpacing: 2,
                        color: T.muted,
                      }}
                    >
                      KG TOTAL
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontFamily: T.font,
                        fontSize: 24,
                        fontWeight: 700,
                        color: T.cyan,
                        lineHeight: 1,
                      }}
                    >
                      {entrada.ejercicios.length}
                    </div>
                    <div
                      style={{
                        fontFamily: T.font,
                        fontSize: 10,
                        letterSpacing: 2,
                        color: T.muted,
                      }}
                    >
                      EJERC.
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontFamily: T.font,
                        fontSize: 24,
                        fontWeight: 700,
                        color: T.gold,
                        lineHeight: 1,
                      }}
                    >
                      {totalSeries}
                    </div>
                    <div
                      style={{
                        fontFamily: T.font,
                        fontSize: 10,
                        letterSpacing: 2,
                        color: T.muted,
                      }}
                    >
                      SERIES
                    </div>
                  </div>

                  {/* Expand chevron */}
                  <div
                    style={{
                      fontFamily: T.font,
                      fontSize: 18,
                      color: T.muted,
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.25s",
                    }}
                  >
                    ▾
                  </div>
                </div>
              </div>

              {/* ── Expanded detail ── */}
              {isExpanded && (
                <div>
                  <Divider color={T.border} />
                  <div style={{ padding: "24px 24px 28px" }}>
                    {entrada.ejercicios.map((ej) => (
                      <div key={ej.idEjercicio} style={{ marginBottom: 28 }}>
                        {/* Exercise header */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            marginBottom: 12,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: T.font,
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: 2,
                              color: T.red,
                              background: `${T.red}15`,
                              border: `1px solid ${T.red}33`,
                              padding: "2px 10px",
                              borderRadius: 2,
                            }}
                          >
                            #{ej.orden}
                          </span>
                          <span
                            style={{
                              fontFamily: T.font,
                              fontSize: 16,
                              fontWeight: 700,
                              letterSpacing: 2,
                              color: T.text,
                              textTransform: "uppercase",
                            }}
                          >
                            {ej.nombreEjercicio || `Ejercicio ${ej.idEjercicio}`}
                          </span>
                        </div>

                        {/* Sets table */}
                        {ej.series && ej.series.length > 0 ? (
                          <div
                            style={{
                              background: T.elevated,
                              border: `1px solid ${T.border}`,
                              borderRadius: 3,
                              overflow: "hidden",
                            }}
                          >
                            {/* Table header */}
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "56px 1fr 1fr 1fr",
                                padding: "8px 16px",
                                borderBottom: `1px solid ${T.border}`,
                              }}
                            >
                              {["SERIE", "KG", "REPS", "DESCANSO"].map((h) => (
                                <span
                                  key={h}
                                  style={{
                                    fontFamily: T.font,
                                    fontSize: 10,
                                    fontWeight: 700,
                                    letterSpacing: 2,
                                    color: T.muted,
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {h}
                                </span>
                              ))}
                            </div>
                            {/* Table rows */}
                            {ej.series.map((serie) => (
                              <div
                                key={serie.numeroSerie}
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "56px 1fr 1fr 1fr",
                                  padding: "10px 16px",
                                  borderBottom: `1px solid ${T.border}`,
                                  transition: "background 0.15s",
                                }}
                                onMouseEnter={(e) => {
                                  (e.currentTarget as HTMLDivElement).style.background =
                                    `${T.red}08`;
                                }}
                                onMouseLeave={(e) => {
                                  (e.currentTarget as HTMLDivElement).style.background =
                                    "transparent";
                                }}
                              >
                                <span
                                  style={{
                                    fontFamily: T.font,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: T.red,
                                  }}
                                >
                                  {serie.numeroSerie}
                                </span>
                                <span
                                  style={{
                                    fontFamily: T.font,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: T.text,
                                  }}
                                >
                                  {serie.pesoKG}
                                </span>
                                <span
                                  style={{
                                    fontFamily: T.font,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: T.text,
                                  }}
                                >
                                  {serie.repeticiones}
                                </span>
                                <span
                                  style={{
                                    fontFamily: T.font,
                                    fontSize: 13,
                                    color: T.muted,
                                  }}
                                >
                                  {formatDescanso(serie.descansoSegundo)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p
                            style={{
                              fontFamily: T.font,
                              fontSize: 12,
                              color: T.muted,
                              letterSpacing: 2,
                            }}
                          >
                            SIN SERIES REGISTRADAS
                          </p>
                        )}
                      </div>
                    ))}

                    {/* Delete button */}
                    <div style={{ textAlign: "right", marginTop: 8 }}>
                      <button
                        disabled={deletingId === entrada.id}
                        onClick={() => handleDelete(entrada.id)}
                        style={{
                          background: `${T.red}15`,
                          border: `1px solid ${T.red}44`,
                          borderRadius: 2,
                          color: T.red,
                          fontFamily: T.font,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: 2,
                          padding: "6px 16px",
                          cursor: deletingId === entrada.id ? "not-allowed" : "pointer",
                          opacity: deletingId === entrada.id ? 0.5 : 1,
                          textTransform: "uppercase",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (deletingId !== entrada.id)
                            (e.currentTarget as HTMLButtonElement).style.background =
                              `${T.red}30`;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background =
                            `${T.red}15`;
                        }}
                      >
                        {deletingId === entrada.id ? "Eliminando..." : "✕ Eliminar registro"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HistorialView;
