-- Data manipulation queries for Artbase project with colon : character being used to 
-- denote the variables that will have data from the backend programming language

-- Events table queries
-- get all events to populate Events table DONE
SELECT eventID, name, DATE_FORMAT(startDate, '%a %b %e %Y') startDate, DATE_FORMAT(endDate, '%a %b %e %Y') endDate, TIME_FORMAT(time, '%h %i %p') time, location, city, state, zipCode 
    FROM Events 
    ORDER BY date(startDate) ASC;

-- get data for one event for update-event form DONE
SELECT eventID, name, DATE_FORMAT(startDate, '%Y-%m-%d') startDate, DATE_FORMAT(endDate, '%Y-%m-%d') endDate, time, location, city, state, zipCode 
    FROM Events 
    WHERE eventID=:eventID_table_row;

-- search for events by name DONE
SELECT eventID, name, DATE_FORMAT(startDate, '%a %b %e %Y') startDate, DATE_FORMAT(endDate, '%a %b %e %Y') endDate, TIME_FORMAT(time, '%h %i %p') time, location, city, state, zipCode 
    FROM Events 
    WHERE name 
    LIKE % + :searchedEvents_input + %;

-- add new event DONE
INSERT INTO Events (name, startDate, endDate, time, location, city, state, zipCode) 
    VALUES (:name_input, :startDate_input, :endDate_input, :time_input, :location_input, :city_input, :state_input, :zipCode_input);

-- edit an event DONE
UPDATE Events 
    SET name=:name_input, startDate=:startDate_input, endDate=:endDate_input, time=:time_input, location=:location_input, city=:city_input, state=:state_input, zipCode=:zipCode_input
    WHERE eventID=:eventID_table_row;

-- get all events to populate events dropdown for associating an artwork to an event DONE
SELECT name, eventID 
    FROM Events 
    ORDER BY name ASC;

-- Artworks_Events table queries
-- add new event to artwork DONE
INSERT INTO Artworks_Events (artworkID, eventID) VALUES 
    ((SELECT Artworks.artworkID
    FROM Artworks
    LEFT JOIN Artists ON Artworks.artistID=Artists.artistID
    WHERE Artists.username=:sessions_username AND Artworks.url=:artwork_url)
    (SELECT Events.eventID FROM Events WHERE Events.eventID=:eventID));

-- get all events for an artwork for image-user pages DONE
SELECT ae.artworkID AS id, ae.eventID, e.name, aw.url, aw.title, aw.medium, aw.material, aw.description, DATE_FORMAT(e.startDate, '%a %b %e %Y') AS startDate, DATE_FORMAT(e.endDate, '%a %b %e %Y') AS endDate, TIME_FORMAT(e.time, '%h %i %p') AS time, e.location, e.city, e.state, e.zipCode
    FROM Artworks_Events ae
    LEFT JOIN Events e ON e.eventID = ae.eventID
    LEFT JOIN Artworks aw ON aw.artworkID = ae.artworkID
    LEFT JOIN Artists a ON a.artistID = aw.artistID
    WHERE ae.artworkID = :artworkID
    ORDER BY date(startDate) ASC;

-- get all events for an artwork for image-artist page DONE
SELECT ae.artworkID AS aid, ae.eventID AS eid, CONCAT(a.firstName, ' ', a.lastName) AS artistName, e.name, aw.url, aw.title, aw.medium, aw.material, aw.description, DATE_FORMAT(e.startDate, '%a %b %e %Y') AS startDate, DATE_FORMAT(e.endDate, '%a %b %e %Y') AS endDate, TIME_FORMAT(e.time, '%h %i %p') AS time, e.location, e.city, e.state, e.zipCode
    FROM Artworks_Events ae
    LEFT JOIN Events e on e.eventID = ae.eventID
    LEFT JOIN Artworks aw on aw.artworkID = ae.artworkID
    LEFT JOIN Artists a on a.artistID = aw.artistID
    WHERE aw.artworkID=:artworkID
    ORDER BY date(startDate) ASC;

-- Disassociate artwork from event DONE
DELETE FROM Artworks_Events WHERE artworkID=:selected_artwork AND eventID=:selected_event;

-- Users table queries
-- Sign up new user DONE
INSERT INTO Users (username, password, email, birthdate) 
    VALUES (:username_input, :password_input, :email_input, :birthdate_input);

-- Login as user DONE
SELECT * FROM Users WHERE username=:username_from_user_login_form, AND password=:password_from_user_login_form;

-- get user info DONE
SELECT username FROM Users WHERE userID=:userID;

-- Users_Events table queries
-- associate user to an event DONE
INSERT INTO Users_Events (userID, eventID) VALUES
	((SELECT Users.userID FROM Users WHERE Users.userID==:sessions_userID),
     (SELECT Events.eventID FROM Events WHERE Events.eventID=:event_input));

-- get all events a user is attending DONE
SELECT ue.eventID AS eid, ue.userID AS uid, e.name, DATE_FORMAT(e.startDate, '%a %b %e %Y') AS startDate, DATE_FORMAT(e.endDate, '%a %b %e %Y') AS endDate, TIME_FORMAT(e.time, '%h %i %p') AS time, e.location, e.city, e.state, e.zipCode
    FROM Events e 
    RIGHT JOIN Users_Events ue ON ue.eventID = e.eventID
    RIGHT JOIN Users u ON u.userID = ue.userID
    WHERE u.userID = :userID 
    ORDER BY date(startDate) ASC;

-- disassociate an event from a user DONE
DELETE FROM Users_Events WHERE userID = :uid_from_selected_users_and_events_list AND eventID = :eid_from_selected_users_and_events_list;

-- Artist table queries
-- Sign up new artist DONE
INSERT INTO Artists (username, firstName, lastName, password, email, birthdate) VALUES 
    (:username_input, :firstName_input, :lastName_input, :password_input, :email_input, :birthdate_input);

-- Login as artist DONE
SELECT * FROM Artists WHERE username=:username_from_artist_login_form, AND password=:password_from_artist_login_form;

-- get artist information for artist-portfolio page DONE
SELECT CONCAT(firstName, ' ', lastName) AS artistName, artistID FROM Artists WHERE artistID=:artistID

-- Artworks table queries
-- Search artworks from searchbar on navbar DONE 
SELECT * FROM Artworks
	JOIN (SELECT Artists.artistID, Artists.username, CONCAT(Artists.firstName, ' ', Artists.lastName) AS artistName FROM Artists) AS fn ON fn.artistID=Artworks.artistID
    WHERE fn.artistName LIKE '%:search_input%'
    OR title LIKE '%:search_input%'
    OR medium LIKE '%:search_input%'
    OR material LIKE '%:search_input%'
    OR description LIKE '%:search_input%'
    LIMIT 20;

-- get all artworks for an artist for artist-portfolio page DONE
SELECT artworkID as id, Artworks.artistID, title, url, CONCAT(firstName, ' ', lastName) AS artistName
    FROM Artworks
    LEFT JOIN Artists on Artists.artistID = Artworks.artistID
    WHERE Artworks.artistID=:route_id; 

-- get the artwork and artist for the image-user page DONE
SELECT CONCAT(firstName, ' ', lastName) AS artistName, artworkID AS id, Artists.artistID, title, medium, material, description, url 
    FROM Artworks 
    INNER JOIN Artists ON Artists.artistID = Artworks.artistID 
    WHERE artworkID = :route_id;

-- get the artwork and artist for the image-artist page DONE
SELECT CONCAT(a.firstName, ' ', a.lastName) AS artistName, a.username, a.artistID, aw.artworkID, aw.url, aw.title, aw.medium, aw.material, aw.description
    FROM Artworks aw
    LEFT JOIN Artists a ON a.artistID = aw.artistID
    WHERE aw.artworkID = :route_id;

-- Homepage/Discover page artwork display DONE
SELECT artworkID, title, url, Artworks.artistID, CONCAT(firstName, ' ', lastName) AS artistName 
    FROM Artworks 
    JOIN Artists ON Artists.artistID = Artworks.artistID

-- Upload Artwork DONE
INSERT INTO Artworks (artistID, title, medium, material, description, url) VALUES 
    (:session_artistID, :title_input, :madium_input, :material_input, :description_input, :url_input);
INSERT INTO Artworks_Events (artworkID, eventID) VALUES
	((SELECT Artworks.artworkID FROM Artworks
	    LEFT JOIN Artists ON Artworks.artistID=Artists.artistID
        WHERE Artists.username=:sessions_username AND Artworks.url=:new_artwork_url),
     (SELECT Events.eventID FROM Events WHERE Events.eventID=:event_input));

