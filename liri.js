//require("dotenv").config();

var OMDB = require("./omdb");
var SPOTIFY = require("./spotify");
var BANDSINTOWN = require("./bandsintown");

//You should then be able to access your keys information like so
// var spotify = new Spotify(keys.spotify);

var fs = require("fs");

var inquirer = require("inquirer");

var moment = require('moment');

var divider = "------------------------------";


if (fs.existsSync("log.txt")) 
{
    var logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " LIRI Bot Activated";
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
                makeAPICall("band",value);
                break;
            case "spotify this song":
                makeAPICall("song",value);
                break;
            case "omdb this movie":
                makeAPICall("movie",value);
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


function letLIRIDecide(theSearchValue)
{
    var logData = "";

    if(theSearchValue != "")
    {
        logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " User would like for LIRI to deciede how to search for: " + theSearchValue;
        updateLog(logData);

        var liriChoice = Math.floor(Math.random() * 3) + 1;

        if(liriChoice === 1)
        {
            logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " LIRI decieded to search OMDB for: " + theSearchValue;

            updateLog(logData);

            makeAPICall("movie", theSearchValue);
        }
        else if(liriChoice === 2)
        {
            logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " LIRI decieded to search BandsInTown for: " + theSearchValue;

            updateLog(logData);

            makeAPICall("band", theSearchValue);
        }
        else if(liriChoice === 3)
        {
            logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " LIRI decieded to search Spotify for: " + theSearchValue;

            updateLog(logData);

            makeAPICall("song", theSearchValue);
        }
        else
        {
            console.log("Random number expected to be 1-3. LiriChoice = " + liriChoice);
        }
    }
    else
    {
        logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " User would like for LIRI to search for something on her own.";

        updateLog(logData);

        readRandomTxt();
    }
}


function makeAPICall(apiChoice, value)
{
    if(apiChoice.toLowerCase() === "movie")
    {
        var omdb = new OMDB();
        omdb.omdbSearch(value);
    }
    else if(apiChoice.toLowerCase() === "band")
    {
        var bandsintown = new BANDSINTOWN();
        bandsintown.bitSearch(value);
    }
    else if(apiChoice.toLowerCase() === "song")
    {
        var spotify = new SPOTIFY();
        spotify.spotifySearch(value);
    }
    else
    {
        console.log(divider + "\n" + "Unexpected API Choice in makeAPICall()!");
    }
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
            var liriChoice = Math.floor(Math.random() * 3);
            var liriSearch = ""; 

            for(var i = 0; i < output[liriChoice].length; i++)
            {
                if(output[liriChoice].charAt(i) != "[" && output[liriChoice].charAt(i) != "]")
                {
                    liriSearch += output[liriChoice].charAt(i);
                }
            }

            if (liriChoice === 0)
            {
                logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " LIRI searches Spotify for: " + liriSearch;

                makeAPICall("song", liriSearch);
            }
            else if (liriChoice === 1)
            {
                logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " LIRI searches OMDB for: " + liriSearch;

                makeAPICall("movie", liriSearch);
            }
            else if (liriChoice === 2)
            {
                logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " LIRI searches BandsInTown for: " + liriSearch;

                makeAPICall("band", liriSearch);
            }
            else
            {
                console.log("Random number expected to be 0-2. LiriChoice = " + liriChoice);
            }

            updateLog(logData);
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














































































































