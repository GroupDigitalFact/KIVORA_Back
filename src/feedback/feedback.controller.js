import Feedback from "./feedback.model.js";
import Sprint from "../sprint/sprint.model.js";
import PDFDocument from "pdfkit";
import Task from "../task/task.model.js"


export const createRetrospective = async (req, res) => {
  try {
    const createdBy = req.usuario._id;
    const { relatedTo, ...data } = req.body;

    const existingFeedback = await Feedback.findOne({
      relatedTo,
      status: true,
    });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: `You have already submitted feedback ${existingFeedback.relatedType} `,
      });
    }

    const retrospective = await Feedback.create({
      relatedTo,
      createdBy,
      ...data,
    });

    if (!retrospective) {
      return res.status(400)({
        success: false,
        message: "Error creating feedback",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Retrospective feedback submitted successfully",
      retrospective,
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
        lastEditAt: new Date(),
      },
      { new: true }
    );

    if (!updatedFeedback) {
      return res.status(400).json({
        success: false,
        message: "Error updating feedback",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Retrospective feedback updated successfully",
      retrospective: updatedFeedback,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update retrospective feedback",
      error: err.message,
    });
  }
};

export const deleteRetrospective = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Retrospective feedback not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Retrospective feedback deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete retrospective feedback",
      error: err.message,
    });
  }
};

export const getSprintSummary = async (req, res) => {
  try {
    const { projectId } = req.params;

    const feedback = await Feedback.find({
      project: projectId,
      status: true,
    }).sort({ priority: 1, fechaCreacion: -1 });

    if (!feedback || feedback.length === 0) {
      return res.status(404).json({
        message: "No backlogs found for this project",
      });
    }

    return res.status(200).json({
      message: "Backlogs retrieved successfully",
      feedback,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to retrieve backlogs",
      error: err.message,
    });
  }
};



export const exportRetrospectiveToPDF = async (req, res) => {
  try {
    const { sprintId } = req.params;

    const [sprint, feedbacks] = await Promise.all([
      Sprint.findById(sprintId)
        .select("tittle dateStart dateEnd")
        .populate("project", "title"),
      Feedback.find({
        relatedTo: sprintId,
        relatedType: "Sprint",
        status: true,
      }).populate("createdBy", "name role"),
    ]);

    if (!sprint) {
      return res.status(404).json({
        success: false,
        message: "Sprint no encontrado",
      });
    }

    if (!feedbacks || feedbacks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron retroalimentaciones para este sprint",
      });
    }

    const doc = new PDFDocument({
      margin: 30,
      size: "A4",
      font: "Helvetica",
    });

    const parseFeedbackText = (text) => {
      if (!text) return [];
      return text
        .split(/[,;]\s*|\n+/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    };

    const processedFeedbacks = feedbacks.map((f) => ({
      strengths: parseFeedbackText(f.strengths),
      improvementAreas: parseFeedbackText(f.improvementAreas),
      proposedActions: parseFeedbackText(f.proposedActions),
      createdBy: f.createdBy,
    }));

    doc
      .fillColor("#2563eb")
      .fontSize(18)
      .text("INFORME DE RETROSPECTIVA DE SPRINT", {
        align: "center",
        underline: true,
      })
      .moveDown(1);

    doc
      .fillColor("#1e40af")
      .fontSize(14)
      .text(`Proyecto: ${sprint.project?.title || "Sin nombre de proyecto"}`, {
        align: "center",
      })
      .moveDown(0.5);

    doc
      .fillColor("#4b5563")
      .fontSize(12)
      .text(
        `Sprint: ${sprint.tittle} (${formatDate(
          sprint.dateStart
        )} - ${formatDate(sprint.dateEnd)})`,
        { align: "center" }
      )
      .moveDown(1.5);

    doc
      .fillColor("#111827")
      .fontSize(14)
      .text("Retroalimentación consolidada", { underline: true })
      .moveDown(0.8);

    doc
      .fillColor("#15803d")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Fortalezas del equipo:", { indent: 10 })
      .moveDown(0.3);

    doc.fillColor("#14532d").fontSize(11);

    const allStrengths = [
      ...new Set(processedFeedbacks.flatMap((f) => f.strengths)),
    ];
    allStrengths.forEach((item) => {
      doc.text(`• ${item}`, { indent: 20, paragraphGap: 5 });
    });

    doc.moveDown(0.8);

    doc
      .fillColor("#b91c1c")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Áreas de mejora:", { indent: 10 })
      .moveDown(0.3);

    doc.fillColor("#7f1d1d").fontSize(11);

    const allImprovements = [
      ...new Set(processedFeedbacks.flatMap((f) => f.improvementAreas)),
    ];
    allImprovements.forEach((item) => {
      doc.text(`• ${item}`, { indent: 20, paragraphGap: 5 });
    });

    doc.moveDown(0.8);

    doc
      .fillColor("#4338ca")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Acciones propuestas:", { indent: 10 })
      .moveDown(0.3);

    doc.fillColor("#3730a3").fontSize(11);

    const allActions = [
      ...new Set(processedFeedbacks.flatMap((f) => f.proposedActions)),
    ];
    allActions.forEach((item, i) => {
      doc.text(`${i + 1}. ${item}`, { indent: 20, paragraphGap: 5 });
    });

    doc.moveDown(2);

    doc
      .fillColor("#6b7280")
      .fontSize(9)
      .text(`Generado el ${formatDate(new Date())}`, { align: "right" });

    doc.moveDown(0.5);
    doc
      .fillColor("#6b7280")
      .fontSize(9)
      .text(`${sprint.project?.title || "Proyecto"} - ${sprint.tittle}`, {
        align: "right",
        paragraphGap: 5,
      });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Retrospectiva_${(
        sprint.tittle || "sprint"
      ).replace(/\s+/g, "_")}.pdf"`
    );
    doc.pipe(res);
    doc.end();
  } catch (err) {
    console.error("Error generando PDF:", err);
    return res.status(500).json({
      success: false,
      message: "Error al generar el PDF de retrospectiva",
      error: err.message,
    });
  }
};

export const exportTaskRetrospectiveToPDF = async (req, res) => {
  try {
    const { taskId } = req.params;

    const [task, feedbacks] = await Promise.all([
      Task.findById(taskId)
        .select("title description state isUrgent tags")
        .populate("sprint", "tittle")
        .populate("assignedTo", "name")
        .populate("project", "title"),
      Feedback.find({
        relatedTo: taskId,
        relatedType: "Task",
        status: true,
      }).populate("createdBy", "name role"),
    ]);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada",
      });
    }

    if (!feedbacks || feedbacks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron retroalimentaciones para esta tarea",
      });
    }

    const doc = new PDFDocument({
      margin: 30,
      size: "A4",
      font: "Helvetica",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Retrospectiva_Tarea_${(task.title || "tarea").replace(/\s+/g, "_")}.pdf"`
    );
    doc.pipe(res);

    const parseFeedbackText = (text) => {
      if (!text) return [];
      return text
        .split(/[,;]\s*|\n+/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    };

    const processedFeedbacks = feedbacks.map((f) => ({
      strengths: parseFeedbackText(f.strengths),
      improvementAreas: parseFeedbackText(f.improvementAreas),
      proposedActions: parseFeedbackText(f.proposedActions),
      createdBy: f.createdBy,
    }));

    doc
      .fillColor("#2563eb")
      .fontSize(18)
      .text("INFORME DE RETROSPECTIVA DE TAREA", {
        align: "center",
        underline: true,
      })
      .moveDown(1);

    doc
      .fillColor("#1e40af")
      .fontSize(14)
      .text(`Proyecto: ${task.project?.title || "Sin nombre de proyecto"}`, {
        align: "left",
      })
      .moveDown(0.5);

    doc
      .fillColor("#4b5563")
      .fontSize(12)
      .text(`Tarea: ${task.title}`, { align: "left" });

    if (task.sprint) {
      doc
        .fillColor("#4b5563")
        .fontSize(12)
        .text(`Sprint: ${task.sprint.tittle}`, { align: "left" });
    }

    let stateInfo = `Estado: ${translateState(task.state)}`;
    if (task.isUrgent) {
      stateInfo += " (Urgente)";
    }
    doc
      .fillColor("#4b5563")
      .fontSize(12)
      .text(stateInfo, { align: "left" })
      .moveDown(0.5);

    if (task.description) {
      doc
        .fillColor("#6b7280")
        .fontSize(11)
        .text("Descripción:", { align: "left" })
        .moveDown(0.2);
      doc
        .fillColor("#6b7280")
        .fontSize(10)
        .text(task.description, {
          align: "left",
          width: 450,
          indent: 30,
        })
        .moveDown(0.5);
    }

    if (task.tags && task.tags.length > 0) {
      doc
        .fillColor("#6b7280")
        .fontSize(10)
        .text(`Etiquetas: ${task.tags.join(", ")}`, { align: "left" });
    }

    doc.moveDown(1.5);

    doc
      .fillColor("#111827")
      .fontSize(14)
      .text("Retroalimentación consolidada", { underline: true })
      .moveDown(0.8);

    doc
      .fillColor("#15803d")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Fortalezas del equipo:", { indent: 10 })
      .moveDown(0.3);

    doc.fillColor("#14532d").fontSize(11);

    const allStrengths = [
      ...new Set(processedFeedbacks.flatMap((f) => f.strengths)),
    ];
    allStrengths.forEach((item) => {
      doc.text(`• ${item}`, { indent: 20, paragraphGap: 5 });
    });

    doc.moveDown(0.8);

    doc
      .fillColor("#b91c1c")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Áreas de mejora:", { indent: 10 })
      .moveDown(0.3);

    doc.fillColor("#7f1d1d").fontSize(11);

    const allImprovements = [
      ...new Set(processedFeedbacks.flatMap((f) => f.improvementAreas)),
    ];
    allImprovements.forEach((item) => {
      doc.text(`• ${item}`, { indent: 20, paragraphGap: 5 });
    });

    doc.moveDown(0.8);

    doc
      .fillColor("#4338ca")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Acciones propuestas:", { indent: 10 })
      .moveDown(0.3);

    doc.fillColor("#3730a3").fontSize(11);

    const allActions = [
      ...new Set(processedFeedbacks.flatMap((f) => f.proposedActions)),
    ];
    allActions.forEach((item, i) => {
      doc.text(`${i + 1}. ${item}`, { indent: 20, paragraphGap: 5 });
    });

    doc.moveDown(2);

    doc
      .fillColor("#6b7280")
      .fontSize(9)
      .text(`Generado el ${formatDate(new Date())}`, { align: "right" });

    doc.moveDown(0.5);
    doc
      .fillColor("#6b7280")
      .fontSize(9)
      .text(
        `${task.project?.title || "Proyecto"} - ${task.title} - Asignado a: ${
          task.assignedTo?.name || "Sin asignar"
        }`,
        { align: "right", paragraphGap: 5 }
      );

    doc.end();
  } catch (err) {
    console.error("Error generando PDF:", err);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Error al generar el PDF de retrospectiva",
        error: err.message,
      });
    }
  }
};

function translateState(state) {
  const states = {
    "Late": "Atrasada",
    "In Progress": "En Progreso",
    "In Review": "En Revisión",
    "finalized": "Finalizada",
  };
  return states[state] || state;
}

function formatDate(date) {
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
