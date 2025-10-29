import api from "./api";
import type { MovieShow, PaginationResponse } from "../types/index";

export const movieShowService = {
  async getMovieShows(
    page: number = 1,
    limit: number = 10,
    search: string = "",
    type: string = "",
    sortBy: string = "-createdAt"
  ): Promise<PaginationResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
    });

    if (search) params.append("search", search);
    if (type) params.append("type", type);

    const response = await api.get(`/movies?${params.toString()}`);
    return response.data;
  },

  async getMovieShowById(id: string): Promise<MovieShow> {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },

  async createMovieShow(formData: FormData): Promise<MovieShow> {
    const response = await api.post("/movies", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async updateMovieShow(id: string, formData: FormData): Promise<MovieShow> {
    const response = await api.put(`/movies/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async deleteMovieShow(id: string): Promise<void> {
    await api.delete(`/movies/${id}`);
  },
};
