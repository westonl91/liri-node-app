require("dotenv").config();
var keys = require("./keys.js");
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var search = process.argv.slice(3).join(" ");

function liri(com) {
    switch (com) {
        case "concert-this": concert(search);
            break;
        case "spotify-this-song": spot(search);
            break;
        case "movie-this": movie(search);
            break;
        case "do-what-it-says": doWhat();
            break;
        default: console.log("Please use one of these commands: ");
            console.log("concert-this");
            console.log("spotify-this-song");
            console.log("movie-this");
            console.log("do-what-it-says");
    }
}

function concert(sea) {
    if (sea !== "") {
        axios.get("https://rest.bandsintown.com/artists/" + sea + "/events?app_id=codingbootcamp").then(function (response) {
            if (response.data.length !== 0) {
                for (var i = 0; i < response.data.length; i++) {
                    var convertedDate = moment(response.data[i].datetime.slice(0, 10)).format("MM/DD/YYYY");
                    console.log("Venue:", response.data[i].venue.name);
                    console.log("Location:", response.data[i].venue.city + ", " + response.data[i].venue.region);
                    console.log("Date:", convertedDate);
                    console.log("======================================");
                    var info = "Venue: " + response.data[i].venue.name + "\n" + "Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + "\n" + "Date: " + convertedDate + "\n\n";
                    saveData(info);
                }
            } else {
                console.log("Sorry, no concerts could be found for that band.");
            }

        });
    } else {
        console.log("Please enter a band.");
    }
}

function spot(sea) {
    if (sea !== "") {
        spotify.search({ type: 'track', query: sea }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            for (var i = 0; i < data.tracks.items.length; i++) {
                console.log("Artist(s):", data.tracks.items[i].artists[0].name);
                console.log("Track name:", data.tracks.items[i].name);
                console.log("Spotify link:", data.tracks.items[i].external_urls.spotify);
                console.log("Album:", data.tracks.items[i].album.name);
                console.log("===========================================");
                var info = "Artist(s): " + data.tracks.items[i].artists[0].name + "\n" + "Track name: " + data.tracks.items[i].name + "\n" + "Album: " + data.tracks.items[i].album.name + "\n\n";
                saveData(info);
            }

        });
    } else {
        spotify.search({ type: 'track', query: 'The Sign' }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            console.log("Artist(s):", data.tracks.items[11].artists[0].name);
            console.log("Track name:", data.tracks.items[11].name);
            console.log("Spotify link:", data.tracks.items[11].external_urls.spotify);
            console.log("Album:", data.tracks.items[11].album.name);
            console.log("===========================================");
            var info = "Artist(s): " + data.tracks.items[11].artists[0].name + "\n" + "Track name: " + data.tracks.items[11].name + "\n" + "Album: " + data.tracks.items[11].album.name + "\n\n";
            saveData(info);
        });
    }

}

function movie(sea) {
    if (sea !== "") {
        axios.get("http://www.omdbapi.com/?t=" + sea + "&y=&plot=short&apikey=trilogy").then(
            function (response) {
                console.log("Title:", response.data.Title);
                console.log("Year:", response.data.Year);
                console.log("Imdb rating:", response.data.imdbRating);
                console.log("Rotten tomatoes rating:", response.data.Ratings[1].Value);
                console.log("Country:", response.data.Country);
                console.log("Language:", response.data.Language);
                console.log("Plot:", response.data.Plot);
                console.log("Actors:", response.data.Actors);
                var info = "Title: " + response.data.Title + "\nYear: " + response.data.Year + "\nImdb rating: " + response.data.imdbRating + "\nRotten tomatoes rating: " + response.data.Ratings[1].Value + "\nCountry: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors + "\n\n";
                saveData(info);
            }
        );
    } else {
        axios.get("http://www.omdbapi.com/?t=mr Nobody&y=&plot=short&apikey=trilogy").then(
            function (response) {
                console.log("Title:", response.data.Title);
                console.log("Year:", response.data.Year);
                console.log("Imdb rating:", response.data.imdbRating);
                console.log("Rotten tomatoes rating:", response.data.Ratings[1].Value);
                console.log("Country:", response.data.Country);
                console.log("Language:", response.data.Language);
                console.log("Plot:", response.data.Plot);
                console.log("Actors:", response.data.Actors);
                var info = "Title: " + response.data.Title + "\nYear: " + response.data.Year + "\nImdb rating: " + response.data.imdbRating + "\nRotten tomatoes rating: " + response.data.Ratings[1].Value + "\nCountry: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors + "\n\n";
                saveData(info);
            }
        );
    }
}

function doWhat() {
    var ran1 = (Math.floor(Math.random() * 3)) * 2;
    console.log(ran1);
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        if (ran1 === 0) {
            concert(dataArr[1]);
        } else if (ran1 === 2) {
            spot(dataArr[3]);
        } else if (ran1 === 4) {
            movie(dataArr[5]);
        }

    });

}

function saveData(data) {
    fs.appendFile("log.txt", data, function (err) {
        if (err) {
            console.log("something went wrong");
        }

    });
}

liri(command);