-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 21-Set-2016 às 00:31
-- Versão do servidor: 10.1.16-MariaDB
-- PHP Version: 7.0.9

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

DROP TABLE IF EXISTS `appuser`;
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
-- Extraindo dados da tabela `appuser`
--

INSERT INTO `appuser` (`id_appuser`, `username`, `password`, `fullname`, `email`, `usertype`, `avatar`) VALUES
(1, 'phcacique', '161dad636b1d5778e97dd6e25964d233', 'Pedro Henrique Cacique Braga', 'phcacique@gmail.com', 0, 'avatar1.png'),
(6, 'phcacique2', '161dad636b1d5778e97dd6e25964d233', 'Pedro', 'ph@gmail.com', 1, 'avatar6.png'),
(7, 'phcacique3', '161dad636b1d5778e97dd6e25964d233', 'Pedro Cacique 3', 'email@gmail.com', 1, 'avatar6.png');

-- --------------------------------------------------------

--
-- Estrutura da tabela `bug`
--

DROP TABLE IF EXISTS `bug`;
CREATE TABLE `bug` (
  `id_bug` int(11) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `detailedtext` varchar(300) NOT NULL,
  `bugdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `bug`
--

INSERT INTO `bug` (`id_bug`, `subject`, `detailedtext`, `bugdate`, `id_user`) VALUES
(21, 'Teste', 'Bug bugado', '2016-09-20 20:59:59', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `frame`
--

DROP TABLE IF EXISTS `frame`;
CREATE TABLE `frame` (
  `id_frame` int(11) NOT NULL,
  `id_storyboard` int(11) NOT NULL,
  `num` int(11) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `activeTime` int(11) NOT NULL DEFAULT '0',
  `gestureTime` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `frame`
--

INSERT INTO `frame` (`id_frame`, `id_storyboard`, `num`, `duration`, `image`, `activeTime`, `gestureTime`) VALUES
(75, 7, 1, 5, '1474372401.png', 0, 0),
(76, 7, 2, 5, '1474398163.png', 0, 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `framelayer`
--

DROP TABLE IF EXISTS `framelayer`;
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
-- Extraindo dados da tabela `framelayer`
--

INSERT INTO `framelayer` (`id_layer`, `id_frame`, `name_layer`, `frame_index`, `visibility`, `gesture`, `image`) VALUES
(163, 75, 'Layer 1', 0, 1, 0, '14743724010.png'),
(164, 76, 'Layer 1', 0, 1, 0, '14743981630.png');

-- --------------------------------------------------------

--
-- Estrutura da tabela `post`
--

DROP TABLE IF EXISTS `post`;
CREATE TABLE `post` (
  `id_post` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `text` text,
  `postdate` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `post`
--

INSERT INTO `post` (`id_post`, `id_user`, `text`, `postdate`) VALUES
(3, 6, 'teste\r\n', '2016-09-11 22:59:05'),
(17, 1, 'I''m the fastest man alive!\r\n', '2016-09-20 03:03:35'),
(18, 1, 'My name is Barry Allen!\r\n', '2016-09-20 03:03:42');

-- --------------------------------------------------------

--
-- Estrutura da tabela `redeem_code`
--

DROP TABLE IF EXISTS `redeem_code`;
CREATE TABLE `redeem_code` (
  `id_redeem_code` int(11) NOT NULL,
  `code` varchar(10) DEFAULT NULL,
  `total_users` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `redeem_code`
--

INSERT INTO `redeem_code` (`id_redeem_code`, `code`, `total_users`) VALUES
(1, 'testes', 7);

-- --------------------------------------------------------

--
-- Estrutura da tabela `storyboard`
--

DROP TABLE IF EXISTS `storyboard`;
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
-- Extraindo dados da tabela `storyboard`
--

INSERT INTO `storyboard` (`id_storyboard`, `title`, `avatar`, `id_user`, `lastupdate`, `fps`, `frame_format`, `description`) VALUES
(4, 'Teste', '', 6, '2016-09-11 23:04:54', 24, 1, 'aham'),
(7, 'Storyboard 1', 'users/phcacique/storyboards/phcacique7/1474372401.png', 1, '2016-09-20 19:02:46', 24, 1, 'Teste de storyboard'),
(8, 'Teste Cacique', 'img/america.png', 7, '2016-09-20 18:46:57', 24, 1, 'Teste phcacique3');

-- --------------------------------------------------------

--
-- Estrutura da tabela `usercode`
--

DROP TABLE IF EXISTS `usercode`;
CREATE TABLE `usercode` (
  `id_usercode` int(11) NOT NULL,
  `id_userapp` int(11) NOT NULL,
  `id_redeem_code` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `usercode`
--

INSERT INTO `usercode` (`id_usercode`, `id_userapp`, `id_redeem_code`) VALUES
(4, 6, 1),
(5, 7, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appuser`
--
ALTER TABLE `appuser`
  ADD PRIMARY KEY (`id_appuser`);

--
-- Indexes for table `bug`
--
ALTER TABLE `bug`
  ADD PRIMARY KEY (`id_bug`),
  ADD KEY `fk_userbug_idx` (`id_user`);

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
  MODIFY `id_appuser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `bug`
--
ALTER TABLE `bug`
  MODIFY `id_bug` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
--
-- AUTO_INCREMENT for table `frame`
--
ALTER TABLE `frame`
  MODIFY `id_frame` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;
--
-- AUTO_INCREMENT for table `framelayer`
--
ALTER TABLE `framelayer`
  MODIFY `id_layer` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=165;
--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `id_post` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT for table `redeem_code`
--
ALTER TABLE `redeem_code`
  MODIFY `id_redeem_code` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `storyboard`
--
ALTER TABLE `storyboard`
  MODIFY `id_storyboard` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `usercode`
--
ALTER TABLE `usercode`
  MODIFY `id_usercode` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `bug`
--
ALTER TABLE `bug`
  ADD CONSTRAINT `fk_userbug` FOREIGN KEY (`id_user`) REFERENCES `appuser` (`id_appuser`) ON DELETE CASCADE ON UPDATE CASCADE;

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
