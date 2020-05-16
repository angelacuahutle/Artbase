DROP TABLE IF EXISTS `Users`;

CREATE TABLE `Users` (
  `userID` int(11) AUTO_INCREMENT,
  `username` varchar(25) NOT NULL,
  `password` varchar(25) NOT NULL,
  `email` varchar(25) NOT NULL,
  `birthdate` date,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO Users (username, password, email, birthdate) 
VALUES 	('alorTay1',  'passwrd1', 'alorTay1@gmail.com', '1980-03-25'),
		('qmoore30', 'passwrd2', 'qmoore30@gmail.com', '1990-02-12'),
		('caspersv', 'passwrd3', 'caspersv@gmail.com', '1992-12-03');

DROP TABLE IF EXISTS `Events`;

CREATE TABLE `Events` (
  `eventID` int(11) AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `time` time NOT NULL,
  `location` varchar(100) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(2) NOT NULL,
  `zipCode` varchar(5) NOT NULL,
  PRIMARY KEY (`eventID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO Events (name, startDate, endDate, time, location, city, state, zipCode) 
VALUES 	('Plaza Art Fair', '2020-09-25', '2020-09-27', '10:00:00', 'Country Club Plaza', 'Kansas City', 'MO', '64112'),
		('Bayou City Art Festival', '2020-10-10', '2020-10-11', '10:00:00', '6501 Memorial Dr.', 'Houston', 'TX', '77007'),
		('Art Fair Nashville', '2020-08-28', '2020-08-29', '10:30:00', 'Vanderbilt University', 'Nashville', 'TN', '37212');


DROP TABLE IF EXISTS `Users_Events`;

CREATE TABLE `Users_Events` (
  `userID` int(11) NOT NULL,
  `eventID` int(11) NOT NULL,
  PRIMARY KEY (`userId`, `eventID`),
  CONSTRAINT FOREIGN KEY (`userID`) REFERENCES Users (`userID`),
  CONSTRAINT FOREIGN KEY (`eventID`) REFERENCES Events (`eventID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

