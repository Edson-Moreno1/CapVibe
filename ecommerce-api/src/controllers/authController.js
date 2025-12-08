import * as authService from '../services/authService.js';
import logger from '../config/logger.js';

export const register = async (req, res)=> {
  try{
    const result = await authService.registerUser(req.body);
    res.status(201).json({
      message:'Usuario creado existosamente',
      ...result
    });
  } catch (error){
    if(error.name === 'AuthError'){
      logger.warn(`Intento de registro fallido:${error.message}`);
      return res.status(error.statusCode || 400).json({message:error.message});
    }
    logger.error(`Error en el registro de usuario: ${error.message}`);
    res.status(500).json({ message:'Error interno del servidor',error:error.message});
  }
};

export const login = async(req,res) => {
  try{
    const result = await authService.loginUser(req.body);
    res.json({
      message:'Inicio de sesión exitoso',
      ...result
    });
  }catch (error){
    if (error.name === 'AuthError'){
      logger.warn(`Intento de login fallido para ${req.body.email}:${error.message}`);
      return res.status(error.statusCode || 400).json({message:error.message});
    }
    logger.error('Error en el inicio de sesión:', error);
    res.status(500).json({message:'Error interno del servidor', error:error.message});
  }
    };