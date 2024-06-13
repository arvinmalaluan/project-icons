CREATE DATABASE icons;
USE icons;

CREATE TABLE `tbl_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `tbl_account` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isVerified` tinyint(1) DEFAULT '0',
  `role_fkid` int NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'allowed',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`role_fkid`) REFERENCES `tbl_role`(`id`)
);

CREATE TABLE `tbl_profile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `photo` longtext,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `account_fkid` int NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`account_fkid`) REFERENCES `tbl_account`(`id`)
);

CREATE TABLE `tbl_gallery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `image` longtext,
  `description` mediumtext,
  `account_fkid` int NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`account_fkid`) REFERENCES `tbl_account`(`id`)
);

CREATE TABLE `tbl_home_content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `image` longtext NOT NULL,
  `views` int DEFAULT '0',
  `account_fkid` int DEFAULT NULL,
  `status` varchar(100) NOT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`account_fkid`) REFERENCES `tbl_account`(`id`)
);

CREATE TABLE `tbl_community_post` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` mediumtext NOT NULL,
  `image` longtext,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `account_fkid` int NOT NULL,
  `profile_fkid` int NOT NULL,
  `views` int DEFAULT '0',
  `author` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`account_fkid`) REFERENCES `tbl_account`(`id`),
  FOREIGN KEY (`profile_fkid`) REFERENCES `tbl_profile`(`id`)
);

CREATE TABLE `tbl_comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comment` mediumtext,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `image` longtext,
  `community_post_fkid` int NOT NULL,
  `account_fkid` int NOT NULL,
  `profile_fkid` int NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`community_post_fkid`) REFERENCES `tbl_community_post`(`id`),
  FOREIGN KEY (`account_fkid`) REFERENCES `tbl_account`(`id`),
  FOREIGN KEY (`profile_fkid`) REFERENCES `tbl_profile`(`id`)
);

CREATE TABLE `tbl_engagement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `is_liked` tinyint(1) NOT NULL,
  `is_disliked` tinyint(1) NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `image` longtext,
  `community_post_fkid` int NOT NULL,
  `account_fkid` int NOT NULL,
  `profile_fkid` int NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`community_post_fkid`) REFERENCES `tbl_community_post`(`id`),
  FOREIGN KEY (`account_fkid`) REFERENCES `tbl_account`(`id`),
  FOREIGN KEY (`profile_fkid`) REFERENCES `tbl_profile`(`id`)
);

CREATE TABLE `tbl_message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room` varchar(255) NOT NULL UNIQUE,
  `timestamp` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `account_fkid_1` int NOT NULL,
  `account_fkid_2` int NOT NULL,
  `profile_fkid_1` int,
  `profile_fkid_2` int,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`account_fkid_1`) REFERENCES `tbl_account`(`id`),
  FOREIGN KEY (`account_fkid_2`) REFERENCES `tbl_account`(`id`),
  FOREIGN KEY (`profile_fkid_1`) REFERENCES `tbl_profile`(`id`),
  FOREIGN KEY (`profile_fkid_2`) REFERENCES `tbl_profile`(`id`)
);

CREATE TABLE `tbl_conversation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message_content` varchar(8000) NOT NULL,
  `image` longblob NOT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `message_fkid` int NOT NULL,
  `sender` int NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`message_fkid`) REFERENCES `tbl_message`(`id`)
);

CREATE TABLE `tbl_service` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name_of_service` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `profile_fkid` int NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`profile_fkid`) REFERENCES `tbl_profile`(`id`)
);

CREATE TABLE `tbl_startup_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` mediumtext NOT NULL,
  `link` varchar(255) NOT NULL,
  `title` mediumtext NOT NULL,
  `profile_fkid` int NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`profile_fkid`) REFERENCES `tbl_profile`(`id`)
);

CREATE TABLE `tbl_hidden_posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hidden_posts` text NOT NULL,
  `profile_fkid` int NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `account_fkid` int NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`account_fkid`) REFERENCES `tbl_account`(`id`)
);

CREATE TABLE `tbl_newsletter` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` mediumtext NOT NULL,
  `link` varchar(255) NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `tbl_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page` int DEFAULT '0',
  `times_clicked` int DEFAULT '0',
  `duration` int DEFAULT '0',
  `modification_made` int DEFAULT '0',
  `keys_pressed` int DEFAULT '0',
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `account_fkid` int NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`account_fkid`) REFERENCES `tbl_account`(`id`)
);

CREATE TABLE `tbl_login_session` (
  `id` int NOT NULL AUTO_INCREMENT,
  `login_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `account_fkid` int NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`account_fkid`) REFERENCES `tbl_account`(`id`)
);

CREATE TABLE `tbl_queries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender` varchar(255) NOT NULL,
  `subject` mediumtext NOT NULL,
  `content` longtext NOT NULL,
  `query_status` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `tbl_role` (`role`) VALUES ('admin');
INSERT INTO `tbl_role` (`role`) VALUES ('startup');
INSERT INTO `tbl_role` (`role`) VALUES ('partner');
INSERT INTO `tbl_role` (`role`) VALUES ('content_manager');

INSERT INTO `tbl_account` VALUES (1,'admin@gmail.com','admin','$2b$10$KPxehGeFDbd/WY7GzcQjFuhNnzcNitxc9UfIxHg2yGyZk74Vc..By','2024-04-30 01:12:29','2024-04-30 01:14:09',1,1,'allowed');
INSERT INTO `tbl_profile` VALUES (1,'Center for Technopreneurship and Innovation','admin','Batangas City',NULL,'2024-05-02 02:03:08','2024-05-02 02:03:08',1);