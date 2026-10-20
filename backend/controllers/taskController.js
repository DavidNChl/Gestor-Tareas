const { Task } = require('../models');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({ 
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar tareas' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    if (!title) return res.status(400).json({ error: 'El título es obligatorio' });

    const newTask = await Task.create({
      title,
      description: description || '',
      priority: priority || 'media',
      dueDate: dueDate || null,
      userId: req.user.id
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, dueDate, completed } = req.body;

    const task = await Task.findOne({ where: { id, userId: req.user.id } });
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (completed !== undefined) task.completed = completed;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.destroy({ where: { id, userId: req.user.id } });

    if (!deleted) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
};