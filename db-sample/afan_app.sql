-- phpMyAdmin SQL Dump
-- version 3.3.10.4
-- http://www.phpmyadmin.net
--
-- Host: mysql.cognitionis.com
-- Generation Time: Nov 13, 2015 at 11:52 AM
-- Server version: 5.1.56
-- PHP Version: 5.3.29

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `afan_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(100) NOT NULL,
  `mode` varchar(100) NOT NULL,
  `user` varchar(100) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `age` varchar(3) NOT NULL,
  `num_correct` varchar(10) NOT NULL,
  `num_answered` varchar(10) NOT NULL,
  `result` varchar(10) NOT NULL,
  `level` varchar(10) NOT NULL,
  `duration` varchar(10) NOT NULL,
  `timestamp` varchar(16) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=104 ;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `type`, `mode`, `user`, `subject`, `age`, `num_correct`, `num_answered`, `result`, `level`, `duration`, `timestamp`) VALUES
(103, 'memoria_visual', 'test', 'hectorlm1983@gmail.com', 'juan_llorens', '33', '1', '6', '0.16666666', '1', '1', '2015-10-23 11:40'),
(102, 'memoria_visual', 'test', 'hectorlm1983@gmail.com', 'juan_llorens', '33', '2', '6', '0.33333333', '1', '3', '2015-10-23 11:35'),
(93, 'memoria_visual', 'test', 'hectorlm1983@gmail.com', 'pedrito', '15', '1', '12', '0.08333333', '1', '16', '2015-09-09 23:05');

-- --------------------------------------------------------

--
-- Table structure for table `session_activities`
--

CREATE TABLE IF NOT EXISTS `session_activities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(100) NOT NULL,
  `mode` varchar(100) NOT NULL,
  `user` varchar(100) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `session` varchar(100) NOT NULL,
  `activity` varchar(100) NOT NULL,
  `choice` varchar(100) NOT NULL,
  `result` varchar(10) NOT NULL,
  `level` varchar(10) NOT NULL,
  `duration` varchar(10) NOT NULL,
  `timestamp` varchar(19) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=301 ;

--
-- Dumping data for table `session_activities`
--

INSERT INTO `session_activities` (`id`, `type`, `mode`, `user`, `subject`, `session`, `activity`, `choice`, `result`, `level`, `duration`, `timestamp`) VALUES
(298, 'conciencia', 'test', 'hectorlm1983@gmail.com', 'juan_llorens', '101', 'carta', 'carta', 'correct', '1', '0', '2015-10-22 22:03:26'),
(297, 'conciencia', 'test', 'hectorlm1983@gmail.com', 'juan_llorens', '101', 'casa', 'casa', 'correct', '1', '2', '2015-10-22 22:03:18'),
(299, 'conciencia', 'test', 'hectorlm1983@gmail.com', 'juan_llorens', '101', 'banyera', 'banyera', 'correct', '1', '0', '2015-10-22 22:03:34'),
(300, 'conciencia', 'test', 'hectorlm1983@gmail.com', 'juan_llorens', '101', 'koala', 'koala', 'correct', '1', '0', '2015-10-22 22:03:41'),
(295, 'conciencia', 'test', 'hectorlm1983@gmail.com', 'juan_llorens', '101', 'ala', 'ala', 'correct', '1', '1', '2015-10-22 22:02:55'),
(296, 'conciencia', 'test', 'hectorlm1983@gmail.com', 'juan_llorens', '101', 'mesa', 'mesa', 'correct', '1', '0', '2015-10-22 22:03:11'),
(281, 'conciencia', 'test', 'hectorlm1983@gmail.com', 'pedrito', '91', 'banyera', 'banyera', 'correct', '1', '7', '2015-09-09 22:56:39'),
(282, 'conciencia', 'test', 'hectorlm1983@gmail.com', 'pedrito', '91', 'koala', 'koala', 'correct', '1', '0', '2015-09-09 22:56:46'),
(277, 'conciencia', 'test', 'hectorlm1983@gmail.com', 'pedrito', '91', 'ala', 'ala', 'correct', '1', '0', '2015-09-09 22:56:01'),
(278, 'conciencia', 'test', 'hectorlm1983@gmail.com', 'pedrito', '91', 'mesa', 'mesa', 'correct', '1', '0', '2015-09-09 22:56:07'),
(279, 'conciencia', 'test', 'hectorlm1983@gmail.com', 'pedrito', '91', 'casa', 'casa', 'correct', '1', '0', '2015-09-09 22:56:13'),
(280, 'conciencia', 'test', 'hectorlm1983@gmail.com', 'pedrito', '91', 'carta', 'carta', 'correct', '1', '4', '2015-09-09 22:56:22');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE IF NOT EXISTS `subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(100) NOT NULL,
  `alias` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `birthdate` date NOT NULL,
  `comments` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user` (`user`,`alias`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=45 ;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `user`, `alias`, `name`, `birthdate`, `comments`) VALUES
(41, 'hectorlm1983@gmail.com', 'pedrito', 'Pedrito Ayala', '2000-01-01', 'comment...'),
(42, 'hectorlm1983@gmail.com', 'juan_llorens', 'Juan Llorens', '1982-03-04', 'a'),
(43, 'montsedeayala@gmail.com', 'Natalia', 'Natalia', '2008-05-15', ''),
(44, 'hectorlm1983@gmail.com', 'manolo', 'Manolo', '2012-08-15', 'no...');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `access_level` varchar(100) NOT NULL,
  `display_name` varchar(100) NOT NULL,
  `password` varchar(50) NOT NULL,
  `avatar` varchar(100) NOT NULL,
  `last_login` varchar(19) NOT NULL,
  `last_provider` varchar(100) NOT NULL,
  `creation_timestamp` varchar(19) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `access_level`, `display_name`, `password`, `avatar`, `last_login`, `last_provider`, `creation_timestamp`) VALUES
(2, 'hectorlm1983@gmail.com', 'admin', 'Héctor Admin', '', '', '2015-11-11 09:42:23', 'google', ''),
(4, 'hector.llorens.martinez@gmail.com', 'invitee', 'Hector Llorens', '', '', '2015-10-22 23:39:48', 'google', '');
