import { useState, useEffect } from "react";

interface RestTimerProps {
  initialSeconds: number;
  onClose: () => void;
}

function RestTimer({ initialSeconds, onClose }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((tiempoAnterior) => tiempoAnterior - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      className={`text-white text-center py-2 px-3 mt-3 rounded d-flex justify-content-between align-items-center shadow-lg animate__animated animate__fadeIn ${timeLeft > 0 ? "bg-dark border border-secondary" : "bg-danger border border-danger"}`}
    >
      {timeLeft > 0 ? (
        <>
          <span className="text-secondary small fw-bold">DESCANSO:</span>
          <span
            className="text-danger fw-bold fs-4"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </span>
        </>
      ) : (
        <span
          className="fw-bold animate__animated animate__flash w-100 text-center"
          style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "1px" }}
        >
          ¡SE ACABÓ EL DESCANSO! A LA GUERRA
        </span>
      )}

      {/* Botón para cerrar el temporizador manualmente */}
      <button
        className="btn btn-sm btn-outline-light border-0 ms-2"
        onClick={onClose}
        style={{
          width: "30px",
          height: "30px",
          padding: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default RestTimer;
