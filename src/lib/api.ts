import { Task } from "@/types/task";
import {
  ApiErrorResponseDto,
  AuthUserResponseDto,
  CreateTaskRequestDto,
  TaskResponseDto,
  taskResponseDtoToTask,
  UpdateTaskRequestDto,
} from "./api.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export class ApiHttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

const buildUrl = (path: string): string => {
  return `${API_BASE_URL}${path}`;
};

const toLocalDate = (value: Date | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }
  return value.toISOString().split("T")[0];
};

const getApiErrorMessage = async (response: Response): Promise<string> => {
  try {
    const errorResponse = (await response.json()) as ApiErrorResponseDto;
    return errorResponse.error;
  } catch {
    return `Request failed: ${response.status} ${response.statusText}`;
  }
};

const createDefaultHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
});

const fetchJson = async <T>(path: string, init: RequestInit): Promise<T> => {
  const response = await fetch(buildUrl(path), {
    credentials: "include",
    ...init,
  });

  if (!response.ok) {
    throw new ApiHttpError(await getApiErrorMessage(response), response.status);
  }

  return (await response.json()) as T;
};

/**
 * Create a new task.
 *
 * @param request The request to create a new task.
 * @returns The created task.
 */
export const createTask = async (
  request: CreateTaskRequestDto,
): Promise<Task> => {
  const dto = await fetchJson<TaskResponseDto>("/api/tasks", {
    method: "POST",
    headers: createDefaultHeaders(),
    body: JSON.stringify({
      title: request.title,
      description: request.description,
      dueDate: toLocalDate(request.dueDate),
      priority: request.priority,
    }),
  });
  return taskResponseDtoToTask(dto);
};

/**
 * List all tasks.
 *
 * @returns The list of tasks.
 */
export const listTasks = async (): Promise<Task[]> => {
  const dtos = await fetchJson<TaskResponseDto[]>("/api/tasks", {
    method: "GET",
    headers: createDefaultHeaders(),
  });
  return dtos.map((dto) => taskResponseDtoToTask(dto));
};

/**
 * Update an existing task.
 *
 * @param todoId The ID of the task to update.
 * @param request The request to update the task.
 * @returns The updated task.
 */
export const updateTask = async (
  todoId: string,
  request: UpdateTaskRequestDto,
): Promise<Task> => {
  const dto = await fetchJson<TaskResponseDto>(`/api/tasks/${todoId}`, {
    method: "PUT",
    headers: createDefaultHeaders(),
    body: JSON.stringify({
      title: request.title,
      description: request.description,
      dueDate: toLocalDate(request.dueDate),
      priority: request.priority,
      status: request.status,
    }),
  });
  return taskResponseDtoToTask(dto);
};

/**
 * Delete an existing task.
 *
 * @param todoId The ID of the task to delete.
 */
export const deleteTask = async (todoId: string): Promise<void> => {
  const response = await fetch(buildUrl(`/api/tasks/${todoId}`), {
    method: "DELETE",
    credentials: "include",
    headers: createDefaultHeaders(),
  });

  if (!response.ok) {
    throw new ApiHttpError(await getApiErrorMessage(response), response.status);
  }
};

export const getAuthenticatedUser = async (): Promise<AuthUserResponseDto> => {
  return fetchJson<AuthUserResponseDto>("/api/auth/me", {
    method: "GET",
    headers: createDefaultHeaders(),
  });
};

export const signInWithGoogle = (): void => {
  window.location.href = buildUrl("/oauth2/authorization/google");
};

export const logout = async (): Promise<void> => {
  const response = await fetch(buildUrl("/logout"), {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new ApiHttpError(await getApiErrorMessage(response), response.status);
  }
};
