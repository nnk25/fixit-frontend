import { Task, TaskPriority, TaskStatus } from "@/types/task";

/** Standardized Error Response */
export interface ApiErrorResponseDto {
  error: string;
}

export interface UserResponseDto {
  id: number;
  email: string;
}

export interface AuthUserResponseDto {
  id: number;
  email: string;
}

/** Standardized DTO representing a task. */
export interface TaskResponseDto {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
  owner: UserResponseDto;
  completer?: UserResponseDto;
}

/**
 * Maps a TaskResponseDto to a Task.
 *
 * @param dto The TaskResponseDto object.
 * @returns The Task object.
 */
export const taskResponseDtoToTask = (dto: TaskResponseDto): Task => {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? "",
    dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    priority: dto.priority,
    status: dto.status,
    owner: dto.owner,
    completer: dto.completer,
  };
};

/** A request to create a new task. */
export interface CreateTaskRequestDto {
  title: string;
  description?: string;
  dueDate?: Date;
  priority: TaskPriority;
}

export interface UpdateTaskRequestDto {
  title: string;
  description?: string;
  dueDate?: Date;
  priority: TaskPriority;
  status: TaskStatus;
}
