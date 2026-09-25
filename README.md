# Sistema de Préstamos de Equipo

Sistema web para gestionar el préstamo y devolución de equipos dentro de una organización, universidad o departamento de TI.

El proyecto permite registrar usuarios y equipos, controlar los préstamos activos y mantener un historial de las devoluciones.

## Objetivo

Desarrollar una aplicación pequeña pero completa que permita practicar el desarrollo **Full Stack** utilizando:

- C#
- ASP.NET Core Web API
- Entity Framework Core
- postgresql
- React

El proyecto está diseñado para aplicar conceptos como **CRUD, relaciones entre entidades, reglas de negocio, manejo de excepciones, APIs REST y arquitectura limpia**.

### 👤 Gestión de usuarios

- Registrar usuarios.
- Consultar usuarios.
- Editar usuarios.
- Eliminar usuarios.

### 💻 Gestión de equipos

- Registrar equipos.
- Consultar equipos.
- Editar equipos.
- Eliminar equipos.
- Consultar disponibilidad de los equipos.

### 📋 Gestión de préstamos

- Registrar un préstamo.
- Consultar préstamos activos.
- Registrar la devolución de un equipo.
- Consultar el historial de préstamos.
- Filtrar préstamos por usuario, equipo o estado.

### ⚙️ Reglas de negocio

El sistema debe impedir, entre otras cosas:

- Prestar un equipo que ya se encuentre prestado.
- Registrar una devolución de un préstamo que ya fue cerrado.
- Realizar operaciones con información inválida.

---

## 🗄️ Modelo de datos

El proyecto utiliza únicamente **3 tablas principales**:

```text
┌──────────────┐
│   Usuarios   │
├──────────────┤
│ Id           │
│ Nombre       │
│ Correo       │
└──────┬───────┘
       │
       │ 1:N
       │
┌──────▼────────────┐
│     Prestamos     │
├───────────────────┤
│ Id                │
│ UsuarioId         │
│ EquipoId          │
│ FechaPrestamo     │
│ FechaDevolucion   │
│ Estado            │
└──────┬────────────┘
       │
       │ N:1
       │
┌──────▼───────┐
│   Equipos    │
├──────────────┤
│ Id           │
│ Nombre       │
│ Tipo         │
│ Estado       │
└──────────────┘
```

### Tablas

#### Usuarios

| Campo  | Descripción               |
| ------ | ------------------------- |
| Id     | Identificador del usuario |
| Nombre | Nombre completo           |
| Correo | Correo electrónico        |

#### Equipos

| Campo  | Descripción                     |
| ------ | ------------------------------- |
| Id     | Identificador del equipo        |
| Nombre | Nombre o descripción del equipo |
| Tipo   | Tipo de equipo                  |
| Estado | Disponibilidad actual           |

#### Prestamos

| Campo           | Descripción                         |
| --------------- | ----------------------------------- |
| Id              | Identificador del préstamo          |
| UsuarioId       | Usuario que realiza el préstamo     |
| EquipoId        | Equipo prestado                     |
| FechaPrestamo   | Fecha en que se realiza el préstamo |
| FechaDevolucion | Fecha de devolución                 |
| Estado          | Estado actual del préstamo          |
