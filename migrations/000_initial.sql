CREATE TABLE IF NOT EXISTS `users` (
  `id` INTEGER NOT NULL auto_increment,
  `netid` VARCHAR(255) NOT NULL UNIQUE,
  `universityName` VARCHAR(255),
  `preferredName` VARCHAR(255),
  `isAdmin` TINYINT(1) DEFAULT false,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  UNIQUE `users_netid_unique` (`netid`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `courses` (
  `id` INTEGER NOT NULL auto_increment,
  `name` VARCHAR(255),
  `shortcode` VARCHAR(255),
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `queues` (
  `id` INTEGER NOT NULL auto_increment,
  `name` TEXT,
  `location` TEXT,
  `startTime` DATETIME,
  `endTime` DATETIME,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  `deletedAt` DATETIME,
  `courseId` INTEGER,
  `createdByUserId` INTEGER,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`createdByUserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `activeStaff` (
  `id` INTEGER NOT NULL auto_increment,
  `startTime` DATETIME,
  `endTime` DATETIME,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  `userId` INTEGER,
  `queueId` INTEGER,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`queueId`) REFERENCES `queues` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `courseStaff` (
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  `courseId` INTEGER,
  `userId` INTEGER,
  PRIMARY KEY (`courseId`, `userId`),
  FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `questions` (
  `id` INTEGER NOT NULL auto_increment ,
  `name` TEXT,
  `location` TEXT,
  `topic` TEXT,
  `beingAnswered` TINYINT(1) DEFAULT false,
  `answerStartTime` DATETIME,
  `answerFinishTime` DATETIME,
  `enqueueTime` DATETIME,
  `dequeueTime` DATETIME,
  `comments` TEXT,
  `preparedness` ENUM('not', 'average', 'well'),
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  `deletedAt` DATETIME,
  `queueId` INTEGER,
  `askedById` INTEGER,
  `answeredById` INTEGER,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`queueId`) REFERENCES `queues` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`askedById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`answeredById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;
