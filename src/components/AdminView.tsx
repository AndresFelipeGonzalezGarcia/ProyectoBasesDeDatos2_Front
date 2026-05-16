import { useState } from "react";
import type { Challenge, User, Exercise } from "../Types";

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
      ? { padding: "6px 16px", fontSize: 11 }
      : size === "lg"
        ? { padding: "14px 40px", fontSize: 14 }
        : { padding: "10px 24px", fontSize: 13 };

  return (
    <button
      {...props}
      style={{
        fontFamily: T.font,
        fontWeight: 700,
        letterSpacing: 2,
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
interface AdminProps {
  challenges: Challenge[];
  users: User[];
  exercises: Exercise[];
  setChallenges: (ch: Challenge[]) => void;
  setUsers: (u: User[]) => void;
  setExercises: (ex: Exercise[]) => void;
}

function AdminView({
  challenges,
  users,
  exercises,
  setChallenges,
  setUsers,
  setExercises,
}: AdminProps) {
  // ─── LÓGICA INTACTA ───
  const [activeTab, setActiveTab] = useState<
    "retos" | "usuarios" | "ejercicios"
  >("usuarios");

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const [newExName, setNewExName] = useState("");
  const [newExMuscle, setNewExMuscle] = useState("PECHO");
  const [newExImage, setNewExImage] = useState("");

  const handleCreateExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    const newExData: Exercise = {
      id: Date.now().toString(),
      name: newExName.toUpperCase(),
      muscle: newExMuscle,
      imageUrl:
        newExImage ||
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200",
    };
    setExercises([...exercises, newExData]);
    setNewExName("");
    setNewExImage("");
  };

  const saveExerciseUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExercise) {
      setExercises(
        exercises.map((ex) =>
          ex.id === editingExercise.id ? editingExercise : ex,
        ),
      );
      setEditingExercise(null);
    }
  };

  const handleDeleteExercise = async (id: string) => {
    if (window.confirm("¿Eliminar este ejercicio permanentemente?")) {
      setExercises(exercises.filter((ex) => ex.id !== id));
    }
  };

  const saveUserUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
      setEditingUser(null);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm("¿Expulsar a este guerrero del sistema?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleDeleteChallenge = async (id: number) => {
    if (window.confirm("¿Borrar este reto del Olimpo?")) {
      setChallenges(challenges.filter((ch) => ch.id !== id));
    }
  };

  return (
    <div className="container mt-4 mb-5 animate__animated animate__fadeIn">
      {/* ─── Estilos Inyectados ─── */}
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
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th {
          font-family: ${T.font}; font-size: 12px; letter-spacing: 3px; color: ${T.muted};
          text-transform: uppercase; padding: 16px; border-bottom: 2px solid ${T.red}; background: ${T.elevated};
        }
        .admin-table td { padding: 16px; border-bottom: 1px solid ${T.border}; vertical-align: middle; }
        .admin-table tr:hover { background: ${T.surface}; }
      `}</style>

      {/* ─── Encabezado ─── */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <Tag color={T.red}>ACCESO RESTRINGIDO</Tag>
        <h1
          style={{
            fontFamily: T.serif,
            fontSize: "clamp(40px, 6vw, 64px)",
            fontWeight: 700,
            color: T.text,
            margin: "12px 0 4px",
            letterSpacing: -1,
            lineHeight: 1,
          }}
        >
          Central de{" "}
          <em style={{ fontStyle: "italic", color: T.red }}>Datos</em>
        </h1>
        <div style={{ marginTop: 24 }}>
          <Divider color={T.red} />
        </div>
      </div>

      {/* ─── MENÚ DE NAVEGACIÓN ─── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          marginBottom: 48,
          flexWrap: "wrap",
        }}
      >
        <GlowBtn
          variant={activeTab === "usuarios" ? "red" : "ghost"}
          onClick={() => setActiveTab("usuarios")}
        >
          👤 USUARIOS
        </GlowBtn>
        <GlowBtn
          variant={activeTab === "ejercicios" ? "red" : "ghost"}
          onClick={() => setActiveTab("ejercicios")}
        >
          🏋️ EJERCICIOS
        </GlowBtn>
        <GlowBtn
          variant={activeTab === "retos" ? "red" : "ghost"}
          onClick={() => setActiveTab("retos")}
        >
          ⚔️ RETOS
        </GlowBtn>
      </div>

      {/* ==========================================
          SECCIÓN DE USUARIOS
      ========================================== */}
      {activeTab === "usuarios" && (
        <div className="animate__animated animate__fadeIn">
          {editingUser && (
            <div
              style={{
                background: T.elevated,
                border: `1px solid ${T.border}`,
                borderTop: `3px solid ${T.gold}`,
                padding: 32,
                borderRadius: 4,
                marginBottom: 32,
                boxShadow: `0 16px 48px #000000`,
              }}
              className="animate__animated animate__zoomIn"
            >
              <h5
                style={{
                  fontFamily: T.font,
                  color: T.gold,
                  fontSize: 18,
                  letterSpacing: 2,
                  marginBottom: 24,
                  fontWeight: 700,
                }}
              >
                EDITAR PERFIL DE GUERRERO
              </h5>
              <form
                onSubmit={saveUserUpdate}
                className="row g-3 align-items-end"
              >
                <div className="col-md-4">
                  <label className="buggy-label">NOMBRE</label>
                  <input
                    type="text"
                    className="buggy-input"
                    value={editingUser.name}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, name: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-5">
                  <label className="buggy-label">CORREO</label>
                  <input
                    type="email"
                    className="buggy-input"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-3 d-flex gap-2">
                  <GlowBtn variant="gold" type="submit" style={{ flex: 1 }}>
                    Guardar
                  </GlowBtn>
                  <GlowBtn
                    variant="ghost"
                    type="button"
                    onClick={() => setEditingUser(null)}
                  >
                    ✕
                  </GlowBtn>
                </div>
              </form>
            </div>
          )}

          <div
            style={{
              background: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: 4,
              overflowX: "auto",
            }}
          >
            <table className="admin-table text-center">
              <thead>
                <tr>
                  <th>NOMBRE</th>
                  <th>CORREO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td
                      style={{
                        fontFamily: T.font,
                        fontWeight: 700,
                        fontSize: 16,
                        color: T.text,
                        letterSpacing: 1,
                      }}
                    >
                      {u.name}
                    </td>
                    <td
                      style={{
                        color: T.muted,
                        fontFamily: T.font,
                        fontSize: 14,
                        letterSpacing: 1,
                      }}
                    >
                      {u.email}
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <GlowBtn
                          variant="cyan"
                          size="sm"
                          onClick={() => setEditingUser(u)}
                        >
                          Editar
                        </GlowBtn>
                        <GlowBtn
                          variant="red"
                          size="sm"
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          Borrar
                        </GlowBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==========================================
          SECCIÓN DE EJERCICIOS
      ========================================== */}
      {activeTab === "ejercicios" && (
        <div className="animate__animated animate__fadeIn">
          {/* FORMULARIO DINÁMICO */}
          <div
            style={{
              background: T.elevated,
              border: `1px solid ${T.border}`,
              borderTop: `3px solid ${editingExercise ? T.cyan : T.red}`,
              padding: 32,
              borderRadius: 4,
              marginBottom: 32,
              boxShadow: `0 16px 48px #000000`,
            }}
          >
            <h5
              style={{
                fontFamily: T.font,
                color: editingExercise ? T.cyan : T.red,
                fontSize: 18,
                letterSpacing: 2,
                marginBottom: 24,
                fontWeight: 700,
              }}
            >
              {editingExercise
                ? "ACTUALIZAR EJERCICIO"
                : "AÑADIR NUEVO EJERCICIO AL CATÁLOGO"}
            </h5>
            <form
              onSubmit={
                editingExercise ? saveExerciseUpdate : handleCreateExercise
              }
              className="row g-3 align-items-end"
            >
              <div className="col-md-4">
                <label className="buggy-label">NOMBRE DEL MOVIMIENTO</label>
                <input
                  type="text"
                  className="buggy-input"
                  required
                  value={editingExercise ? editingExercise.name : newExName}
                  onChange={(e) =>
                    editingExercise
                      ? setEditingExercise({
                          ...editingExercise,
                          name: e.target.value,
                        })
                      : setNewExName(e.target.value)
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="buggy-label">GRUPO MUSCULAR</label>
                <select
                  className="buggy-input"
                  value={editingExercise ? editingExercise.muscle : newExMuscle}
                  onChange={(e) =>
                    editingExercise
                      ? setEditingExercise({
                          ...editingExercise,
                          muscle: e.target.value,
                        })
                      : setNewExMuscle(e.target.value)
                  }
                >
                  <option value="PECHO">PECHO</option>
                  <option value="ESPALDA">ESPALDA</option>
                  <option value="PIERNA">PIERNA</option>
                  <option value="BRAZO">BRAZO</option>
                  <option value="CARDIO">CARDIO</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="buggy-label">URL IMAGEN / GIF</label>
                <input
                  type="text"
                  className="buggy-input"
                  value={
                    editingExercise ? editingExercise.imageUrl : newExImage
                  }
                  onChange={(e) =>
                    editingExercise
                      ? setEditingExercise({
                          ...editingExercise,
                          imageUrl: e.target.value,
                        })
                      : setNewExImage(e.target.value)
                  }
                />
              </div>
              <div className="col-md-2">
                {editingExercise ? (
                  <div className="d-flex gap-2">
                    <GlowBtn variant="cyan" type="submit" style={{ flex: 1 }}>
                      OK
                    </GlowBtn>
                    <GlowBtn
                      variant="ghost"
                      type="button"
                      onClick={() => setEditingExercise(null)}
                    >
                      ✕
                    </GlowBtn>
                  </div>
                ) : (
                  <GlowBtn
                    variant="red"
                    type="submit"
                    style={{ width: "100%" }}
                  >
                    AÑADIR
                  </GlowBtn>
                )}
              </div>
            </form>
          </div>

          {/* TABLA DE EJERCICIOS */}
          <div
            style={{
              background: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: 4,
              overflowX: "auto",
            }}
          >
            <table className="admin-table text-center">
              <thead>
                <tr>
                  <th>VISTA</th>
                  <th>EJERCICIO</th>
                  <th>ZONA</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {exercises.map((ex) => (
                  <tr key={ex.id}>
                    <td>
                      <img
                        src={ex.imageUrl}
                        alt={ex.name}
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: 2,
                          filter: "grayscale(50%)",
                          border: `1px solid ${T.border}`,
                        }}
                      />
                    </td>
                    <td
                      style={{
                        fontFamily: T.font,
                        fontWeight: 700,
                        fontSize: 16,
                        color: T.text,
                        letterSpacing: 1,
                      }}
                    >
                      {ex.name}
                    </td>
                    <td>
                      <Tag color={T.muted}>{ex.muscle}</Tag>
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <GlowBtn
                          variant="cyan"
                          size="sm"
                          onClick={() => setEditingExercise(ex)}
                        >
                          Editar
                        </GlowBtn>
                        <GlowBtn
                          variant="red"
                          size="sm"
                          onClick={() => handleDeleteExercise(ex.id)}
                        >
                          Borrar
                        </GlowBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==========================================
          SECCIÓN DE RETOS
      ========================================== */}
      {activeTab === "retos" && (
        <div
          className="animate__animated animate__fadeIn"
          style={{
            background: T.bg,
            border: `1px solid ${T.border}`,
            borderRadius: 4,
            overflowX: "auto",
          }}
        >
          <table className="admin-table text-center">
            <thead>
              <tr>
                <th>LÍDER</th>
                <th>DESAFÍO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((ch) => (
                <tr key={ch.id}>
                  <td
                    style={{
                      fontFamily: T.font,
                      fontWeight: 700,
                      fontSize: 16,
                      color: T.gold,
                      letterSpacing: 1,
                    }}
                  >
                    {ch.creator}
                  </td>
                  <td
                    style={{
                      fontFamily: T.font,
                      fontSize: 15,
                      color: T.text,
                      letterSpacing: 1,
                    }}
                  >
                    {ch.description}
                  </td>
                  <td>
                    <GlowBtn
                      variant="red"
                      size="sm"
                      onClick={() => handleDeleteChallenge(ch.id)}
                    >
                      ELIMINAR
                    </GlowBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminView;
