export interface User {
  _id: string;
  name: string;
  email: string;
  token?: string;
}

export interface MovieShow {
  _id: string;
  title: string;
  type: "Movie" | "TV Show";
  director: string;
  budget?: string;
  location?: string;
  duration: string;
  year: number;
  genre?: string;
  rating?: number;
  description?: string;
  poster?: string;
  user: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MovieShowFormData {
  title: string;
  type: "Movie" | "TV Show";
  director: string;
  budget?: string;
  location?: string;
  duration: string;
  year: number;
  genre?: string;
  rating?: number;
  description?: string;
  poster?: File | null;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface PaginationResponse {
  movieShows: MovieShow[];
  page: number;
  pages: number;
  total: number;
  hasMore: boolean;
}
