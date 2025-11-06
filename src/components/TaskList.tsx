import { Task } from '@/types/task';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (task: Task) => void;
}

const TaskList = ({ tasks, onEdit, onDelete, onStatusChange }: TaskListProps) => {
  const groupedTasks = {
    pending: tasks.filter(t => t.status === 'pending'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    completed: tasks.filter(t => t.status === 'completed'),
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-3 w-3 rounded-full bg-muted-foreground" />
          <h3 className="font-semibold text-foreground">Pending</h3>
          <span className="text-sm text-muted-foreground">({groupedTasks.pending.length})</span>
        </div>
        {groupedTasks.pending.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-3 w-3 rounded-full bg-warning" />
          <h3 className="font-semibold text-foreground">In Progress</h3>
          <span className="text-sm text-muted-foreground">({groupedTasks['in-progress'].length})</span>
        </div>
        {groupedTasks['in-progress'].map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-3 w-3 rounded-full bg-success" />
          <h3 className="font-semibold text-foreground">Completed</h3>
          <span className="text-sm text-muted-foreground">({groupedTasks.completed.length})</span>
        </div>
        {groupedTasks.completed.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
