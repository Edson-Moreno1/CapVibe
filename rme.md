# 🎬 DEMO SCRIPT - CapVibe API REST

## 📋 PREPARACIÓN PREVIA
- ✅ Servidor corriendo: `npm run dev` en terminal
- ✅ MongoDB conectado 
- ✅ Postman abierto
- ✅ Verificar: http://localhost:3000 muestra "CapVibe API funcionando"

---

## 🎯 SCRIPT DE PRESENTACIÓN (5 MINUTOS)

### 📖 INTRODUCCIÓN (30 segundos)
**Decir:**
*"Buenos días, soy Edson y voy a presentar mi API REST para CapVibe, un ecommerce de gorras deportivas. La API está desarrollada con Node.js, Express, MongoDB y sigue arquitectura MVC profesional."*

---

### 🏗️ ARQUITECTURA (1 minuto)
**Decir:**
*"Mi API tiene 8 endpoints organizados: auth, productos, usuarios, carritos, órdenes, categorías, direcciones y métodos de pago. Incluye autenticación JWT, validaciones con express-validator, relaciones MongoDB y paginación."*

---

### 🧪 DEMOSTRACIÓN EN VIVO (3 minutos)

#### **PASO 1: VALIDACIONES (45 segundos)**

**Decir:** *"Primero demuestro las validaciones con datos incorrectos:"*

**POSTMAN:**
1. **Método:** POST
2. **URL:** `http://localhost:3000/api/auth/register`
3. **Headers:** Content-Type: application/json (automático con JSON)
4. **Body → raw → JSON:**
```json
{
  "name": "A",
  "email": "email-invalido",
  "password": "123"
}
```
5. **Click Send**

**Resultado esperado:** Error 400 con mensajes de validación

**Decir:** *"Como ven, las validaciones funcionan correctamente detectando errores."*

---

#### **PASO 2: REGISTRO EXITOSO (30 segundos)**

**Decir:** *"Ahora registro un usuario válido:"*

**POSTMAN:**
1. **Mantener:** POST `http://localhost:3000/api/auth/register`
2. **Cambiar Body:**
```json
{
  "name": "Demo Usuario",
  "email": "demo@capvibe.com",
  "password": "123456"
}
```
3. **Click Send**

**Resultado esperado:** 201 Created con token

**Decir:** *"Usuario creado exitosamente, token JWT generado para autenticación."*

---

#### **PASO 3: CATEGORÍAS Y RELACIONES (45 segundos)**

**Decir:** *"Veamos las categorías deportivas y sus relaciones:"*

**POSTMAN:**
1. **Método:** GET
2. **URL:** `http://localhost:3000/api/categories`
3. **Sin headers adicionales** (ruta pública)
4. **Click Send**

**Resultado esperado:** 6 categorías (MLB, NBA, Liga MX, F1, LMB, NFL)

**Decir:** *"6 categorías deportivas creadas, que se relacionan con los productos."*

---

#### **PASO 4: PRODUCTOS CON PAGINACIÓN (90 segundos)**

**Decir:** *"Ahora los productos con paginación y relaciones a categorías:"*

**POSTMAN:**
1. **Método:** GET  
2. **URL:** `http://localhost:3000/api/products`
3. **Click Send**

**Resultado esperado:** Lista de productos con categorías asociadas

**Decir:** *"10 productos con paginación, cada uno asociado a su categoría correspondiente."*

**Mostrar relación:** *"Observen que cada producto tiene un campo 'category' con el nombre de la categoría."*

---

#### **PASO 5: AUTENTICACIÓN REQUERIDA (60 segundos)**

**Decir:** *"Demostremos la seguridad - crear producto requiere autenticación:"*

**POSTMAN - SIN TOKEN:**
1. **Método:** POST
2. **URL:** `http://localhost:3000/api/products`
3. **Body → raw → JSON:**
```json
{
  "name": "Gorra Demo",
  "price": 799,
  "stock": 10,
  "category": "68a690c0eeb1a3fe35ea18b4"
}
```
4. **Click Send**

**Resultado esperado:** Error 401 Unauthorized

**Decir:** *"Sin token, acceso denegado - seguridad funcionando."*

**POSTMAN - CON TOKEN:**
1. **Headers → Add:**
   - **Key:** Authorization
   - **Value:** Bearer [COPIAR TOKEN DEL REGISTRO]
2. **Click Send**

**Resultado esperado:** 201 Created - producto creado

**Decir:** *"Con token válido, producto creado exitosamente."*

---

### 📊 CONCLUSIÓN (30 segundos)

**Decir:**
*"Como han visto, mi API CapVibe cumple todos los requisitos de la rúbrica:"*
- *"✅ Endpoints funcionando"*
- *"✅ Autenticación JWT"*
- *"✅ Validaciones express-validator"*
- *"✅ Relaciones productos-categorías"*
- *"✅ Datos de prueba (10+ productos, 6 categorías)"*
- *"✅ Paginación implementada"*
- *"✅ Manejo de errores"*

*"Gracias por su atención."*

---

## 🚨 BACKUP - URLs DE EMERGENCIA

Si algo falla durante la demo:

**APIs que SIEMPRE funcionan:**
- `http://localhost:3000` → Mensaje de bienvenida
- `http://localhost:3000/api/categories` → Ver categorías
- `http://localhost:3000/api/products` → Ver productos

**Token de respaldo:** [Hacer login rápido si el token expira]

---

## 📝 NOTAS IMPORTANTES

- **Tiempo total:** 5 minutos máximo
- **Enfoque:** Funcionalidad, no código
- **Mostrar:** Resultados en Postman, no explicar sintaxis
- **Si algo falla:** Usar URLs de backup y continuar
- **Mantener calma:** La API funciona, solo demostrar lo básico

---

## ✅ CHECKLIST PRE-DEMO

- [ ] Servidor corriendo
- [ ] MongoDB conectado
- [ ] Postman configurado
- [ ] URLs verificadas
- [ ] Script practicado
- [ ] Timing controlado (5 min max)