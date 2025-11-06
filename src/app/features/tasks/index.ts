export {
  default as tasksReducer,
  setTasks,
  addTask,
  updateTask,
  removeTask,
  clearTasks,
  setLoading,
  setError,
  selectTasks,
  selectTasksLoading,
  selectTasksError,
  selectTasksByStatus,
  selectTasksByPriority,
  selectTaskById,
  selectPendingTasks,
  selectInProgressTasks,
  selectCompletedTasks,
  selectTasksCount,
} from './taskSlice';

export type { TasksState } from './taskSlice';

