export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  imageUrl: string;
  volume?: number;
}

export interface Challenge {
  id: number;
  creator: string;
  type?: string;
  description: string;
  bet?: string;
  status: string;
  deadline?: string;
  participants?: string[];
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
  id: string;
  name: string;
  exercises: Exercise[];
}
