import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Calendar, Edit, Flag, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { useTasks } from "@/providers/task-provider";
import { AuthUserResponseDto } from "@/lib/api.types";

interface TodoCardProps {
  task: Task;
  currentUser: AuthUserResponseDto;
  editTask(task: Task): void;
  deleteTask(task: Task): void;
}

const TodoCard: React.FC<TodoCardProps> = ({
  task,
  currentUser,
  editTask,
  deleteTask,
}) => {
  const { toggleTaskStatus } = useTasks();
  const isOwner = task.owner.id === currentUser.id;
  const canUncheck =
    task.status !== TaskStatus.COMPLETE || task.completer?.id === currentUser.id;

  const colorFlagByPriority = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH: {
        return "text-red-500";
      }
      case TaskPriority.LOW: {
        return "text-blue-500";
      }
      default: {
        return "text-muted-foreground";
      }
    }
  };

  const colorCheckboxByStatus = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETE: {
        return "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 data-[state=checked]:scale-125 transition-all duration-300 ease-out";
      }
      default: {
        return "transition-all duration-200 ease-in-out scale-100";
      }
    }
  };

  return (
    <div className="flex items-center gap-6 py-2 px-1 border-b">
      <Checkbox
        className={`w-6 h-6 ${colorCheckboxByStatus(task.status)}`}
        checked={task.status === TaskStatus.COMPLETE}
        onClick={() => {
          if (canUncheck) {
            void toggleTaskStatus(task.id);
          }
        }}
        disabled={!canUncheck}
        data-testid="checkbox-task-status"
      />

      <div className="flex items-center justify-between w-full">
        <div>
          <Label htmlFor="terms-2" className="text-md">
            {task.title}
          </Label>
          <p className="text-muted-foreground text-sm">{task.description}</p>
          <p className="text-muted-foreground text-xs">
            Owner: {task.owner.email}
          </p>
          {task.completer && task.status === TaskStatus.COMPLETE && (
            <p className="text-muted-foreground text-xs">
              Completed by: {task.completer.email}
            </p>
          )}
          <div className="flex gap-4 items-center">
            <Button
              variant={"ghost"}
              className="h-8 p-0 justify-start"
              disabled
            >
              <Flag className={`${colorFlagByPriority(task.priority)}`} />{" "}
              {task.priority}
            </Button>

            {task.dueDate && (
              <Button
                variant={"ghost"}
                className="h-8 p-0 justify-start"
                disabled
              >
                <Calendar /> {task.dueDate.toLocaleDateString()}
              </Button>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={"outline"}
            className="hover:bg-yellow-600"
            data-testid="button-edit-task"
            onClick={() => editTask(task)}
          >
            <Edit />
          </Button>
          <Button
            data-testid="button-delete-task"
            className="hover:bg-red-500"
            variant={"outline"}
            onClick={() => deleteTask(task)}
            disabled={!isOwner}
          >
            <Trash />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
