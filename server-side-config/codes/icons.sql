-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 04, 2024 at 03:59 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `icons`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_account`
--

CREATE TABLE `tbl_account` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `recovery_email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `role_fkid` int(11) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'allowed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_account`
--

INSERT INTO `tbl_account` (`id`, `email`, `username`, `recovery_email`, `password`, `timestamp`, `role_fkid`, `status`) VALUES
(43, 'admin.administrator@gmail.com', 'admin', 'admin.recover@gmail.com', '$2b$10$PC6M38GM6Q3xTkXVWBTvie6LVIJZ7sa5CcO2PP1.5Z1/yxXdcqW5m', '2024-04-02 08:13:00.677881', 1, 'allowed');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_comment`
--

CREATE TABLE `tbl_comment` (
  `id` int(11) NOT NULL,
  `comment` varchar(8000) NOT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `image` longtext NOT NULL,
  `community_post_fkid` int(11) NOT NULL,
  `account_fkid` int(11) NOT NULL,
  `profile_fkid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_community_post`
--

CREATE TABLE `tbl_community_post` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `image` longtext DEFAULT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `account_fkid` int(11) NOT NULL,
  `profile_fkid` int(11) DEFAULT NULL,
  `views` int(11) NOT NULL DEFAULT 0,
  `author` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_community_post`
--

INSERT INTO `tbl_community_post` (`id`, `title`, `content`, `image`, `timestamp`, `account_fkid`, `profile_fkid`, `views`, `author`) VALUES
(26, 'Darkmode by jeawow', 'This is a content', '', '2024-04-03 03:57:57.299146', 43, 13, 0, ''),
(27, 'This is a new post', 'This is the content of the new post', '', '2024-04-03 04:40:18.449401', 43, 13, 0, ''),
(28, 'Test again', 'test again content', '', '2024-04-03 04:41:24.727897', 43, 13, 0, ''),
(29, 'New Post', '--new-content', '', '2024-04-03 06:09:07.142384', 43, 13, 0, ''),
(31, 'Welcome', 'This is a mock content', '', '2024-04-04 00:21:52.634933', 43, 13, 0, ''),
(32, 'Mock', 'Mock', '', '2024-04-04 00:23:14.060327', 43, 13, 0, ''),
(33, 'Mock', 'Mock', '', '2024-04-04 00:24:55.308415', 43, 13, 0, ''),
(34, 'Mock', 'Mock', '', '2024-04-04 00:27:05.141624', 43, 13, 0, ''),
(35, 'New Mock', 'New Mock', '', '2024-04-04 00:27:18.369117', 43, 13, 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_conversation`
--

CREATE TABLE `tbl_conversation` (
  `id` int(11) NOT NULL,
  `message_content` varchar(8000) NOT NULL,
  `image` longtext NOT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `message_fkid` int(11) NOT NULL,
  `sender` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_engagement`
--

CREATE TABLE `tbl_engagement` (
  `id` int(11) NOT NULL,
  `is_liked` tinyint(1) NOT NULL,
  `is_disliked` tinyint(1) NOT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `community_post_fkid` int(11) NOT NULL,
  `account_fkid` int(11) NOT NULL,
  `profile_fkid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_gallery`
--

CREATE TABLE `tbl_gallery` (
  `id` int(11) NOT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `image` longtext NOT NULL,
  `description` mediumtext NOT NULL,
  `account_fkid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_home_content`
--

CREATE TABLE `tbl_home_content` (
  `id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`content`)),
  `image` longtext DEFAULT NULL,
  `account_fkid` int(11) NOT NULL,
  `views` int(11) NOT NULL,
  `status` varchar(100) DEFAULT 'in feed',
  `created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_home_content`
--

INSERT INTO `tbl_home_content` (`id`, `type`, `author`, `content`, `image`, `account_fkid`, `views`, `status`, `created`) VALUES
(28, 'article', 'Center for Technopreneurship and Innovation', '{\"title\":\"Mock Article editable\",\"content\":\"In the ever-evolving realm of journalism, occasionally, there arises a need to delve into the uncharted territories of creativity and imagination. Today, we present to you a mock article, a product of such an endeavor. This piece is not grounded in reality but rather a flight of fancy, crafted solely for the purpose of entertainment and exploration.\"}', '', 43, 0, 'in feed', '2024-04-03 09:34:44'),
(29, 'article', 'Center for Technopreneurship and Innovation', '{\"title\":\"Mock Article 2 --edited\",\"content\":\"In the ever-evolving realm of journalism, occasionally, there arises a need to delve into the uncharted territories of creativity and imagination. Today, we present to you a mock article, a product of such an endeavor. This piece is not grounded in reality but rather a flight of fancy, crafted solely for the purpose of entertainment and exploration.\"}', '', 43, 0, 'in feed', '2024-04-03 09:35:25'),
(30, 'article', 'Center for Technopreneurship and Innovation', '{\"title\":\"Mock Article #3\",\"content\":\"This is mock article #3. Hope you like it.\"}', '', 43, 0, 'in feed', '2024-04-03 09:43:38'),
(31, 'article', 'Center for Technopreneurship and Innovation', '{\"title\":\"Mock Article --edited by jeao\",\"content\":\"Mock article content #4\"}', '', 43, 0, 'in feed', '2024-04-03 09:44:24'),
(32, 'article', 'Center for Technopreneurship and Innovation', '{\"title\":\"Mock Article #5\",\"content\":\"Mock article content #5.\"}', '', 43, 0, 'in feed', '2024-04-03 09:45:13'),
(33, 'article', 'Center for Technopreneurship and Innovation', '{\"title\":\"Mock Article #6\",\"content\":\"Mock content #6\"}', '', 43, 0, 'in feed', '2024-04-03 10:17:53'),
(34, 'article', 'Center for Technopreneurship and Innovation', '{\"title\":\"Mock Article #7\",\"content\":\"Mock article content #7 \"}', '', 43, 0, 'in feed', '2024-04-03 10:23:45'),
(35, 'article', 'Center for Technopreneurship and Innovation', '{\"title\":\"Mock Article #8\",\"content\":\"Mock content #8\"}', '', 43, 0, 'in feed', '2024-04-03 10:31:18'),
(36, 'article', 'Center for Technopreneurship and Innovation', '{\"title\":\"Mock Article #9\",\"content\":\"Mock content #9\"}', '', 43, 0, 'in feed', '2024-04-03 10:35:18'),
(37, 'article', 'Center for Technopreneurship and Innovation', '{\"title\":\"Mock Article #4\",\"content\":\"Mock content\"}', '', 43, 0, 'in feed', '2024-04-03 10:35:53'),
(38, 'article', 'Center for Technopreneurship and Innovation', '{\"title\":\"Hello jeao article\",\"content\":\"Mock content\"}', '', 43, 0, 'in feed', '2024-04-03 10:36:17'),
(39, 'article', 'Center for Technopreneurship and Innovation', '{\"title\":\"Hello arvin\",\"content\":\"Mock content\"}', '', 43, 0, 'in feed', '2024-04-03 10:37:24'),
(40, 'article', 'Center for Technopreneurship and Innovation', '{\"title\":\"Hi Florie\",\"content\":\"Hi florie\"}', '', 43, 0, 'in feed', '2024-04-03 10:41:56'),
(52, 'program', 'Center for Technopreneurship and Innovation', '{\"title\":\"Mocking Bird -\",\"content\":\"Mocking the data\"}', '', 43, 0, 'in feed', '2024-04-03 11:41:46'),
(53, 'program', 'Center for Technopreneurship and Innovation', '{\"title\":\"Mock\",\"content\":\"Mock\"}', '', 43, 0, 'in feed', '2024-04-03 11:45:59'),
(54, 'program', 'Center for Technopreneurship and Innovation', '{\"title\":\"Mock\",\"content\":\"Mock\"}', '', 43, 0, 'in feed', '2024-04-03 11:46:47'),
(55, 'program', 'Center for Technopreneurship and Innovation', '{\"title\":\"Mock\",\"content\":\"Hello\"}', '', 43, 0, 'in feed', '2024-04-03 11:50:00'),
(56, 'program', 'Center for Technopreneurship and Innovation', '{\"title\":\"Mock You Pomay\",\"content\":\"Hello\"}', '', 43, 0, 'in feed', '2024-04-03 11:50:17'),
(57, 'article', 'Clear', '{\"title\":\"New\",\"content\":\"Author\"}', '', 43, 0, 'in feed', '2024-04-03 11:52:19'),
(58, 'article', 'Center for Technopreneurship and Innovation', '{\"title\":\"Mock\",\"content\":\"Mock the data\"}', '', 43, 0, 'in feed', '2024-04-03 11:54:38'),
(59, 'article', 'Center for Technopreneurship and Innovation', '{\"title\":\"Hello\",\"content\":\"Testing\"}', '', 43, 0, 'in feed', '2024-04-03 12:31:30'),
(60, 'article', 'Center for Technopreneurship and Innovation', '{\"title\":\"Mock\",\"content\":\"Mock\"}', '', 43, 0, 'in feed', '2024-04-03 12:33:34'),
(61, 'program', 'Center for Technopreneurship and Innovation', '{\"title\":\"Mock\",\"content\":\"Mock\"}', '', 43, 0, 'in feed', '2024-04-03 12:34:05'),
(62, 'article', 'Center for Technopreneurship and Innovation', '{\"title\":\"new_pisot\",\"content\":\"post_is_new\"}', '', 43, 0, 'in feed', '2024-04-03 13:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_log`
--

CREATE TABLE `tbl_log` (
  `id` int(11) NOT NULL,
  `page` varchar(255) NOT NULL,
  `times_clicked` varchar(255) NOT NULL,
  `duration` varchar(255) NOT NULL,
  `modification_made` int(11) NOT NULL,
  `keys_pressed` int(11) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_login_session`
--

CREATE TABLE `tbl_login_session` (
  `id` int(11) NOT NULL,
  `login_time` datetime DEFAULT current_timestamp(),
  `account_fkid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_message`
--

CREATE TABLE `tbl_message` (
  `id` int(11) NOT NULL,
  `room` varchar(255) NOT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `account_fkid_1` int(11) NOT NULL,
  `account_fkid_2` int(11) NOT NULL,
  `profile_fkid_1` int(11) DEFAULT NULL,
  `profile_fkid_2` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_profile`
--

CREATE TABLE `tbl_profile` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `photo` longtext NOT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `account_fkid` int(11) NOT NULL,
  `bio` varchar(10000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_profile`
--

INSERT INTO `tbl_profile` (`id`, `name`, `location`, `photo`, `timestamp`, `account_fkid`, `bio`) VALUES
(13, 'Center for Technopreneurship and Innovation', '', '', '2024-04-02 08:13:31.234346', 43, '');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_queries`
--

CREATE TABLE `tbl_queries` (
  `id` int(11) NOT NULL,
  `sender` varchar(255) NOT NULL,
  `subject` varchar(10000) NOT NULL,
  `content` mediumtext NOT NULL,
  `query_status` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_queries`
--

INSERT INTO `tbl_queries` (`id`, `sender`, `subject`, `content`, `query_status`, `created_at`) VALUES
(1, 'malaluanofficial7@gmail.com', 'Request to create new account', 'lorem ipsum dolor', 'unread', '2024-03-22 10:51:28');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_role`
--

CREATE TABLE `tbl_role` (
  `id` int(11) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_role`
--

INSERT INTO `tbl_role` (`id`, `role`) VALUES
(1, 'admin'),
(2, 'startup'),
(3, 'partner');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_service`
--

CREATE TABLE `tbl_service` (
  `id` int(255) NOT NULL,
  `name_of_service` varchar(255) NOT NULL,
  `description` varchar(8000) NOT NULL,
  `profile_fkid` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_startup_info`
--

CREATE TABLE `tbl_startup_info` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(8000) NOT NULL,
  `link` varchar(255) NOT NULL,
  `profile_fkid` int(255) NOT NULL,
  `title` varchar(5000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_account`
--
ALTER TABLE `tbl_account`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_fkid` (`role_fkid`);

--
-- Indexes for table `tbl_comment`
--
ALTER TABLE `tbl_comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tbl_comment_ibfk_1` (`community_post_fkid`),
  ADD KEY `tbl_comment_ibfk_2` (`account_fkid`),
  ADD KEY `tbl_comment_ibfk_3` (`profile_fkid`);

--
-- Indexes for table `tbl_community_post`
--
ALTER TABLE `tbl_community_post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tbl_community_post_ibfk_1` (`account_fkid`),
  ADD KEY `tbl_community_post_ibfk_2` (`profile_fkid`);

--
-- Indexes for table `tbl_conversation`
--
ALTER TABLE `tbl_conversation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tbl_conversation_ibfk_1` (`message_fkid`);

--
-- Indexes for table `tbl_engagement`
--
ALTER TABLE `tbl_engagement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tbl_engagement_ibfk_1` (`community_post_fkid`),
  ADD KEY `tbl_engagement_ibfk_2` (`account_fkid`),
  ADD KEY `tbl_engagement_ibfk_3` (`profile_fkid`);

--
-- Indexes for table `tbl_gallery`
--
ALTER TABLE `tbl_gallery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tbl_gallery_ibfk_1` (`account_fkid`);

--
-- Indexes for table `tbl_home_content`
--
ALTER TABLE `tbl_home_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tbl_home_content_ibfk_1` (`account_fkid`);

--
-- Indexes for table `tbl_log`
--
ALTER TABLE `tbl_log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_login_session`
--
ALTER TABLE `tbl_login_session`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tbl_login_session_ibfk_1` (`account_fkid`);

--
-- Indexes for table `tbl_message`
--
ALTER TABLE `tbl_message`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `room` (`room`),
  ADD KEY `tbl_message_ibfk_1` (`account_fkid_1`),
  ADD KEY `tbl_message_ibfk_2` (`account_fkid_2`),
  ADD KEY `tbl_message_ibfk_3` (`profile_fkid_1`),
  ADD KEY `tbl_message_ibfk_4` (`profile_fkid_2`);

--
-- Indexes for table `tbl_profile`
--
ALTER TABLE `tbl_profile`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tbl_profile_ibfk_1` (`account_fkid`);

--
-- Indexes for table `tbl_queries`
--
ALTER TABLE `tbl_queries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_role`
--
ALTER TABLE `tbl_role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_service`
--
ALTER TABLE `tbl_service`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tbl_service_ibfk_1` (`profile_fkid`);

--
-- Indexes for table `tbl_startup_info`
--
ALTER TABLE `tbl_startup_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tbl_startup_info_ibfk_1` (`profile_fkid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_account`
--
ALTER TABLE `tbl_account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `tbl_comment`
--
ALTER TABLE `tbl_comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `tbl_community_post`
--
ALTER TABLE `tbl_community_post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `tbl_conversation`
--
ALTER TABLE `tbl_conversation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_engagement`
--
ALTER TABLE `tbl_engagement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `tbl_gallery`
--
ALTER TABLE `tbl_gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_home_content`
--
ALTER TABLE `tbl_home_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `tbl_log`
--
ALTER TABLE `tbl_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `tbl_login_session`
--
ALTER TABLE `tbl_login_session`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tbl_message`
--
ALTER TABLE `tbl_message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_profile`
--
ALTER TABLE `tbl_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `tbl_queries`
--
ALTER TABLE `tbl_queries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_role`
--
ALTER TABLE `tbl_role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_service`
--
ALTER TABLE `tbl_service`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_startup_info`
--
ALTER TABLE `tbl_startup_info`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_account`
--
ALTER TABLE `tbl_account`
  ADD CONSTRAINT `tbl_account_ibfk_1` FOREIGN KEY (`role_fkid`) REFERENCES `tbl_role` (`id`);

--
-- Constraints for table `tbl_comment`
--
ALTER TABLE `tbl_comment`
  ADD CONSTRAINT `tbl_comment_ibfk_1` FOREIGN KEY (`community_post_fkid`) REFERENCES `tbl_community_post` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_comment_ibfk_2` FOREIGN KEY (`account_fkid`) REFERENCES `tbl_account` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_comment_ibfk_3` FOREIGN KEY (`profile_fkid`) REFERENCES `tbl_profile` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_community_post`
--
ALTER TABLE `tbl_community_post`
  ADD CONSTRAINT `tbl_community_post_ibfk_1` FOREIGN KEY (`account_fkid`) REFERENCES `tbl_account` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_community_post_ibfk_2` FOREIGN KEY (`profile_fkid`) REFERENCES `tbl_profile` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_conversation`
--
ALTER TABLE `tbl_conversation`
  ADD CONSTRAINT `tbl_conversation_ibfk_1` FOREIGN KEY (`message_fkid`) REFERENCES `tbl_message` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_engagement`
--
ALTER TABLE `tbl_engagement`
  ADD CONSTRAINT `tbl_engagement_ibfk_1` FOREIGN KEY (`community_post_fkid`) REFERENCES `tbl_community_post` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_engagement_ibfk_2` FOREIGN KEY (`account_fkid`) REFERENCES `tbl_account` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_engagement_ibfk_3` FOREIGN KEY (`profile_fkid`) REFERENCES `tbl_profile` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_gallery`
--
ALTER TABLE `tbl_gallery`
  ADD CONSTRAINT `tbl_gallery_ibfk_1` FOREIGN KEY (`account_fkid`) REFERENCES `tbl_account` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_home_content`
--
ALTER TABLE `tbl_home_content`
  ADD CONSTRAINT `tbl_home_content_ibfk_1` FOREIGN KEY (`account_fkid`) REFERENCES `tbl_account` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_login_session`
--
ALTER TABLE `tbl_login_session`
  ADD CONSTRAINT `tbl_login_session_ibfk_1` FOREIGN KEY (`account_fkid`) REFERENCES `tbl_account` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_message`
--
ALTER TABLE `tbl_message`
  ADD CONSTRAINT `tbl_message_ibfk_1` FOREIGN KEY (`account_fkid_1`) REFERENCES `tbl_account` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_message_ibfk_2` FOREIGN KEY (`account_fkid_2`) REFERENCES `tbl_account` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_message_ibfk_3` FOREIGN KEY (`profile_fkid_1`) REFERENCES `tbl_profile` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_message_ibfk_4` FOREIGN KEY (`profile_fkid_2`) REFERENCES `tbl_profile` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_profile`
--
ALTER TABLE `tbl_profile`
  ADD CONSTRAINT `tbl_profile_ibfk_1` FOREIGN KEY (`account_fkid`) REFERENCES `tbl_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_service`
--
ALTER TABLE `tbl_service`
  ADD CONSTRAINT `tbl_service_ibfk_1` FOREIGN KEY (`profile_fkid`) REFERENCES `tbl_profile` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_startup_info`
--
ALTER TABLE `tbl_startup_info`
  ADD CONSTRAINT `tbl_startup_info_ibfk_1` FOREIGN KEY (`profile_fkid`) REFERENCES `tbl_profile` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
