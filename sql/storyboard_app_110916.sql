-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 12-Set-2016 às 01:12
-- Versão do servidor: 10.1.13-MariaDB
-- PHP Version: 5.5.37

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `storyboard_app`
--
CREATE DATABASE IF NOT EXISTS `storyboard_app` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `storyboard_app`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `appuser`
--
-- Criação: 20-Jul-2016 às 22:14
--

CREATE TABLE `appuser` (
  `id_appuser` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(32) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `usertype` int(1) NOT NULL,
  `avatar` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- RELATIONS FOR TABLE `appuser`:
--

--
-- Extraindo dados da tabela `appuser`
--

INSERT INTO `appuser` (`id_appuser`, `username`, `password`, `fullname`, `email`, `usertype`, `avatar`) VALUES
(1, 'phcacique', '161dad636b1d5778e97dd6e25964d233', 'Pedro Cacique', 'phcacique@gmail.com', 0, 'avatar1.png'),
(6, 'phcacique2', 'fcea920f7412b5da7be0cf42b8c93759', 'Pedro', 'ph@gmail.com', 1, 'avatar6.png');

-- --------------------------------------------------------

--
-- Estrutura da tabela `frame`
--
-- Criação: 20-Jul-2016 às 22:42
--

CREATE TABLE `frame` (
  `id_frame` int(11) NOT NULL,
  `id_storyboard` int(11) NOT NULL,
  `num` int(11) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- RELATIONS FOR TABLE `frame`:
--   `id_storyboard`
--       `storyboard` -> `id_storyboard`
--

--
-- Extraindo dados da tabela `frame`
--

INSERT INTO `frame` (`id_frame`, `id_storyboard`, `num`, `duration`, `image`) VALUES
(54, 2, 1, 5, '1470150301.png'),
(55, 2, 2, 5, '1470156581.png'),
(56, 2, 3, 5, '1470156599.png'),
(57, 2, 4, 5, '1470151017.png'),
(58, 3, 1, 5, '1471834842.png'),
(59, 3, 2, 5, '1473358983.png');

-- --------------------------------------------------------

--
-- Estrutura da tabela `framelayer`
--
-- Criação: 29-Jul-2016 às 22:21
--

CREATE TABLE `framelayer` (
  `id_layer` int(11) NOT NULL,
  `id_frame` int(11) DEFAULT NULL,
  `name_layer` varchar(100) DEFAULT NULL,
  `frame_index` int(11) DEFAULT NULL,
  `visibility` int(1) DEFAULT NULL,
  `gesture` int(1) DEFAULT NULL,
  `image` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- RELATIONS FOR TABLE `framelayer`:
--   `id_frame`
--       `frame` -> `id_frame`
--

--
-- Extraindo dados da tabela `framelayer`
--

INSERT INTO `framelayer` (`id_layer`, `id_frame`, `name_layer`, `frame_index`, `visibility`, `gesture`, `image`) VALUES
(119, 54, 'desenho', 0, 1, 0, '14701503010.png'),
(120, 54, 'gesto', 1, 1, 1, '14701503011.png'),
(121, 54, 'Layer 3', 2, 1, 1, '14701503012.png'),
(123, 55, 'Layer 1', 0, 1, 1, '14701510170.png'),
(124, 56, 'Layer 1', 0, 1, 1, '14701565810.png'),
(125, 57, 'Layer 1', 0, 1, 1, '14701565990.png'),
(126, 58, 'Layer 1', 0, 1, 0, '14718348420.png'),
(127, 58, 'Layer 2', 1, 1, 1, '14718348421.png'),
(130, 59, 'desenho', 0, 1, 0, '14733589830.png'),
(131, 59, 'gestos', 1, 1, 1, '14733589831.png');

-- --------------------------------------------------------

--
-- Estrutura da tabela `post`
--
-- Criação: 20-Jul-2016 às 22:39
--

CREATE TABLE `post` (
  `id_post` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `text` text,
  `postdate` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- RELATIONS FOR TABLE `post`:
--   `id_user`
--       `appuser` -> `id_appuser`
--

--
-- Extraindo dados da tabela `post`
--

INSERT INTO `post` (`id_post`, `id_user`, `text`, `postdate`) VALUES
(3, 6, 'teste\r\n', '2016-09-11 22:59:05'),
(6, 1, 'oi\r\n', '2016-09-11 23:08:28'),
(7, 1, 'teste2\r\n', '2016-09-11 23:08:32');

-- --------------------------------------------------------

--
-- Estrutura da tabela `redeem_code`
--
-- Criação: 11-Set-2016 às 22:25
--

CREATE TABLE `redeem_code` (
  `id_redeem_code` int(11) NOT NULL,
  `code` varchar(10) DEFAULT NULL,
  `total_users` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- RELATIONS FOR TABLE `redeem_code`:
--

--
-- Extraindo dados da tabela `redeem_code`
--

INSERT INTO `redeem_code` (`id_redeem_code`, `code`, `total_users`) VALUES
(1, 'testes', 8);

-- --------------------------------------------------------

--
-- Estrutura da tabela `storyboard`
--
-- Criação: 20-Jul-2016 às 22:34
--

CREATE TABLE `storyboard` (
  `id_storyboard` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `avatar` varchar(100) NOT NULL,
  `id_user` int(11) NOT NULL,
  `lastupdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fps` int(11) NOT NULL,
  `frame_format` int(11) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- RELATIONS FOR TABLE `storyboard`:
--   `id_user`
--       `appuser` -> `id_appuser`
--

--
-- Extraindo dados da tabela `storyboard`
--

INSERT INTO `storyboard` (`id_storyboard`, `title`, `avatar`, `id_user`, `lastupdate`, `fps`, `frame_format`, `description`) VALUES
(2, 'Storyboard 1', '', 1, '2016-08-02 16:49:59', 0, 2, 'Teste de painting'),
(3, 'Storyboard Test', '', 1, '2016-09-08 18:23:03', 24, 1, 'This is just a UI test'),
(4, 'Teste', '', 6, '2016-09-11 23:04:54', 24, 1, 'aham');

-- --------------------------------------------------------

--
-- Estrutura da tabela `usercode`
--
-- Criação: 11-Set-2016 às 22:32
--

CREATE TABLE `usercode` (
  `id_usercode` int(11) NOT NULL,
  `id_userapp` int(11) NOT NULL,
  `id_redeem_code` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- RELATIONS FOR TABLE `usercode`:
--   `id_userapp`
--       `appuser` -> `id_appuser`
--   `id_redeem_code`
--       `redeem_code` -> `id_redeem_code`
--

--
-- Extraindo dados da tabela `usercode`
--

INSERT INTO `usercode` (`id_usercode`, `id_userapp`, `id_redeem_code`) VALUES
(4, 6, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appuser`
--
ALTER TABLE `appuser`
  ADD PRIMARY KEY (`id_appuser`);

--
-- Indexes for table `frame`
--
ALTER TABLE `frame`
  ADD PRIMARY KEY (`id_frame`),
  ADD KEY `fk_frame_story_idx` (`id_storyboard`);

--
-- Indexes for table `framelayer`
--
ALTER TABLE `framelayer`
  ADD PRIMARY KEY (`id_layer`),
  ADD KEY `fk_frameLayer_idx` (`id_frame`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id_post`),
  ADD KEY `fk_id_user_idx` (`id_user`);

--
-- Indexes for table `redeem_code`
--
ALTER TABLE `redeem_code`
  ADD PRIMARY KEY (`id_redeem_code`);

--
-- Indexes for table `storyboard`
--
ALTER TABLE `storyboard`
  ADD PRIMARY KEY (`id_storyboard`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `usercode`
--
ALTER TABLE `usercode`
  ADD PRIMARY KEY (`id_usercode`),
  ADD KEY `fk1_idx` (`id_userapp`),
  ADD KEY `fk2_idx` (`id_redeem_code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appuser`
--
ALTER TABLE `appuser`
  MODIFY `id_appuser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `frame`
--
ALTER TABLE `frame`
  MODIFY `id_frame` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;
--
-- AUTO_INCREMENT for table `framelayer`
--
ALTER TABLE `framelayer`
  MODIFY `id_layer` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=132;
--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `id_post` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `redeem_code`
--
ALTER TABLE `redeem_code`
  MODIFY `id_redeem_code` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `storyboard`
--
ALTER TABLE `storyboard`
  MODIFY `id_storyboard` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `usercode`
--
ALTER TABLE `usercode`
  MODIFY `id_usercode` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `frame`
--
ALTER TABLE `frame`
  ADD CONSTRAINT `fk_frame_story` FOREIGN KEY (`id_storyboard`) REFERENCES `storyboard` (`id_storyboard`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `framelayer`
--
ALTER TABLE `framelayer`
  ADD CONSTRAINT `fk_frameLayer` FOREIGN KEY (`id_frame`) REFERENCES `frame` (`id_frame`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `fk_postUser` FOREIGN KEY (`id_user`) REFERENCES `appuser` (`id_appuser`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `storyboard`
--
ALTER TABLE `storyboard`
  ADD CONSTRAINT `fk_id_user` FOREIGN KEY (`id_user`) REFERENCES `appuser` (`id_appuser`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `usercode`
--
ALTER TABLE `usercode`
  ADD CONSTRAINT `fk1` FOREIGN KEY (`id_userapp`) REFERENCES `appuser` (`id_appuser`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk2` FOREIGN KEY (`id_redeem_code`) REFERENCES `redeem_code` (`id_redeem_code`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
