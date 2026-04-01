import { useState } from "react";

interface OlimpoProps {
  userName: string;
}

// 1. Quitamos 'deadline' de la interfaz
interface Challenge {
  id: number;
  creator: string;
  type: string;
  description: string;
  bet: string;
  status: string;
  participants: string[];
}

function OlimpoView({ userName }: OlimpoProps) {
  // 2. Quitamos el tiempo límite de los retos de prueba
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 1,
      creator: "El_Tanque",
      type: "FUERZA",
      description: "Llegar a 140kg en Sentadilla Libre (1 Rep Mínima)",
      bet: "Pagar la mensualidad del mes",
      status: "Abierto",
      participants: ["El_Tanque", "Ragnar_99"],
    },
    {
      id: 2,
      creator: "Valkiria",
      type: "RESISTENCIA",
      description: "100 Dominadas estrictas en menos de 15 minutos",
      bet: "Un tarro de Creatina",
      status: "En progreso",
      participants: ["Valkiria", "Chris_Fit", "Sebas_Iron"],
    },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);

  // 3. Ya no necesitamos el estado de newDeadline
  const [newType, setNewType] = useState("FUERZA");
  const [newDescription, setNewDescription] = useState("");
  const [newBet, setNewBet] = useState("");

  const handleAcceptChallenge = (challengeId: number) => {
    const updatedChallenges = challenges.map((ch) => {
      if (ch.id === challengeId && !ch.participants.includes(userName)) {
        return { ...ch, participants: [...ch.participants, userName] };
      }
      return ch;
    });
    setChallenges(updatedChallenges);
  };

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();

    // 4. Creamos el reto sin el parámetro de tiempo
    const newChallenge: Challenge = {
      id: Date.now(),
      creator: userName,
      type: newType,
      description: newDescription,
      bet: newBet,
      status: "Abierto",
      participants: [userName],
    };

    setChallenges([newChallenge, ...challenges]);

    setNewDescription("");
    setNewBet("");
    setShowCreateForm(false);
  };

  return (
    <div className="container mt-4 mb-5 animate__animated animate__fadeIn">
      <div className="text-center mb-5 border-bottom border-danger pb-4">
        <h1
          className="display-4 text-white fw-bold mb-0"
          style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "2px" }}
        >
          EL <span className="text-danger">OLIMPO</span>
        </h1>
        <p className="text-secondary fs-5 mt-2">
          BIENVENIDO,{" "}
          <span className="text-white fw-bold text-uppercase">{userName}</span>.
          ACEPTA TU DESTINO.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          {!showCreateForm ? (
            /* ========================================= */
            /* VISTA 1: LISTA DE RETOS                   */
            /* ========================================= */
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3
                  className="text-white fw-bold m-0"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  RETOS DISPONIBLES
                </h3>
                <button
                  className="btn btn-danger fw-bold shadow"
                  onClick={() => setShowCreateForm(true)}
                >
                  + LANZAR UN RETO
                </button>
              </div>

              {challenges.map((challenge) => {
                const isUserParticipating =
                  challenge.participants.includes(userName);
                return (
                  <div
                    key={challenge.id}
                    className="card bg-black border-secondary mb-4 shadow-lg animate__animated animate__fadeInUp"
                    style={{
                      borderLeft: isUserParticipating
                        ? "4px solid #ff0000"
                        : "4px solid #ffc107",
                    }}
                  >
                    <div className="card-body">
                      {/* 5. Eliminamos la etiqueta del reloj de aquí */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <span
                          className={`badge bg-dark border ${isUserParticipating ? "text-danger border-danger" : "text-warning border-warning"} p-2 small`}
                        >
                          {challenge.type}
                        </span>
                        <small className="text-secondary fw-bold">
                          Líder:{" "}
                          <span className="text-white">
                            {challenge.creator}
                          </span>
                        </small>
                      </div>

                      <h4 className="card-title text-white fw-bold mb-3 text-uppercase">
                        {challenge.description}
                      </h4>

                      <div className="bg-dark p-3 rounded mb-3 border border-secondary d-flex justify-content-between align-items-center shadow-sm">
                        <div>
                          <span className="text-secondary small fw-bold d-block mb-1">
                            APUESTA:
                          </span>
                          <span className="text-danger fw-bold fs-5 text-uppercase">
                            {challenge.bet}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className="text-secondary small fw-bold d-block mb-2">
                          GUERREROS ({challenge.participants.length}):
                        </span>
                        <div className="d-flex flex-wrap gap-2">
                          {challenge.participants.map((p, index) => (
                            <span
                              key={index}
                              className={`badge p-2 border ${p === userName ? "bg-danger text-white border-danger" : "bg-dark text-secondary border-secondary"}`}
                            >
                              {p === userName ? "🔥 TÚ" : `👤 ${p}`}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        className={`btn w-100 fw-bold py-2 shadow ${isUserParticipating ? "btn-outline-secondary disabled" : "btn-warning"}`}
                        onClick={() => handleAcceptChallenge(challenge.id)}
                        disabled={isUserParticipating}
                      >
                        {isUserParticipating
                          ? "ESTÁS EN COMBATE"
                          : "ACEPTAR RETO Y APOSTAR"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            /* ========================================= */
            /* VISTA 2: FORMULARIO PARA CREAR NUEVO RETO */
            /* ========================================= */
            <div className="card bg-black p-4 border border-danger shadow-lg animate__animated animate__zoomIn">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-2">
                <h3
                  className="text-white fw-bold m-0"
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    letterSpacing: "1px",
                  }}
                >
                  FORJAR NUEVO RETO
                </h3>
                <button
                  className="btn btn-sm btn-outline-secondary border-0"
                  onClick={() => setShowCreateForm(false)}
                >
                  ✕ CANCELAR
                </button>
              </div>

              <form onSubmit={handleCreateChallenge}>
                {/* 6. El selector de Tipo ahora ocupa toda la fila porque quitamos el del tiempo */}
                <div className="mb-3">
                  <label className="form-label text-secondary fw-bold small">
                    TIPO DE DISCIPLINA
                  </label>
                  <select
                    className="form-select bg-dark text-white border-secondary shadow-none fw-bold"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                  >
                    <option value="FUERZA">FUERZA BRUTA</option>
                    <option value="RESISTENCIA">RESISTENCIA</option>
                    <option value="VOLUMEN">VOLUMEN (KILOS TOTALES)</option>
                    <option value="DISCIPLINA">
                      DISCIPLINA (DÍAS SEGUIDOS)
                    </option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary fw-bold small">
                    MISIÓN (¿QUÉ HAY QUE HACER?)
                  </label>
                  <textarea
                    className="form-control bg-dark text-white border-secondary shadow-none"
                    rows={2}
                    required
                    placeholder="Ej: Lograr 100 flexiones sin descanso..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-secondary fw-bold small">
                    LA APUESTA (¿QUÉ PIERDE EL QUE FALLE?)
                  </label>
                  <input
                    type="text"
                    className="form-control bg-dark text-danger fw-bold border-danger shadow-none"
                    required
                    placeholder="Ej: Invitar una pizza, pagar 50 dólares..."
                    value={newBet}
                    onChange={(e) => setNewBet(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-danger w-100 fw-bold py-3 fs-5 shadow-lg"
                  style={{ letterSpacing: "2px" }}
                >
                  🔥 LANZAR A LA ARENA
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OlimpoView;
