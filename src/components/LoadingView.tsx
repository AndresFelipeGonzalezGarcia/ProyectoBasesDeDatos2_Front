import bug from "../assets/bug.png";
import { useState } from "react";

interface LoadingProps {
  onLogin: (name: string, password: string) => void;

  onRegister: (data: {
    name: string;
    email: string;
    age: number;
    weight: number;
    sex: string;
  }) => void;
}

function LoadingView({ onLogin, onRegister }: LoadingProps) {
  const [showForm, setShowForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const [warriorName, setWarriorName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [sex, setSex] = useState("m");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      onLogin(warriorName.trim(), password);
    } else {
      onRegister({
        name: warriorName.trim(),
        email: email,
        age: Number(age),
        weight: Number(weight),
        sex: sex,
      });
    }
  };

  const blockInvalidNumberKeys = (e: React.KeyboardEvent) => {
    if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
      e.preventDefault();
    }
  };
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center min-vh-100"
      style={{
        backgroundColor: "#000",
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.95)), url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!showForm ? (
        <div className="animate__animated animate__fadeInDown px-3">
          <div style={{ height: "400px", overflow: "hidden" }}>
            <img
              src={bug}
              alt="Logo"
              style={{ width: "600px", marginTop: "-50px" }}
            />
          </div>

          <h1
            className="text-white display-1 fw-bold mb-0"
            style={{
              fontFamily: "'Anton', sans-serif",
              letterSpacing: "2px",
              fontSize: "clamp(3rem, 10vw, 6rem)",
            }}
          >
            BUGGY'S <span className="text-danger">FIT</span>
          </h1>
          <p
            className="text-secondary fs-4 mt-2 mb-5 fw-bold"
            style={{ letterSpacing: "3px" }}
          >
            FORJA TU LEYENDA. CONQUISTA EL OLIMPO.
          </p>

          <button
            className="btn btn-danger btn-lg px-5 py-3 fw-bold fs-4 shadow-lg"
            style={{
              borderRadius: "0",
              border: "2px solid #ff0000",
              fontFamily: "'Anton', sans-serif",
              letterSpacing: "2px",
            }}
            onClick={() => setShowForm(true)}
          >
            INGRESAR AL SISTEMA
          </button>
        </div>
      ) : (
        <div
          className="card bg-black p-4 p-md-5 shadow-lg animate__animated animate__zoomIn"
          style={{
            width: "90%",
            maxWidth: "500px",
            borderRadius: "0",
            border: "1px solid #333",
            borderTop: "4px solid #ff0000",
          }}
        >
          <h2
            className="text-white text-center mb-4"
            style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "2px" }}
          >
            {isLogin ? "INICIAR SESIÓN" : "NUEVO GUERRERO"}
          </h2>

          <form onSubmit={handleSubmit} className="text-start">
            {/* CAMPO DE NOMBRE: APARECE SIEMPRE */}
            <div className="mb-3 animate__animated animate__fadeIn">
              <label className="form-label text-secondary fw-bold small">
                NOMBRE DE USUARIO
              </label>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary shadow-none text-center fw-bold"
                required
                placeholder="Ej: ADMIN, El_Tanque..."
                value={warriorName}
                onChange={(e) => setWarriorName(e.target.value)}
              />
            </div>

            {/* CAMPOS EXCLUSIVOS DE REGISTRO */}
            {!isLogin && (
              <div className="animate__animated animate__fadeIn">
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label text-secondary fw-bold small">
                      EDAD
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control bg-dark text-white border-secondary shadow-none text-center"
                      required
                      placeholder="Años"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      onKeyDown={blockInvalidNumberKeys}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label text-secondary fw-bold small">
                      PESO (KG)
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control bg-dark text-white border-secondary shadow-none text-center"
                      required
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="kg"
                      onKeyDown={blockInvalidNumberKeys}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary fw-bold small">
                    SEXO
                  </label>
                  <select
                    className="form-select bg-dark text-white border-secondary shadow-none"
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                  >
                    <option value="m">MASCULINO</option>
                    <option value="f">FEMENINO</option>
                    <option value="o">OTRO</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary fw-bold small">
                    CORREO ELECTRÓNICO
                  </label>
                  <input
                    type="email"
                    className="form-control bg-dark text-white border-secondary shadow-none text-center"
                    required
                    placeholder="correo@olimpo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* LA CONTRASEÑA SE PIDE SIEMPRE */}
            <div className="mb-4">
              <label className="form-label text-secondary fw-bold small">
                CONTRASEÑA
              </label>
              <input
                type="password"
                className="form-control bg-dark text-white border-secondary shadow-none text-center"
                required
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-danger w-100 fw-bold py-2 shadow-sm"
              style={{ borderRadius: "0", letterSpacing: "1px" }}
            >
              {isLogin ? "ENTRAR AL OLIMPO" : "CREAR PERFIL"}
            </button>
          </form>

          <div className="text-center mt-4 border-top border-dark pt-3">
            <button
              type="button"
              className="btn btn-link text-danger fw-bold text-decoration-none p-0 mt-1"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "¿AÚN NO ERES PARTE DEL OLIMPO? REGÍSTRATE"
                : "¿YA TIENES UN LUGAR? INICIA SESIÓN"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoadingView;
