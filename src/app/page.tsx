'use client';

import { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import ListView from '../components/ListView';
import KanbanView from '../components/KanbanView';
import Modal from '../components/Modal';
import { clearLocalStorage } from '../utils/localstorage';

export default function Home() {
  const { tasks, categories, addTask, addCategory } = useTaskContext();
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', categoryId: '' });
  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    if (categories.length > 0) {
      const generalCategory = categories.find((cat) => cat.name === 'General');
      setNewTask((prev) => ({
        ...prev,
        categoryId: generalCategory?.id || categories[0].id,
      }));
    }
  }, [categories]);

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = statusFilter === 'All' || task.status === statusFilter.toLowerCase();
    const catMatch = categoryFilter === 'All' || task.categoryId === categories.find((c) => c.name === categoryFilter)?.id;
    return statusMatch && catMatch;
  });

  const handleAddTask = () => {
    if (!newTask.title || !newTask.categoryId) return;

    addTask({
      id: Date.now().toString(),
      title: newTask.title,
      status: 'todo',
      createdAt: new Date(),
      categoryId: newTask.categoryId,
    });
    setNewTask({ title: '', categoryId: categories.find((cat) => cat.name === 'General')?.id || (categories[0]?.id || '') });
    setIsTaskModalOpen(false);
  };

  const handleAddCategory = () => {
    if (!newCatName) return;

    addCategory({ id: Date.now().toString(), name: newCatName, taskIds: [] });
    setNewCatName('');
    setIsCatModalOpen(false);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        <div>
          <button className={["m-1 p-2 font-semibold bg-gray-200 rounded", view === 'list' && 'border-2 border-blue-700 border-solid'].join(' ')} onClick={() => setView('list')}>
            Список
          </button>

          <button className={["m-1 p-2 font-semibold bg-gray-200 rounded", view === 'kanban' && 'border-2 border-blue-700 border-solid'].join(' ')} onClick={() => setView('kanban')}>
            Канбан
          </button>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="m-1 p-1 border"
          >
            <option>All</option>
            <option>Todo</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="m-1 p-1 border"
          >
            <option>All</option>
            {categories.map((cat) => (
              <option key={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <button className="m-1 p-2 bg-blue-500 text-white rounded" onClick={() => setIsTaskModalOpen(true)}>
            Создать задачу
          </button>

          <button className="m-1 p-2 bg-blue-500 text-white rounded" onClick={() => setIsCatModalOpen(true)}>
            Создать категорию
          </button>
        </div>

        <div>
          <button title="Очистить local storage от todo" className="p-1 hover:bg-gray-200 rounded"
            onClick={clearLocalStorage}
          >
            🗑️
          </button>
        </div>
      </div>

      {view === 'list' ? <ListView tasks={filteredTasks} /> : <KanbanView tasks={filteredTasks} />}

      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Новая задача">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Заголовок"
            className="p-2 border"
          />

          <select
            value={newTask.categoryId}
            onChange={(e) => setNewTask({ ...newTask, categoryId: e.target.value })}
            className="p-2 border"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            className="w-32 p-2 mt-6 self-center bg-green-600 text-white rounded"
            onClick={handleAddTask}
          >
            Добавить
          </button>
        </div>
      </Modal>

      <Modal isOpen={isCatModalOpen} onClose={() => setIsCatModalOpen(false)} title="Новая категория">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Название"
            className="p-2 border"/>

          <button className="w-32 p-2 mt-6 self-center bg-green-600 text-white rounded" onClick={handleAddCategory}>
            Добавить
          </button>
        </div>
      </Modal>
    </div>
  );
}