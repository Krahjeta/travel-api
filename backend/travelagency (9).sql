-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 11, 2025 at 10:16 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `travelagency`
--

-- --------------------------------------------------------

--
-- Table structure for table `airlines`
--

CREATE TABLE `airlines` (
  `id` int(11) NOT NULL,
  `emri` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `airlines`
--

INSERT INTO `airlines` (`id`, `emri`) VALUES
(1, 'Air Albania'),
(2, 'Lufthansa'),
(3, 'British Airways'),
(4, 'Emirates'),
(5, 'Qatar Airways');

-- --------------------------------------------------------

--
-- Table structure for table `airports`
--

CREATE TABLE `airports` (
  `id` int(11) NOT NULL,
  `emri` varchar(100) NOT NULL,
  `qyteti` varchar(100) NOT NULL,
  `shteti_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `airports`
--

INSERT INTO `airports` (`id`, `emri`, `qyteti`, `shteti_id`) VALUES
(1, 'Tirana International Airport', 'Tirana', 1),
(2, 'Pristina International Airport', 'Pristina', 2),
(3, 'Frankfurt Airport', 'Frankfurt', 6),
(4, 'Charles de Gaulle Airport', 'Paris', 7),
(5, 'Heathrow Airport', 'London', 7);

-- --------------------------------------------------------

--
-- Table structure for table `flights`
--

CREATE TABLE `flights` (
  `id` int(11) NOT NULL,
  `airline_id` int(11) DEFAULT NULL,
  `aeroporti_nisjes_id` int(11) DEFAULT NULL,
  `aeroporti_mberritjes_id` int(11) DEFAULT NULL,
  `data_fluturimit` date NOT NULL,
  `ora_fluturimit` time NOT NULL,
  `qmimi` decimal(10,2) NOT NULL,
  `vendet_disponueshme` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flights`
--

INSERT INTO `flights` (`id`, `airline_id`, `aeroporti_nisjes_id`, `aeroporti_mberritjes_id`, `data_fluturimit`, `ora_fluturimit`, `qmimi`, `vendet_disponueshme`) VALUES
(8, 1, 1, 4, '2025-06-10', '08:00:00', 150.00, 47),
(9, 2, 3, 5, '2025-06-11', '09:30:00', 200.00, 100),
(10, 3, 5, 1, '2025-06-12', '07:45:00', 180.00, 60),
(11, 4, 4, 3, '2025-06-15', '11:00:00', 210.00, 70),
(12, 5, 2, 4, '2025-06-16', '10:15:00', 220.00, 80),
(14, 1, 4, 2, '2025-06-18', '16:01:00', 160.00, 10);

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(60) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'keja', 'krahjetaj@gmail.com', '$2b$10$aAvdRFvNzl7KLnhQJIotqusLuReSBNlyTcIylbBsLBJUX.djaBhPS', 'admin'),
(2, 'user', 'user1@gmail.com', '$2b$10$1VvM7At/MMvOJYSx0TF/jOyazyi0soz7inR4AxElGDd/Gh4N.mjsi', 'user'),
(3, 'user2', 'user2@gmail.com', '$2b$10$wkC1Vxmroh9.7ZnKWXbNcu8AdrB9khgYjz3xizyytUTkl1YsFB72W', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `offers`
--

CREATE TABLE `offers` (
  `id` int(11) NOT NULL,
  `city` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) NOT NULL,
  `type` varchar(50) DEFAULT 'One-way',
  `departureDate` date DEFAULT NULL,
  `departureTime` time DEFAULT NULL,
  `landingDate` date DEFAULT NULL,
  `landingTime` time DEFAULT NULL,
  `availableSeats` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `offers`
--

INSERT INTO `offers` (`id`, `city`, `price`, `image`, `type`, `departureDate`, `departureTime`, `landingDate`, `landingTime`, `availableSeats`) VALUES
(1, 'Paris', 99.99, 'C:UsersKrahjetaDesktopLab-projectfrontendsrcphotosParis.avif', 'One-way', '2025-06-01', '08:00:00', '2025-06-01', '10:30:00', 0),
(2, 'London', 120.50, 'frontend\\src\\photos\\Londonn.jpeg', 'One-way', '2025-06-03', '09:00:00', '2025-06-03', '11:00:00', 0),
(3, 'MonteCarlo', 105.99, 'frontend\\src\\photos\\MonteCarlo.jpg', 'One-way', '2025-07-01', '07:30:00', '2025-07-10', '09:45:00', 0),
(4, 'Barcelona', 85.99, 'frontend\\src\\photos\\Barcelona.webp', 'One-way', '2025-06-07', '10:00:00', '2025-06-07', '12:00:00', 2),
(5, 'Greece', 90.90, 'frontend\\src\\photos\\Greece.jpeg', 'One-way', '2025-06-06', '10:25:00', '2025-06-06', '11:50:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `offerId` int(11) DEFAULT NULL,
  `numSeats` int(11) NOT NULL DEFAULT 1,
  `reservationDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `paid` tinyint(1) NOT NULL DEFAULT 0,
  `flightId` int(11) DEFAULT NULL
) ;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `userId`, `offerId`, `numSeats`, `reservationDate`, `paid`, `flightId`) VALUES
(1, 2, 4, 1, '2025-05-30 18:37:03', 0, NULL),
(3, 3, 5, 1, '2025-05-31 01:15:17', 0, NULL),
(4, 3, 5, 1, '2025-05-31 01:20:55', 1, NULL),
(7, 3, 4, 1, '2025-05-31 18:48:07', 1, NULL),
(8, 3, NULL, 1, '2025-06-07 20:23:29', 1, 8),
(11, 3, 4, 1, '2025-06-11 07:39:26', 0, NULL),
(12, 3, NULL, 1, '2025-06-11 07:40:43', 1, 8);

-- --------------------------------------------------------

--
-- Table structure for table `shtetet`
--

CREATE TABLE `shtetet` (
  `id` int(11) NOT NULL,
  `emri` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shtetet`
--

INSERT INTO `shtetet` (`id`, `emri`) VALUES
(1, 'Shqipëria'),
(2, 'Kosova'),
(3, 'Maqedonia e Veriut'),
(4, 'Greqia'),
(5, 'Italia'),
(6, 'Gjermania'),
(7, 'Franca'),
(8, 'Spanja'),
(9, 'Turqia'),
(10, 'SHBA'),
(11, 'Kanada'),
(12, 'Australi');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `airlines`
--
ALTER TABLE `airlines`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `airports`
--
ALTER TABLE `airports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `shteti_id` (`shteti_id`);

--
-- Indexes for table `flights`
--
ALTER TABLE `flights`
  ADD PRIMARY KEY (`id`),
  ADD KEY `airline_id` (`airline_id`),
  ADD KEY `aeroporti_nisjes_id` (`aeroporti_nisjes_id`),
  ADD KEY `aeroporti_mberritjes_id` (`aeroporti_mberritjes_id`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user` (`userId`),
  ADD KEY `fk_offer` (`offerId`),
  ADD KEY `fk_flight` (`flightId`);

--
-- Indexes for table `shtetet`
--
ALTER TABLE `shtetet`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `airlines`
--
ALTER TABLE `airlines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `airports`
--
ALTER TABLE `airports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `flights`
--
ALTER TABLE `flights`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shtetet`
--
ALTER TABLE `shtetet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `airports`
--
ALTER TABLE `airports`
  ADD CONSTRAINT `airports_ibfk_1` FOREIGN KEY (`shteti_id`) REFERENCES `shtetet` (`id`);

--
-- Constraints for table `flights`
--
ALTER TABLE `flights`
  ADD CONSTRAINT `flights_ibfk_1` FOREIGN KEY (`airline_id`) REFERENCES `airlines` (`id`),
  ADD CONSTRAINT `flights_ibfk_2` FOREIGN KEY (`aeroporti_nisjes_id`) REFERENCES `airports` (`id`),
  ADD CONSTRAINT `flights_ibfk_3` FOREIGN KEY (`aeroporti_mberritjes_id`) REFERENCES `airports` (`id`);

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `fk_flight` FOREIGN KEY (`flightId`) REFERENCES `flights` (`id`),
  ADD CONSTRAINT `fk_offer` FOREIGN KEY (`offerId`) REFERENCES `offers` (`id`),
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`userId`) REFERENCES `login` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
