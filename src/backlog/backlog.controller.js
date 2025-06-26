import Backlog from "./backlog.model.js";
import PDFDocument from 'pdfkit';
import Project from '../project/project.model.js';

export const createBacklog = async (req, res) => {
  try {
    const data = req.body;

    const existingBacklog = await Backlog.findOne({
      title: data.title,
      project: data.project,
      status: true,
    });

    if (existingBacklog) {
      return res.status(400).json({
        message: "Ya existe un backlog con ese título en este proyecto",
      });
    }

    const backlog = await Backlog.create(data);

    if (!backlog) {
      return res.status(400).json({
        message: "Backlog creation failed",
      });
    }

    return res.status(200).json({
      message: "Backlog has been created",
      backlog,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Backlog creation failed",
      error: err.message,
    });
  }
};

export const getBacklogs = async (req, res) => {
  try {
    const { projectId } = req.params;

    const backlogs = await Backlog.find({
      project: projectId,
      status: true,
    }).sort({ priority: 1, fechaCreacion: -1 });

    if (!backlogs || backlogs.length === 0) {
      return res.status(404).json({
        message: "No backlogs found for this project",
      });
    }

    return res.status(200).json({
      message: "Backlogs retrieved successfully",
      backlogs,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to retrieve backlogs",
      error: err.message,
    });
  }
};

export const updateBacklog = async (req, res) => {
  try {
    const { backlogId } = req.params;
    const data = req.body;

    const backlog = await Backlog.findByIdAndUpdate(backlogId, data, {
      new: true,
    });

    if (!backlog) {
      return res.status(404).json({
        message: "Backlog not found",
      });
    }
    return res.status(200).json({
      message: "Backlog updated successfully",
      backlog,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to update backlog",
      error: err.message,
    });
  }
};

export const deleteBacklog = async (req, res) => {
  try {
    const { backlogId } = req.params;

    const backlog = await Backlog.findByIdAndUpdate(
      backlogId,
      { status: false },
      { new: true }
    );

    if (!backlog) {
      return res.status(404).json({
        message: "Backlog not found",
      });
    }

    return res.status(200).json({
      message: "Backlog deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to delete backlog",
      error: err.message,
    });
  }
};

export const exportBacklogToPDF = async (req, res) => {
  try {
    const { projectId } = req.params;

    const [backlogs, project] = await Promise.all([
      Backlog.find({ project: projectId, status: true })
             .sort({ priority: 1, fechaCreacion: -1 })
             .lean(),
      
      Project.findById(projectId)
             .select('title productOwner')
             .populate('productOwner', 'name')
             .lean()
    ]);

    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: "Proyecto no encontrado" 
      });
    }

    const mapStateToSpanish = (state) => {
      const stateMap = {
        'Pending': 'Pendiente',
        'ReadySprint': 'Listo para Sprint',
        'Discarded': 'Descartado'
      };
      return stateMap[state] || 'Pendiente';
    };

    const validatedBacklogs = backlogs.map(item => ({
      titulo: item.title || 'Título no definido',
      descripcion: item.description || 'Descripción no proporcionada',
      estado: mapStateToSpanish(item.state),
      prioridad: item.priority || 3,
      fechaCreacion: item.fechaCreacion || new Date()
    }));

    if (validatedBacklogs.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "No hay elementos en el backlog" 
      });
    }

    const doc = new PDFDocument({
      margin: 40,
      size: 'A4',
      font: 'Helvetica'
    });

    doc.fillColor('#2563eb')
       .fontSize(20)
       .text('BACKLOG DEL PROYECTO', { 
         align: 'center', 
         underline: true,
         paragraphGap: 10
       })
       .moveDown(0.5)
       .fillColor('#4b5563')
       .fontSize(14)
       .text(`Proyecto: ${project.title || 'Sin nombre'}`, { align: 'center' })
       .text(`Product Owner: ${project.productOwner?.name || 'No asignado'}`, { 
         align: 'center',
         paragraphGap: 15
       })
       .moveDown(1);

    const priorityLabels = {
      1: 'URGENTE',      
      2: 'CRÍTICA',     
      3: 'ALTA',        
      4: 'MEDIA',        
      5: 'BAJA'         
    };

    const priorityColors = {
      1: '#dc2626',   
      2: '#ea580c',    
      3: '#d97706',    
      4: '#3b82f6',    
      5: '#9ca3af'     
    };

    const statusConfig = {
      'Pendiente': { label: 'PENDIENTE', color: '#f59e0b' },
      'Listo para Sprint': { label: 'EN PROCESO', color: '#10b981' },
      'Descartado': { label: 'COMPLETADO', color: '#ef4444' }
    };

    validatedBacklogs.forEach((item, index) => {
      const startY = doc.y;
      
      doc.roundedRect(45, startY, 510, 100, 8)
         .fill('#ffffff')
         .stroke('#e5e7eb');
      
      doc.fillColor('#111827')
         .fontSize(14)
         .font('Helvetica-Bold')
         .text(`${index + 1}. ${item.titulo}`, 60, startY + 20, {
           width: 480
         });

      doc.fillColor('#4b5563')
         .fontSize(11)
         .text(item.descripcion, 60, startY + 40, {
           width: 480
         });

      const estadoConfig = statusConfig[item.estado] || statusConfig['Pendiente'];
      
      doc.fillColor(estadoConfig.color)
         .roundedRect(60, startY + 70, 80, 20, 4)
         .fillAndStroke(estadoConfig.color, estadoConfig.color)
         .fillColor('#ffffff')
         .fontSize(10)
         .text(estadoConfig.label, 70, startY + 75, { width: 70, align: 'center' });

      const priorityLabel = priorityLabels[item.prioridad] || 'MEDIA';
      const priorityColor = priorityColors[item.prioridad] || '#3b82f6';

      doc.fillColor(priorityColor)
         .font('Helvetica-Bold')
         .text(`Prioridad: ${priorityLabel} (Nivel ${item.prioridad})`, 220, startY + 75)
         .fillColor('#111827'); 

      doc.fillColor('#6b7280')
         .text(`Fecha: ${new Date(item.fechaCreacion).toLocaleDateString('es-ES')}`, 400, startY + 75);

      doc.moveDown(3);
    });

    doc.fillColor('#9ca3af')
       .fontSize(10)
       .text(`Generado el ${new Date().toLocaleString('es-ES')} • ${project.title || 'Proyecto'}`, { 
         align: 'center'
       });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Backlog_${(project.title || 'proyecto').replace(/\s+/g, '_')}.pdf"`);
    doc.pipe(res);
    doc.end();

  } catch (err) {
    console.error('Error al generar PDF:', err);
    return res.status(500).json({
      success: false,
      message: "Error al generar el documento PDF",
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
};