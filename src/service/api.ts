import type { Exercise, Challenge, User, SavedRoutine } from "../Types";

const BASE_URL = "http://localhost:8080/api";

const request = async <T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }

    if (res.status === 204) return {} as T;

    return await res.json();
  } catch (error) {
    console.error("API ERROR:", error);
    throw error;
  }
};

export const getExercises = () => request<Exercise[]>("/exercises");

export const createExercise = (exercise: Partial<Exercise>) =>
  request<Exercise>("/exercises", {
    method: "POST",
    body: JSON.stringify(exercise),
  });

export const updateExercise = (id: string, exercise: Partial<Exercise>) =>
  request<Exercise>(`/exercises/${id}`, {
    method: "PUT",
    body: JSON.stringify(exercise),
  });

export const deleteExercise = (id: string) =>
  request(`/exercises/${id}`, { method: "DELETE" });

export const getChallenges = () => request<Challenge[]>("/challenges");

export const createChallenge = (challenge: Partial<Challenge>) =>
  request<Challenge>("/challenges", {
    method: "POST",
    body: JSON.stringify(challenge),
  });

export const updateChallenge = (id: number, challenge: Partial<Challenge>) =>
  request<Challenge>(`/challenges/${id}`, {
    method: "PUT",
    body: JSON.stringify(challenge),
  });

export const deleteChallenge = (id: number) =>
  request(`/challenges/${id}`, { method: "DELETE" });

export const getUsers = () => request<User[]>("/users");

export const createUser = (user: Partial<User>) =>
  request<User>("/users", {
    method: "POST",
    body: JSON.stringify(user),
  });

export const updateUser = (id: number, user: Partial<User>) =>
  request<User>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(user),
  });

export const deleteUser = (id: number) =>
  request(`/users/${id}`, { method: "DELETE" });

export const login = (credentials: { name: string; password?: string }) =>
  request<User>("/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const getRoutines = () => request<SavedRoutine[]>("/routines");

export const createRoutine = (routine: Partial<SavedRoutine>) =>
  request<SavedRoutine>("/routines", {
    method: "POST",
    body: JSON.stringify(routine),
  });

export const deleteRoutine = (id: string) =>
  request(`/routines/${id}`, {
    method: "DELETE",
  });

export const createWorkout = (workout: {
  userId: number;
  date: string;
  totalVolume: number;
  exercisesCount: number;
  exercises: any[];
}) =>
  request("/workouts", {
    method: "POST",
    body: JSON.stringify(workout),
  });
