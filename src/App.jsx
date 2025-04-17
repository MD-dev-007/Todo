import { useEffect, useState } from 'react'
import './App.css'
import Search from './components/Search'
import TaskPage from './components/TaskPage';
import { createTodo, fetchTodo, updateTodo, deleteTodo, fetchOverdueTodos } from './axios';
import TaskItem from './components/TaskItem';

function App() {
  const [search, setSearch] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'All',
    priority: 'All',
    subject: 'All',
    showOverdue: false,
  });

  useEffect(() => {
    const getTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchTodo();
        setTasks(data);
        applyFilters(data);
      } catch (err) { 
        console.error("Error loading tasks:", err);
        setError(err.response?.data?.message || "Failed to load tasks. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    getTasks();
  }, []);

  useEffect(() => {
    applyFilters(tasks);
  }, [filters]);

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    if (!searchTerm.trim()) {
      applyFilters(tasks);
      return;
    }
    
    const filtered = tasks.filter(task => 
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
    applyFilters(filtered);
  };

  const applyFilters = (tasksToFilter) => {
    let filtered = [...tasksToFilter];

    // Apply search filter
    if (search.trim()) {
      filtered = filtered.filter(task => 
        task.description.toLowerCase().includes(search.toLowerCase()) ||
        task.subject.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category !== 'All') {
      filtered = filtered.filter(task => task.category === filters.category);
    }

    // Apply priority filter
    if (filters.priority !== 'All') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Apply subject filter
    if (filters.subject !== 'All') {
      filtered = filtered.filter(task => task.subject === filters.subject);
    }

    // Apply overdue filter
    if (filters.showOverdue) {
      const currentDate = new Date();
      filtered = filtered.filter(task => 
        new Date(task.dueDate) < currentDate && !task.completed
      );
    }

    setFilteredTasks(filtered);
  };

  const submitTask = async (taskData) => {
    try {
      setIsLoading(true);
      setError(null);
      const newTask = await createTodo(taskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
      setFilteredTasks(prevTasks => [...prevTasks, newTask]);
      setSearch('');
    } catch (err) {
      setError("Failed to create task. Please try again.");
      console.error("Error creating task: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const completeTask = async (id) => {
    try {
      const taskToUpdate = tasks.find(task => task._id === id);
      if (!taskToUpdate) return;

      const updatedTask = await updateTodo(id, {
        completed: !taskToUpdate.completed
      });

      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === id ? updatedTask : task
        )
      );
      setFilteredTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === id ? updatedTask : task
        )
      );
    } catch (err) {
      setError("Failed to update task. Please try again.");
      console.error("Error updating task: ", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteTodo(id);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
      setFilteredTasks(prevTasks => prevTasks.filter(task => task._id !== id));
    } catch (err) {
      setError("Failed to delete task. Please try again.");
      console.error("Error deleting task: ", err);
    }
  };

  const editTask = async (id, updates) => {
    try {
      if (!updates.description.trim()) {
        throw new Error('Task description cannot be empty');
      }

      const updatedTask = await updateTodo(id, updates);

      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === id ? updatedTask : task
        )
      );
      setFilteredTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === id ? updatedTask : task
        )
      );
    } catch (err) {
      console.error("Error editing task: ", err);
      throw err;
    }
  };

  const getUniqueSubjects = () => {
    const subjects = new Set(tasks.map(task => task.subject));
    return ['All', ...subjects];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
              College Task Manager
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredTasks.length} tasks
              </span>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="overdue"
                  checked={filters.showOverdue}
                  onChange={(e) => {
                    setFilters(prev => ({ ...prev, showOverdue: e.target.checked }));
                  }}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="overdue" className="text-sm font-medium text-gray-700">
                  Show Overdue Tasks
                </label>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.category}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, category: e.target.value }));
                applyFilters(tasks);
              }}
              className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="All">All Categories</option>
              <option value="Assignment">Assignments</option>
              <option value="Exam">Exams</option>
              <option value="Project">Projects</option>
              <option value="Lecture">Lectures</option>
              <option value="Study">Study</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, priority: e.target.value }));
                applyFilters(tasks);
              }}
              className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={filters.subject}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, subject: e.target.value }));
                applyFilters(tasks);
              }}
              className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {getUniqueSubjects().map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>

        <Search 
          search={search} 
          setSearch={setSearch} 
          submitTask={submitTask}
          onSearch={handleSearch}
        />

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading tasks...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg max-w-md">
              <h2 className="text-lg font-semibold mb-2">Error</h2>
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <TaskPage 
            tasks={filteredTasks} 
            completeTask={completeTask} 
            deleteTask={deleteTask} 
            editTask={editTask}
          />
        )}
      </main>
      <footer className="bg-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Created by <span className="font-semibold">Deebak Balaji</span></p>
        </div>
      </footer>
    </div>
  );
}

export default App;
