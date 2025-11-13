import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Clase para errores especificios que el controlador pueda entender 
class AuthError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthError';
        this.statusCode = 400; // Por defecto para credenciales invalidad o duplicadas
    }
    }

    export const registerUser = async (userData) => {
        const { name,email,password} = userData;

        // Verificar si el usario ya existe
        const existingUser = await User.findOne({email});
        if (existingUser){
            throw new AuthError('Usario ya existe');
        }
        // Crear nuevo usuario
        const user = new User({name,email,password});
        await user.save();
        
        const token = jwt.sign({userId: user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

        return {
            token, 
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        };
    };
    export const loginUser = async (credentials)=> {
        const {email,password} = credentials;

        //Buscar usuario
        const user = await User.findOne({email});
        if (!user){
            throw new AuthError('Credenciales inválidad');
        }
        //Verificar contraseña
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            throw new AuthError('Credenciales inválidas');
        }

        // Generar token JWT
        const token = jwt.sign({userId: user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

        return {
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        };
    };       