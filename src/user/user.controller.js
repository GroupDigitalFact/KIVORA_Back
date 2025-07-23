import User from "./user.model.js";
import cloudinary from "cloudinary";
import { hash, verify } from "argon2"


export const getUser = async (req, res) => {
  try {
    const user = await User.find({ state: true });

    if (!user || user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    const userWithImage = user.map((userImage) => {
      const userObj = userImage.toObject();

      userObj.imageUrl = userImage.profilePicture
        ? cloudinary.v2.url(userImage.profilePicture)
        : null;

      return userObj;
    });

    return res.status(200).json({
      success: true,
      services: userWithImage,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error getting users",
      error: err.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.usuario._id;
    const data = req.body;

    const user = await User.findByIdAndUpdate(id, data, { new: true });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userObj = user.toObject();
    userObj.imageUrl = user.profilePicture
      ? cloudinary.v2.url(user.profilePicture)
      : null;

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
      imageUrl: userObj.imageUrl,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error updating user",
      error: err.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.usuario._id;

    const user = await User.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: err.message,
    });
  }
};

export const updateImage = async (req, res) => {
  try {
    const id = req.usuario._id;
    const file = req.file.filename;

    const user = await User.findById(id);

    if (file) {
      if (user.profilePicture) {
        await cloudinary.v2.uploader.destroy(user.profilePicture);
      }

      user.profilePicture = file;

      await user.save();
    }

    const userObj = user.toObject();
    userObj.imageUrl = user.profilePicture
      ? cloudinary.v2.url(user.profilePicture)
      : null;

    return res.status(200).json({
      success: true,
      message: "Image updated successfully",
      user: userObj,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error updating image",
      error: err.message,
    });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const id = req.usuario._id;
    const user = await User.findById(id);

    if (user.profilePicture) {
      await cloudinary.v2.uploader.destroy(user.profilePicture);
    }

    user.profilePicture = null;
    await user.save();

    const userObj = user.toObject();
    userObj.imageUrl = user.imageProduct
      ? cloudinary.v2.url(user.imageProduct)
      : null;

    return res.status(200).json({
      success: true,
      message: "Servicio actualizado",
      user: userObj,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error deleting image",
      error: err.message,
    });
  }
};


export const modificarContraseña = async (req, res) => {
    try {
        const userId = req.usuario.id;  
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const correctPassword = await verify(user.password, oldPassword);

        if (!correctPassword) {
            return res.status(400).json({
                message: "The old password is incorrect"
            });
        }

        const hashedPassword = await hash(newPassword);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            message: "Password updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating password",
            error: error.message
        });
    }
};

export const getMyUser = async (req, res) => {
  try {
    const id = req.usuario._id;
    const user = await User.find({ _id: id, state: true });

    if (!user || user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    const userWithImage = user.map((userImage) => {
      const userObj = userImage.toObject();

      userObj.imageUrl = userImage.profilePicture
        ? cloudinary.v2.url(userImage.profilePicture)
        : null;

      return userObj;
    });

    return res.status(200).json({
      success: true,
      services: userWithImage,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error getting users",
      error: err.message,
    });
  }
};


export const checkAuth = (req, res) =>{
  res.status(200).json({
    success:true,
    user: req.usuario
  });
}

export const getMyContacts = async (req, res) => {
  try {
    const id = req.usuario._id;

    const user = await User.findById(id)
      .select("contacts")
      .populate("contacts.user", "name surname username email profilePicture"); 

    if (!user || !user.contacts) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron contactos para este usuario.",
      });
    }

    return res.status(200).json({
      success: true,
      contacts: user.contacts,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los contactos",
      error: err.message,
    });
  }
};