'use client';

import { useState } from 'react';
import { Task } from '../context/TaskContext';
import TaskItem from './TaskItem';

interface ListViewProps {
  tasks: Task[];
}

export default function ListView({ tasks }: ListViewProps) {
  const [sortBy, setSortBy] = useState<'createdAt' | 'title' | 'status'>('createdAt');

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'status') {
      const statusOrder = { todo: 0, 'in progress': 1, done: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div>
      <div className="mb-6">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="p-2 border"
        >
          <option value="createdAt">Дата создания</option>
          <option value="title">Алфавит</option>
          <option value="status">Статус</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        {sortedTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}