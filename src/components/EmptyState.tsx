import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ClipboardList, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateTask: () => void;
}

const EmptyState = ({ onCreateTask }: EmptyStateProps) => {
  return (
    <Card className="p-12 text-center">
      <div className="flex flex-col items-center max-w-md mx-auto">
        <div className="h-20 w-20 rounded-full bg-primary-light flex items-center justify-center mb-6">
          <ClipboardList className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">No tasks yet</h3>
        <p className="text-muted-foreground mb-8">
          Get started by creating your first task. Stay organized and boost your productivity!
        </p>
        <Button
          onClick={onCreateTask}
          size="lg"
          className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
        >
          <Plus className="h-5 w-5" />
          Create Your First Task
        </Button>
      </div>
    </Card>
  );
};

export default EmptyState;
