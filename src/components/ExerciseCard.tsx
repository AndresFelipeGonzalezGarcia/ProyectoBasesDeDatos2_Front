import { useState } from "react";
import RestTimer from "./RestTimer";

interface ExerciseProps {
  name: string;
  muscle: string;
  imageUrl: string;
  onRemove: () => void;
}

interface WorkoutSet {
  weight: number;
  reps: number;
}

function ExerciseCard({ name, muscle, imageUrl, onRemove }: ExerciseProps) {
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [currentWeight, setCurrentWeight] = useState("");
  const [currentReps, setCurrentReps] = useState("");
  const [isResting, setIsResting] = useState(false);
  const [restSeconds, setRestSeconds] = useState(60);

  const handleSaveSet = () => {
    if (currentWeight && currentReps) {
      const newSet: WorkoutSet = {
        weight: Number(currentWeight),
        reps: Number(currentReps),
      };
      setSets([...sets, newSet]);
      setCurrentWeight("");
      setCurrentReps("");
      setIsResting(true);
    }
  };

  const handleDeleteSet = (indexToRemove: number) => {
    const updatedSets = sets.filter((_, index) => index !== indexToRemove);
    setSets(updatedSets);
  };

  // Función auxiliar para bloquear teclas no deseadas en el Peso (permite decimales)
  const blockInvalidWeightKeys = (e: React.KeyboardEvent) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  // Función auxiliar para bloquear teclas no deseadas en las Reps (bloquea decimales)
  const blockInvalidRepsKeys = (e: React.KeyboardEvent) => {
    if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div
      className="card text-white border-0 mb-4 shadow-lg position-relative"
      style={{ backgroundColor: "#0a0a0a", borderLeft: "4px solid #ff0000" }}
    >
      <button
        onClick={onRemove}
        className="btn btn-danger position-absolute top-0 end-0 m-2 rounded-circle shadow"
        style={{
          width: "35px",
          height: "35px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
        title="Quitar ejercicio"
      >
        ✕
      </button>

      <img
        src={imageUrl}
        className="card-img-top opacity-75"
        alt={name}
        style={{
          filter: "grayscale(100%) contrast(120%)",
          height: "200px",
          objectFit: "cover",
        }}
      />

      <div className="card-body">
        <h5
          className="card-title fw-bold m-0"
          style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "1px" }}
        >
          {name}
        </h5>
        <p className="card-text text-danger small fw-bold">{muscle}</p>

        <div className="mt-4">
          <div className="row text-secondary small fw-bold mb-2 text-center border-bottom border-dark pb-2">
            <div className="col-2">#</div>
            <div className="col-3">KG</div>
            <div className="col-3">REPS</div>
            <div className="col-2">REST</div>
            <div className="col-2"></div>
          </div>

          {sets.map((set, index) => (
            <div
              key={index}
              className="row text-center mb-2 align-items-center animate__animated animate__fadeIn"
            >
              <div className="col-2 fw-bold text-danger">{index + 1}</div>
              <div className="col-3 fw-bold">{set.weight}</div>
              <div className="col-3 fw-bold">{set.reps}</div>
              <div className="col-2 text-secondary small">-</div>
              <div className="col-2">
                <button
                  className="btn btn-sm btn-outline-secondary border-0 text-muted"
                  onClick={() => handleDeleteSet(index)}
                  title="Eliminar serie"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {/* FILA DE INPUTS CON LOS BLOQUEOS ACTIVADOS */}
          <div className="row mt-3 align-items-center bg-dark p-2 rounded">
            <div className="col-2 text-center text-secondary fw-bold">
              {sets.length + 1}
            </div>
            <div className="col-3 px-1">
              <input
                type="number"
                min="0"
                step="0.5"
                className="form-control form-control-sm bg-black text-white border-secondary text-center fw-bold"
                placeholder="KG"
                value={currentWeight}
                onKeyDown={blockInvalidWeightKeys} //
                onChange={(e) => setCurrentWeight(e.target.value)}
              />
            </div>
            <div className="col-3 px-1">
              <input
                type="number"
                min="0"
                step="1"
                className="form-control form-control-sm bg-black text-white border-secondary text-center fw-bold"
                placeholder="REPS"
                value={currentReps}
                onKeyDown={blockInvalidRepsKeys} //
                onChange={(e) => setCurrentReps(e.target.value)}
              />
            </div>
            <div className="col-2 px-1 text-center">
              <select
                className="form-select form-select-sm bg-black text-danger border-secondary fw-bold p-1 text-center shadow-none"
                value={restSeconds}
                onChange={(e) => setRestSeconds(Number(e.target.value))}
                style={{ appearance: "none", cursor: "pointer" }}
              >
                <option value={30}>30s</option>
                <option value={60}>60s</option>
                <option value={90}>90s</option>
                <option value={120}>2m</option>
                <option value={150}>2m 30s</option>
                <option value={180}>3m</option>
                <option value={210}>3m 30s</option>
                <option value={240}>4m</option>
                <option value={270}>4m 30s</option>
                <option value={300}>5m</option>
              </select>
            </div>
            <div className="col-2 px-1 text-center">
              <button
                className="btn btn-danger btn-sm w-100 fw-bold"
                onClick={handleSaveSet}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {isResting && (
          <RestTimer
            key={sets.length}
            initialSeconds={restSeconds}
            onClose={() => setIsResting(false)}
          />
        )}
      </div>
    </div>
  );
}

export default ExerciseCard;
