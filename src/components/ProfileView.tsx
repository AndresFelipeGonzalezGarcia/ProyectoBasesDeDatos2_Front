interface ProfileProps {
  userName: string;
  totalWorkouts: number;
}

function ProfileView({ userName, totalWorkouts }: ProfileProps) {
  // Las estadísticas ahora son dinámicas
  const stats = {
    totalWorkouts: totalWorkouts,
    totalVolumeKg: totalWorkouts * 1250,
    challengesWon: 0,
    level: totalWorkouts > 10 ? "GUERRERO DE ÉLITE" : "INICIADO DEL OLIMPO",
  };

  const achievements = [
    {
      id: 1,
      name: "PRIMERA SANGRE",
      desc: "Completaste tu primer entrenamiento.",
      icon: "🩸",
      unlocked: true,
    },
    {
      id: 2,
      name: "TITÁN DE ACERO",
      desc: "Levantaste más de 10,000 kg en total.",
      icon: "🦾",
      unlocked: true,
    },
    {
      id: 3,
      name: "REY DE LA ARENA",
      desc: "Gana 5 retos en el Olimpo.",
      icon: "👑",
      unlocked: false,
    },
    {
      id: 4,
      name: "DISCIPLINA",
      desc: "Entrena 5 días seguidos.",
      icon: "🔥",
      unlocked: false,
    },
  ];

  return (
    <div className="container mt-4 mb-5 animate__animated animate__fadeIn">
      {/* Encabezado del Perfil */}
      <div className="text-center mb-5 border-bottom border-danger pb-4">
        <div
          className="d-inline-flex align-items-center justify-content-center bg-danger text-white rounded-circle mb-3 shadow-lg"
          style={{ width: "100px", height: "100px", fontSize: "3rem" }}
        >
          {userName.charAt(0).toUpperCase()}
        </div>
        <h1
          className="display-4 text-white fw-bold mb-0 text-uppercase"
          style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "2px" }}
        >
          {userName}
        </h1>
        <p className="text-warning fs-5 fw-bold mt-2 text-uppercase">
          {stats.level}
        </p>
      </div>

      <div className="row">
        {/* Columna de Estadísticas */}
        <div className="col-md-5 mb-4">
          <h3
            className="text-white fw-bold mb-3"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            ESTADÍSTICAS
          </h3>

          <div className="card bg-black border-secondary mb-3 shadow">
            <div className="card-body d-flex justify-content-between align-items-center">
              <span className="text-secondary fw-bold">
                RUTINAS COMPLETADAS
              </span>
              <span className="text-white fs-4 fw-bold">
                {stats.totalWorkouts}
              </span>
            </div>
          </div>

          <div className="card bg-black border-secondary mb-3 shadow">
            <div className="card-body d-flex justify-content-between align-items-center">
              <span className="text-secondary fw-bold">VOLUMEN TOTAL (KG)</span>
              <span className="text-danger fs-4 fw-bold">
                {stats.totalVolumeKg.toLocaleString()} kg
              </span>
            </div>
          </div>

          <div className="card bg-black border-warning mb-3 shadow">
            <div className="card-body d-flex justify-content-between align-items-center">
              <span className="text-warning fw-bold">RETOS GANADOS</span>
              <span className="text-white fs-4 fw-bold">
                {stats.challengesWon}
              </span>
            </div>
          </div>
        </div>

        {/* Columna de Logros */}
        <div className="col-md-7">
          <h3
            className="text-white fw-bold mb-3"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            MEDALLAS DE GUERRA
          </h3>

          {/* Columna de Logros */}

          <div className="row">
            {achievements.map((ach) => (
              <div key={ach.id} className="col-sm-6 mb-3">
                {/* Ajustamos la opacidad base para que se vea mejor aunque esté bloqueado */}
                <div
                  className={`card h-100 bg-black border-${ach.unlocked ? "danger" : "secondary"} shadow-sm`}
                  style={{ opacity: ach.unlocked ? 1 : 0.6 }}
                >
                  <div className="card-body text-center">
                    <div className="display-4 mb-2">{ach.icon}</div>
                    <h5
                      className={`fw-bold text-uppercase ${ach.unlocked ? "text-white" : "text-secondary"}`}
                    >
                      {ach.name}
                    </h5>
                    {/* CAMBIO AQUÍ: Usamos text-light en lugar de text-muted para que contraste */}
                    <p className="small text-light opacity-75 m-0">
                      {ach.desc}
                    </p>
                    {ach.unlocked && (
                      <span className="badge bg-danger mt-2">DESBLOQUEADO</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
