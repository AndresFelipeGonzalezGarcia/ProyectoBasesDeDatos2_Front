import { useState } from "react";
import NavBar from "./components/NavBar";
import ExerciseCard from "./components/ExerciseCard";
import LoadingView from "./components/LoadingView";
import OlimpoView from "./components/OlimpoView";
import ProfileView from "./components/ProfileView";
import { exerciseDatabase } from "./data/Exercises";
import "./App.css";

interface Exercise {
  id: string;
  name: string;
  muscle: string;
  imageUrl: string;
}

// Definimos cómo se ve una rutina guardada
interface SavedRoutine {
  id: string;
  name: string;
  exercises: Exercise[];
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guerrero");
  const [currentView, setCurrentView] = useState<
    "routines" | "workout" | "olimpo" | "profile"
  >("routines");

  const [workoutCount, setWorkoutCount] = useState(0);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);

  const [activeRoutine, setActiveRoutine] = useState<Exercise[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  //  ESTADOS PARA GUARDAR RUTINAS PROPIAS ===
  const [savedRoutines, setSavedRoutines] = useState<SavedRoutine[]>([]);
  const [isSavingRoutine, setIsSavingRoutine] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");

  const handleStartPredefinedRoutine = (type: "pierna" | "torso") => {
    let selectedExercises: Exercise[] = [];
    if (type === "pierna") {
      selectedExercises = exerciseDatabase
        .filter(
          (ex) =>
            ex.muscle.toLowerCase().includes("pierna") ||
            ex.name.toLowerCase().includes("sentadilla") ||
            ex.name.toLowerCase().includes("peso muerto"),
        )
        .slice(0, 3);
    } else {
      selectedExercises = exerciseDatabase
        .filter(
          (ex) =>
            ex.muscle.toLowerCase().includes("pecho") ||
            ex.muscle.toLowerCase().includes("espalda") ||
            ex.name.toLowerCase().includes("press") ||
            ex.name.toLowerCase().includes("dominada"),
        )
        .slice(0, 3);
    }
    if (selectedExercises.length === 0)
      selectedExercises = exerciseDatabase.slice(0, 3);

    setActiveRoutine(selectedExercises);
    setIsWorkoutStarted(true);
    setCurrentView("workout");
  };

  //Arrancar una rutina que tú mismo guardaste
  const handleStartSavedRoutine = (routine: SavedRoutine) => {
    setActiveRoutine([...routine.exercises]); // Cargamos tus ejercicios exactos
    setIsWorkoutStarted(true);
    setCurrentView("workout");
  };

  const handleStartCustomWorkout = () => {
    setActiveRoutine([]);
    setIsWorkoutStarted(true);
    setCurrentView("workout");
  };

  const handleFinishWorkout = () => {
    setWorkoutCount((prev) => prev + 1);
    setIsWorkoutStarted(false);
    setActiveRoutine([]);
    setCurrentView("profile");
  };

  // Función para guardar la rutina actual en la caja fuerte
  const handleSaveRoutine = () => {
    if (newRoutineName.trim() === "") return; // Evitar nombres vacíos

    const newRoutine: SavedRoutine = {
      id: Date.now().toString(),
      name: newRoutineName.toUpperCase(),
      exercises: [...activeRoutine], // Copiamos los ejercicios actuales
    };

    setSavedRoutines([...savedRoutines, newRoutine]); // Agregamos a la lista
    setIsSavingRoutine(false);
    setNewRoutineName("");

    // Alerta visual de éxito rápida
    alert(`¡Rutina "${newRoutine.name}" forjada con éxito!`);
  };

  const handleAddExercise = (exercise: Exercise) => {
    const alreadyExists = activeRoutine.find((e) => e.id === exercise.id);
    if (!alreadyExists) {
      setActiveRoutine([...activeRoutine, exercise]);
    }
    setIsSearching(false);
  };

  const handleRemoveExercise = (idToRemove: string) => {
    const updatedRoutine = activeRoutine.filter(
      (exercise) => exercise.id !== idToRemove,
    );
    setActiveRoutine(updatedRoutine);
  };

  if (!isLoggedIn) {
    return (
      <LoadingView
        onLogin={(n) => {
          setUserName(n);
          setIsLoggedIn(true);
          setCurrentView("routines");
        }}
      />
    );
  }

  return (
    <>
      <NavBar
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={() => setIsLoggedIn(false)}
      />

      {currentView === "profile" && (
        <ProfileView userName={userName} totalWorkouts={workoutCount} />
      )}
      {currentView === "olimpo" && <OlimpoView userName={userName} />}

      {/* === VISTA DE RUTINAS === */}
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
            <p className="text-secondary fs-5 mt-2">
              SELECCIONA TU PLAN DE BATALLA.
            </p>
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
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      letterSpacing: "1px",
                    }}
                  >
                    DÍA DE PIERNA
                  </h2>
                  <p className="text-secondary fw-bold">
                    Sentadillas, Prensa, Peso Muerto
                  </p>
                  <button
                    className="btn btn-danger w-100 mt-3 fw-bold shadow"
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
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      letterSpacing: "1px",
                    }}
                  >
                    TORSO SUPERIOR
                  </h2>
                  <p className="text-secondary fw-bold">
                    Press Banca, Dominadas, Fondos
                  </p>
                  <button
                    className="btn btn-outline-info w-100 mt-3 fw-bold shadow"
                    onClick={() => handleStartPredefinedRoutine("torso")}
                  >
                    INICIAR MASACRE
                  </button>
                </div>
              </div>
            </div>

            {/* SECCIÓN DE RUTINAS GUARDADAS === */}
            {savedRoutines.length > 0 && (
              <div className="col-12 mt-3 mb-4 text-center">
                <h3
                  className="text-warning fw-bold border-bottom border-warning pb-2 d-inline-block"
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    letterSpacing: "1px",
                  }}
                >
                  ⚔️ TUS CREACIONES ⚔️
                </h3>
                <div className="row justify-content-center mt-3">
                  {savedRoutines.map((routine) => (
                    <div key={routine.id} className="col-md-5 mb-4">
                      <div
                        className="card bg-black border-warning h-100 shadow-lg animate__animated animate__zoomIn"
                        style={{ borderTop: "4px solid #ffc107" }}
                      >
                        <div className="card-body text-center py-4">
                          <h3
                            className="text-white fw-bold text-uppercase"
                            style={{
                              fontFamily: "'Anton', sans-serif",
                              letterSpacing: "1px",
                            }}
                          >
                            {routine.name}
                          </h3>
                          <p className="text-secondary fw-bold">
                            {routine.exercises.length} Ejercicios registrados
                          </p>
                          <button
                            className="btn btn-warning w-100 mt-2 fw-bold shadow text-dark"
                            onClick={() => handleStartSavedRoutine(routine)}
                          >
                            INICIAR {routine.name}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* =========================================== */}

            <div className="col-md-10 mt-2">
              <div
                className="card bg-black border-secondary shadow-lg p-3"
                style={{ borderStyle: "dashed", borderWidth: "2px" }}
              >
                <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center text-center text-md-start">
                  <div className="mb-3 mb-md-0">
                    <h3
                      className="text-white fw-bold m-0"
                      style={{
                        fontFamily: "'Anton', sans-serif",
                        letterSpacing: "1px",
                      }}
                    >
                      BATALLA LIBRE
                    </h3>
                    <p className="text-secondary fw-bold m-0">
                      Arma tu propia masacre desde cero.
                    </p>
                  </div>
                  <button
                    className="btn btn-outline-light btn-lg fw-bold shadow px-5"
                    onClick={handleStartCustomWorkout}
                  >
                    + FORJAR MI DESTINO
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === VISTA DE ENTRENAMIENTO === */}
      {currentView === "workout" && (
        <main className="container mt-4 mb-5 animate__animated animate__fadeIn">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 border-bottom border-danger pb-3 gap-3">
            <div>
              <h2
                className="display-5 fw-bold text-white m-0"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                {isWorkoutStarted ? "SESIÓN EN " : "PREPARAR "}{" "}
                <span className="text-danger">CURSO</span>
              </h2>
            </div>

            {/* BOTONES SUPERIORES */}
            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn btn-outline-light fw-bold"
                onClick={() => setIsSearching(!isSearching)}
              >
                {isSearching ? "CANCELAR" : "+ EJERCICIO"}
              </button>

              {/*GUARDAR RUTINA (Solo aparece si hay ejercicios) */}
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

          {/* FORMULARIO PARA GUARDAR EL NOMBRE DE LA RUTINA */}
          {isSavingRoutine && (
            <div className="bg-dark p-3 rounded mb-4 border border-warning d-flex flex-column flex-md-row gap-2 animate__animated animate__fadeInDown">
              <input
                type="text"
                className="form-control bg-black text-white border-warning shadow-none fw-bold"
                placeholder="Nombra tu rutina (Ej: ESPALDA MUTANTE)..."
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
                autoFocus
              />
              <button
                className="btn btn-warning fw-bold text-dark px-4"
                onClick={handleSaveRoutine}
              >
                GUARDAR
              </button>
              <button
                className="btn btn-outline-secondary fw-bold"
                onClick={() => setIsSavingRoutine(false)}
              >
                CANCELAR
              </button>
            </div>
          )}

          {isSearching && (
            <div className="bg-dark p-4 rounded mb-4 border border-secondary animate__animated animate__fadeInDown">
              <h4 className="text-white mb-3">SELECCIONA UN EJERCICIO</h4>
              <div className="row">
                {exerciseDatabase.map((exercise) => (
                  <div key={exercise.id} className="col-md-4 mb-3">
                    <div
                      className="card bg-black text-white border-secondary h-100"
                      style={{ cursor: "pointer", transition: "0.3s" }}
                      onClick={() => {
                        handleAddExercise(exercise);
                        setIsWorkoutStarted(true);
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.borderColor = "#ff0000")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.borderColor = "#6c757d")
                      }
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
              <div className="col-12 text-center text-secondary py-5">
                <h1 className="display-1 opacity-25">Ø</h1>
                <h4>TU RUTINA ESTÁ VACÍA</h4>
                <p>Agrega un ejercicio para comenzar a sangrar.</p>
                <button
                  className="btn btn-danger mt-3 fw-bold"
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
                    onRemove={() => handleRemoveExercise(exercise.id)}
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
