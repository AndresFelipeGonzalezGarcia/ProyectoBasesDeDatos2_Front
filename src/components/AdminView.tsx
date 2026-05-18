import { useState, useEffect } from "react";
import type { Challenge, User, Exercise, TrenBackend, LogroBackend, UsuarioBackend } from "../Types";
import {
  getTrenes,
  getEjercicios,
  createEjercicio,
  updateEjercicio,
  deleteEjercicio,
  deleteReto,
  getAllLogros,
  updateLogro,
  deleteLogro,
  getAllUsuarios,
  updateUsuario,
  deleteUsuario,
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
  exercises: Exercise[];
  logros: LogroBackend[];
  onReloadChallenges: () => Promise<void>;
  onReloadLogros: () => Promise<void>;
  setExercises: (ex: Exercise[]) => void;
  showToast: (message: string, type?: ToastType) => void;
  showConfirm: (message: string, onConfirm: () => void, opts?: { subMessage?: string; confirmLabel?: string; danger?: boolean }) => void;
}

function AdminView({
  challenges,
  exercises,
  logros,
  onReloadChallenges,
  onReloadLogros,
  setExercises,
  showToast,
  showConfirm,
}: AdminProps) {
  // ─── LÓGICA INTACTA ───
  const [activeTab, setActiveTab] = useState<
    "retos" | "usuarios" | "ejercicios" | "logros"
  >("usuarios");

  // ─── Usuarios (desde el backend) ─────────────────────────────────────────
  const [usuarios, setUsuarios] = useState<UsuarioBackend[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [editingUser, setEditingUser] = useState<UsuarioBackend | null>(null);
  const [userLoading, setUserLoading] = useState(false);

  const loadUsuarios = async () => {
    setLoadingUsuarios(true);
    try {
      const data = await getAllUsuarios();
      if (Array.isArray(data)) setUsuarios(data);
    } catch (err: any) {
      showToast(err.message || "Error al cargar usuarios.", "error");
    } finally {
      setLoadingUsuarios(false);
    }
  };

  const saveUserUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUserLoading(true);
    try {
      await updateUsuario(editingUser.idUsuario, {
        nombre:        editingUser.nombre,
        correoUsuario: editingUser.correoUsuario,
        edad:          editingUser.edad,
        peso:          editingUser.peso,
        genero:        editingUser.genero,
        idRol:         editingUser.idRol,
      });
      setEditingUser(null);
      await loadUsuarios();
      showToast("Usuario actualizado correctamente.", "success");
    } catch (err: any) {
      showToast(err.message || "Error al actualizar el usuario.", "error");
    } finally {
      setUserLoading(false);
    }
  };

  const handleDeleteUser = (id: number) => {
    showConfirm(
      "¿Expulsar a este guerrero del sistema?",
      async () => {
        try {
          await deleteUsuario(id);
          await loadUsuarios();
          showToast("Usuario eliminado del sistema.", "info");
        } catch (err: any) {
          showToast(err.message || "Error al eliminar el usuario.", "error");
        }
      },
      { subMessage: "Esta acción eliminará al usuario permanentemente.", confirmLabel: "Expulsar", danger: true }
    );
  };

  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const [newExName, setNewExName] = useState("");
  const [newExMuscle, setNewExMuscle] = useState("PECHO");
  const [newExImage, setNewExImage] = useState("");
  const [newExTren, setNewExTren] = useState<number>(0);

  const [trenes, setTrenes] = useState<TrenBackend[]>([]);
  const [exLoading, setExLoading] = useState(false);
  const [exError, setExError] = useState("");

  // ─── Carga inicial desde el backend ──────────────────────────────────────
  const loadEjercicios = async () => {
    try {
      const data = await getEjercicios();
      setExercises(
        data.map((e) => ({
          id: String(e.idEjercicio),
          name: e.nombre,
          muscle: e.musculo,
          imageUrl:
            e.imagen ||
            "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200",
          idTren: e.idTren,
        })),
      );
    } catch {
      // Si falla, dejamos el listado como está
    }
  };

  useEffect(() => {
    getTrenes()
      .then((data) => {
        setTrenes(data);
        if (data.length > 0) setNewExTren(data[0].idTren);
      })
      .catch(() => {});

    loadEjercicios();
    loadUsuarios();
  }, []);

  const handleCreateExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    setExError("");
    setExLoading(true);
    try {
      await createEjercicio({
        nombre: newExName.trim().toUpperCase(),
        musculo: newExMuscle,
        imagen: newExImage.trim(),
        idTren: newExTren,
      });
      setNewExName("");
      setNewExImage("");
      await loadEjercicios();
    } catch (err: any) {
      setExError(err.message || "Error al crear el ejercicio.");
    } finally {
      setExLoading(false);
    }
  };

  const saveExerciseUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExercise) return;
    setExError("");
    setExLoading(true);
    try {
      await updateEjercicio({
        idEjercicio: Number(editingExercise.id),
        nombre: editingExercise.name.trim().toUpperCase(),
        musculo: editingExercise.muscle,
        imagen: editingExercise.imageUrl.trim(),
        idTren: editingExercise.idTren ?? newExTren,
      });
      setEditingExercise(null);
      await loadEjercicios();
    } catch (err: any) {
      setExError(err.message || "Error al actualizar el ejercicio.");
    } finally {
      setExLoading(false);
    }
  };

  const handleDeleteExercise = (id: string) => {
    showConfirm(
      "¿Eliminar este ejercicio permanentemente?",
      async () => {
        setExError("");
        try {
          await deleteEjercicio(Number(id));
          await loadEjercicios();
          showToast("Ejercicio eliminado.", "info");
        } catch (err: any) {
          showToast(err.message || "Error al eliminar el ejercicio.", "error");
        }
      },
      { subMessage: "Se eliminará de todas las rutinas asociadas.", confirmLabel: "Eliminar", danger: true }
    );
  };

  const handleDeleteChallenge = (id: number) => {
    showConfirm(
      "¿Borrar este reto del Olimpo?",
      async () => {
        try {
          await deleteReto(id);
          await onReloadChallenges();
          showToast("Reto eliminado del Olimpo.", "info");
        } catch (err: any) {
          showToast(err.message || "Error al eliminar el reto.", "error");
        }
      },
      { subMessage: "Se eliminarán también todos sus participantes.", confirmLabel: "Borrar reto", danger: true }
    );
  };

  // ─── Logros ───────────────────────────────────────────────────────────────
  const [editingLogro, setEditingLogro] = useState<LogroBackend | null>(null);
  const [logroLoading, setLogroLoading] = useState(false);
  const [logroError, setLogroError] = useState("");

  const handleSaveLogroEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLogro) return;
    setLogroError("");
    setLogroLoading(true);
    try {
      await updateLogro(editingLogro.idLogro, {
        nombre: editingLogro.nombre.trim().toUpperCase(),
        descripcion: editingLogro.descripcion.trim(),
        icono: editingLogro.icono.trim(),
      });
      setEditingLogro(null);
      await onReloadLogros();
    } catch (err: any) {
      setLogroError(err.message || "Error al actualizar el logro.");
    } finally {
      setLogroLoading(false);
    }
  };

  const handleDeleteLogro = (id: number) => {
    showConfirm(
      "¿Eliminar este logro permanentemente?",
      async () => {
        setLogroError("");
        try {
          await deleteLogro(id);
          await onReloadLogros();
          showToast("Logro eliminado.", "info");
        } catch (err: any) {
          showToast(err.message || "Error al eliminar el logro.", "error");
        }
      },
      { subMessage: "Los usuarios que lo tengan lo perderán.", confirmLabel: "Eliminar", danger: true }
    );
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
        <GlowBtn
          variant={activeTab === "logros" ? "red" : "ghost"}
          onClick={() => setActiveTab("logros")}
        >
          🏅 LOGROS
        </GlowBtn>
      </div>

      {/* ==========================================
          SECCIÓN DE USUARIOS
      ========================================== */}
      {activeTab === "usuarios" && (
        <div className="animate__animated animate__fadeIn">

          {/* ── Formulario de edición ────────────────────────────────────── */}
          {editingUser && (
            <div
              style={{
                background: T.elevated,
                border: `1px solid ${T.border}`,
                borderTop: `3px solid ${T.gold}`,
                padding: 32,
                borderRadius: 4,
                marginBottom: 32,
                boxShadow: "0 16px 48px #000000",
              }}
              className="animate__animated animate__zoomIn"
            >
              <h5 style={{ fontFamily: T.font, color: T.gold, fontSize: 18, letterSpacing: 2, marginBottom: 24, fontWeight: 700 }}>
                EDITAR PERFIL DE GUERRERO — {editingUser.nombre}
              </h5>
              <form onSubmit={saveUserUpdate} className="row g-3 align-items-end">
                {/* Nombre */}
                <div className="col-md-4">
                  <label className="buggy-label">NOMBRE</label>
                  <input
                    type="text"
                    className="buggy-input"
                    value={editingUser.nombre}
                    onChange={(e) => setEditingUser({ ...editingUser, nombre: e.target.value })}
                    required
                  />
                </div>
                {/* Correo */}
                <div className="col-md-4">
                  <label className="buggy-label">CORREO</label>
                  <input
                    type="email"
                    className="buggy-input"
                    value={editingUser.correoUsuario}
                    onChange={(e) => setEditingUser({ ...editingUser, correoUsuario: e.target.value })}
                    required
                  />
                </div>
                {/* Edad */}
                <div className="col-md-2">
                  <label className="buggy-label">EDAD</label>
                  <input
                    type="number"
                    className="buggy-input"
                    min={10} max={100}
                    value={editingUser.edad}
                    onChange={(e) => setEditingUser({ ...editingUser, edad: Number(e.target.value) })}
                    required
                  />
                </div>
                {/* Peso */}
                <div className="col-md-2">
                  <label className="buggy-label">PESO (kg)</label>
                  <input
                    type="number"
                    className="buggy-input"
                    min={30} max={300} step={0.5}
                    value={editingUser.peso}
                    onChange={(e) => setEditingUser({ ...editingUser, peso: Number(e.target.value) })}
                    required
                  />
                </div>
                {/* Género */}
                <div className="col-md-3">
                  <label className="buggy-label">GÉNERO</label>
                  <select
                    className="buggy-input"
                    value={editingUser.genero}
                    onChange={(e) => setEditingUser({ ...editingUser, genero: e.target.value })}
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="O">Otro</option>
                  </select>
                </div>
                {/* Rol */}
                <div className="col-md-3">
                  <label className="buggy-label">ROL</label>
                  <select
                    className="buggy-input"
                    value={editingUser.idRol}
                    onChange={(e) => setEditingUser({ ...editingUser, idRol: Number(e.target.value) })}
                  >
                    <option value={1}>Admin</option>
                    <option value={2}>Usuario</option>
                  </select>
                </div>
                {/* Botones */}
                <div className="col-md-6 d-flex gap-2">
                  <GlowBtn variant="gold" type="submit" style={{ flex: 1 }} disabled={userLoading}>
                    {userLoading ? "Guardando..." : "Guardar cambios"}
                  </GlowBtn>
                  <GlowBtn variant="ghost" type="button" onClick={() => setEditingUser(null)}>
                    Cancelar
                  </GlowBtn>
                </div>
              </form>
            </div>
          )}

          {/* ── Tabla de usuarios ────────────────────────────────────────── */}
          {loadingUsuarios ? (
            <div style={{ textAlign: "center", padding: 48, color: T.muted, fontFamily: T.font, letterSpacing: 3 }}>
              CARGANDO GUERREROS...
            </div>
          ) : (
            <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 4, overflowX: "auto" }}>
              <table className="admin-table text-center">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>NOMBRE</th>
                    <th>CORREO</th>
                    <th>EDAD</th>
                    <th>PESO</th>
                    <th>GÉNERO</th>
                    <th>ROL</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ color: T.muted, fontFamily: T.font, padding: 32, letterSpacing: 2 }}>
                        SIN GUERREROS REGISTRADOS
                      </td>
                    </tr>
                  ) : (
                    usuarios.map((u) => (
                      <tr key={u.idUsuario}>
                        <td style={{ fontFamily: T.font, fontSize: 13, color: T.muted }}>{u.idUsuario}</td>
                        <td style={{ fontFamily: T.font, fontWeight: 700, fontSize: 15, color: T.text, letterSpacing: 1 }}>
                          {u.nombre}
                        </td>
                        <td style={{ color: T.muted, fontFamily: T.font, fontSize: 13 }}>{u.correoUsuario}</td>
                        <td style={{ fontFamily: T.font, fontSize: 14, color: T.text }}>{u.edad}</td>
                        <td style={{ fontFamily: T.font, fontSize: 14, color: T.text }}>{u.peso} kg</td>
                        <td style={{ fontFamily: T.font, fontSize: 13, color: T.muted }}>
                          {u.genero === "M" ? "Masc." : u.genero === "F" ? "Fem." : "Otro"}
                        </td>
                        <td>
                          <span style={{
                            fontFamily: T.font, fontSize: 11, fontWeight: 700, letterSpacing: 2,
                            color: u.idRol === 1 ? T.gold : T.cyan,
                            border: `1px solid ${u.idRol === 1 ? T.gold : T.cyan}44`,
                            padding: "2px 8px", borderRadius: 2,
                            background: `${u.idRol === 1 ? T.gold : T.cyan}11`,
                          }}>
                            {u.idRol === 1 ? "ADMIN" : "USUARIO"}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <GlowBtn variant="cyan" size="sm" onClick={() => setEditingUser(u)}>
                              Editar
                            </GlowBtn>
                            <GlowBtn variant="red" size="sm" onClick={() => handleDeleteUser(u.idUsuario)}>
                              Borrar
                            </GlowBtn>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
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
              {/* Nombre */}
              <div className="col-md-3">
                <label className="buggy-label">NOMBRE DEL MOVIMIENTO</label>
                <input
                  type="text"
                  className="buggy-input"
                  required
                  placeholder="EJ: PRESS BANCA"
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

              {/* Músculo */}
              <div className="col-md-2">
                <label className="buggy-label">MÚSCULO</label>
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

              {/* Tren */}
              <div className="col-md-2">
                <label className="buggy-label">TREN</label>
                <select
                  className="buggy-input"
                  value={
                    editingExercise
                      ? (editingExercise.idTren ?? newExTren)
                      : newExTren
                  }
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    editingExercise
                      ? setEditingExercise({ ...editingExercise, idTren: val })
                      : setNewExTren(val);
                  }}
                >
                  {trenes.length === 0 && (
                    <option value={0}>Sin trenes</option>
                  )}
                  {trenes.map((t) => (
                    <option key={t.idTren} value={t.idTren}>
                      {t.nombre.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Imagen */}
              <div className="col-md-3">
                <label className="buggy-label">URL IMAGEN / GIF</label>
                <input
                  type="text"
                  className="buggy-input"
                  placeholder="https://..."
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

              {/* Botones */}
              <div className="col-md-2">
                {editingExercise ? (
                  <div className="d-flex gap-2">
                    <GlowBtn
                      variant="cyan"
                      type="submit"
                      style={{ flex: 1 }}
                      disabled={exLoading}
                    >
                      {exLoading ? "..." : "OK"}
                    </GlowBtn>
                    <GlowBtn
                      variant="ghost"
                      type="button"
                      onClick={() => { setEditingExercise(null); setExError(""); }}
                    >
                      ✕
                    </GlowBtn>
                  </div>
                ) : (
                  <GlowBtn
                    variant="red"
                    type="submit"
                    style={{ width: "100%" }}
                    disabled={exLoading || trenes.length === 0}
                  >
                    {exLoading ? "GUARDANDO..." : "AÑADIR"}
                  </GlowBtn>
                )}
              </div>
            </form>

            {/* Mensaje de error */}
            {exError && (
              <div
                style={{
                  marginTop: 16,
                  fontFamily: T.font,
                  fontSize: 13,
                  letterSpacing: 1,
                  color: T.red,
                  background: `${T.red}12`,
                  border: `1px solid ${T.red}44`,
                  borderRadius: 2,
                  padding: "10px 14px",
                }}
              >
                ⚠ {exError}
              </div>
            )}
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
          SECCIÓN DE LOGROS
      ========================================== */}
      {activeTab === "logros" && (
        <div className="animate__animated animate__fadeIn">

          {/* Form editar */}
          {editingLogro && (
            <div
              style={{ background: T.elevated, border: `1px solid ${T.border}`, borderTop: `3px solid ${T.gold}`, padding: 32, borderRadius: 4, marginBottom: 32 }}
              className="animate__animated animate__zoomIn"
            >
              <h5 style={{ fontFamily: T.font, color: T.gold, fontSize: 18, letterSpacing: 2, marginBottom: 24, fontWeight: 700 }}>
                EDITAR LOGRO
              </h5>
              <form onSubmit={handleSaveLogroEdit} className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="buggy-label">NOMBRE</label>
                  <input className="buggy-input" required value={editingLogro.nombre}
                    onChange={(e) => setEditingLogro({ ...editingLogro, nombre: e.target.value })} />
                </div>
                <div className="col-md-5">
                  <label className="buggy-label">DESCRIPCIÓN</label>
                  <input className="buggy-input" required value={editingLogro.descripcion}
                    onChange={(e) => setEditingLogro({ ...editingLogro, descripcion: e.target.value })} />
                </div>
                <div className="col-md-2">
                  <label className="buggy-label">ÍCONO / EMOJI</label>
                  <input className="buggy-input" value={editingLogro.icono}
                    onChange={(e) => setEditingLogro({ ...editingLogro, icono: e.target.value })} placeholder="🏅 o URL" />
                </div>
                <div className="col-md-2 d-flex gap-2">
                  <button type="submit" disabled={logroLoading} style={{ fontFamily: T.font, fontWeight: 700, fontSize: 12, letterSpacing: 2, background: `${T.cyan}18`, color: T.cyan, border: `1px solid ${T.cyan}55`, borderRadius: 2, padding: "10px 16px", cursor: "pointer" }}>
                    {logroLoading ? "…" : "GUARDAR"}
                  </button>
                  <button type="button" onClick={() => setEditingLogro(null)} style={{ fontFamily: T.font, fontWeight: 700, fontSize: 12, letterSpacing: 2, background: "transparent", color: T.muted, border: `1px solid ${T.border}`, borderRadius: 2, padding: "10px 16px", cursor: "pointer" }}>
                    ✕
                  </button>
                </div>
              </form>
            </div>
          )}


          {/* Tabla */}
          <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 4, overflowX: "auto" }}>
            <table className="admin-table text-center">
              <thead>
                <tr>
                  <th>ÍCONO</th>
                  <th>NOMBRE</th>
                  <th>DESCRIPCIÓN</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {logros.length === 0 ? (
                  <tr><td colSpan={4} style={{ fontFamily: T.font, color: T.muted, padding: 32, letterSpacing: 2 }}>NO HAY LOGROS CREADOS</td></tr>
                ) : (
                  logros.map((lg) => (
                    <tr key={lg.idLogro}>
                      <td style={{ fontSize: 28 }}>
                        {lg.icono?.startsWith("http") ? (
                          <img src={lg.icono} alt={lg.nombre} style={{ width: 40, height: 40, objectFit: "contain" }} />
                        ) : (
                          lg.icono || "🏅"
                        )}
                      </td>
                      <td style={{ fontFamily: T.font, fontWeight: 700, fontSize: 15, color: T.text, letterSpacing: 1 }}>
                        {lg.nombre}
                      </td>
                      <td style={{ fontFamily: T.font, fontSize: 13, color: T.muted, letterSpacing: 1 }}>
                        {lg.descripcion}
                      </td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <GlowBtn variant="cyan" size="sm" onClick={() => { setEditingLogro(lg); setLogroError(""); }}>
                            Editar
                          </GlowBtn>
                          <GlowBtn variant="red" size="sm" onClick={() => handleDeleteLogro(lg.idLogro)}>
                            Borrar
                          </GlowBtn>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
