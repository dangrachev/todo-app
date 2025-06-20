'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task, useTaskContext } from '../../../context/TaskContext';
import Modal from '../../../components/Modal';

interface TaskEditPageProps {
  params: Promise<{ id: string }>;
}

export default function TaskEditPage({ params }: TaskEditPageProps) {
  const router = useRouter();
  const { id: taskId } = React.use(params);
  const { tasks, categories, updateTask, deleteTask } = useTaskContext();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [taskData, setTaskData] = useState<Task | null>(null);

  useEffect(() => {
    const task = tasks.find((t) => t.id === taskId);
    setTaskData(task ? { ...task } : null);
  }, [taskId, tasks]);

  if (!taskData) return (
    <div className="p-4 max-w-full mx-auto">
      <button className="mb-10" onClick={() => router.replace('/')}>🠔 На главную</button>
      <h1 className="text-center text-3xl font-semibold">Задача не найдена</h1>
    </div>
  );

  const handleChange = (field: keyof Task, value: string) => {
    setTaskData((prev) =>
      prev ? { ...prev, [field]: value } as Task : prev
    );
  };

  const handleSave = () => {
    if (taskData) {
      updateTask(taskData.id, {
        title: taskData.title,
        status: taskData.status,
        categoryId: taskData.categoryId,
      });
      router.push('/');
    }
  };

  const handleDelete = () => {
    setIsConfirmOpen(false);
    deleteTask(taskId);
    router.replace('/');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <button className="mb-10" onClick={() => router.replace('/')}>🠔 На главную</button>

      <h1 className="text-2xl mb-4 text-center">Редактировать задачу</h1>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={taskData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="p-2 border"
        />

        <select
          value={taskData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="p-2 border"
        >
          <option value="todo">Todo</option>
          <option value="in progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          value={taskData.categoryId}
          onChange={(e) => handleChange('categoryId', e.target.value)}
          className="p-2 border"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className='flex justify-evenly mt-4'>
          <button className="p-2 w-32 bg-blue-500 text-white rounded" onClick={handleSave}>
            Сохранить
          </button>

          <button className="p-2 w-32 bg-red-700 text-white rounded" onClick={() => setIsConfirmOpen(true)}>
            Удалить
          </button>
        </div>
      </div>

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Подтверждение"
      >
        <p className="text-center">Удалить задачу?</p>

        <div className="flex justify-between gap-2 mt-6">
          <button className="px-3 py-1 bg-red-700 text-white rounded" onClick={handleDelete}>
            Да
          </button>

          <button className="px-2 py-1 bg-gray-700 text-white rounded" onClick={() => setIsConfirmOpen(false)}>
            Нет
          </button>
        </div>
      </Modal>
    </div>
  );
}