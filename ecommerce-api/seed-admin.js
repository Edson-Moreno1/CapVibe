import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";
import 'dotenv/config';


const ADMIN_EMAIL = 'eadmin@capvibe.com';
const ADMIN_PASSWORD = 'AdminPass123';
const ADMIN_NAME = 'CapVibe Admin';

const seedAdminUser = async () =>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectando a MongoDB...');

        const existingAdmin = await User.findOne({email: ADMIN_EMAIL});
        if(existingAdmin){
            console.log(`El usuario admin ${ADMIN_EMAIL} ya existe.`);
            mongoose.connection.close();
            return;
        }
        const adminUser = new User({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            role: 'admin',
        });
        await adminUser.save();
        console.log('Usuario Administrador creado con éxit');
        console.log('Email:',saveUser.email);
        console.log('Rol:', savedUser.role);
    }catch(error){
        console.error('Error al crear el usuario administrador:', error.message);
    }finally{
        mongoose.connection.close();
        console.log('Desconectado de MongoDB.');
    }
    
};

seedAdminUser();
