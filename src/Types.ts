// Respuesta real del backend al hacer login
export interface UsuarioBackend {
  idUsuario: number;
  correoUsuario: string;
  claveUsuario?: string;
  nombre: string;
  edad: number;
  peso: number;
  genero: string;
  idRol: number;
}

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  imageUrl: string;
  volume?: number;
  idTren?: number;
}

export interface TrenBackend {
  idTren: number;
  nombre: string;
  descripcion: string;
}

export interface EjercicioBackend {
  idEjercicio: number;
  nombre: string;
  musculo: string;
  imagen: string;
  idTren: number;
}

export interface TipoRetoBackend {
  idTipoReto: number;
  nombre: string;
}

export interface RetoParticipanteBackend {
  idRetoParticipante: number;
  idUsuario: number;
  nombreUsuario: string;
  idReto: number;
  fechaUnion: string;
  esGanador: boolean;
}

export interface Challenge {
  id: number;           // idReto
  creator: string;      // nombreUsuario del creador
  idCreador: number;    // idUsuario del creador
  type: string;         // nombreTipoReto
  idTipoReto: number;
  description: string;  // descripcion
  bet: string;          // apuesta
  status: string;       // estado: PENDIENTE | EN_PROCESO | FINALIZADO
  deadline: string;     // fechaLimite ISO string
  participantes: RetoParticipanteBackend[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Activo" | "Baneado";
  age: number;
  weight: number;
}

export interface SavedRoutine {
  id: string;       // idRutina del backend (como string)
  name: string;
  exercises: Exercise[];
}

export interface RutinaBackend {
  idRutina: number;
  idUsuario: number;
  nombre: string;
  fechaCreacion: string;
}

export interface RutinaEjercicioBackend {
  idRutinaEjercicio: number;
  idRutina: number;
  idEjercicio: number;
  orden: number;
}

export interface LogroBackend {
  idLogro: number;
  nombre: string;
  descripcion: string;
  icono: string;
}

export interface UsuarioLogroBackend {
  idUsuarioLogro: number;
  idUsuario: number;
  idLogro: number;
  nombreLogro: string;
  descripcionLogro: string;
  iconoLogro: string;
  fechaDesbloqueo: string;
}

export interface LogroRutinaBackend {
  idLogroRutina: number;
  idRutina: number;
  idLogro: number;
  estado: string;
}

// ─── Historial / Serie (MongoDB) ──────────────────────────────────────────────

/** Datos de una serie individual capturada en ExerciseCard */
export interface WorkoutSet {
  weight: number;
  reps: number;
  restSeconds: number;
}

export interface SerieBackend {
  numeroSerie: number;
  pesoKG: number;
  repeticiones: number;
  descansoSegundo: number;
}

export interface HistorialEjercicioBackend {
  idEjercicio: number;
  nombreEjercicio: string;
  orden: number;
  series: SerieBackend[];
}

export interface HistorialBackend {
  id: string;
  idUsuario: number;
  idRutina: number;
  nombreRutina: string;
  fechaFin: string;
  volumenTotalKG: number;
  ejercicios: HistorialEjercicioBackend[];
}
