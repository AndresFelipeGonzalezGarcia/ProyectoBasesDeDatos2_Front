import bug from "../assets/bug.png";

interface NavBarProps {
  currentView: "routines" | "workout" | "olimpo" | "profile" | "admin";
  onViewChange: (
    view: "routines" | "workout" | "olimpo" | "profile" | "admin",
  ) => void;
  onLogout: () => void;
  userName: string;
}

function NavBar({
  currentView,
  onViewChange,
  onLogout,
  userName,
}: NavBarProps) {
  return (
    <nav className="navbar navbar-dark bg-black border-bottom border-secondary sticky-top shadow">
      <div className="container-fluid px-3 px-md-5">
        <span
          className="navbar-brand mb-0 h1 fw-bold d-flex align-items-center gap-2"
          style={{
            fontFamily: "'Anton', sans-serif",
            letterSpacing: "2px",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
          onClick={() => onViewChange("routines")}
        >
          <img src={bug} alt="Logo" width="60" height="60" />
          BUGGY'S <span className="text-danger">FIT</span>
        </span>

        {/* Usamos flex-wrap por si se abre en un celular muy pequeño */}
        <div className="d-flex flex-wrap gap-2 gap-md-3 align-items-center mt-2 mt-md-0">
          <button
            className={`btn btn-sm fw-bold ${currentView === "routines" ? "btn-danger" : "btn-outline-secondary border-0 text-white"}`}
            onClick={() => onViewChange("routines")}
          >
            RUTINAS
          </button>

          <button
            className={`btn btn-sm fw-bold ${currentView === "workout" ? "btn-danger" : "btn-outline-secondary border-0 text-white"}`}
            onClick={() => onViewChange("workout")}
          >
            ENTRENAR
          </button>

          <button
            className={`btn btn-sm fw-bold ${currentView === "olimpo" ? "btn-danger" : "btn-outline-secondary border-0 text-white"}`}
            onClick={() => onViewChange("olimpo")}
          >
            <span className="text-warning me-1">👑</span> OLIMPO
          </button>

          <button
            className={`btn btn-sm fw-bold ${currentView === "profile" ? "btn-danger" : "btn-outline-secondary border-0 text-white"}`}
            onClick={() => onViewChange("profile")}
          >
            PERFIL
          </button>
          {userName.toUpperCase() === "ADMIN" && (
            <button
              className={`btn fw-bold ${currentView === "admin" ? "btn-danger" : "btn-outline-danger"} ms-2`}
              onClick={() => onViewChange("admin")}
            >
              ADMIN
            </button>
          )}

          <button
            className="btn btn-link text-secondary text-decoration-none p-0 ms-2"
            onClick={onLogout}
          >
            <small>SALIR</small>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
