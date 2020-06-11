DROP TABLE IF EXISTS `Users`;

CREATE TABLE `Users` (
  `userID` int(11) AUTO_INCREMENT,
  `username` varchar(25) NOT NULL UNIQUE,
  `password` varchar(25) NOT NULL,
  `email` varchar(255) NOT NULL,
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
  `name` varchar(25) NOT NULL UNIQUE,
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

INSERT INTO Users_Events (userID, eventID) VALUES
	((SELECT Users.userID FROM Users WHERE Users.username='caspersv'),
     (SELECT Events.eventID FROM Events WHERE Events.name='Plaza Art Fair')),
    ((SELECT Users.userID FROM Users WHERE Users.username='caspersv'),
     (SELECT Events.eventID FROM Events WHERE Events.name='Bayou City Art Festival')),
    ((SELECT Users.userID FROM Users WHERE Users.username='caspersv'),
     (SELECT Events.eventID FROM Events WHERE Events.name='Art Fair Nashville')),
    ((SELECT Users.userID FROM Users WHERE Users.username='qmoore30'),
     (SELECT Events.eventID FROM Events WHERE Events.name='Art Fair Nashville')),
    ((SELECT Users.userID FROM Users WHERE Users.username='alorTay1'),
     (SELECT Events.eventID FROM Events WHERE Events.name='Plaza Art Fair'));

/*Artists Table*/

DROP TABLE IF EXISTS `Artists`;
    
CREATE TABLE `Artists` ( 
    `artistID` int(11) AUTO_INCREMENT PRIMARY KEY,
    `username` varchar(25) NOT NULL UNIQUE,
    `password` varchar(25) NOT NULL,
    `firstName` varchar(25) NOT NULL,
    `lastName` varchar(25) NOT NULL,
    `email` varchar(255) NOT NULL,
    `birthdate` date,
    CONSTRAINT `full_name` UNIQUE (`firstName`, `lastName`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO Artists (username, password, firstName, lastName, email, birthdate) VALUES 
    ('SteveJ45', 'password1', 'Steve', 'Johnson', 'SteveJ45@gmail.com', '1975-05-22'),
    ('KeatG', 'password2', 'George', 'Keating', 'georgekeat@gmail.com', '1976-09-13'),
    ('W W', 'asd123', 'Melissa', 'Baker', 'baker125@yahoo.com', '1995-10-05'),
    ('aLamorea', 'password6', 'Amber', 'Lamoreaux', 'alamor@gmail.com', '1985-08-17');

/*Artworks Table*/
DROP TABLE IF EXISTS `Artworks`;

CREATE TABLE `Artworks` ( 
    `artworkID` int(11) AUTO_INCREMENT,
    `artistID` int(11),
    `title` varchar(255) NOT NULL,
    `medium` varchar(25) NOT NULL,
    `material` varchar(25) NOT NULL,
    `description` varchar(255) NOT NULL,
    `url` varchar(255) UNIQUE NOT NULL,
    PRIMARY KEY (`artworkID`),
    CONSTRAINT FOREIGN KEY (`artistID`) REFERENCES Artists(`artistID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO Artworks (artistID, title, medium, material, description, url) VALUES
    ((SELECT artistID FROM Artists WHERE username='W W'), 'Brown Wooden Planks', 'Abstract', 'Wood paint, fence wood', 'Painting done on separated fence pickets', '/uploads/pexels-photo-889839.jpeg'),
    ((SELECT artistID FROM Artists WHERE username='SteveJ45'), 'Blue, Orange, and White Abstract Painting', 'Abstract', 'Oil, paper canvas', 'Abstract oil paint on canvas', '/uploads/pexels-photo-1183992.jpeg'),
    ((SELECT artistID FROM Artists WHERE username='SteveJ45'), 'Multicolored', 'Abstract', 'Acrylic, paper canvas', 'Abstract acrylic on canvas', '/uploads/file-1590943729906.jpeg'),
    ((SELECT artistID FROM Artists WHERE username='KeatG'), 'Beach Wave', 'Photograph', 'none', 'Digitally enhanced photograph of a wave', '/uploads/pexels-photo-948331.jpeg'),
    ((SELECT artistID FROM Artists WHERE username='aLamorea'), 'Teal', 'Painting', 'Watercolor', 'Abstract watercolor on canvas', '/uploads/green-and-purple-illustration-2051004.jpg'),
    ((SELECT artistID FROM Artists WHERE username='aLamorea'), 'RBG', 'Painting', 'Watercolor', 'Abstract watercolor on canvas', '/uploads/multicolored-abstract-art-2065820.jpg'),
    ((SELECT artistID FROM Artists WHERE username='aLamorea'), 'Splash', 'Painting', 'Watercolor', 'Abstract watercolor on canvas', '/uploads/purple-and-teal-splash-painting-2068898.jpg'),
    ((SELECT artistID FROM Artists WHERE username='aLamorea'), 'Liquify', 'Painting', 'Watercolor', 'Abstract watercolor on canvas', '/uploads/multicolored-abstract-painting-1095624.jpg');

CREATE TABLE `Artworks_Events` (
    `artworkID` int(11) NOT NULL,
    `eventID` int(11) NOT NULL,
    PRIMARY KEY (`artworkID`, `eventID`),
    CONSTRAINT FOREIGN KEY (`artworkID`) REFERENCES Artworks(`artworkID`),
    CONSTRAINT FOREIGN KEY (`eventID`) REFERENCES Events(`eventID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO Artworks_Events (artworkID, eventID) VALUES
    (1,(SELECT Events.eventID FROM Events WHERE Events.name='Plaza Art Fair')),
    (1,(SELECT Events.eventID FROM Events WHERE Events.name='Art Fair Nashville')),
    (1,(SELECT Events.eventID FROM Events WHERE Events.name='Bayou City Art Festival')),
    (2,(SELECT Events.eventID FROM Events WHERE Events.name='Plaza Art Fair')),
    (2,(SELECT Events.eventID FROM Events WHERE Events.name='Art Fair Nashville')),
    (2,(SELECT Events.eventID FROM Events WHERE Events.name='Bayou City Art Festival')),
    (3,(SELECT Events.eventID FROM Events WHERE Events.name='Plaza Art Fair')),
    (3,(SELECT Events.eventID FROM Events WHERE Events.name='Art Fair Nashville')),
    (3,(SELECT Events.eventID FROM Events WHERE Events.name='Bayou City Art Festival')),
    (4,(SELECT Events.eventID FROM Events WHERE Events.name='Plaza Art Fair')),
    (5,(SELECT Events.eventID FROM Events WHERE Events.name='Art Fair Nashville')),
    (6,(SELECT Events.eventID FROM Events WHERE Events.name='Art Fair Nashville')),
    (7,(SELECT Events.eventID FROM Events WHERE Events.name='Bayou City Art Festival')),
    (8,(SELECT Events.eventID FROM Events WHERE Events.name='Art Fair Nashville'));