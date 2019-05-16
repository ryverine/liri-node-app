require("dotenv").config();

var keys = require("./keys.js");

var fs = require("fs");

var inquirer = require("inquirer");

var spotify = require('node-spotify-api');

var axios = require("axios");

// http://momentjs.com/docs/

var moment = require('moment');

//You should then be able to access your keys information like so
// var spotify = new Spotify(keys.spotify);

// var action = process.argv[2];
// var value = process.argv.slice(3).join(" ");
// console.log("ACTION: " + action);
// console.log("VALUE: " + value);

initializeLog();

inquirer.prompt([
{
    type: "list",
    message: "What action:",
    choices: [  "Concert This Band",
                "Spotify This Song",
                "OMDB This Movie",
                "Do What It Says"],
    name: "action"
},
{
    type: "input",
    message: "What are you searching for?",
    name: "value"
}/*,
{
    type: "confirm",
    message: "Are you sure:",
    name: "confirm",
    default: true
}*/
]).then(function(inquirerResponse) 
{
    
    //console.log("ACTION: " + inquirerResponse.action);
    //console.log("VALUE: " + inquirerResponse.value);

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
        case "do what it says":
            doWhatItSays(value);
            break;
        default:
            console.log("Cannot process " + inquirerResponse.action + '!');
    }
});


function spotifySearch(theSearchValue)
{
    console.log("Search Spotify: " + theSearchValue);
}

function omdbSearch(theSearchValue)
{
    console.log("Search OMDB: " + theSearchValue);
}

function bitSearch(theSearchValue)
{
    console.log("Search BandsInTown: " + theSearchValue);

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
        console.log("------------------------------");


        console.log("******************************");

	}).catch(function(error) 
	{
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

function doWhatItSays(theSearchValue)
{
    console.log("Search BandsInTown: " + theSearchValue);
}


























function initializeLog()
{
    var data =  "**********" + "\n" +  
                "** Log File Created" + "\n" + 
                "** " + moment().format("YYYY-MM-DD hh:mm:ss")  + "\n" + 
                "**********";
             
	// will need to create user object
	// that hold key data values
	// will alos need to use moment js for time stamp

	fs.writeFile("log.txt", data, function(error) 
	{
		if(error) 
		{
			return console.log("Error writing to log file: " + "\n" + error);
		}
		// console.log("User data logged.");
	});
}



/*
//===== concert-this


node liri.js concert-this <artist/band name here>
This will search the Bands in Town Artist Events API: ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") 
for an artist and render the following information about each event to the terminal:
Name of the venue
Venue location
Date of the Event (use moment to format this as "MM/DD/YYYY")


//===== spotify-this-song

Client ID 
5f3d3e3bff894ca09140905e231cd6a9

node liri.js spotify-this-song '<song name here>'
This will show the following information about the song in your terminal/bash window
Artist(s)
The song's name
A preview link of the song from Spotify
The album that the song is from

If no song is provided then your program will default to "The Sign" by Ace of Base.

You will utilize the node-spotify-api package in order to retrieve song information from the Spotify API.

The Spotify API requires you sign up as a developer to generate the necessary credentials. You can follow these steps in order to generate a client id and client secret:

Step One: Visit https://developer.spotify.com/my-applications/#!/

Step Two: Either login to your existing Spotify account or create a new one (a free account is fine) and log in.

Step Three: Once logged in, navigate to https://developer.spotify.com/my-applications/#!/applications/create to register a new application to be used with the Spotify API. You can fill in whatever you'd like for these fields. When finished, click the "complete" button.


Step Four: On the next screen, scroll down to where you see your client id and client secret. Copy these values down somewhere, you'll need them to use the Spotify API and the node-spotify-api package.

//===== movie-this

OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=e3a15507
api key = e3a15507

node liri.js movie-this '<movie name here>'

This will output the following information to your terminal/bash window:
* Title of the movie.
   
* Year the movie came out.
   
* IMDB Rating of the movie.
   
* Rotten Tomatoes Rating of the movie.
   
* Country where the movie was produced.
   
* Language of the movie.
   
* Plot of the movie.
   
* Actors in the movie.


If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

You'll use the axios package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use trilogy.


//===== do-what-it-says

node liri.js do-what-it-says

Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.

Edit the text in random.txt to test out the feature for movie-this and concert-this.



//===== BONUS

In addition to logging the data to your terminal/bash window, output the data to a .txt file called log.txt.

Make sure you append each command you run to the log.txt file.

Do not overwrite your file each time you run a command.

*/













































































































