'use client';

import { Task, useTaskContext } from '../context/TaskContext';
import TaskItem from './TaskItem';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../components/Modal';

interface KanbanViewProps {
  tasks: Task[];
}

export default function KanbanView({ tasks }: KanbanViewProps) {
  const router = useRouter();
  const { categories, moveTask, deleteCategory } = useTaskContext();
  const [isConfirmOpen, setIsConfirmOpen] = useState<{ categoryId: string; open: boolean }>({ categoryId: '', open: false });

  const handleDrop = (e: React.DragEvent, categoryId: string, index: number) => {
    e.preventDefault();

    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    moveTask(taskId, categoryId, index);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDeleteCategory = (categoryId: string) => {
    setIsConfirmOpen({ categoryId: '', open: false });
    deleteCategory(categoryId);

    router.replace('/');
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 overflow-x-auto">
      {categories.map((cat) => {
        const catTasks = tasks.filter((t) => t.categoryId === cat.id);
        return (
          <div
            key={cat.id}
            className="w-full max-w-[300px] p-2 bg-gray-100 rounded"
            onDrop={(e) => handleDrop(e, cat.id, catTasks.length)}
            onDragOver={handleDragOver}
          >
            <div className="mb-2 flex justify-between items-center">
              <h3 className="font-bold">{cat.name}</h3>

              <button title="Удалить категорию"
                className="p-1 hover:text-red-500"
                onClick={() => setIsConfirmOpen({ categoryId: cat.id, open: true })}
              >
                ✕
              </button>
            </div>

            {cat.taskIds.map((taskId, idx) => {
              const task = catTasks.find((t) => t.id === taskId);
              if (!task) return null;
              return (
                <div
                  key={task.id}
                  className="mb-2"
                  onDrop={(e) => {
                    e.stopPropagation();
                    handleDrop(e, cat.id, idx);
                  }}
                  onDragOver={handleDragOver}
                >
                  <TaskItem task={task} />
                </div>
              );
            })}
          </div>
        );
      })}

      <Modal
        isOpen={isConfirmOpen.open}
        onClose={() => setIsConfirmOpen({ categoryId: '', open: false })}
        title="Подтверждение"
      >
        <p className="text-center">Категория будет удалена только если в ней нет задач.</p>
        <p className="text-center">Удалить категорию?</p>

        <div className="flex justify-between gap-2 mt-6">
          <button className="px-3 py-1 bg-red-700 text-white rounded"
            onClick={() => handleDeleteCategory(isConfirmOpen.categoryId)}>
            Да
          </button>

          <button className="px-2 py-1 bg-gray-700 text-white rounded"
            onClick={() => setIsConfirmOpen({ categoryId: '', open: false })}>
            Нет
          </button>
        </div>
      </Modal>
    </div>
  );
}