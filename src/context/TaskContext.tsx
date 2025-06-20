'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localstorage';

export interface Task {
    id: string;
    title: string;
    status: 'todo' | 'in progress' | 'done';
    createdAt: Date;
    categoryId: string;
}

interface Category {
    id: string;
    name: string;
    taskIds: string[];
}

interface TaskContextType {
    tasks: Task[];
    categories: Category[];
    addTask: (task: Task) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    addCategory: (category: Category) => void;
    deleteCategory: (id: string) => void;
    moveTask: (taskId: string, newCategoryId: string, newIndex: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const loadedTasks = loadFromLocalStorage<Task[]>('todo-tasks') || [];
        const loadedCategories = loadFromLocalStorage<Category[]>('todo-categories') || [];
        if (loadedCategories.length === 0) {
            loadedCategories.push({ id: Date.now().toString(), name: 'General', taskIds: [] });
        }

        setTasks(loadedTasks);
        setCategories(loadedCategories);
    }, []);

    useEffect(() => {
        saveToLocalStorage('todo-tasks', tasks);
        saveToLocalStorage('todo-categories', categories);
    }, [tasks, categories]);

    const addTask = (task: Task) => {
        setTasks((prev) => [...prev, task]);
        setCategories((prev) => prev.map((cat) => cat.id === task.categoryId
            ? { ...cat, taskIds: [...cat.taskIds, task.id] } : cat
        ));
    };

    const updateTask = (id: string, updates: Partial<Task>) => {
        setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)));
    };

    const deleteTask = (id: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
        setCategories((prev) =>
            prev.map((cat) => ({
                ...cat,
                taskIds: cat.taskIds.filter((taskId) => taskId !== id),
            }))
        );
    };

    const addCategory = (category: Category) => {
        setCategories((prev) => [...prev, category]);
    };

    const deleteCategory = (id: string) => {
        const cat = categories.find((c) => c.id === id);
        if (cat?.taskIds.length) {
            alert('Нельзя удалить категорию, в которой есть задачи.');
            return;
        }
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
    };

    const moveTask = (taskId: string, newCategoryId: string, newIndex: number) => {
        const task = tasks.find((task) => task.id === taskId);
        if (!task) return;

        if (task.categoryId === newCategoryId) {
            setCategories((prev) =>
                prev.map((cat) => {
                    if (cat.id === newCategoryId) {
                        const currentIndex = cat.taskIds.indexOf(taskId);
                        if (currentIndex === -1) return cat;

                        const taskIds = cat.taskIds.filter((id) => id !== taskId);
                        const adjustedIndex = Math.min(newIndex, taskIds.length);
                        return {
                            ...cat,
                            taskIds: [
                                ...taskIds.slice(0, adjustedIndex),
                                taskId,
                                ...taskIds.slice(adjustedIndex),
                            ],
                        };
                    }
                    return cat;
                })
            );
        } else {
            setCategories((prev) =>
                prev.map((cat) => {
                    if (cat.id === task.categoryId) {
                        return { ...cat, taskIds: cat.taskIds.filter((id) => id !== taskId) };
                    }

                    if (cat.id === newCategoryId) {
                        const adjustedIndex = Math.min(newIndex, cat.taskIds.length);
                        return {
                            ...cat,
                            taskIds: [
                                ...cat.taskIds.slice(0, adjustedIndex),
                                taskId,
                                ...cat.taskIds.slice(adjustedIndex),
                            ],
                        };
                    }
                    return cat;
                })
            );
            setTasks((prev) =>
                prev.map((t) => (t.id === taskId ? { ...t, categoryId: newCategoryId } : t))
            );
        }
    };

    return (
        <TaskContext.Provider
            value={{
                tasks,
                categories,
                addTask,
                updateTask,
                deleteTask,
                addCategory,
                deleteCategory,
                moveTask,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (!context) throw new Error();
    return context;
};