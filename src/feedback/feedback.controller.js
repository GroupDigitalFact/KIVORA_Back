import Feedback from "./feedback.model.js";

export const createRetrospective = async (req, res) => {
  try {
    const createdBy = req.usuario._id; 
    const { relatedTo,  ...data } = req.body;

    const existingFeedback = await Feedback.findOne({
      relatedTo,
      status: true
    });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted feedback ",
      });
    }

    const retrospective = await Feedback.create({
      relatedTo,
      createdBy,
      ...data
    });

    if(!retrospective){
        return res.status(400)({
            success: false,
            message: "Error creating feedback"
        })
    }

    return res.status(201).json({
      success: true,
      message: "Retrospective feedback submitted successfully",
      retrospective
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit retrospective feedback",
      error: err.message,
    });
  }
};


export const updateRetrospective = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const feedback = await Feedback.findById(id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Retrospective feedback not found",
      });
    }

    const now = new Date();
    const createdAt = new Date(feedback.createdAt);
    const hoursDiff = (now - createdAt) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      return res.status(403).json({
        success: false,
        message: "Editing is only allowed within 24 hours of submission",
      });
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { 
        ...data,
        isEdited: true,
        lastEditAt: new Date()
      },
      { new: true }
    );

    if(!updatedFeedback){
      return res.status(400).json({
        success: false,
        message: "Error updating feedback"
      })
    }

    return res.status(200).json({
      success: true,
      message: "Retrospective feedback updated successfully",
      retrospective: updatedFeedback
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update retrospective feedback",
      error: err.message,
    });
  }
};
