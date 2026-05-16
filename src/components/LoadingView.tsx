import bug from "../assets/bug.png";
import { useState } from "react";

// ─── Design Tokens (Sincronizados con App.tsx) ─────────────────────────────
const T = {
  bg: "#0a0a0a",
  surface: "#111111",
  elevated: "#181818",
  border: "#222222",
  red: "#e63946",
  redDim: "#7f1d1d",
  text: "#f0ede8",
  muted: "#5a5a5a",
  font: "'Barlow Condensed', sans-serif",
  serif: "'Playfair Display', serif",
};

// ─── GlowBtn Component ──────────────────────────────────────────────────────
interface GlowBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "red" | "ghost";
  size?: "md" | "lg";
}

const GlowBtn = ({
  children,
  variant = "red",
  size = "md",
  style,
  ...props
}: GlowBtnProps) => {
  const map = {
    red: { color: T.red, bg: `${T.red}18`, hover: `${T.red}30` },
    ghost: { color: T.text, bg: "transparent", hover: "#ffffff0d" },
  };
  const v = map[variant];
  const sz =
    size === "lg"
      ? { padding: "14px 40px", fontSize: 16 }
      : { padding: "10px 28px", fontSize: 14 };

  return (
    <button
      {...props}
      style={{
        fontFamily: T.font,
        fontWeight: 700,
        letterSpacing: 3,
        textTransform: "uppercase",
        color: v.color,
        background: v.bg,
        border: `1px solid ${v.color}55`,
        borderRadius: 2,
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: `0 0 16px ${v.color}22`,
        ...sz,
        ...style,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = v.hover;
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          `0 0 28px ${v.color}55`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = v.bg;
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          `0 0 16px ${v.color}22`;
      }}
    >
      {children}
    </button>
  );
};

// ─── Interfaces & Main Component ────────────────────────────────────────────
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
        backgroundColor: T.bg,
        backgroundImage: `linear-gradient(${T.bg}dd, ${T.bg}f2), url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: T.text,
      }}
    >
      {/* ─── Estilos Inyectados para Inputs ─── */}
      <style>{`
        .buggy-input {
          background: ${T.surface};
          border: 1px solid ${T.border};
          color: ${T.text};
          font-family: ${T.font};
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 2px;
          padding: 12px;
          border-radius: 2px;
          width: 100%;
          text-align: center;
          outline: none;
          transition: all 0.2s;
        }
        .buggy-input:focus {
          border-color: ${T.red}88;
          box-shadow: 0 0 12px ${T.red}22;
          background: ${T.elevated};
        }
        .buggy-input::placeholder {
          color: ${T.muted};
          font-weight: 400;
        }
        .buggy-label {
          font-family: ${T.font};
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          color: ${T.muted};
          text-transform: uppercase;
          margin-bottom: 6px;
          display: block;
        }
      `}</style>

      {!showForm ? (
        <div className="animate__animated animate__fadeInDown px-3">
          <div style={{ height: "400px", overflow: "hidden" }}>
            <img
              src={bug}
              alt="Logo"
              style={{ width: "500px", marginTop: "-50px" }}
            />
          </div>

          <h1
            style={{
              fontFamily: T.serif,
              fontSize: "clamp(3.5rem, 10vw, 7rem)",
              fontWeight: 700,
              color: T.text,
              margin: "-40px 0 10px 0",
              lineHeight: 1,
              letterSpacing: "-2px",
            }}
          >
            BUGGY'S <em style={{ fontStyle: "italic", color: T.red }}>FIT</em>
          </h1>
          <p
            style={{
              fontFamily: T.font,
              fontSize: 16,
              color: T.muted,
              letterSpacing: 6,
              textTransform: "uppercase",
              marginBottom: 48,
            }}
          >
            Forja tu leyenda · Conquista el olimpo
          </p>

          <GlowBtn variant="red" size="lg" onClick={() => setShowForm(true)}>
            INGRESAR AL SISTEMA
          </GlowBtn>
        </div>
      ) : (
        <div
          className="animate__animated animate__zoomIn"
          style={{
            width: "90%",
            maxWidth: "480px",
            background: T.elevated,
            border: `1px solid ${T.border}`,
            borderTop: `3px solid ${T.red}`,
            padding: "40px 32px",
            borderRadius: 4,
            boxShadow: `0 16px 48px #000000`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Brillo de fondo sutil */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 300,
              height: 150,
              background: `radial-gradient(ellipse at top, ${T.red}12 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          <h2
            style={{
              fontFamily: T.serif,
              fontSize: 32,
              fontWeight: 700,
              color: T.text,
              marginBottom: 32,
              letterSpacing: 1,
            }}
          >
            {isLogin ? (
              "Identifícate"
            ) : (
              <>
                Nuevo{" "}
                <em style={{ color: T.red, fontStyle: "italic" }}>Guerrero</em>
              </>
            )}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="text-start"
            style={{ position: "relative", zIndex: 1 }}
          >
            <div className="mb-4 animate__animated animate__fadeIn">
              <label className="buggy-label">NOMBRE DE USUARIO</label>
              <input
                type="text"
                className="buggy-input"
                required
                placeholder="EJ: EL_TANQUE"
                value={warriorName}
                onChange={(e) => setWarriorName(e.target.value)}
              />
            </div>

            {!isLogin && (
              <div className="animate__animated animate__fadeIn">
                <div className="row mb-4 gx-3">
                  <div className="col-6">
                    <label className="buggy-label">EDAD</label>
                    <input
                      type="number"
                      min="0"
                      className="buggy-input"
                      required
                      placeholder="AÑOS"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      onKeyDown={blockInvalidNumberKeys}
                    />
                  </div>
                  <div className="col-6">
                    <label className="buggy-label">PESO (KG)</label>
                    <input
                      type="number"
                      min="0"
                      className="buggy-input"
                      required
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="KG"
                      onKeyDown={blockInvalidNumberKeys}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="buggy-label">SEXO</label>
                  <select
                    className="buggy-input"
                    style={{ cursor: "pointer" }}
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                  >
                    <option value="m">MASCULINO</option>
                    <option value="f">FEMENINO</option>
                    <option value="o">OTRO</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="buggy-label">CORREO ELECTRÓNICO</label>
                  <input
                    type="email"
                    className="buggy-input"
                    required
                    placeholder="CORREO@OLIMPO.COM"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="mb-5">
              <label className="buggy-label">CONTRASEÑA</label>
              <input
                type="password"
                className="buggy-input"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <GlowBtn
              variant="red"
              size="lg"
              style={{ width: "100%" }}
              type="submit"
            >
              {isLogin ? "ENTRAR A LA ARENA" : "FORJAR PERFIL"}
            </GlowBtn>
          </form>

          <div
            style={{
              marginTop: 32,
              paddingTop: 24,
              borderTop: `1px solid ${T.border}`,
              textAlign: "center",
            }}
          >
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                fontFamily: T.font,
                fontSize: 12,
                letterSpacing: 2,
                color: T.muted,
                cursor: "pointer",
                transition: "color 0.2s",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "¿Sin acceso? Regístrate aquí"
                : "¿Ya tienes lugar? Inicia sesión"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoadingView;
