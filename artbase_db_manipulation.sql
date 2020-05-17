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
SELECT name 
FROM Events 
ORDER BY name ASC;

-- get all events for an artwork for image-user and image-artist pages
SELECT CONCAT(a.firstName, ' ', a.lastName) AS artistName, e.name, aw.url, aw.title, aw.medium, aw.material, aw.description, DATE_FORMAT(e.startDate, '%a %b %e %Y') AS startDate, DATE_FORMAT(e.endDate, '%a %b %e %Y') AS endDate, e.time, e.location, e.city, e.state, e.zipCode
FROM Artworks_Events ae
LEFT JOIN Events e on e.eventID = ae.eventID
LEFT JOIN Artworks aw on aw.artworkID = ae.artworkID
LEFT JOIN Artists a on a.artistID = aw.artistID)
WHERE ae.artworkID = :artworkID
ORDER BY date(startDate) ASC;

-- Users table queries
-- add new user
INSERT INTO Users (username, password, email, birthdate) 
VALUES (:username_input, :password_input, :email_input, :birthdate_input);

-- Users_Events table queries
-- associate an event to a user
INSERT INTO Users_Events (userID, eventID)
VALUES (:userID, :eventID);

-- get all events a user is attending
SELECT e.name, DATE_FORMAT(e.startDate, '%a %b %e %Y') AS startDate, DATE_FORMAT(e.endDate, '%a %b %e %Y') AS endDate, e.time, e.location, e.city, e.state, e.zipCode
FROM Events e 
INNER JOIN Users_Events u on u.eventID = e.eventID 
WHERE userID = :userID
ORDER BY date(startDate) ASC;

-- disassociate an event from a user
DELETE FROM Users_Events WHERE userID = :uid_from_selected_users_and_events_list AND eventID = :eid_from_selected_users_and_events_list;



