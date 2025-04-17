{tasks.map((task) => (
  <TaskItem 
    key={task._id}
    task={task}
    onDelete={handleDelete}
    onUpdate={handleUpdate}
  />
))}