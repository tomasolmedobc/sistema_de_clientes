-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3340
-- Tiempo de generación: 16-11-2023 a las 12:20:58
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `usuarios_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(40) NOT NULL,
  `apellido` varchar(40) NOT NULL,
  `tel` varchar(20) NOT NULL,
  `direccion` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre`, `apellido`, `tel`, `direccion`) VALUES
(2, 'Tomas', 'Olmedo', '02352401425', 'cerrito 149'),
(3, 'Nomik', 'Perri', '12321312', 'ops'),
(5, 'Tomas22', 'Olmedo22', '0235240142522', 'cerrito 1492'),
(8, 'zoai', 'diqwe', '090090', 'dsa13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id_users` int(11) NOT NULL,
  `username` varchar(60) NOT NULL,
  `name` varchar(60) NOT NULL,
  `rol` varchar(20) NOT NULL,
  `email` varchar(60) DEFAULT NULL,
  `password` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id_users`, `username`, `name`, `rol`, `email`, `password`) VALUES
(7, 'admin', 'Tomas Olmedo', 'admin', 'tomasolmedobc@gmail.com', '$2a$08$PoczFHS3FXGIurc4tKYAc.J7EkSerrhiFMJ.FPpnWJ8w8WhM3xsDK'),
(13, 'tolmedo', 'Tomas Olmedo', 'estudiante', 'tom@gmail.com', '$2a$08$PS2EIezlAEz9TfRRIpHKLOELEDZMRpRMLbQJwou4kA4VdCp1soBIi'),
(14, 'usuario2', 'Soy un bot', '', 'sda2@dasd.com', '$2a$08$HvsriRzu6ncdoFSq5LNrMOqlEI81tcNDO8.f2/XLPlFdls/LVZabm'),
(15, 'soy90', '909090', '', 'soy90@gmail.com', '$2a$08$gQQZegIBBIXoK492CVBjquMXMTnHjqbJSeaq/nwDz3AasBv1u.3zW');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_users`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `name` (`name`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id_users` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
