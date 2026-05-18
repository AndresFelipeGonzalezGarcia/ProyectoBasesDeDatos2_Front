import { useState, useEffect, useCallback } from "react";
import NavBar from "./components/NavBar";
import ExerciseCard from "./components/ExerciseCard";
import LoadingView from "./components/LoadingView";
import OlimpoView from "./components/OlimpoView";
import ProfileView from "./components/ProfileView";
import AdminView from "./components/AdminView";
import HistorialView from "./components/HistorialView";
import Toast, { type ToastType } from "./components/Toast";
import ConfirmModal from "./components/ConfirmModal";
import { exerciseDatabase } from "./data/Exercises";
import type {
  Exercise, Challenge, SavedRoutine, UsuarioBackend,
  LogroBackend, UsuarioLogroBackend, WorkoutSet, HistorialBackend,
} from "./Types";
import {
  getEjercicios,
  getRutinasByUsuario,
  getRutinaEjercicios,
  createRutina,
  addEjerciciosBatch,
  deleteRutina,
  getAllRetos,
  getAllParticipantes,
  getParticipantesByUsuario,
  getAllLogros,
  getLogrosUsuario,
  asignarLogro,
  getLogrosByRutina,
  getHistorialByUsuario,
  createHistorial,
} from "./service/api";
import "./App.css";

// ─── Inline design tokens ────────────────────────────────────────────────────
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

// ─── Shared micro-components ─────────────────────────────────────────────────

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

// ─── Routine card ─────────────────────────────────────────────────────────────

interface RoutineCardProps {
  title: string;
  accent: string;
  subtitle?: string;
  onStart: () => void;
  btnVariant?: "red" | "gold" | "cyan" | "ghost";
}

const RoutineCard = ({
  title,
  accent,
  subtitle,
  onStart,
  btnVariant = "red",
}: RoutineCardProps) => (
  <div
    style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderTop: `3px solid ${accent}`,
      borderRadius: 4,
      padding: "40px 32px",
      textAlign: "center",
      transition: "transform 0.2s, box-shadow 0.2s",
      boxShadow: `0 4px 32px #00000066`,
      position: "relative",
      overflow: "hidden",
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
      (e.currentTarget as HTMLDivElement).style.boxShadow =
        `0 8px 48px ${accent}22`;
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      (e.currentTarget as HTMLDivElement).style.boxShadow =
        "0 4px 32px #00000066";
    }}
  >
    {/* background glow */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: 200,
        height: 200,
        background: `radial-gradient(ellipse at top, ${accent}12 0%, transparent 70%)`,
        pointerEvents: "none",
      }}
    />
    <Tag color={accent}>PROTOCOLO</Tag>
    <h2
      style={{
        fontFamily: T.serif,
        fontSize: 28,
        fontWeight: 700,
        color: T.text,
        margin: "16px 0 8px",
        letterSpacing: 1,
      }}
    >
      {title}
    </h2>
    {subtitle && (
      <p
        style={{
          fontFamily: T.font,
          fontSize: 12,
          color: T.muted,
          letterSpacing: 2,
          marginBottom: 24,
        }}
      >
        {subtitle}
      </p>
    )}
    <GlowBtn
      variant={btnVariant}
      size="md"
      style={{ width: "100%" }}
      onClick={onStart}
    >
      Iniciar masacre
    </GlowBtn>
  </div>
);

// ─── Helpers de sesión ────────────────────────────────────────────────────────
const SESSION_KEY = "buggyfit_session";

const getStoredUser = (): UsuarioBackend | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as UsuarioBackend) : null;
  } catch {
    return null;
  }
};

// ─── Main App ─────────────────────────────────────────────────────────────────

function App() {
  // Inicializar directamente desde localStorage — sin spinner, sin delay
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getStoredUser());
  const [currentUser, setCurrentUser] = useState<UsuarioBackend | null>(() => getStoredUser());
  const [userName, setUserName] = useState(() => getStoredUser()?.nombre ?? "Guerrero");
  const [currentView, setCurrentView] = useState<
    "routines" | "workout" | "olimpo" | "profile" | "admin" | "historial"
  >("routines");

  const [globalExercises, setGlobalExercises] =
    useState<Exercise[]>(exerciseDatabase);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [savedRoutines, setSavedRoutines] = useState<SavedRoutine[]>([]);
  const [logros, setLogros] = useState<LogroBackend[]>([]);
  const [logrosUsuario, setLogrosUsuario] = useState<UsuarioLogroBackend[]>([]);
  const [currentSavedRoutineId, setCurrentSavedRoutineId] = useState<number | null>(null);
  const [historial, setHistorial] = useState<HistorialBackend[]>([]);
  // exerciseSets: mapa exerciseId → sets registradas en la sesión activa
  const [exerciseSets, setExerciseSets] = useState<Record<string, WorkoutSet[]>>({});

  const [loading, setLoading] = useState(false);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [challengesWon, setChallengesWon] = useState(0);
  const [totalVolumeGlobal, setTotalVolumeGlobal] = useState(0);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [activeRoutine, setActiveRoutine] = useState<Exercise[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSavingRoutine, setIsSavingRoutine] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");
  const [saveRoutineError, setSaveRoutineError] = useState("");
  const [isSavingToServer, setIsSavingToServer] = useState(false);

  // ── Toast & Confirm ─────────────────────────────────────────────────────
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    message: string;
    subMessage?: string;
    confirmLabel?: string;
    onConfirm: () => void;
    danger?: boolean;
  } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    setToast({ message, type });
  }, []);

  const showConfirm = useCallback((
    message: string,
    onConfirm: () => void,
    opts?: { subMessage?: string; confirmLabel?: string; danger?: boolean }
  ) => {
    setConfirmModal({ message, onConfirm, ...opts });
  }, []);

  // ── Restaurar sesión al recargar ─────────────────────────────────────────
  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) return;

    // Sesión detectada — cargar todos los datos del usuario en background
    (async () => {
      try {
        const [ejerciciosData] = await Promise.all([
          getEjercicios().catch(() => [] as any[]),
        ]);

        let exerciseList: Exercise[] = globalExercises;
        if (Array.isArray(ejerciciosData) && ejerciciosData.length > 0) {
          exerciseList = ejerciciosData.map((e: any) => ({
            id: String(e.idEjercicio),
            name: e.nombre,
            muscle: e.musculo,
            imageUrl:
              e.imagen ||
              "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200",
          }));
          setGlobalExercises(exerciseList);
        }

        await Promise.all([
          loadUserRoutines(stored.idUsuario, exerciseList),
          loadChallenges(),
          loadLogros(stored.idUsuario),
          loadUserStats(stored.idUsuario),
          loadHistorial(stored.idUsuario),
        ]);
      } catch {
        // Si el backend no responde, el usuario sigue logueado con datos vacíos
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Cargar ejercicios del backend al montar ──────────────────────────────
  useEffect(() => {
    getEjercicios()
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setGlobalExercises(
            data.map((e) => ({
              id: String(e.idEjercicio),
              name: e.nombre,
              muscle: e.musculo,
              imageUrl:
                e.imagen ||
                "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200",
            })),
          );
        }
      })
      .catch(() => {}); // fallback: usa exerciseDatabase
  }, []);


  // ── Cargar estadísticas del usuario desde el backend ─────────────────────
  const loadUserStats = async (idUsuario: number) => {
    try {
      const participaciones = await getParticipantesByUsuario(idUsuario).catch(() => []);
      const lista = Array.isArray(participaciones) ? participaciones : [];
      const ganados = lista.filter((p) => p.esGanador).length;
      setChallengesWon(ganados);
    } catch {
      // Si falla, queda en 0
    }
  };

  // ── Cargar rutinas del usuario ────────────────────────────────────────────
  const loadUserRoutines = async (idUsuario: number, exerciseList: Exercise[]) => {
    try {
      const rutinas = await getRutinasByUsuario(idUsuario);
      if (!Array.isArray(rutinas) || rutinas.length === 0) {
        setSavedRoutines([]);
        setWorkoutCount(0);
        return;
      }
      // El número de rutinas guardadas representa las sesiones completadas
      setWorkoutCount(rutinas.length);
      const routinesWithExercises = await Promise.all(
        rutinas.map(async (r) => {
          try {
            const items = await getRutinaEjercicios(r.idRutina);
            const exercises: Exercise[] = Array.isArray(items)
              ? items
                  .sort((a, b) => a.orden - b.orden)
                  .map((item) =>
                    exerciseList.find((ex) => ex.id === String(item.idEjercicio)),
                  )
                  .filter((ex): ex is Exercise => ex !== undefined)
              : [];
            return { id: String(r.idRutina), name: r.nombre, exercises };
          } catch {
            return { id: String(r.idRutina), name: r.nombre, exercises: [] };
          }
        }),
      );
      setSavedRoutines(routinesWithExercises);
    } catch {
      setSavedRoutines([]);
    }
  };

  // ── Cargar retos del backend ──────────────────────────────────────────────
  const loadChallenges = async () => {
    try {
      const [retos, participantes] = await Promise.all([
        getAllRetos().catch(() => []),
        getAllParticipantes().catch(() => []),
      ]);

      const retosArray = Array.isArray(retos) ? retos : [];
      const partArray = Array.isArray(participantes) ? participantes : [];

      const mapped: Challenge[] = retosArray
        .filter((r) => r.estado !== "FINALIZADO")
        .map((r) => ({
          id: r.idReto,
          creator: r.nombreUsuario,
          idCreador: r.idUsuario,
          type: r.nombreTipoReto,
          idTipoReto: r.idTipoReto,
          description: r.descripcion,
          bet: r.apuesta,
          status: r.estado,
          deadline: r.fechaLimite,
          participantes: partArray.filter((p) => p.idReto === r.idReto),
        }));

      setChallenges(mapped);
    } catch {
      setChallenges([]);
    }
  };

  // ── Cargar logros del backend ─────────────────────────────────────────────
  const loadLogros = async (idUsuario: number) => {
    try {
      const [catalogo, desbloqueados] = await Promise.all([
        getAllLogros().catch(() => []),
        getLogrosUsuario(idUsuario).catch(() => []),
      ]);
      setLogros(Array.isArray(catalogo) ? catalogo : []);
      setLogrosUsuario(Array.isArray(desbloqueados) ? desbloqueados : []);
    } catch {
      setLogros([]);
      setLogrosUsuario([]);
    }
  };

  // ── Cargar historial desde MongoDB ───────────────────────────────────────
  const loadHistorial = async (idUsuario: number) => {
    try {
      const data = await getHistorialByUsuario(idUsuario).catch(() => []);
      const lista = Array.isArray(data) ? data : [];
      setHistorial(lista);
      // Calcular volumen acumulado real desde el historial
      const volumenTotal = lista.reduce((sum, h) => sum + (h.volumenTotalKG || 0), 0);
      setTotalVolumeGlobal(volumenTotal);
    } catch {
      setHistorial([]);
    }
  };

  // ── Otorgar logros vinculados a una rutina específica (logro_rutina) ────────
  const checkAndAwardLogros = async (idRutina: number, idUsuario: number) => {
    try {
      const vinculados = await getLogrosByRutina(idRutina).catch(() => []);
      if (!Array.isArray(vinculados) || vinculados.length === 0) return;
      await Promise.all(
        vinculados.map((lr) => asignarLogro(idUsuario, lr.idLogro).catch(() => {})),
      );
      await loadLogros(idUsuario);
    } catch { /* silencioso */ }
  };

  // ── Evaluar logros por estadísticas (sesiones, volumen, retos) ────────────
  // Compara la descripción del logro con las stats actuales para saber si aplica.
  const logroAplica = (
    logro: LogroBackend,
    stats: { sesiones: number; volumenKG: number; retosGanados: number },
  ): boolean => {
    const desc = (logro.descripcion ?? "").toLowerCase();

    // ── Primer entrenamiento / primera sesión ─────────────────────────────
    if (/primer\s+entrenamiento|primera?\s+sesi[oó]n/i.test(desc)) {
      return stats.sesiones >= 1;
    }

    // ── N entrenamientos completados (ej: "10 entrenamientos") ───────────
    const mSesiones = desc.match(/(\d+)\s+entrenamiento/);
    if (mSesiones) return stats.sesiones >= Number(mSesiones[1]);

    // ── Volumen en kg (ej: "10,000 kg" o "10000 kg") ─────────────────────
    const mVol = desc.match(/([\d][0-9.,]*)\s*kg/i);
    if (mVol) {
      const threshold = Number(mVol[1].replace(/[.,]/g, ""));
      if (!isNaN(threshold) && threshold > 0) return stats.volumenKG >= threshold;
    }

    // ── N retos ganados (ej: "5 retos") ──────────────────────────────────
    const mRetos = desc.match(/(\d+)\s+reto/);
    if (mRetos) return stats.retosGanados >= Number(mRetos[1]);

    return false;
  };

  const evaluarLogros = async (
    idUsuario: number,
    stats: { sesiones: number; volumenKG: number; retosGanados: number },
    catalogoActual?: LogroBackend[],
    desbloqueadosActual?: UsuarioLogroBackend[],
  ) => {
    try {
      // Usamos los catálogos frescos si se pasan, si no los del estado
      const catalogo = catalogoActual ?? logros;
      const desbloqueados = desbloqueadosActual ?? logrosUsuario;
      if (catalogo.length === 0) return;

      const idsYaTiene = new Set(desbloqueados.map((ul) => ul.idLogro));
      const pendientes = catalogo.filter(
        (l) => !idsYaTiene.has(l.idLogro) && logroAplica(l, stats),
      );
      if (pendientes.length === 0) return;

      await Promise.all(
        pendientes.map((l) => asignarLogro(idUsuario, l.idLogro).catch(() => {})),
      );
      // Recargar logros para que el perfil muestre los nuevos badges
      await loadLogros(idUsuario);
    } catch { /* silencioso */ }
  };

  // ── handlers ────────────────────────────────────────────────────────────

  const handleStartPredefinedRoutine = (type: "pierna" | "torso") => {
    let selectedExercises: Exercise[] = [];
    if (type === "pierna") {
      selectedExercises = globalExercises
        .filter(
          (ex) =>
            ex.muscle.toLowerCase().includes("pierna") ||
            ex.name.toLowerCase().includes("sentadilla"),
        )
        .slice(0, 3);
    } else {
      selectedExercises = globalExercises
        .filter(
          (ex) =>
            ex.muscle.toLowerCase().includes("pecho") ||
            ex.name.toLowerCase().includes("press"),
        )
        .slice(0, 3);
    }
    setActiveRoutine(selectedExercises);
    setExerciseSets({});
    setCurrentSavedRoutineId(null); // rutina predefinida, no tiene id de BD
    setIsWorkoutStarted(true);
    setCurrentView("workout");
  };

  const handleStartSavedRoutine = (routine: SavedRoutine) => {
    setActiveRoutine([...routine.exercises]);
    setExerciseSets({});
    setCurrentSavedRoutineId(Number(routine.id));
    setIsWorkoutStarted(true);
    setCurrentView("workout");
  };

  const handleFinishWorkout = async () => {
    const sessionVolume = activeRoutine.reduce(
      (sum, ex) => sum + (ex.volume || 0),
      0,
    );

    // Stats frescas (calculadas localmente antes de que el setState sea procesado)
    const nuevasSesiones = workoutCount + 1;
    const nuevoVolumen   = totalVolumeGlobal + sessionVolume;

    setWorkoutCount(nuevasSesiones);

    // ── Guardar historial en MongoDB ──────────────────────────────────────
    if (currentUser) {
      try {
        const ejerciciosData = activeRoutine
          .map((ex, idx) => {
            const sets = exerciseSets[ex.id] || [];
            return {
              idEjercicio: Number(ex.id),
              orden: idx + 1,
              series: sets.map((s, si) => ({
                numeroSerie: si + 1,
                pesoKG: s.weight,
                repeticiones: s.reps,
                descansoSegundo: s.restSeconds,
              })),
            };
          })
          .filter((e) => e.series.length > 0 && !isNaN(e.idEjercicio) && e.idEjercicio > 0);

        if (ejerciciosData.length > 0) {
          const nombreRutina = currentSavedRoutineId
            ? savedRoutines.find((r) => r.id === String(currentSavedRoutineId))?.name ?? "RUTINA"
            : "BATALLA LIBRE";

          await createHistorial({
            idUsuario: currentUser.idUsuario,
            idRutina: currentSavedRoutineId ?? 0,
            nombreRutina,
            fechaFin: new Date().toISOString().slice(0, 19),
            volumenTotalKG: sessionVolume,
            ejercicios: ejerciciosData,
          });
          await loadHistorial(currentUser.idUsuario);
        } else {
          setTotalVolumeGlobal(nuevoVolumen);
        }
      } catch {
        setTotalVolumeGlobal(nuevoVolumen);
      }
    } else {
      setTotalVolumeGlobal(nuevoVolumen);
    }

    // Limpiar estado de sesión
    setIsWorkoutStarted(false);
    setActiveRoutine([]);
    setExerciseSets({});
    setCurrentView("historial");

    if (currentUser) {
      // Logros vinculados a la rutina específica (logro_rutina)
      if (currentSavedRoutineId) {
        await checkAndAwardLogros(currentSavedRoutineId, currentUser.idUsuario);
      }
      // Logros por estadísticas: sesiones, volumen, retos
      await evaluarLogros(currentUser.idUsuario, {
        sesiones:      nuevasSesiones,
        volumenKG:     nuevoVolumen,
        retosGanados:  challengesWon,
      });
    }

    setCurrentSavedRoutineId(null);
    showToast("¡Entrenamiento registrado en el Olimpo!", "success");
  };

  const handleSaveRoutine = async () => {
    if (newRoutineName.trim() === "" || !currentUser) return;
    setSaveRoutineError("");
    setIsSavingToServer(true);

    // Rastreamos el id creado para poder hacer rollback si el batch falla
    let rutinaIdCreada: number | null = null;

    try {
      // ── 1. Crear la cabecera de la rutina ──────────────────────────────────
      const res = await createRutina({
        idUsuario: currentUser.idUsuario,
        nombre: newRoutineName.trim().toUpperCase(),
      });
      const idRutina = res?.idRutina;

      if (!idRutina || idRutina <= 0) {
        throw new Error("El servidor no devolvió el ID de la rutina. ¿Reiniciaste el backend?");
      }
      rutinaIdCreada = idRutina; // desde aquí existe en el DB; si algo falla → rollback

      // ── 2. Construir el batch para la tabla rutina_ejercicio ───────────────
      const batch = activeRoutine
        .map((ex, idx) => ({
          idRutina,
          idEjercicio: Number(ex.id),
          orden: idx + 1,
        }))
        .filter((item) => !isNaN(item.idEjercicio) && item.idEjercicio > 0);

      if (batch.length === 0 && activeRoutine.length > 0) {
        // Los ejercicios son del catálogo hardcodeado (IDs inválidos para el backend)
        throw new Error(
          "Los ejercicios no están en el catálogo del servidor. " +
          "Usa el buscador de ejercicios para agregar ejercicios reales.",
        );
      }

      if (batch.length > 0) {
        // Si el backend no encuentra algún ejercicio devuelve 404 (ya no 207)
        await addEjerciciosBatch(batch);
      }

      // ── 3. Éxito: actualizar estado local ──────────────────────────────────
      rutinaIdCreada = null; // cancelamos el rollback: todo salió bien
      const newRoutine: SavedRoutine = {
        id: String(idRutina),
        name: newRoutineName.trim().toUpperCase(),
        exercises: [...activeRoutine],
      };
      setSavedRoutines([...savedRoutines, newRoutine]);
      setIsSavingRoutine(false);
      setNewRoutineName("");

      // ── 4. Verificar y otorgar logros vinculados a esta rutina ─────────────
      if (currentUser) {
        await checkAndAwardLogros(idRutina, currentUser.idUsuario);
      }

    } catch (err: any) {
      // Rollback: si la rutina fue creada pero el batch falló, la eliminamos
      if (rutinaIdCreada) {
        await deleteRutina(rutinaIdCreada).catch(() => {});
      }
      setSaveRoutineError(err.message || "Error al guardar la rutina.");
    } finally {
      setIsSavingToServer(false);
    }
  };

  const handleDeleteSavedRoutine = (id: string) => {
    showConfirm(
      "¿Eliminar esta rutina del sistema?",
      async () => {
        try {
          await deleteRutina(Number(id));
          setSavedRoutines(savedRoutines.filter((r) => r.id !== id));
          showToast("Rutina eliminada.", "info");
        } catch (err: any) {
          showToast(err.message || "Error al eliminar la rutina.", "error");
        }
      },
      { subMessage: "Esta acción no se puede deshacer.", confirmLabel: "Eliminar", danger: true }
    );
  };

  const handleLogin = async (userData: UsuarioBackend) => {
    // Persistir sesión para sobrevivir recargas
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));

    setCurrentUser(userData);
    setUserName(userData.nombre);
    setIsLoggedIn(true);
    setCurrentView("routines");

    // Cargar ejercicios y rutinas en paralelo
    try {
      const [ejerciciosData] = await Promise.all([
        getEjercicios().catch(() => []),
      ]);
      const exerciseList: Exercise[] =
        Array.isArray(ejerciciosData) && ejerciciosData.length > 0
          ? ejerciciosData.map((e) => ({
              id: String(e.idEjercicio),
              name: e.nombre,
              muscle: e.musculo,
              imageUrl:
                e.imagen ||
                "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200",
            }))
          : globalExercises;

      if (Array.isArray(ejerciciosData) && ejerciciosData.length > 0) {
        setGlobalExercises(exerciseList);
      }

      await Promise.all([
        loadUserRoutines(userData.idUsuario, exerciseList),
        loadChallenges(),
        loadLogros(userData.idUsuario),
        loadUserStats(userData.idUsuario),
        loadHistorial(userData.idUsuario),
      ]);
    } catch {
      // Si falla, quedamos con los datos locales
    }
  };

  // ── guards ───────────────────────────────────────────────────────────────

  if (!isLoggedIn) {
    return <LoadingView onLogin={handleLogin} />;
  }


  // ── render ───────────────────────────────────────────────────────────────

  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.text }}>

      {/* ── Toast global ─────────────────────────────────────────────────── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* ── Confirm Modal global ─────────────────────────────────────────── */}
      {confirmModal && (
        <ConfirmModal
          message={confirmModal.message}
          subMessage={confirmModal.subMessage}
          confirmLabel={confirmModal.confirmLabel}
          danger={confirmModal.danger}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        ::selection { background: ${T.red}55; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.redDim}; border-radius: 2px; }
        input::placeholder { color: ${T.muted} !important; }
      `}</style>

      <NavBar
        currentView={currentView}
        onViewChange={(v) => setCurrentView(v)}
        onLogout={() => {
          localStorage.removeItem(SESSION_KEY);
          setIsLoggedIn(false);
          setCurrentUser(null);
          setUserName("Guerrero");
          setHistorial([]);
          setExerciseSets({});
          setSavedRoutines([]);
          setChallenges([]);
        }}
        userName={userName}
      />

      {/* ── Historial ───────────────────────────────────────────────────── */}
      {currentView === "historial" && (
        <HistorialView
          historial={historial}
          onReloadHistorial={() =>
            currentUser ? loadHistorial(currentUser.idUsuario) : Promise.resolve()
          }
          showToast={showToast}
          showConfirm={showConfirm}
        />
      )}

      {/* ── Profile ─────────────────────────────────────────────────────── */}
      {currentView === "profile" && (
        <ProfileView
          userName={userName}
          totalWorkouts={workoutCount}
          challengesWon={challengesWon}
          totalVolumeKg={totalVolumeGlobal}
          logros={logros}
          logrosUsuario={logrosUsuario}
        />
      )}

      {/* ── Olimpo ──────────────────────────────────────────────────────── */}
      {currentView === "olimpo" && currentUser && (
        <OlimpoView
          currentUser={currentUser}
          challenges={challenges}
          onReloadChallenges={loadChallenges}
          onWinChallenge={() => {
            const nuevosRetos = challengesWon + 1;
            setChallengesWon(nuevosRetos);
            if (currentUser) {
              evaluarLogros(currentUser.idUsuario, {
                sesiones:     workoutCount,
                volumenKG:    totalVolumeGlobal,
                retosGanados: nuevosRetos,
              }).catch(() => {});
            }
          }}
          showToast={showToast}
          showConfirm={showConfirm}
        />
      )}

      {/* ── Admin ───────────────────────────────────────────────────────── */}
      {currentView === "admin" && (
        <AdminView
          challenges={challenges}
          onReloadChallenges={loadChallenges}
          logros={logros}
          onReloadLogros={() => currentUser ? loadLogros(currentUser.idUsuario) : Promise.resolve()}
          exercises={globalExercises}
          setExercises={setGlobalExercises}
          showToast={showToast}
          showConfirm={showConfirm}
        />
      )}

      {/* ── Routines ────────────────────────────────────────────────────── */}
      {currentView === "routines" && (
        <div
          style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px 80px" }}
        >
          {/* Page header */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <Tag color={T.muted}>SALA DE GUERRA</Tag>
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
              Mis <em style={{ fontStyle: "italic", color: T.red }}>Rutinas</em>
            </h1>
            <p
              style={{
                fontFamily: T.font,
                color: T.muted,
                fontSize: 13,
                letterSpacing: 3,
                marginTop: 8,
              }}
            >
              ELIGE TU PROTOCOLO · FORJA TU LEGADO
            </p>
            <div style={{ marginTop: 24 }}>
              <Divider color={T.red} />
            </div>
          </div>

          {/* Predefined routines */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
              marginBottom: 56,
            }}
          >
            <RoutineCard
              title="Tren Inferior"
              accent={T.red}
              subtitle="Cuádriceps · Isquios · Glúteos"
              onStart={() => handleStartPredefinedRoutine("pierna")}
              btnVariant="red"
            />
            <RoutineCard
              title="Tren Superior"
              accent={T.cyan}
              subtitle="Pecho · Espalda · Hombros"
              onStart={() => handleStartPredefinedRoutine("torso")}
              btnVariant="cyan"
            />
          </div>

          {/* Saved routines section */}
          {savedRoutines.length > 0 && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 28,
                }}
              >
                <Divider color={T.gold} />
                <span
                  style={{
                    fontFamily: T.font,
                    fontSize: 11,
                    letterSpacing: 4,
                    color: T.gold,
                    whiteSpace: "nowrap",
                    fontWeight: 700,
                  }}
                >
                  ⚔ TUS CREACIONES ⚔
                </span>
                <Divider color={T.gold} />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 20,
                  marginBottom: 48,
                }}
              >
                {savedRoutines.map((routine) => (
                  <div key={routine.id} style={{ position: "relative" }}>
                    <RoutineCard
                      title={routine.name}
                      accent={T.gold}
                      subtitle={
                        routine.exercises.length > 0
                          ? `${routine.exercises.length} ejercicio${routine.exercises.length !== 1 ? "s" : ""}`
                          : undefined
                      }
                      onStart={() => handleStartSavedRoutine(routine)}
                      btnVariant="gold"
                    />
                    {/* Botón eliminar */}
                    <button
                      onClick={() => handleDeleteSavedRoutine(routine.id)}
                      title="Eliminar rutina"
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        background: `${T.red}18`,
                        border: `1px solid ${T.red}44`,
                        borderRadius: 2,
                        color: T.red,
                        fontFamily: T.font,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 1,
                        padding: "4px 8px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = `${T.red}33`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = `${T.red}18`;
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Free workout CTA */}
          <div
            style={{
              textAlign: "center",
              marginTop: savedRoutines.length === 0 ? 0 : 8,
            }}
          >
            {savedRoutines.length === 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 36,
                }}
              >
                <Divider color={T.muted} />
                <span
                  style={{
                    fontFamily: T.font,
                    fontSize: 10,
                    letterSpacing: 4,
                    color: T.muted,
                    whiteSpace: "nowrap",
                  }}
                >
                  O CREA LA TUYA
                </span>
                <Divider color={T.muted} />
              </div>
            )}
            <GlowBtn
              variant="ghost"
              size="lg"
              onClick={() => {
                setActiveRoutine([]);
                setIsWorkoutStarted(true);
                setCurrentView("workout");
              }}
            >
              + Forjar mi destino —&nbsp;Batalla libre
            </GlowBtn>
          </div>
        </div>
      )}

      {/* ── Workout ─────────────────────────────────────────────────────── */}
      {currentView === "workout" && (
        <main
          style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px" }}
        >
          {/* Workout header */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 40,
              paddingBottom: 24,
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <div>
              <Tag color={isWorkoutStarted ? T.red : T.muted}>
                {isWorkoutStarted ? "● EN VIVO" : "PREPARACIÓN"}
              </Tag>
              <h2
                style={{
                  fontFamily: T.serif,
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 700,
                  color: T.text,
                  margin: "8px 0 0",
                  letterSpacing: -0.5,
                }}
              >
                {isWorkoutStarted ? (
                  <>
                    Entrenamiento{" "}
                    <em style={{ fontStyle: "italic", color: T.red }}>
                      en curso
                    </em>
                  </>
                ) : (
                  "Preparar sesión"
                )}
              </h2>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <GlowBtn
                variant="ghost"
                size="sm"
                onClick={() => setIsSearching(!isSearching)}
              >
                {isSearching ? "✕ Cancelar" : "+ Ejercicio"}
              </GlowBtn>
              {activeRoutine.length > 0 && (
                <GlowBtn
                  variant="gold"
                  size="sm"
                  onClick={() => setIsSavingRoutine(!isSavingRoutine)}
                >
                  Guardar rutina
                </GlowBtn>
              )}
              {isWorkoutStarted && (
                <GlowBtn variant="cyan" size="sm" onClick={handleFinishWorkout}>
                  ✓ Terminar
                </GlowBtn>
              )}
            </div>
          </div>

          {/* Save routine panel */}
          {isSavingRoutine && (
            <div
              style={{
                background: T.elevated,
                border: `1px solid ${T.gold}44`,
                borderLeft: `3px solid ${T.gold}`,
                borderRadius: 4,
                padding: "20px 24px",
                marginBottom: 32,
              }}
            >
              <div style={{ display: "flex", gap: 12, marginBottom: saveRoutineError ? 10 : 0 }}>
                <input
                  type="text"
                  placeholder="NOMBRE DE LA RUTINA…"
                  value={newRoutineName}
                  onChange={(e) => { setNewRoutineName(e.target.value); setSaveRoutineError(""); }}
                  disabled={isSavingToServer}
                  style={{
                    flex: 1,
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 2,
                    color: T.text,
                    fontFamily: T.font,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: 2,
                    padding: "10px 16px",
                    outline: "none",
                    opacity: isSavingToServer ? 0.6 : 1,
                  }}
                />
                <GlowBtn
                  variant="gold"
                  size="md"
                  onClick={handleSaveRoutine}
                  disabled={isSavingToServer || newRoutineName.trim() === ""}
                >
                  {isSavingToServer ? "GUARDANDO..." : "Guardar"}
                </GlowBtn>
              </div>
              {saveRoutineError && (
                <div style={{
                  fontFamily: T.font, fontSize: 12, letterSpacing: 1,
                  color: T.red, background: `${T.red}12`,
                  border: `1px solid ${T.red}44`, borderRadius: 2,
                  padding: "8px 12px",
                }}>
                  ⚠ {saveRoutineError}
                </div>
              )}
            </div>
          )}

          {/* Exercise search panel */}
          {isSearching && (
            <div
              style={{
                background: T.elevated,
                border: `1px solid ${T.border}`,
                borderRadius: 4,
                padding: 24,
                marginBottom: 32,
              }}
            >
              <p
                style={{
                  fontFamily: T.font,
                  fontSize: 11,
                  letterSpacing: 3,
                  color: T.muted,
                  marginBottom: 20,
                }}
              >
                SELECCIONA UN EJERCICIO
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 12,
                }}
              >
                {globalExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    onClick={() => {
                      if (!activeRoutine.find((e) => e.id === exercise.id)) {
                        setActiveRoutine([...activeRoutine, exercise]);
                      }
                      setIsSearching(false);
                      setIsWorkoutStarted(true);
                    }}
                    style={{
                      background: T.surface,
                      border: `1px solid ${T.border}`,
                      borderRadius: 4,
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        `${T.red}66`;
                      (e.currentTarget as HTMLDivElement).style.background =
                        `${T.red}0d`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        T.border;
                      (e.currentTarget as HTMLDivElement).style.background =
                        T.surface;
                    }}
                  >
                    <img
                      src={exercise.imageUrl}
                      alt={exercise.name}
                      style={{
                        width: 48,
                        height: 48,
                        objectFit: "cover",
                        borderRadius: 3,
                        filter: "grayscale(80%) contrast(1.1)",
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontFamily: T.font,
                          fontWeight: 700,
                          fontSize: 13,
                          letterSpacing: 1,
                          color: T.text,
                        }}
                      >
                        {exercise.name}
                      </div>
                      <div
                        style={{
                          fontFamily: T.font,
                          fontSize: 10,
                          letterSpacing: 2,
                          color: T.red,
                          marginTop: 2,
                        }}
                      >
                        {exercise.muscle}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exercise list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {activeRoutine.length === 0 && !isSearching ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 0",
                  color: T.muted,
                }}
              >
                <div
                  style={{
                    fontSize: 80,
                    opacity: 0.15,
                    lineHeight: 1,
                    marginBottom: 24,
                  }}
                >
                  Ø
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
                  TU RUTINA ESTÁ VACÍA
                </h4>
                <p
                  style={{
                    fontFamily: T.font,
                    fontSize: 13,
                    color: T.muted,
                    marginBottom: 32,
                  }}
                >
                  Agrega un ejercicio para comenzar a sangrar.
                </p>
                <GlowBtn
                  variant="red"
                  size="md"
                  onClick={() => setIsSearching(true)}
                >
                  + Explorar ejercicios
                </GlowBtn>
              </div>
            ) : (
              activeRoutine.map((exercise) => (
                <div key={exercise.id}>
                  <ExerciseCard
                    name={exercise.name}
                    muscle={exercise.muscle}
                    imageUrl={exercise.imageUrl}
                    onRemove={() =>
                      setActiveRoutine(
                        activeRoutine.filter((e) => e.id !== exercise.id),
                      )
                    }
                    onUpdateVolume={(vol) => {
                      setActiveRoutine((prev) =>
                        prev.map((e) =>
                          e.id === exercise.id ? { ...e, volume: vol } : e,
                        ),
                      );
                    }}
                    onUpdateSets={(sets) => {
                      setExerciseSets((prev) => ({ ...prev, [exercise.id]: sets }));
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
