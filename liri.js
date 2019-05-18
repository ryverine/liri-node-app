require("dotenv").config();

var OMDB = require("./omdb");
var SPOTIFY = require("./spotify");
var BANDSINTOWN = require("./bandsintown");
var keys = require("./keys.js");
//You should then be able to access your keys information like so
// var spotify = new Spotify(keys.spotify);

var fs = require("fs");

var inquirer = require("inquirer");

var moment = require('moment');

var divider = "------------------------------";


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
                //bitSearch(value);
                var bandsintown = new BANDSINTOWN();
                bandsintown.bitSearch(value);
                break;
            case "spotify this song":
                //spotifySearch(value);
                var spotify = new SPOTIFY();
                spotify.spotifySearch(value);
                break;
            case "omdb this movie":
                //omdbSearch(value);
                var omdb = new OMDB();
                omdb.omdbSearch(value);
                break;
            case "let liri decide":
                letLIRIDecide(value);
                break;
            default:
                console.log("Cannot process " + inquirerResponse.action + '!');
        }

        setTimeout(continueLIRI, 3000);
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

            var logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " LIRI Bot Deactivated";
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
        logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " User would like for LIRI to deciede how to search for:. " + theSearchValue;
        updateLog(logData);

        var liriChoice = Math.floor(Math.random() * 3) + 1;

        if(liriChoice === 1)
        {
            logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " LIRI decieded to search OMDB for: " + theSearchValue;
            updateLog(logData);
            omdbSearch(theSearchValue);
        }
        else if(liriChoice === 2)
        {
            logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " LIRI decieded to search BandsInTown for: " + theSearchValue;
            updateLog(logData);
            bitSearch(theSearchValue);
        }
        else if(liriChoice === 3)
        {
            logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " LIRI decieded to search Spotify for: " + theSearchValue;
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
        logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " User would like for LIRI to search for something on her own.";
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
            var logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " LIRI encounted error reading from random.txt.";
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
    var logData =  "******************************" + "\r\n" +
                "** Log File Created" + "\r\n" + 
                "** " + moment().format("YYYY-MM-DD hh:mm:ss")  + "\r\n" + 
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
            var logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " LIRI encounted error writing to random.txt.";
            updateLog(logData);
            return console.log("Error updating log file: " + "\n" + error);
        }
    });
}














































































































