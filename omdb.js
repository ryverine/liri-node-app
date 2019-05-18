var axios = require("axios");

var fs = require("fs");

var moment = require('moment');

var divider = "------------------------------";

var OMDB = function()
{
    this.omdbSearch = function(theSearchValue)
    {
        if(theSearchValue.length < 1)
        {
            theSearchValue = "Mr. Nobody";
        }

        var logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " Searching OMDB for: " + theSearchValue;

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
                logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + "LIRI OMDB search was succcessful.";

                var data = response.data;

                console.log(divider);
                console.log(data.Title.toUpperCase());
                console.log(divider);
                console.log("Year: " + data.Year);
                console.log("IMDB: " + data.Ratings[0].Value);
                console.log("Rotten Tomatoes: " + data.Ratings[1].Value);
                console.log("MetaCritic: " + data.Ratings[2].Value);
                console.log("Country: " + data.Country);
                console.log("Language: " + data.Language);
                console.log("Plot: " + data.Plot);
                console.log("Actors: " + data.Actors);
                console.log(divider);

            }).catch(function(error) 
            {
                logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + "LIRI encounted an error with this OMDB request.";
                updateLog(logData);
        
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
            console.log("You did not provide a movie title for LIRI to search for.");
        }
    };
}


function updateLog(content) 
{
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



module.exports = OMDB;