import Cluster from "./cluster.model.js";
import User from "../user/user.model.js";
import { createNotification } from "../helpers/notifications-validators.js";

// Crear grupo
export const crearGrupo = async (req, res) => {
  try {
    const id = req.usuario._id;
    const { nombre, descripcion } = req.body;
    const profilePicture = req.file ? req.file.path : null;

    const grupoExistente = await Cluster.findOne({
      nombre: nombre.trim(),
      propietario: id,
    });

    if (grupoExistente) {
      return res.status(400).json({
        message: "Ya has creado un grupo con ese nombre",
      });
    }

    const grupo = await Cluster.create({
      nombre,
      descripcion,
      profilePicture,
      propietario: id,
      integrantes: [{ usuario: id, rol: "admin", state:true}],
    });

    console.log(grupo);

    await createNotification({
      user: id,
      title: `Nuevo Grupo`,
      message: `Haz creado el grupo ${grupo.nombre}`,
      relatedTo: grupo._id,
      relatedType: "Cluster",
    });

    return res.status(201).json({
      message: "Grupo creado exitosamente",
      grupo,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error al crear el grupo",
      error: err.message,
    });
  }
};

// Agregar integrante
export const agregarIntegrante = async (req, res) => {
  try {
    const { grupoId, integrante } = req.body;

    const user = await User.findOne({
      $or: [{ email: integrante }, { username: integrante }],
    });

    if (!user) {
      return res.status(404).json({ message: "Integrante no encontrado" });
    }

    const grupo = await Cluster.findById(grupoId);

    if (!grupo) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }

    if (grupo.propietario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({
        message: "No tienes permisos para agregar integrantes a este grupo",
      });
    }

    const yaIntegrado = grupo.integrantes.some(
      (id) => id.usuario.toString() === user._id.toString()
    );

    if (yaIntegrado) {
      return res.status(400).json({
        message: "El usuario ya es integrante del grupo",
      });
    }

    grupo.integrantes.push({ usuario: user._id, rol: "usuario" });
    await grupo.save();

    await createNotification({
      user: user._id,
      title: `El grupo ${grupo.nombre} te ha invitado a unirte`,
      message: `Has recibido una invitación para unirte al grupo "${grupo.nombre}".`,
      relatedTo: grupoId,
      relatedType: "Cluster",
    });

    return res.status(200).json({
      message: "Integrante agregado exitosamente",
      grupo: await grupo.populate("integrantes.usuario"),
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error al agregar integrante",
      error: err.message,
    });
  }
};

// Eliminar integrante
export const eliminarIntegrante = async (req, res) => {
  try {
    const { grupoId, integrante } = req.body;

    const user = await User.findOne({
      $or: [{ email: integrante }, { username: integrante }],
    });

    if (!user) {
      return res.status(404).json({ message: "Integrante no encontrado" });
    }

    const grupo = await Cluster.findById(grupoId);

    if (!grupo) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }

    if (grupo.propietario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({
        message: "No tienes permisos para eliminar integrantes de este grupo",
      });
    }

    grupo.integrantes = grupo.integrantes.filter(
      (i) => i.usuario.toString() !== user._id.toString()
    );
    await grupo.save();

    await createNotification({
      user: user._id,
      title: `Has sido eliminado del grupo ${grupo.nombre}`,
      message: `Ya no formas parte del grupo "${grupo.nombre}".`,
      relatedTo: grupoId,
      relatedType: "Cluster",
    });

    return res.status(200).json({
      message: "Integrante eliminado exitosamente",
      grupo: await grupo.populate("integrantes.usuario"),
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error al eliminar integrante",
      error: err.message,
    });
  }
};

// Editar descripción
export const editarDescripcion = async (req, res) => {
  try {
    const { grupoId, descripcion } = req.body;

    const grupo = await Cluster.findByIdAndUpdate(
      grupoId,
      { descripcion },
      { new: true }
    );

    if (!grupo) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }

    if (grupo.propietario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({
        message: "No tienes permisos para editar la descripción de este grupo",
      });
    }

    return res.status(200).json({
      message: "Descripción editada exitosamente",
      grupo,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error al editar descripción",
      error: err.message,
    });
  }
};

// Listar grupos
export const listarGrupos = async (req, res) => {
  try {
    const { usuario } = req.body;

    const user = await User.findOne({
      $or: [{ email: usuario }, { username: usuario }],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const grupos = await Cluster.find({
      "integrantes.usuario": user._id,
    }).populate("integrantes.usuario");

    return res.status(200).json({
      message: "Grupos listados exitosamente",
      grupos,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error al listar grupos",
      error: err.message,
    });
  }
};
