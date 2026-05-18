import type {
  UsuarioBackend,
  TrenBackend,
  EjercicioBackend,
  RutinaBackend,
  RutinaEjercicioBackend,
  TipoRetoBackend,
  RetoParticipanteBackend,
  LogroBackend,
  UsuarioLogroBackend,
  LogroRutinaBackend,
  HistorialBackend,
} from "../Types";

const BASE_URL = "http://localhost:8082/api";

const request = async <T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (res.status === 204) return {} as T;

  // Si el back devuelve error, lanzamos el mensaje del GlobalExceptionHandler
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const mensaje = errorBody?.message || errorBody?.mensaje || `Error ${res.status}`;
    throw new Error(mensaje);
  }

  // Si la respuesta es texto plano (ej: "User created successfully.")
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await res.text();
    return text as unknown as T;
  }

  return await res.json();
};

// ─── USUARIO ────────────────────────────────────────────────────────────────

export const loginUser = (correoUsuario: string, claveUsuario: string) =>
  request<UsuarioBackend>("/usuario/login", {
    method: "POST",
    body: JSON.stringify({ correoUsuario, claveUsuario }),
  });

export const registerUser = (data: {
  correoUsuario: string;
  claveUsuario: string;
  nombre: string;
  edad: number;
  peso: number;
  genero: string;
  idRol: number;
}) =>
  request<string>("/usuario/create", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getAllUsuarios = () =>
  request<UsuarioBackend[]>("/usuario/all");

export const updateUsuario = (id: number, data: {
  nombre: string;
  correoUsuario: string;
  edad: number;
  peso: number;
  genero: string;
  idRol: number;
}) =>
  request<string>(`/usuario/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteUsuario = (id: number) =>
  request<string>(`/usuario/delete/${id}`, {
    method: "DELETE",
  });

// ─── TREN ────────────────────────────────────────────────────────────────────

export const getTrenes = () =>
  request<TrenBackend[]>("/tren/listar");

// ─── EJERCICIO ───────────────────────────────────────────────────────────────

export const getEjercicios = () =>
  request<EjercicioBackend[]>("/ejercicio/all");

export const createEjercicio = (data: {
  nombre: string;
  musculo: string;
  imagen: string;
  idTren: number;
}) =>
  request<string>("/ejercicio/create", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateEjercicio = (data: {
  idEjercicio: number;
  nombre: string;
  musculo: string;
  imagen: string;
  idTren: number;
}) =>
  request<string>("/ejercicio/actualizar", {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteEjercicio = (id: number) =>
  request<string>(`/ejercicio/eliminar/${id}`, {
    method: "DELETE",
  });

// ─── RUTINA ──────────────────────────────────────────────────────────────────

export const getRutinasByUsuario = (idUsuario: number) =>
  request<RutinaBackend[]>(`/rutina/usuario/${idUsuario}`);

/** Devuelve { idRutina, message } al crear correctamente */
export const createRutina = (data: { idUsuario: number; nombre: string }) =>
  request<{ idRutina: number; message: string }>("/rutina/create", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteRutina = (id: number) =>
  request<string>(`/rutina/delete/${id}`, {
    method: "DELETE",
  });

// ─── RUTINA-EJERCICIO ────────────────────────────────────────────────────────

export const getRutinaEjercicios = (idRutina: number) =>
  request<RutinaEjercicioBackend[]>(`/rutina-ejercicio/rutina/${idRutina}`);

export const addEjerciciosBatch = (
  items: { idRutina: number; idEjercicio: number; orden: number }[],
) =>
  request<string>("/rutina-ejercicio/add/batch", {
    method: "POST",
    body: JSON.stringify(items),
  });

// ─── TIPO RETO ────────────────────────────────────────────────────────────────

export const getTiposReto = () =>
  request<TipoRetoBackend[]>("/tipo-reto/all");

// ─── RETO ─────────────────────────────────────────────────────────────────────

export const getAllRetos = () =>
  request<{ idReto: number; idUsuario: number; nombreUsuario: string; idTipoReto: number; nombreTipoReto: string; descripcion: string; apuesta: string; estado: string; fechaCreacion: string; fechaLimite: string }[]>("/reto/all");

/** Devuelve { idReto, message } al crear correctamente */
export const createReto = (data: {
  idUsuario: number;
  idTipoReto: number;
  descripcion: string;
  apuesta: string;
  estado: string;
  fechaLimite: string;
}) =>
  request<{ idReto: number; message: string }>("/reto/create", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateRetoEstado = (idReto: number, estado: string) =>
  request<string>(`/reto/update/${idReto}/estado/${estado}`, {
    method: "PATCH",
  });

export const deleteReto = (idReto: number) =>
  request<string>(`/reto/delete/${idReto}`, {
    method: "DELETE",
  });

// ─── RETO PARTICIPANTE ────────────────────────────────────────────────────────

export const getAllParticipantes = () =>
  request<RetoParticipanteBackend[]>("/reto-participante/all");

export const getParticipantesByReto = (idReto: number) =>
  request<RetoParticipanteBackend[]>(`/reto-participante/reto/${idReto}`);

export const getParticipantesByUsuario = (idUsuario: number) =>
  request<RetoParticipanteBackend[]>(`/reto-participante/usuario/${idUsuario}`);

export const joinReto = (idUsuario: number, idReto: number) =>
  request<string>("/reto-participante/join", {
    method: "POST",
    body: JSON.stringify({ idUsuario, idReto }),
  });

export const declararGanador = (idRetoParticipante: number) =>
  request<string>(`/reto-participante/ganador/${idRetoParticipante}`, {
    method: "PUT",
  });

// ─── LOGRO ───────────────────────────────────────────────────────────────────

export const getAllLogros = () =>
  request<LogroBackend[]>("/logro/all");

export const createLogro = (data: { nombre: string; descripcion: string; icono: string }) =>
  request<string>("/logro/create", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateLogro = (id: number, data: { nombre: string; descripcion: string; icono: string }) =>
  request<string>(`/logro/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteLogro = (id: number) =>
  request<string>(`/logro/delete/${id}`, {
    method: "DELETE",
  });

// ─── USUARIO LOGRO ────────────────────────────────────────────────────────────

export const getLogrosUsuario = (idUsuario: number) =>
  request<UsuarioLogroBackend[]>(`/usuario-logro/usuario/${idUsuario}`);

export const asignarLogro = (idUsuario: number, idLogro: number) =>
  request<string>("/usuario-logro/asignar", {
    method: "POST",
    body: JSON.stringify({ idUsuario, idLogro }),
  });

// ─── LOGRO RUTINA ─────────────────────────────────────────────────────────────

export const getLogrosByRutina = (idRutina: number) =>
  request<LogroRutinaBackend[]>(`/logro-rutina/rutina/${idRutina}`);

// ─── HISTORIAL (MongoDB) ──────────────────────────────────────────────────────

export const getHistorialByUsuario = (idUsuario: number) =>
  request<HistorialBackend[]>(`/historial/usuario/${idUsuario}`);

export const createHistorial = (data: {
  idUsuario: number;
  idRutina: number;
  nombreRutina: string;
  fechaFin: string;
  volumenTotalKG: number;
  ejercicios: {
    idEjercicio: number;
    orden: number;
    series: {
      numeroSerie: number;
      pesoKG: number;
      repeticiones: number;
      descansoSegundo: number;
    }[];
  }[];
}) =>
  request<string>("/historial/create", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteHistorial = (id: string) =>
  request<string>(`/historial/delete/${id}`, {
    method: "DELETE",
  });
