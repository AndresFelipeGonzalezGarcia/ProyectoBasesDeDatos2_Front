import { useState } from "react";

import type { Challenge } from "../Types";

interface OlimpoProps {
  userName: string;
  challenges: Challenge[];
  setChallenges: (ch: Challenge[]) => void;
  onWinChallenge: () => void;
}

function OlimpoView({
  userName,
  challenges,
  setChallenges,
  onWinChallenge,
}: OlimpoProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newType, setNewType] = useState("FUERZA");
  const [newDescription, setNewDescription] = useState("");
  const [newBet, setNewBet] = useState("");
  const [newDeadline, setNewDeadline] = useState("24 Horas");

  const handleAcceptChallenge = (challengeId: number) => {
    // Modificamos el JSON global
    setChallenges(
      challenges.map((ch) => {
        if (ch.id === challengeId && !ch.participants?.includes(userName)) {
          return {
            ...ch,
            participants: [...(ch.participants || []), userName],
          };
        }
        return ch;
      }),
    );
  };

  const handleClaimVictory = (challengeId: number) => {
    onWinChallenge(); // Suma 1 al contador de victorias en el Perfil
    const updatedChallenges = challenges.filter((ch) => ch.id !== challengeId);
    setChallenges(updatedChallenges); // Borra el reto de la base de datos global
    alert("¡VICTORIA REGISTRADA! El reto ha sido retirado de la arena.");
  };

  const handleTimeOut = (challengeId: number) => {
    const updatedChallenges = challenges.filter((ch) => ch.id !== challengeId);
    setChallenges(updatedChallenges);
  };

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    const newChallenge: Challenge = {
      id: Date.now(),
      creator: userName,
      type: newType,
      description: newDescription,
      bet: newBet,
      status: "Abierto",
      deadline: newDeadline,
      participants: [userName],
    };
    // Agregamos el nuevo reto al JSON global
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
          LA ARENA ESPERA.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          {!showCreateForm ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4 text-white">
                <h3
                  className="fw-bold m-0"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  RETOS EN JUEGO
                </h3>
                <button
                  className="btn btn-danger fw-bold shadow"
                  onClick={() => setShowCreateForm(true)}
                >
                  + LANZAR UN RETO
                </button>
              </div>

              {challenges.length === 0 ? (
                <div className="text-center py-5 text-secondary">
                  <p className="fs-4">
                    No hay desafíos en la arena actualmente.
                  </p>
                  <p>Sé el primero en forjar uno.</p>
                </div>
              ) : (
                challenges.map((challenge) => {
                  const isUserParticipating =
                    challenge.participants?.includes(userName);
                  const isCreator = challenge.creator === userName;
                  const borderColor = isUserParticipating
                    ? "#ff0000"
                    : "#ffc107";

                  return (
                    <div
                      key={challenge.id}
                      className="card bg-black border-secondary mb-4 shadow-lg animate__animated animate__fadeInUp"
                      style={{ borderLeft: `4px solid ${borderColor}` }}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="d-flex gap-2 text-white">
                            <span className="badge bg-dark border border-secondary p-2">
                              {challenge.type}
                            </span>
                            <span className="badge bg-dark text-warning border border-warning p-2">
                              ⏳ {challenge.deadline}
                            </span>
                          </div>
                          <small className="text-secondary fw-bold">
                            Líder:{" "}
                            <span className="text-white">
                              {challenge.creator}
                            </span>
                          </small>
                        </div>

                        <h4 className="card-title fw-bold mb-3 text-white text-uppercase">
                          {challenge.description}
                        </h4>

                        <div className="bg-dark p-3 rounded mb-3 border border-secondary d-flex flex-column flex-md-row justify-content-between gap-2">
                          <div>
                            <span className="text-secondary small fw-bold d-block mb-1 text-uppercase">
                              APUESTA:
                            </span>
                            <span className="text-danger fw-bold fs-5 text-uppercase">
                              {challenge.bet}
                            </span>
                          </div>
                          <div className="text-md-end">
                            <span className="text-secondary small fw-bold d-block mb-1">
                              ESTADO:
                            </span>
                            <span className="fw-bold text-uppercase text-warning">
                              EN COMBATE
                            </span>
                          </div>
                        </div>

                        <div className="mb-4 text-white">
                          <small className="text-secondary fw-bold d-block mb-2">
                            GUERREROS ({challenge.participants?.length || 0}):
                          </small>
                          <div className="d-flex flex-wrap gap-2">
                            {challenge.participants?.map((p, index) => (
                              <span
                                key={index}
                                className={`badge p-2 border ${p === userName ? "bg-danger text-white border-danger" : "bg-dark text-secondary border-secondary"}`}
                              >
                                {p === userName ? "TÚ" : `${p}`}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="d-flex flex-column gap-2">
                          {isUserParticipating ? (
                            <button
                              className="btn btn-success w-100 fw-bold py-2 shadow border-2 border-success"
                              onClick={() => handleClaimVictory(challenge.id)}
                            >
                              ¡LO LOGRÉ! RECLAMAR VICTORIA
                            </button>
                          ) : (
                            <button
                              className="btn w-100 fw-bold py-2 shadow btn-warning text-dark"
                              onClick={() =>
                                handleAcceptChallenge(challenge.id)
                              }
                            >
                              ENTRAR A LA ARENA
                            </button>
                          )}
                          {isCreator && (
                            <button
                              className="btn btn-link text-secondary text-decoration-none small mt-2"
                              onClick={() => handleTimeOut(challenge.id)}
                            >
                              Cerrar por tiempo agotado
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          ) : (
            <div className="card bg-black p-4 border border-danger shadow-lg animate__animated animate__zoomIn">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-2 text-white">
                <h3
                  className="fw-bold m-0"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  FORJAR NUEVO RETO
                </h3>
                <button
                  className="btn btn-sm btn-outline-secondary border-0 text-white"
                  onClick={() => setShowCreateForm(false)}
                >
                  ✕ CANCELAR
                </button>
              </div>

              <form onSubmit={handleCreateChallenge}>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-secondary fw-bold small">
                      DISCIPLINA
                    </label>
                    <select
                      className="form-select bg-dark text-white border-secondary shadow-none"
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                    >
                      <option value="FUERZA">FUERZA BRUTA</option>
                      <option value="RESISTENCIA">RESISTENCIA</option>
                      <option value="VOLUMEN">VOLUMEN</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-secondary fw-bold small">
                      PLAZO
                    </label>
                    <select
                      className="form-select bg-dark text-white border-secondary shadow-none"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                    >
                      <option value="HOY">HOY MISMO</option>
                      <option value="24 Horas">24 HORAS</option>
                      <option value="3 Días">3 DÍAS</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary fw-bold small">
                    MISIÓN
                  </label>
                  <textarea
                    className="form-control bg-dark text-white border-secondary shadow-none"
                    rows={2}
                    required
                    placeholder="Ej: Lograr 100 flexiones..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>

                <div className="mb-4 text-white">
                  <label className="form-label text-secondary fw-bold small">
                    APUESTA
                  </label>
                  <input
                    type="text"
                    className="form-control bg-dark text-danger fw-bold border-danger shadow-none"
                    required
                    placeholder="Ej: Una pizza..."
                    value={newBet}
                    onChange={(e) => setNewBet(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-danger w-100 fw-bold py-3 fs-5 shadow-lg"
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
