require("dotenv").config();

var keys = require("./keys.js");

var fs = require("fs");

var inquirer = require("inquirer");

var Spotify = require('node-spotify-api');

var axios = require("axios");

// http://momentjs.com/docs/

var moment = require('moment');

//You should then be able to access your keys information like so
// var spotify = new Spotify(keys.spotify);

// Does LOG file exist?
// https://stackoverflow.com/questions/4482686/check-synchronously-if-file-directory-exists-in-node-js
if (fs.existsSync("log.txt")) 
{
    var logData =  "\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " LIRI Bot Activated";
    updateLog(logData);
}
else
{
    initializeLog();
}


startLIRI();


function startLIRI()
{
    inquirer.prompt([
    {
        type: "list",
        message: "What action:",
        choices: [  "Concert This Band",
                    "Spotify This Song",
                    "OMDB This Movie",
                    "Let LIRI Decide"],
        name: "action"
    },
    {
        type: "input",
        message: "What are you searching for?",
        name: "value"
    }
    ]).then(function(inquirerResponse) 
    {
        var action = inquirerResponse.action.toLowerCase();
        var value = inquirerResponse.value.trim();

        switch(action) 
        {
            case "concert this band":
                bitSearch(value);
                break;
            case "spotify this song":
                spotifySearch(value);
                break;
            case "omdb this movie":
                omdbSearch(value);
                break;
            case "let liri decide":
                letLIRIDecide(value);
                break;
            default:
                console.log("Cannot process " + inquirerResponse.action + '!');
        }

        // may need to have search functions return a value once 
        // api calls have completed to ensure this does not happen 
        // before data is added to command line
        // continue();
    });
}


function continueLIRI()
{
    inquirer.prompt([
    {
        type: "confirm",
        message: "Do you have another request for LIRI?",
        name: "confirm",
        default: true
    }
    ]).then(function(inquirerResponse) 
    {
        if(inquirerResponse.confirm)
        {
            startLIRI();
        }
        else
        {
            console.log("LIRI is shutting down...");

            var logData =  "\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " LIRI Bot Deactivated";
            updateLog(logData);

            setTimeout(closeLIRI, 2000);
        }
    });
}


function closeLIRI()
{
    console.log("If you are ever in need, LIRI will be here for you.")
    console.log("Goodbye for now!")
}


function spotifySearch(theSearchValue)
{
    var logData = "";

    if(theSearchValue.length > 0)
    {
        logData =  "\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + "";
    }
    else
    {
        console.log("" + theSearchValue);
        logData =  "\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + "User did not provide song for LIRI to search Spotify. LIRI searched for 'The Sign' by Ace of Base.";

        theSearchValue = 'the sign';
    }
    
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
            logData =  "\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + "LIRI encountered an error with this Spotify request.";
            updateLog(logData);
            return console.log('Error occurred: ' + error);
        }
        else
        {
            var item = data.tracks.items[0];
            console.log("Song: " + item.name);
            console.log("Artist: " + item.album.artists[0].name);
            console.log("Album: " + item.album.name);
            console.log("Preview: " + item.preview_url);
        }
    });

    setTimeout(continueLIRI, 3000);
}


function omdbSearch(theSearchValue)
{
    console.log("Search OMDB: " + theSearchValue);

    var logData =  "\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " Searching OMDB for: " + theSearchValue;
    updateLog(logData);

    var omdb_api_key = "e3a15507";

    var input = theSearchValue.toLowerCase().trim();

    if(input.length > 0)
    {
        var queryText = ""; 
        for (var i = 0; i < input.length; i++)
        {
            if(input.charAt(i) === " ")
            {
                queryText += "+";
            }
            else
            {
                queryText += input.charAt(i);
            }
        }

        var url = "http://www.omdbapi.com/?t=" + queryText + "&apikey=" + omdb_api_key;

        axios.get(url).then(function(response)
        {
            var data = response.data;

            console.log("******************************");
            console.log(data.Title.toUpperCase());
            console.log("------------------------------");
            console.log("Year: " + data.Year);
            console.log("IMDB: " + data.Ratings[0].Value);
            console.log("Rotten Tomatoes: " + data.Ratings[1].Value);
            console.log("MetaCritic: " + data.Ratings[2].Value);
            console.log("Country: " + data.Country);
            console.log("Language: " + data.Language);
            console.log("Plot: " + data.Plot);
            console.log("Actors: " + data.Actors);
            console.log("******************************");

            setTimeout(continueLIRI, 3000);

        }).catch(function(error) 
        {
            logData =  "\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + "LIRI encounted an error with this OMDB request.";
            updateLog(logData);
            // might need to add ".data" to the end of all error refs
            if (error.response) 
            {
                console.log("AXIOS encountered and error: " + "\n" +
                            "Data: " + error.response.data + "\n" +
                            "Status: " + error.response.status + "\n" +
                            "Headers: " + error.response.headers);
            } 
            else if (error.request)
            {
                console.log(error.request);
            } 
            else
            {
                console.log("Error", error.message);
            }
        });
    }
    else
    {
        console.log("You did not provide a movie title for me to search for.");
        setTimeout(continueLIRI, 3000);
    }
}


//===== concert-this
// node liri.js concert-this <artist/band name here>
// This will search the Bands in Town Artist Events API: ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") 
// for an artist and render the following information about each event to the terminal:
// Name of the venue
// Venue location
// Date of the Event (use moment to format this as "MM/DD/YYYY")
function bitSearch(theSearchValue)
{
    console.log("Search BandsInTown: " + theSearchValue);

    var logData =  "\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " Searching BandsInTown for: " + theSearchValue;
    updateLog(logData);

    var bandsInTown_api_key = "codingbootcamp";

    var input = theSearchValue.toLowerCase();

    var queryText = ""; 

    for (var i = 0; i < input.length; i++)
    {
        if(input.charAt(i) === " ")
        {
            queryText += "%20";
        }
        else if (input.charAt(i) === "/")
        {
            queryText += "%252F";
        }
        else if (input.charAt(i) === "?")
        {
            queryText += "%253F";
        }
        else if (input.charAt(i) === "*")
        {
            queryText += "%252A";
        }
        else if (input.charAt(i) === '"')
        {
            queryText += "%27C";
        }
        else
        {
            queryText += input.charAt(i);
        }
    }

    var url = "https://rest.bandsintown.com/artists/" + queryText + "/events?app_id=" + bandsInTown_api_key;

    axios.get(url).then(function(response)
	{
        var data = response.data;

        console.log("******************************");
        console.log(theSearchValue.toUpperCase());
        console.log("Upcoming Events: " + data.length);
        
        for (var j = 0; j < data.length; j++)
        {
            console.log("------------------------------");
            
            var datetime = data[j].datetime.split("T");
            var date = datetime[0];
            var time = datetime[1];

            console.log("Date: " + date);
            console.log("Time: " + time);

            console.log("Location: " + data[j].venue.name + "\n" + 
                        data[j].venue.city + ", " + data[j].venue.region + "\n" + 
                        data[j].venue.country);

            console.log("Line Up:");
            
            for (var k = 0; k < data[j].lineup.length; k++)
            {
                console.log(" * " + data[j].lineup[k]);
            }

            console.log("More information: " + "\n" + data[j].url);
        }

        console.log("******************************");

        setTimeout(continueLIRI, 3000);

	}).catch(function(error) 
	{
        logData =  "\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + "LIRI encountered an error with this BandsInTown request.";
        updateLog(logData);
        // might need to add ".data" to the end of all error refs
		if (error.response) 
		{
			console.log("AXIOS encountered and error: " + "\n" +
						"Data: " + error.response.data + "\n" +
						"Status: " + error.response.status + "\n" +
						"Headers: " + error.response.headers);
		} 
		else if (error.request)
		{
			// The request was made but no response was received
			// `error.request` is an object that comes back with details pertaining to the error that occurred.
			console.log(error.request);
		} 
		else
		{
			// Something happened in setting up the request that triggered an Error
			console.log("Error", error.message);
		}

		// console.log(error.config);
	});

}


//===== do-what-it-says
// node liri.js do-what-it-says
// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
// Edit the text in random.txt to test out the feature for movie-this and concert-this.
function letLIRIDecide(theSearchValue)
{
    console.log("Search BandsInTown: " + theSearchValue);

    var logData = "";

    // theSearchValue can be song, movie, or concert
    // read random.txt and split data based on theSearchValue
    if(theSearchValue != "")
    {
        logData =  "\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " User would like for LIRI to deciede how to search for:. " + theSearchValue;
        updateLog(logData);

        var liriChoice = Math.floor(Math.random() * 3) + 1;

        if(liriChoice === 1)
        {
            logData =  "\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " LIRI decieded to search OMDB for: " + theSearchValue;
            updateLog(logData);
            omdbSearch(theSearchValue);
        }
        else if(liriChoice === 2)
        {
            logData =  "\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " LIRI decieded to search BandsInTown for: " + theSearchValue;
            updateLog(logData);
            bitSearch(theSearchValue);
        }
        else if(liriChoice === 3)
        {
            logData =  "\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " LIRI decieded to search Spotify for: " + theSearchValue;
            updateLog(logData);
            spotifySearch(theSearchValue);
        }
        else
        {
            // should never get here
            console.log("LIRI choice not expected: " + liriChoice);
        }
    }
    else
    {
        logData =  "\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " User would like for LIRI to search for something on her own.";
        updateLog(logData);

        //var randomTxtData = 
        readRandomTxt();

        var liriFavorites = randomTxtData.split("-");
        // 0 = song
        // 1 = movie
        // 2 = band

        //var liriChoice = Math.floor(Math.random() * 3) + 1;

        //console.log("------------------------------");
        //console.log("Data From random.txt");
        //for(var i = 0; i < liriFavorites.length; i++)
        //{
        //    console.log(liriFavorites[i]);
        //}
        
        // grab something from random at random
        // var searchType = "";
    }

    setTimeout(continueLIRI, 3000);
}


function readRandomTxt()
{
    fs.readFile("random.txt", "utf8", function(error, data)
    {
        if(error) 
        {
            var logData =  "\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " LIRI encounted error reading from random.txt.";
            updateLog(logData);

            return console.log("Error reading file: " + "\n" + error);
        }
        else
        {
            var output = data.split("-");
            for (var i = 0; i < output.length; i++) 
            {
                console.log("output["+i+"]: " + output[i]);
            }


            //return data;
        }
    });
}


function initializeLog()
{
    var logData =  "******************************" + "\n" +  
                "** Log File Created" + "\n" + 
                "** " + moment().format("YYYY-MM-DD hh:mm:ss")  + "\n" + 
                "******************************";
    
	fs.writeFile("log.txt", logData, function(error) 
	{
		if(error) 
		{
			return console.log("Error writing to log file: " + "\n" + error);
		}
	});
}

//===== BONUS
// In addition to logging the data to your terminal/bash window, 
// output the data to a .txt file called log.txt.
// Make sure you append each command you run to the log.txt file.
// Do not overwrite your file each time you run a command.
function updateLog(content) 
{
    // do not want to use ", " as delimiter
    fs.appendFile("log.txt", content, function(error) 
    {
        if (error)
        {
            var logData =  "\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " LIRI encounted error writing to random.txt.";
            updateLog(logData);
            return console.log("Error updating log file: " + "\n" + error);
        }
    });
}














































































































