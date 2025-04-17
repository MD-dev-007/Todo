import React from 'react'
import TaskItem from './TaskItem'
import ErrorBoundary from './ErrorBoundary'

const TaskPage = ({tasks, completeTask, editTask, deleteTask}) => {

  const [filter, setFilter] = React.useState('all');

  const filteredTasks = React.useMemo(() => {
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'incomplete':
        return tasks.filter(task => !task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const FilterToggle = () => (
    <div className="flex justify-center gap-2 mb-4 p-4">
      <button
        className={`px-4 py-2 rounded-md ${
          filter === 'all' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={() => handleFilterChange('all')}
      >
        All
      </button>
      <button
        className={`px-4 py-2 rounded-md ${
          filter === 'completed' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={() => handleFilterChange('completed')}
      >
        Completed
      </button>
      <button
        className={`px-4 py-2 rounded-md ${
          filter === 'incomplete' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={() => handleFilterChange('incomplete')}
      >
        Incomplete
      </button>
    </div>
  );
  return (
    <div>
      <FilterToggle />
      {tasks.length > 0 ?
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredTasks.slice().reverse().map(task => (
            <ErrorBoundary key={task._id}>
              <TaskItem task={task} completeTask={completeTask} editTask={editTask} deleteTask={deleteTask}/>
            </ErrorBoundary>
          ))}
        </div>
        :
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-500">No tasks available</p>
        </div>
      }
    </div>
  )
}

export default TaskPage
