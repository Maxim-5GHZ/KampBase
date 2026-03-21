import axios, { AxiosInstance } from "axios";
import { authService } from "./auth-service";
import {
  TaskRequest,
  Task,
  SubmitSolutionRequest,
  CompleteTask,
  ReviewSolutionRequest,
  TreeOfSkills,
} from "./types";

class TaskService {
  private http: AxiosInstance;

  constructor(baseURL: string = "/api/tasks") {
    this.http = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
    });

    this.http.interceptors.request.use((config) => {
      const headers = authService.getAuthHeader();
      if (headers.Authorization) {
        config.headers.Authorization = headers.Authorization;
      }
      return config;
    });
  }

  async createTask(data: TaskRequest): Promise<Task> {
    const response = await this.http.post<Task>("", data);
    return response.data;
  }

  async getAllTasks(): Promise<Task[]> {
    const response = await this.http.get<Task[]>("");
    return response.data;
  }

  async submitSolution(
    taskId: number,
    data: SubmitSolutionRequest,
  ): Promise<CompleteTask> {
    const response = await this.http.post<CompleteTask>(
      `/${taskId}/submit`,
      data,
    );
    return response.data;
  }

  async reviewSolution(
    solutionId: number,
    data: ReviewSolutionRequest,
  ): Promise<CompleteTask> {
    const response = await this.http.post<CompleteTask>(
      `/solutions/${solutionId}/review`,
      data,
    );
    return response.data;
  }

  // ДОБАВЛЕННЫЙ МЕТОД: Получение статистики решений для ментора
  async getTaskSolutions(taskId: number): Promise<CompleteTask[]> {
    const response = await this.http.get<CompleteTask[]>(
      `/${taskId}/solutions`,
    );
    return response.data;
  }

  async getMySkills(): Promise<TreeOfSkills> {
    const response = await this.http.get<TreeOfSkills>("/skills/my");
    return response.data;
  }
}

export const taskService = new TaskService();
