import { Task, TaskStatus } from '@/types/task';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (task: Task) => void;
}

const priorityColors = {
  low: 'bg-secondary text-secondary-foreground',
  medium: 'bg-yellow-400/15 text-yellow-600',
  high: 'bg-destructive/10 text-destructive',
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  const handleStatusChange = (newStatus: TaskStatus) => {
    onStatusChange({ ...task, status: newStatus });
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground mb-1 line-clamp-2">{task.title}</h4>
          <Badge className={priorityColors[task.priority]} variant="secondary">
            {task.priority}
          </Badge>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{task.description}</p>

      {task.dueDate && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Calendar className="h-3 w-3" />
          <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
        </div>
      )}

      <Select value={task.status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </Card>
  );
};

export default TaskCard;
