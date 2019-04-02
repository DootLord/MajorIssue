-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 02, 2019 at 10:28 PM
-- Server version: 10.1.19-MariaDB
-- PHP Version: 5.6.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `majorissue`
--
CREATE DATABASE IF NOT EXISTS `majorissue` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `majorissue`;

-- --------------------------------------------------------

--
-- Table structure for table `combo_old`
--

CREATE TABLE `combo_old` (
  `id` int(11) NOT NULL,
  `selected_term` set('bug','contribution','fix','question','request','reference') NOT NULL,
  `valid_terms` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `combo_old`
--

INSERT INTO `combo_old` (`id`, `selected_term`, `valid_terms`) VALUES
(1, 'bug', 'fix,question,reference,evidence'),
(3, 'contribution', 'fix,question,reference,evidence'),
(4, 'fix', 'reference,evidence'),
(6, 'question', 'evidence'),
(7, 'request', 'reference'),
(13, 'reference', 'reference,evidence');

-- --------------------------------------------------------

--
-- Table structure for table `issue`
--

CREATE TABLE `issue` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `issue_type` text NOT NULL,
  `issue_id` int(11) DEFAULT NULL,
  `repo_id` int(11) DEFAULT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `issue`
--

INSERT INTO `issue` (`id`, `title`, `issue_type`, `issue_id`, `repo_id`, `date`) VALUES
(1, 'SAMPLE TEST', 'BUG_FIX', 1, 158288218, '0000-00-00 00:00:00'),
(5, 'I can''t find the spaghetti', 'BUG_FIX', 5, 158288218, '2019-02-08 09:32:58'),
(6, 'asdasd', 'BUG_FIX', 6, 158288218, '2019-02-08 09:44:23'),
(7, 'test', 'BUG_FIX', 7, 158288218, '2019-02-08 10:47:34'),
(8, 'asdassd', 'BUG_FIX', 8, NULL, '2019-02-20 17:00:19');

-- --------------------------------------------------------

--
-- Table structure for table `issue_bug_fix`
--

CREATE TABLE `issue_bug_fix` (
  `id` int(11) NOT NULL,
  `title` text NOT NULL,
  `work_mal_int` text NOT NULL,
  `sol_workaround` text NOT NULL,
  `note` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `issue_bug_fix`
--

INSERT INTO `issue_bug_fix` (`id`, `title`, `work_mal_int`, `sol_workaround`, `note`) VALUES
(1, '', 'worka', 'bug', 'note'),
(2, '', 'worka', 'bug', 'note'),
(3, '', 'I tried to find some spaghetti, but I can''t find it anywhere!!', 'It was behind the sofa, aha', 'I''m such a dumdum :P'),
(4, '', 'I tried to find some spaghetti, but I can''t find it anywhere!!', 'It was behind the sofa, aha', 'I''m such a dumdum :P'),
(5, '', 'I tried to find some spaghetti, but I can''t find it anywhere!!', 'It was behind the sofa, aha', 'I''m such a dumdum :P'),
(6, '', 'asdasd', 'asdasd', 'asdasd'),
(7, '', 'test', '123', '123'),
(8, '', 'asdasd', 'asdas', 'asdas');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `tag_id` int(11) NOT NULL,
  `tag_name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`tag_id`, `tag_name`) VALUES
(1, 'bug'),
(2, 'contribution'),
(3, 'fix'),
(4, 'question'),
(5, 'request'),
(6, 'reference'),
(7, 'evidence');

-- --------------------------------------------------------

--
-- Table structure for table `templates`
--

CREATE TABLE `templates` (
  `id` int(11) NOT NULL,
  `tag` int(11) NOT NULL,
  `combo_tag` int(11) NOT NULL,
  `name` text NOT NULL,
  `markup_url` text NOT NULL,
  `script_url` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `templates`
--

INSERT INTO `templates` (`id`, `tag`, `combo_tag`, `name`, `markup_url`, `script_url`) VALUES
(1, 1, 3, 'bug_fix', 'bug_fix.html', 'bug_fix.js'),
(2, 1, 4, '', '', ''),
(3, 1, 6, '', '', ''),
(4, 1, 7, '', '', ''),
(5, 2, 3, '', '', ''),
(6, 2, 4, '', '', ''),
(7, 2, 6, '', '', ''),
(8, 2, 7, '', '', ''),
(9, 3, 6, '', '', ''),
(10, 3, 7, '', '', ''),
(11, 4, 7, '', '', ''),
(12, 5, 6, '', '', ''),
(13, 6, 6, '', '', ''),
(14, 6, 7, '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `github` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `combo_old`
--
ALTER TABLE `combo_old`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `issue`
--
ALTER TABLE `issue`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `issue_bug_fix`
--
ALTER TABLE `issue_bug_fix`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`tag_id`);

--
-- Indexes for table `templates`
--
ALTER TABLE `templates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tag_idx` (`tag`),
  ADD KEY `tag_combo_id_idx` (`combo_tag`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `combo_old`
--
ALTER TABLE `combo_old`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `issue`
--
ALTER TABLE `issue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `issue_bug_fix`
--
ALTER TABLE `issue_bug_fix`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `tag_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `templates`
--
ALTER TABLE `templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `templates`
--
ALTER TABLE `templates`
  ADD CONSTRAINT `tag_combo_id` FOREIGN KEY (`combo_tag`) REFERENCES `tags` (`tag_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `tag_id` FOREIGN KEY (`tag`) REFERENCES `tags` (`tag_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
