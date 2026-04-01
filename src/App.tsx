import { useState } from "react";
import NavBar from "./components/NavBar";
import ExerciseCard from "./components/ExerciseCard";
import { exerciseDatabase } from "./data/Exercises";
import "./App.css";

interface Exercise {
  id: string;
  name: string;
  muscle: string;
  imageUrl: string;
}

function App() {
  const [activeRoutine, setActiveRoutine] = useState<Exercise[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Función para agregar
  const handleAddExercise = (exercise: Exercise) => {
    const alreadyExists = activeRoutine.find((e) => e.id === exercise.id);
    if (!alreadyExists) {
      setActiveRoutine([...activeRoutine, exercise]);
    }
    setIsSearching(false);
  };

  // Función para eliminar
  const handleRemoveExercise = (idToRemove: string) => {
    const updatedRoutine = activeRoutine.filter(
      (exercise) => exercise.id !== idToRemove,
    );
    setActiveRoutine(updatedRoutine);
  };

  return (
    <>
      <NavBar />
      <main className="container mt-4 mb-5">
        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-danger pb-3">
          <div>
            <h2
              className="display-5 fw-bold text-white m-0"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              ENTRENAMIENTO <span className="text-danger">ACTIVO</span>
            </h2>
            <p className="text-secondary m-0">Rompe tus límites hoy.</p>
          </div>

          <button
            className="btn btn-danger fw-bold shadow-lg"
            onClick={() => setIsSearching(!isSearching)}
          >
            {isSearching ? "CANCELAR" : "+ AGREGAR EJERCICIO"}
          </button>
        </div>

        {/* --- VISTA 1: EL CATÁLOGO DE BÚSQUEDA --- */}
        {isSearching && (
          <div className="bg-dark p-4 rounded mb-4 border border-secondary animate__animated animate__fadeInDown">
            <h4 className="text-white mb-3">SELECCIONA UN EJERCICIO</h4>

            <div className="row">
              {exerciseDatabase.map((exercise) => (
                <div key={exercise.id} className="col-md-4 mb-3">
                  <div
                    className="card bg-black text-white border-secondary h-100"
                    style={{ cursor: "pointer", transition: "0.3s" }}
                    onClick={() => handleAddExercise(exercise)}
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

              <div className="col-md-4 mb-3">
                <div
                  className="card bg-black text-secondary border-secondary border-dashed h-100 d-flex justify-content-center align-items-center"
                  style={{ borderStyle: "dashed", cursor: "pointer" }}
                >
                  <div className="card-body text-center">
                    <h3 className="m-0">+</h3>
                    <small className="fw-bold">CREAR PERSONALIZADO</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- VISTA 2: TU RUTINA ACTUAL --- */}
        <div className="row">
          {activeRoutine.length === 0 && !isSearching ? (
            <div className="col-12 text-center text-secondary py-5">
              <h1 className="display-1 opacity-25">Ø</h1>
              <h4>TU RUTINA ESTÁ VACÍA</h4>
              <p>Agrega un ejercicio para comenzar a sangrar.</p>
            </div>
          ) : (
            activeRoutine.map((exercise) => (
              <div key={exercise.id} className="col-md-6 col-lg-4">
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
    </>
  );
}

export default App;
