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

  const [loading, setLoading] = useState(false); //
  const [workoutCount, setWorkoutCount] = useState(0);
  const [challengesWon, setChallengesWon] = useState(0);
  const [totalVolumeGlobal, setTotalVolumeGlobal] = useState(0);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [activeRoutine, setActiveRoutine] = useState<Exercise[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSavingRoutine, setIsSavingRoutine] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");

  // ==========================================
  // CONEXIÓN AL BACKEND
  // ==========================================
  /* useEffect(() => {
    const loadOlimpoData = async () => {
      try {
        setLoading(true);
        const [exData, chData, userData, routData] = await Promise.all([
          api.getExercises(),
          api.getChallenges(),
          api.getUsers(),
          api.getRoutines()
        ]);
        setGlobalExercises(exData);
        setChallenges(chData);
        setUsers(userData);
        setSavedRoutines(routData);
      } catch (error) {
        console.error("Error conectando al servidor:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) { loadOlimpoData(); }
  }, [isLoggedIn]); 
  */

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
      // 1. Intentamos guardar en el Back
      // await api.createWorkout(workoutData);

      // 2. Actualizamos el estado local (lo que ya tenías)
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

    // Lógica de Backend (Descomentar cuando el server esté listo)
    /*
    try {
       const savedInBack = await api.createRoutine(newRoutine);
       setSavedRoutines([...savedRoutines, savedInBack]);
    } catch(e) { console.error(e); }
    */

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

    // CONEXIÓN BACKEND (Comentada para el futuro)
    /*
  try {
    await api.createUser(newUser);
  } catch(e) { console.error("Error al persistir en DB"); }
  */
  };

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
      <div className="bg-black min-vh-100 d-flex align-items-center justify-content-center text-danger">
        <h1>CARGANDO...</h1>
      </div>
    );
  }
  return (
    <>
      <NavBar
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={() => setIsLoggedIn(false)}
        userName={userName}
      />

      {currentView === "profile" && (
        <ProfileView
          userName={userName}
          totalWorkouts={workoutCount}
          challengesWon={challengesWon}
          totalVolumeKg={totalVolumeGlobal}
        />
      )}

      {currentView === "olimpo" && (
        <OlimpoView
          userName={userName}
          challenges={challenges}
          setChallenges={setChallenges}
          onWinChallenge={() => setChallengesWon((prev) => prev + 1)}
        />
      )}

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

      {currentView === "routines" && (
        <div className="container mt-4 mb-5 animate__animated animate__fadeIn">
          <div className="text-center mb-5 border-bottom border-danger pb-4">
            <h1
              className="display-4 text-white fw-bold mb-0"
              style={{
                fontFamily: "'Anton', sans-serif",
                letterSpacing: "2px",
              }}
            >
              MIS <span className="text-danger">RUTINAS</span>
            </h1>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-5 mb-4">
              <div
                className="card bg-black border-secondary h-100 shadow-lg"
                style={{ borderTop: "4px solid #ff0000" }}
              >
                <div className="card-body text-center py-5">
                  <h2
                    className="text-white fw-bold"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                  >
                    TREN INFERIOR
                  </h2>
                  <button
                    className="btn btn-outline-danger w-100 mt-3 fw-bold shadow"
                    onClick={() => handleStartPredefinedRoutine("pierna")}
                  >
                    INICIAR MASACRE
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-5 mb-4">
              <div
                className="card bg-black border-secondary h-100 shadow-lg"
                style={{ borderTop: "4px solid #0dcaf0" }}
              >
                <div className="card-body text-center py-5">
                  <h2
                    className="text-white fw-bold"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                  >
                    TREN SUPERIOR
                  </h2>
                  <button
                    className="btn btn-outline-info w-100 mt-3 fw-bold shadow"
                    onClick={() => handleStartPredefinedRoutine("torso")}
                  >
                    INICIAR MASACRE
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body text-center py-5">
              <h2
                className="text-white fw-bold"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                ⚔️ TUS CREACIONES ⚔️
              </h2>
            </div>

            {/* SECCIÓN DE RUTINAS GUARDADAS */}
            {savedRoutines.map((routine) => (
              <div key={routine.id} className="col-md-5 mb-4">
                <div
                  className="card bg-black border-warning h-100 shadow-lg"
                  style={{ borderTop: "4px solid #ffc107" }}
                >
                  <div className="card-body text-center py-4">
                    <h3
                      className="text-white fw-bold text-uppercase"
                      style={{ fontFamily: "'Anton', sans-serif" }}
                    >
                      {routine.name}
                    </h3>
                    <button
                      className="btn btn-warning w-100 mt-2 fw-bold text-dark"
                      onClick={() => handleStartSavedRoutine(routine)}
                    >
                      INICIAR {routine.name}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-md-10 mt-2 text-center">
              <button
                className="btn btn-outline-light btn-lg fw-bold shadow px-5"
                onClick={() => {
                  setActiveRoutine([]);
                  setIsWorkoutStarted(true);
                  setCurrentView("workout");
                }}
              >
                + FORJAR MI DESTINO (BATALLA LIBRE)
              </button>
            </div>
          </div>
        </div>
      )}

      {currentView === "workout" && (
        <main className="container mt-4 mb-5 animate__animated animate__fadeIn">
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-danger pb-3">
            <h2
              className="display-5 fw-bold text-white m-0"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              {isWorkoutStarted ? "ENTRENAMIENTO EN CURSO" : "PREPARAR CURSO"}
            </h2>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-light fw-bold"
                onClick={() => setIsSearching(!isSearching)}
              >
                {isSearching ? "CANCELAR" : "+ EJERCICIO"}
              </button>
              {activeRoutine.length > 0 && (
                <button
                  className="btn btn-warning fw-bold text-dark"
                  onClick={() => setIsSavingRoutine(!isSavingRoutine)}
                >
                  GUARDAR RUTINA
                </button>
              )}
              {isWorkoutStarted && (
                <button
                  className="btn btn-success fw-bold"
                  onClick={handleFinishWorkout}
                >
                  TERMINAR
                </button>
              )}
            </div>
          </div>

          {isSavingRoutine && (
            <div className="bg-dark p-3 rounded mb-4 border border-warning d-flex gap-2 animate__animated animate__fadeInDown">
              <input
                type="text"
                className="form-control bg-black text-white border-warning fw-bold"
                placeholder="NOMBRE DE LA RUTINA..."
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
              />
              <button
                className="btn btn-warning fw-bold text-dark px-4"
                onClick={handleSaveRoutine}
              >
                GUARDAR
              </button>
            </div>
          )}

          {isSearching && (
            <div className="bg-dark p-4 rounded mb-4 border border-secondary animate__animated animate__fadeInDown">
              <div className="row">
                {globalExercises.map((exercise) => (
                  <div key={exercise.id} className="col-md-4 mb-3">
                    <div
                      className="card bg-black text-white border-secondary h-100"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (!activeRoutine.find((e) => e.id === exercise.id)) {
                          setActiveRoutine([...activeRoutine, exercise]);
                        }
                        setIsSearching(false);
                        setIsWorkoutStarted(true);
                      }}
                    >
                      <div className="card-body d-flex align-items-center gap-3">
                        <img
                          src={exercise.imageUrl}
                          alt={exercise.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            filter: "grayscale(100%)",
                          }}
                        />
                        <div>
                          <h6 className="fw-bold m-0 text-uppercase">
                            {exercise.name}
                          </h6>
                          <small className="text-danger fw-bold">
                            {exercise.muscle}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="row justify-content-center">
            {activeRoutine.length === 0 && !isSearching ? (
              <div className="col-12 text-center text-secondary py-5 animate__animated animate__fadeIn">
                <h1 className="display-1 opacity-25">Ø</h1>
                <h4
                  className="fw-bold"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  TU RUTINA ESTÁ VACÍA
                </h4>
                <p>Agrega un ejercicio para comenzar a sangrar.</p>
                <button
                  className="btn btn-danger mt-3 fw-bold shadow"
                  onClick={() => setIsSearching(true)}
                >
                  + EXPLORAR EJERCICIOS
                </button>
              </div>
            ) : (
              activeRoutine.map((exercise) => (
                <div key={exercise.id} className="col-12 col-lg-8 mb-4">
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
    </>
  );
}

export default App;
