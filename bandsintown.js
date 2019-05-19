require("dotenv").config();

var keys = require("./keys.js");

var axios = require("axios");

var fs = require("fs");

var moment = require('moment');

var divider = "------------------------------";

var BANDSINTOWN = function()
{
    this.bitSearch = function(theSearchValue)
    {
        if(theSearchValue.length < 1)
        {
            theSearchValue = "taylor swift";
        }

        var logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + " Searching BandsInTown for: " + theSearchValue;

        updateLog(logData);

        var bandsInTown_api_key = keys.apikeys.bandsintown_key;

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

            logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + "LIRI BandsInTown search was succcessful.";

            var data = response.data;

            console.log(divider);
            console.log(theSearchValue.toUpperCase());
            console.log("Upcoming Events: " + data.length);
            
            for (var j = 0; j < data.length; j++)
            {
                console.log(divider);
                
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

            console.log(divider);

        }).catch(function(error) 
        {
            logData =  "\r\n" + divider + "\r\n" + "** " + moment().format("YYYY-MM-DD hh:mm:ss") + "LIRI encountered an error with this BandsInTown request.";
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


module.exports = BANDSINTOWN;