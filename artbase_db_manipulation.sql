-- Data manipulation queries for Artbase project with colon : character being used to 
-- denote the variables that will have data from the backend programming language

-- Events table queries
-- add new event
INSERT INTO Events (name, startDate, endDate, time, location, city, state, zipCode) 
VALUES (:name_input, :startDate_input, :endDate_input, :time_input, :location_input, :city_input, :state_input, :zipCode_input);

-- get data for one event for update-event form
SELECT eventID, name, DATE_FORMAT(startDate, '%Y-%m-%d') startDate, DATE_FORMAT(endDate, '%Y-%m-%d') endDate, time, location, city, state, zipCode 
FROM Events 
WHERE eventID=:eventID_table_row;

-- edit an event
UPDATE Events 
SET name=:name_input, startDate=:startDate_input, endDate=:endDate_input, time=:time_input, location=:location_input, city=:city_input, state=:state_input, zipCode=:zipCode_input
WHERE eventID=:eventID_table_row;

-- get all events to populate Events table
SELECT eventID, name, DATE_FORMAT(startDate, '%a %b %e %Y') startDate, DATE_FORMAT(endDate, '%a %b %e %Y') endDate, TIME_FORMAT(time, '%h %i %p') time, location, city, state, zipCode 
FROM Events 
ORDER BY date(startDate) ASC;

-- search for events
SELECT eventID, name, DATE_FORMAT(startDate, '%a %b %e %Y') startDate, DATE_FORMAT(endDate, '%a %b %e %Y') endDate, TIME_FORMAT(time, '%h %i %p') time, location, city, state, zipCode 
FROM Events 
WHERE name 
LIKE % + :searchedEvents_input + %;

-- get all events to populate events dropdown for associating an artwork to an event
SELECT name, eventID 
FROM Events 
ORDER BY name ASC;

-- get all events for an artwork for image-user and image-artist pages
SELECT CONCAT(a.firstName, ' ', a.lastName) AS artistName, e.name, aw.url, aw.title, aw.medium, aw.material, aw.description, DATE_FORMAT(e.startDate, '%a %b %e %Y') AS startDate, DATE_FORMAT(e.endDate, '%a %b %e %Y') AS endDate, TIME_FORMAT(e.time, '%h %i %p') AS time, e.location, e.city, e.state, e.zipCode
FROM Artworks_Events ae
LEFT JOIN Events e on e.eventID = ae.eventID
LEFT JOIN Artworks aw on aw.artworkID = ae.artworkID
LEFT JOIN Artists a on a.artistID = aw.artistID
WHERE ae.artworkID = :artworkID
ORDER BY date(startDate) ASC;

-- Users table queries
-- Sign up new user
INSERT INTO Users (username, password, email, birthdate) 
VALUES (:username_input, :password_input, :email_input, :birthdate_input);

-- Login as user
SELECT * FROM Users WHERE username=:username_from_user_login_form, AND password=:password_from_user_login_form;

-- get user info
SELECT username FROM Users WHERE userID=:userID;

-- Users_Events table queries
-- associate an event to a user
INSERT INTO Users_Events (userID, eventID) VALUES
	((SELECT Users.userID FROM Users WHERE Users.username=:sessions_username),
     (SELECT Events.eventID FROM Events WHERE Events.name=:event_input));

-- get all events a user is attending
SELECT e.name, DATE_FORMAT(e.startDate, '%a %b %e %Y') AS startDate, DATE_FORMAT(e.endDate, '%a %b %e %Y') AS endDate, TIME_FORMAT(e.time, '%h %i %p') AS time, e.location, e.city, e.state, e.zipCode
    FROM Events e 
    RIGHT JOIN Users_Events ue ON ue.eventID = e.eventID
    RIGHT JOIN Users u ON u.userID = ue.userID
    WHERE u.userID = :userID 
    ORDER BY date(startDate) ASC;

-- disassociate an event from a user
DELETE FROM Users_Events WHERE userID = :uid_from_selected_users_and_events_list AND eventID = :eid_from_selected_users_and_events_list;

-- Artist table queries
-- Sign up new artist
INSERT INTO Artists (username, password, firstName, lastName, email, birthdate) VALUES 
    (:username_input, :password_input, :firstName_input, :lastName_input, :email_input, :birthdate_input);

-- Login as artist
SELECT * FROM Artists WHERE username=:username_from_artist_login_form, AND password=:password_from_artist_login_form;

-- Artworks table queries
-- Search artworks from searchbar on navbar
SELECT * FROM Artworks
	JOIN (SELECT Artists.artistID, Artists.username, CONCAT(Artists.firstName, ' ', Artists.lastName) AS artistName FROM Artists) AS fn ON fn.artistID=Artworks.artistID
    WHERE fn.artistName LIKE '%:search_input%'
    OR title LIKE '%:search_input%'
    OR medium LIKE '%:search_input%'
    OR material LIKE '%:search_input%'
    OR description LIKE '%:search_input%'
    LIMIT 20;

-- get information for an artist
SELECT CONCAT(firstName, ' ', lastName) AS artistName FROM Artists WHERE artistID=:artistID

-- get all artworks for an artist for artist-portfolio page
SELECT artworkID as id, Artworks.artistID, title, url, CONCAT(firstName, ' ', lastName) AS artistName
    FROM Artworks
    LEFT JOIN Artists on Artists.artistID = Artworks.artistID
    WHERE Artworks.artistID=:route_id; 

-- get the artwork and artist for the image-artist page
SELECT CONCAT(a.firstName, ' ', a.lastName) AS artistName, a.username, a.artistID, aw.artworkID, aw.url, aw.title, aw.medium, aw.material, aw.description 
    FROM Artworks_Events ae 
    LEFT JOIN Artworks aw on aw.artworkID = ae.artworkID 
    LEFT JOIN Artists a on a.artistID = aw.artistID 
    WHERE ae.artworkID = :route_id;

-- Discover page artwork display
SELECT artworkID, title, url, Artworks.artistID, CONCAT(firstName, ' ', lastName) AS artistName 
FROM Artworks 
JOIN Artists ON Artists.artistID = Artworks.artistID

-- Upload Artwork
INSERT INTO Artworks (artistID, title, medium, material, description, url) VALUES 
    (:session_artistID, :title_input, :madium_input, :material_input, :description_input, :url_input);
INSERT INTO Artworks_Events (artworkID, eventID) VALUES
	((SELECT Artworks.artworkID FROM Artworks
	    LEFT JOIN Artists ON Artworks.artistID=Artists.artistID
        WHERE Artists.username=:sessions_username AND Artworks.url=:new_artwork_url),
     (SELECT Events.eventID FROM Events WHERE Events.eventID=:event_input));

-- Artworks_Events table queries
-- Disassociate artwork from event
DELETE FROM Artworks_Events WHERE artworkID=:selected_artwork AND eventID=:selected_event;