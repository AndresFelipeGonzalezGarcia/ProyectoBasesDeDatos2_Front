import { useState } from "react";
import type { Challenge, User, Exercise } from "../Types";

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
  const [activeTab, setActiveTab] = useState<
    "retos" | "usuarios" | "ejercicios"
  >("usuarios");

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const [newExName, setNewExName] = useState("");
  const [newExMuscle, setNewExMuscle] = useState("PECHO");
  const [newExImage, setNewExImage] = useState("");

  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: newExName.toUpperCase(),
      muscle: newExMuscle,
      imageUrl:
        newExImage ||
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200",
    };
    setExercises([...exercises, newExercise]);
    // Limpiamos los campos
    setNewExName("");
    setNewExImage("");
  };

  const saveUserUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
      setEditingUser(null);
    }
  };

  const saveExerciseUpdate = (e: React.FormEvent) => {
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

  return (
    <div className="container mt-4 mb-5 animate__animated animate__fadeIn">
      <div className="text-center mb-4 border-bottom border-danger pb-4">
        <h1
          className="display-4 text-danger fw-bold mb-0 text-uppercase"
          style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "2px" }}
        >
          CENTRAL DE <span className="text-white">DATOS</span>
        </h1>
      </div>

      {/* MENÚ DE NAVEGACIÓN */}
      <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
        <button
          className={`btn fw-bold px-4 ${activeTab === "usuarios" ? "btn-danger" : "btn-outline-secondary"}`}
          onClick={() => setActiveTab("usuarios")}
        >
          USUARIOS
        </button>
        <button
          className={`btn fw-bold px-4 ${activeTab === "ejercicios" ? "btn-danger" : "btn-outline-secondary"}`}
          onClick={() => setActiveTab("ejercicios")}
        >
          EJERCICIOS
        </button>
        <button
          className={`btn fw-bold px-4 ${activeTab === "retos" ? "btn-danger" : "btn-outline-secondary"}`}
          onClick={() => setActiveTab("retos")}
        >
          RETOS
        </button>
      </div>

      {/* ==========================================
          SECCIÓN DE USUARIOS
      ========================================== */}
      {activeTab === "usuarios" && (
        <div className="animate__animated animate__fadeIn">
          {editingUser && (
            <div className="card bg-dark border-warning mb-4 shadow-lg animate__animated animate__zoomIn">
              <div className="card-body">
                <h5 className="text-warning fw-bold mb-3">
                  EDITAR PERFIL DE GUERRERO
                </h5>
                <form onSubmit={saveUserUpdate} className="row g-3">
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control bg-black text-white border-secondary"
                      value={editingUser.name}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="email"
                      className="form-control bg-black text-white border-secondary"
                      value={editingUser.email}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-4 d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-warning fw-bold w-100"
                    >
                      GUARDAR
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-light"
                      onClick={() => setEditingUser(null)}
                    >
                      ✕
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <div className="table-responsive bg-black border border-secondary p-2 shadow-lg">
            <table className="table table-dark table-hover align-middle text-center m-0">
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
                    <td className="text-white fw-bold">{u.name}</td>
                    <td className="text-secondary">{u.email}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-warning me-2 fw-bold"
                        onClick={() => setEditingUser(u)}
                      >
                        EDITAR
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger fw-bold"
                        onClick={() =>
                          setUsers(users.filter((user) => user.id !== u.id))
                        }
                      >
                        BORRAR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==========================================
          SECCIÓN DE EJERCICIOS (CREAR + TABLA)
      ========================================== */}
      {activeTab === "ejercicios" && (
        <div className="animate__animated animate__fadeIn">
          {/* 1. FORMULARIO DINÁMICO (CREAR O EDITAR) */}
          <div
            className={`card ${editingExercise ? "border-info" : "border-danger"} bg-dark mb-4 shadow-lg`}
          >
            <div className="card-body">
              <h5
                className={`${editingExercise ? "text-info" : "text-danger"} fw-bold mb-3`}
              >
                {editingExercise
                  ? "ACTUALIZAR EJERCICIO"
                  : "AÑADIR NUEVO EJERCICIO AL CATÁLOGO"}
              </h5>

              <form
                onSubmit={
                  editingExercise ? saveExerciseUpdate : handleCreateExercise
                }
                className="row g-2 align-items-end"
              >
                <div className="col-md-4">
                  <label className="text-secondary small fw-bold">
                    NOMBRE DEL MOVIMIENTO
                  </label>
                  <input
                    type="text"
                    className="form-control bg-black text-white border-secondary shadow-none"
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
                  <label className="text-secondary small fw-bold">
                    GRUPO MUSCULAR
                  </label>
                  <select
                    className="form-select bg-black text-white border-secondary shadow-none"
                    value={
                      editingExercise ? editingExercise.muscle : newExMuscle
                    }
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
                  <label className="text-secondary small fw-bold">
                    URL IMAGEN / GIF
                  </label>
                  <input
                    type="text"
                    className="form-control bg-black text-white border-secondary shadow-none"
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
                    <div className="d-flex gap-1">
                      <button
                        type="submit"
                        className="btn btn-info w-100 fw-bold"
                      >
                        OK
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-light"
                        onClick={() => setEditingExercise(null)}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-danger w-100 fw-bold"
                    >
                      AÑADIR
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* 2. TABLA DE GESTIÓN */}
          <div className="table-responsive bg-black border border-secondary shadow-lg">
            <table className="table table-dark table-hover align-middle text-center m-0">
              <thead className="text-secondary">
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
                        style={{
                          width: "45px",
                          height: "45px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </td>
                    <td className="text-white fw-bold">{ex.name}</td>
                    <td>
                      <span className="badge bg-secondary">{ex.muscle}</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-info me-2 fw-bold"
                        onClick={() => setEditingExercise(ex)}
                      >
                        EDITAR
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger fw-bold"
                        onClick={() =>
                          setExercises(exercises.filter((e) => e.id !== ex.id))
                        }
                      >
                        BORRAR
                      </button>
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
        <div className="card bg-black border-danger p-0 overflow-hidden animate__animated animate__fadeIn">
          <table className="table table-dark table-hover text-center m-0">
            <thead className="text-secondary">
              <tr>
                <th>LÍDER</th>
                <th>DESAFÍO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((ch) => (
                <tr key={ch.id}>
                  <td className="text-warning fw-bold">{ch.creator}</td>
                  <td className="text-white small">{ch.description}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger fw-bold"
                      onClick={() =>
                        setChallenges(challenges.filter((c) => c.id !== ch.id))
                      }
                    >
                      ELIMINAR
                    </button>
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
