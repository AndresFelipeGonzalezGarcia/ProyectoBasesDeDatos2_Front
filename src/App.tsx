import { useState } from "react";
import NavBar from "./components/NavBar";
import ExerciseCard from "./components/ExerciseCard";
import LoadingView from "./components/LoadingView";
import OlimpoView from "./components/OlimpoView";
import ProfileView from "./components/ProfileView";
import AdminView from "./components/AdminView";
import { exerciseDatabase } from "./data/Exercises";
//import * as api from "./service/api";
import type { Exercise, Challenge, User, SavedRoutine } from "./Types";
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

// ─── Main App ─────────────────────────────────────────────────────────────────

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guerrero");
  const [currentView, setCurrentView] = useState<
    "routines" | "workout" | "olimpo" | "profile" | "admin"
  >("routines");

  const [globalExercises, setGlobalExercises] =
    useState<Exercise[]>(exerciseDatabase);
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 1,
      creator: "El_Tanque",
      type: "FUERZA",
      description: "Llegar a 140kg en Sentadilla Libre",
      bet: "Pagar la mensualidad del mes",
      status: "Abierto",
      deadline: "24 Horas",
      participants: ["El_Tanque", "Ragnar_99"],
    },
    {
      id: 2,
      creator: "Valkiria",
      type: "RESISTENCIA",
      description: "100 Dominadas estrictas sin bajar de la barra",
      bet: "Un tarro de Creatina",
      status: "Abierto",
      deadline: "Hoy mismo",
      participants: ["Valkiria", "Andrés"],
    },
  ]);
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "ADMIN",
      email: "admin@buggys.com",
      role: "Super Admin",
      status: "Activo",
      age: 30,
      weight: 80,
    },
    {
      id: 2,
      name: "Andrés",
      email: "andres@correo.com",
      role: "Guerrero",
      status: "Activo",
      age: 25,
      weight: 75,
    },
  ]);
  const [savedRoutines, setSavedRoutines] = useState<SavedRoutine[]>([]);

  const [loading, setLoading] = useState(false);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [challengesWon, setChallengesWon] = useState(0);
  const [totalVolumeGlobal, setTotalVolumeGlobal] = useState(0);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [activeRoutine, setActiveRoutine] = useState<Exercise[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSavingRoutine, setIsSavingRoutine] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");

  // ── handlers (sin cambios) ───────────────────────────────────────────────

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
    setIsWorkoutStarted(true);
    setCurrentView("workout");
  };

  const handleStartSavedRoutine = (routine: SavedRoutine) => {
    setActiveRoutine([...routine.exercises]);
    setIsWorkoutStarted(true);
    setCurrentView("workout");
  };

  const handleFinishWorkout = async () => {
    const sessionVolume = activeRoutine.reduce(
      (sum, ex) => sum + (ex.volume || 0),
      0,
    );
    const workoutData = {
      userId: 2,
      date: new Date().toISOString(),
      totalVolume: sessionVolume,
      exercisesCount: activeRoutine.length,
      exercises: activeRoutine,
    };
    try {
      setTotalVolumeGlobal((prev) => prev + sessionVolume);
      setWorkoutCount((prev) => prev + 1);
      setIsWorkoutStarted(false);
      setActiveRoutine([]);
      setCurrentView("profile");
      alert("¡ENTRENAMIENTO REGISTRADO EN EL OLIMPO!");
    } catch (error) {
      console.error("Error al registrar la sesión:", error);
    }
  };

  const handleSaveRoutine = async () => {
    if (newRoutineName.trim() === "") return;
    const newRoutine: SavedRoutine = {
      id: Date.now().toString(),
      name: newRoutineName.toUpperCase(),
      exercises: [...activeRoutine],
    };
    setSavedRoutines([...savedRoutines, newRoutine]);
    setIsSavingRoutine(false);
    setNewRoutineName("");
    alert(`¡Rutina "${newRoutine.name}" guardada!`);
  };

  const handleRegister = async (data: {
    name: string;
    email: string;
    age: number;
    weight: number;
    sex: string;
  }) => {
    const newUser: User = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      role: "Guerrero",
      status: "Activo",
      age: data.age,
      weight: data.weight,
    };
    setUsers([...users, newUser]);
    setUserName(data.name);
    setIsLoggedIn(true);
    setCurrentView("routines");
  };

  // ── guards ───────────────────────────────────────────────────────────────

  if (!isLoggedIn) {
    return (
      <LoadingView
        onLogin={(n) => {
          setUserName(n);
          setIsLoggedIn(true);
          setCurrentView("routines");
        }}
        onRegister={handleRegister}
      />
    );
  }

  if (loading) {
    return (
      <div
        style={{
          background: T.bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: T.font,
          color: T.red,
          fontSize: 32,
          letterSpacing: 8,
        }}
      >
        CARGANDO…
      </div>
    );
  }

  // ── render ───────────────────────────────────────────────────────────────

  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.text }}>
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
        onViewChange={setCurrentView}
        onLogout={() => setIsLoggedIn(false)}
        userName={userName}
      />

      {/* ── Profile ─────────────────────────────────────────────────────── */}
      {currentView === "profile" && (
        <ProfileView
          userName={userName}
          totalWorkouts={workoutCount}
          challengesWon={challengesWon}
          totalVolumeKg={totalVolumeGlobal}
        />
      )}

      {/* ── Olimpo ──────────────────────────────────────────────────────── */}
      {currentView === "olimpo" && (
        <OlimpoView
          userName={userName}
          challenges={challenges}
          setChallenges={setChallenges}
          onWinChallenge={() => setChallengesWon((prev) => prev + 1)}
        />
      )}

      {/* ── Admin ───────────────────────────────────────────────────────── */}
      {currentView === "admin" && (
        <AdminView
          challenges={challenges}
          setChallenges={setChallenges}
          users={users}
          setUsers={setUsers}
          exercises={globalExercises}
          setExercises={setGlobalExercises}
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
                  <RoutineCard
                    key={routine.id}
                    title={routine.name}
                    accent={T.gold}
                    onStart={() => handleStartSavedRoutine(routine)}
                    btnVariant="gold"
                  />
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
                display: "flex",
                gap: 12,
              }}
            >
              <input
                type="text"
                placeholder="NOMBRE DE LA RUTINA…"
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
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
                }}
              />
              <GlowBtn variant="gold" size="md" onClick={handleSaveRoutine}>
                Guardar
              </GlowBtn>
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
