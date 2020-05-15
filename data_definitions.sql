/*Artists Table*/

DROP TABLE IF EXISTS Artists;
    
CREATE TABLE Artists ( 
    artistID int AUTO_INCREMENT PRIMARY KEY,
    username varchar(25) NOT NULL UNIQUE,
    password varchar(25) NOT NULL,
    firstName varchar(25) NOT NULL,
    lastName varchar(25) NOT NULL,
    email varchar(255) NOT NULL,
    birthdate date,
    CONSTRAINT full_name UNIQUE (firstName, lastName)
);

INSERT INTO Artists (username, password, firstName, lastName, email, birthdate) VALUES 
    ('SteveJ45', 'password1', 'Steve', 'Johnson', 'SteveJ45@gmail.com', '1975-05-22'),
    ('KeatG', 'password2', 'George', 'Keating', 'georgekeat@gmail.com', '1976-09-13'),
    ('W W', 'asd123', 'Melissa', 'Baker', 'baker125@yahoo.com', '1995-10-05');


/*Artworks Table*/
DROP TABLE IF EXISTS Artworks;

CREATE TABLE Artworks ( 
    artworkID  int AUTO_INCREMENT PRIMARY KEY,
    artistID int,
    title varchar(25) NOT NULL,
    medium varchar(25) NOT NULL,
    material varchar(25) NOT NULL,
    description varchar(255) NOT NULL,
    url varchar(255) UNIQUE NOT NULL,
    rating int(11) NOT NULL DEFAULT (0),
    FOREIGN KEY (artistID) REFERENCES Artists(artistId)
);

INSERT INTO Artworks (artistID, title, medium, material, description, url) VALUES
    ((SELECT artistID FROM Artists WHERE username='W W'), 'Brown Wooden Planks', 'Abstract', 'Wood paint, fence wood', 'Painting done on separated fence pickets', 'https://images.pexels.com/photos/889839/pexels-photo-889839.jpeg'),
    ((SELECT artistID FROM Artists WHERE username='SteveJ45'), 'Blue, Orange, and White Abstract Painting', 'Abstract', 'Oil, paper canvas', '', 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg'),
    ((SELECT artistID FROM Artists WHERE username='KeatG'), 'Beach Wave', 'Photograph', 'none', 'Digitally enhanced photograph of a wave', 'https://images.pexels.com/photos/948331/pexels-photo-948331.jpeg');


/*Artworks_Events Table*/
DROP TABLE IF EXISTS Artworks_Events;

CREATE TABLE Artworks_Events (
    artworkID int,
    eventID int,
    FOREIGN KEY (artworkID) REFERENCES Artworks(artworkID)
);
/*Foreign key for eventID and this table's inserts left out until all data definitions are in one file*/
