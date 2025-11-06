import { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Task, TaskFormValues } from '@/types/task';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
  task?: Task | null;
}

const taskSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .required('Title is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .required('Description is required'),
  status: Yup.string().oneOf(['pending', 'in-progress', 'completed']).required('Status is required'),
  priority: Yup.string().oneOf(['low', 'medium', 'high']).required('Priority is required'),
  dueDate: Yup.string().optional(),
});

const TaskFormModal = ({ open, onClose, onSubmit, task }: TaskFormModalProps) => {
  const initialValues: TaskFormValues = task ? {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
  } : {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={taskSchema}
          onSubmit={(values, { setSubmitting }) => {
            if (task) {
              onSubmit({ ...task, ...values });
            } else {
              onSubmit(values);
            }
            setSubmitting(false);
            onClose();
          }}
          enableReinitialize
        >
          {({ values, setFieldValue, isSubmitting, errors, touched }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Field
                  as={Input}
                  id="title"
                  name="title"
                  placeholder="Enter task title"
                  className={errors.title && touched.title ? 'border-destructive' : ''}
                />
                <ErrorMessage name="title" component="p" className="text-sm text-destructive" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Field
                  as={Textarea}
                  id="description"
                  name="description"
                  placeholder="Enter task description"
                  rows={4}
                  className={errors.description && touched.description ? 'border-destructive' : ''}
                />
                <ErrorMessage name="description" component="p" className="text-sm text-destructive" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={values.status}
                    onValueChange={(value) => setFieldValue('status', value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <ErrorMessage name="status" component="p" className="text-sm text-destructive" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select
                    value={values.priority}
                    onValueChange={(value) => setFieldValue('priority', value)}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <ErrorMessage name="priority" component="p" className="text-sm text-destructive" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date (Optional)</Label>
                <Field
                  as={Input}
                  type="date"
                  id="dueDate"
                  name="dueDate"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                >
                  {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormModal;
