-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Pritësi (host): 127.0.0.1
-- Koha e gjenerimit: Maj 03, 2025 në 01:27 PD
-- Versioni i serverit: 10.4.27-MariaDB
-- PHP Versioni: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databaza: `destinacioni`
--

-- --------------------------------------------------------

--
-- Struktura e tabelës për tabelën `destinacioni`
--

CREATE TABLE `destinacioni` (
  `id` int(11) NOT NULL,
  `emri` varchar(100) DEFAULT NULL,
  `vendi` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Zbraz të dhënat për tabelën `destinacioni`
--

INSERT INTO `destinacioni` (`id`, `emri`, `vendi`) VALUES
(1, 'Paris', 'France'),
(2, 'Rome', 'Italy');

-- --------------------------------------------------------

--
-- Struktura e tabelës për tabelën `udhetimet`
--

CREATE TABLE `udhetimet` (
  `id` int(11) NOT NULL,
  `destinacion_id` int(11) DEFAULT NULL,
  `data_nisjes` date DEFAULT NULL,
  `cmimi` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Zbraz të dhënat për tabelën `udhetimet`
--

INSERT INTO `udhetimet` (`id`, `destinacion_id`, `data_nisjes`, `cmimi`) VALUES
(1, 1, '2025-06-01', '499.00'),
(2, 2, '2025-06-02', '499.00');

--
-- Indekset për tabelat e hedhura
--

--
-- Indekset për tabelë `destinacioni`
--
ALTER TABLE `destinacioni`
  ADD PRIMARY KEY (`id`);

--
-- Indekset për tabelë `udhetimet`
--
ALTER TABLE `udhetimet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `destinacion_id` (`destinacion_id`);

--
-- AUTO_INCREMENT për tabelat e hedhura
--

--
-- AUTO_INCREMENT për tabelë `destinacioni`
--
ALTER TABLE `destinacioni`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT për tabelë `udhetimet`
--
ALTER TABLE `udhetimet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Detyrimet për tabelat e hedhura
--

--
-- Detyrimet për tabelën `udhetimet`
--
ALTER TABLE `udhetimet`
  ADD CONSTRAINT `udhetimet_ibfk_1` FOREIGN KEY (`destinacion_id`) REFERENCES `destinacioni` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
