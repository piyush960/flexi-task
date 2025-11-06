import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout as logoutAction, selectUser } from '@/app/features/auth/authSlice';
import { 
  selectTasks, 
} from '@/app/features/tasks/taskSlice';
import { 
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from '@/app/services/tasksAPI';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';
import TaskList from '@/components/TaskList';
import TaskFormModal from '@/components/TaskFormModal';
import EmptyState from '@/components/EmptyState';
import { LogOut, Plus, Moon, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  
  useGetTasksQuery();
  
  const tasks = useAppSelector(selectTasks);
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleLogout = () => {
    dispatch(logoutAction());
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate('/');
  };

  const handleCreateTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createTask(task).unwrap();
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask).unwrap();
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId).unwrap();
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task.",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">FlexiTask</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">My Tasks</h2>
            <p className="text-muted-foreground mt-1">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-md"
          >
            <Plus className="h-5 w-5" />
            New Task
          </Button>
        </div>

        {tasks.length === 0 ? (
          <EmptyState onCreateTask={() => setIsModalOpen(true)} />
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={handleEditClick}
            onDelete={handleDeleteTask}
            onStatusChange={handleUpdateTask}
          />
        )}
      </main>

      <TaskFormModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
      />
    </div>
  );
};

export default Dashboard;
