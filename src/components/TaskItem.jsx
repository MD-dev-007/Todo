import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditTask from "./EditTask";
import { format } from 'date-fns';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Urgent':
      return 'bg-red-100 text-red-800';
    case 'High':
      return 'bg-orange-100 text-orange-800';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'Low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Assignment':
      return '📝';
    case 'Exam':
      return '📚';
    case 'Project':
      return '📋';
    case 'Lecture':
      return '🎓';
    case 'Study':
      return '📖';
    default:
      return '📌';
  }
};

const formatDate = (dateString) => {
  try {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

const TaskItem = ({ task, completeTask, editTask, deleteTask }) => {
  const isOverdue = task.dueDate ? new Date(task.dueDate) < new Date() && !task.completed : false;
  const timeRemaining = task.dueDate ? Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${
      isOverdue ? 'border-l-4 border-red-500' : ''
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-grow">
            <div className="flex-shrink-0">
              <input
                type="checkbox"
                checked={task.completed || false}
                onChange={() => completeTask(task._id)}
                className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex-grow">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getCategoryIcon(task.category)}</span>
                <h3 className={`text-lg font-semibold ${
                  task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                }`}>
                  {task.description}
                </h3>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Subject:</span>
                  <span className="text-sm font-medium text-gray-700">{task.subject}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Due:</span>
                  <span className={`text-sm font-medium ${
                    isOverdue ? 'text-red-500' : 'text-gray-700'
                  }`}>
                    {formatDate(task.dueDate)}
                    {!task.completed && task.dueDate && (
                      <span className="ml-2 text-xs">
                        ({timeRemaining > 0 ? `${timeRemaining} days left` : 'Overdue'})
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Priority:</span>
                  <span className={`text-sm px-2.5 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>

                {task.estimatedTime && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Time:</span>
                    <span className="text-sm text-gray-700">
                      {Math.floor(task.estimatedTime / 60)}h {task.estimatedTime % 60}m
                    </span>
                  </div>
                )}

                {task.progress > 0 && (
                  <div className="pt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">
                      {task.progress}% complete
                    </span>
                  </div>
                )}

                {task.notes && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded">
                      {task.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <EditTask task={task} editTask={editTask} />
            <button
              onClick={() => deleteTask(task._id)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <DeleteIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
