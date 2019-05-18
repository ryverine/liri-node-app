var Spotify = require('node-spotify-api');

var fs = require("fs");

var moment = require('moment');

var divider = "------------------------------";

var SPOTIFY = function()
{
    this.spotifySearch = function(theSearchValue)
    {
        if(theSearchValue.length < 1)
        {
            theSearchValue = "the sign";
        }
    
        var logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " Searching Spotify for: " + theSearchValue;
        
        updateLog(logData);
    
        var clientID = "5f3d3e3bff894ca09140905e231cd6a9";
        var clientSecret = "84b4aa0d6817413ba45a338ab8bd75f0";
    
        var spotify = new Spotify({
            id: clientID,
            secret: clientSecret
        });
    
        spotify.search({ type: 'track', query: theSearchValue}, function(error, data) 
        {
            if (error) 
            {
                logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + "LIRI encountered an error with this Spotify request.";
                updateLog(logData);
                return console.log('Error occurred: ' + error);
            }
            else
            {
                logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + "LIRI Spotify search was succcessful.";
    
                var item = data.tracks.items[0];
                console.log(divider);
                console.log("Song: " + item.name);
                console.log("Artist: " + item.album.artists[0].name);
                console.log("Album: " + item.album.name);
                console.log("Preview: " + item.preview_url);
                console.log(divider);
            }
        });

        //setTimeout(continueLIRI, 3000);     
    };
}


function updateLog(content) 
{
    // do not want to use ", " as delimiter
    fs.appendFile("log.txt", content, function(error) 
    {
        if (error)
        {
            var logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " LIRI encounted error writing to random.txt.";
            updateLog(logData);
            return console.log("Error updating log file: " + "\n" + error);
        }
    });
}




module.exports = SPOTIFY;