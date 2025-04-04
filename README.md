# 🛠️ Auth-Service | Node.js Microservice

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%206.x-brightgreen)](https://www.mongodb.com/)
[![Jest](https://img.shields.io/badge/Tested_with-Jest-blue)](https://jestjs.io/)
[![CI/CD](https://img.shields.io/badge/CI/CD-Jenkins-orange)](https://www.jenkins.io/)
[![Terraform](https://img.shields.io/badge/IaC-Terraform-844FBA)](https://www.terraform.io/)
[![AWS](https://img.shields.io/badge/Deployed_on-AWS_EC2-FF9900)](https://aws.amazon.com/ec2/)

> Microservicio de autenticación desarrollado en Node.js, con base de datos MongoDB, pruebas unitarias con Jest, contenerizado con Docker y desplegado automáticamente mediante Jenkins en una instancia EC2 de AWS usando Terraform como IaC.

---

## 📌 Características

- Registro e inicio de sesión con JWT
- Validación de usuarios y rutas protegidas
- Base de datos MongoDB
- Pruebas con Jest
- Pipeline de CI/CD con Jenkins
- Docker para contenerización
- Despliegue automatizado en EC2 con Terraform

---

## ⚙️ Tecnologías utilizadas

- Node.js + Express
- MongoDB + Mongoose
- Jest + Supertest
- Docker + Docker Compose
- Jenkins + Webhooks (GitHub)
- AWS EC2 + SSH
- Terraform (Infraestructura como código)

---

---

## 🧪 Pruebas

```bash
npm install
npm run test
Las pruebas con Jest se ejecutan automáticamente en el pipeline Jenkins en cada push a master.

📡 Endpoints principales
Método	Ruta	Descripción
POST	/register	Registrar nuevo usuario
POST	/login	Autenticación con JWT
GET	/me	Ver datos del usuario

---

## 📜 Licencia

MIT © 2025 - EstebanJaramilloV
---


