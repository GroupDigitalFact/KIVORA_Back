import { hash, verify } from "argon2"
import { generateJWT } from "../helpers/generate-jwt.js";
import User from "../user/user.model.js"
import nodemailer from "nodemailer"
import { sendEmail } from "../helpers/sendEmail.js";

export const register = async (req, res) => {
    try {
        const data = req.body;
        let profilePicture = req.file ? req.file.filename : null;
        const encryptedPassword = await hash(data.password)
        data.password = encryptedPassword
        data.profilePicture = profilePicture

        const user = await User.create(data);

        return res.status(201).json({
            message: "User has been created",
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email
        });
    } catch (err) {
        return res.status(500).json({
            message: "User registration failed",
            error: err.message
        });
    }
}

export const login = async (req, res) => {
    const { email, username, password } = req.body
    try{
        const user = await User.findOne({
            $or:[{email: email}, {username: username}]
        })

        if(!user){
            return res.status(400).json({
                message: "Crendenciales inválidas",
                error:"No existe el usuario o correo ingresado"
            })
        }

        const validPassword = await verify(user.password, password)

        if(!validPassword){
            return res.status(400).json({
                message: "Crendenciales inválidas",
                error: "Contraseña incorrecta"
            })
        }

        const token = await generateJWT(user.id)
        const id = user._id;

        return res.status(200).json({
            message: "Login successful",
            userDetails: {
                user: id,
                token: token,
                profilePicture: user.profilePicture,
                username: user.username,
            }
        })
    }catch(err){
        return res.status(500).json({
            message: "login failed, server error",
            error: err.message
        })
    }
}

const codigos = new Map(); // o puedes usar Redis

export const generateCodigo = async (req, res) => {
  const { email } = req.body;

  const codigo = Math.floor(100000 + Math.random() * 900000);

  codigos.set(email, { codigo, expiresAt: Date.now() + 10 * 60 * 1000 });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f6f9;
            padding: 0;
            margin: 0;
          }
          .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
            padding: 30px;
          }
          h2 {
            color: #2b535c;
            text-align: center;
            margin-bottom: 20px;
          }
          .code-box {
            background-color: #f0f4f8;
            border-left: 6px solid #426a73;
            padding: 15px 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
          }
          .code-box p {
            font-size: 22px;
            font-weight: bold;
            color: #2b535c;
            margin: 0;
          }
          .footer {
            text-align: center;
            font-size: 13px;
            color: #888888;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>🔐 Recuperación de Cuenta</h2>
          <p style="text-align:center;">Hola, hemos recibido una solicitud para recuperar tu cuenta. Usa el siguiente código para continuar con el proceso:</p>
          
          <div class="code-box">
            <p>${codigo}</p>
          </div>

          <p style="text-align: center; font-size: 14px;">
            Si no solicitaste este código, comunicate de inmediato con nuestro soporte técnico.
          </p>

          <div class="footer">
            © ${new Date().getFullYear()} Banco Albora. Todos los derechos reservados.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await sendEmail({
          to: email,
          subject: 'Código de recuperación de cuenta - Kivora',
          html: htmlContent,
        });
    res.status(200).json({ message: "Código enviado", codigo: codigo });
  } catch (err) {
    console.log(process.env.SENDGRID_API_KEY)
    console.error("Error al enviar el correo:", err);
    res.status(500).json({ error: "Error enviando el correo" });
  }
};
