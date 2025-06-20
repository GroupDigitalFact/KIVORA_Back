import Task from "./task.model.js"

export const addTask = async (req, res) => {
    try{
        const data = req.body;

        const task = await Task.create(data);

        if(!task){
            return res.status(400).json({
                message: "Task not created" 
            });
        }

        return res.status(200).json({
            message: "Task created successfully", 
            task: task
        });
    }catch (error){
        res.status(500).json({
            message: "Error adding task", 
            error: error.message
        });
    }
}


export const updateTask = async (req, res) => {
  try {
    const data = req.body;

    const task = await Task.findByIdAndUpdate(id, data, { new: true });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: task,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error updating task",
      error: err.message,
    });
  }
};


export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Task.findByIdAndUpdate(
      id,
      { estado: true },
      { new: true }
    );
    if (!service) {
      return res.status(404).json({
        message: "service not found",
      });
    }

    return res.status(200).json({
      message: "Service deleted success fully",
    });
  } catch (err) {
    return res.status(500).json({
      succes: false,
      message: "Error deleting service",
      error: err.message,
    });
  }
};