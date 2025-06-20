'use client';

import { useRouter } from 'next/navigation';
import { Task } from '../context/TaskContext';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const router = useRouter();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  const statusColor = {
    'todo': 'bg-red-800',
    'in progress': 'bg-orange-400',
    'done': 'bg-green-500',
  };

  return (
    <div className="p-2 bg-white border cursor-pointer flex justify-between"
      draggable
      onDragStart={handleDragStart}
      onClick={() => router.push(`/task/${task.id}`)}>
      <span>{task.title}</span>

      <span className={`p-2 ml-2 text-white rounded ${statusColor[task.status]}`}>
        {task.status}
      </span>
    </div>
  );
}