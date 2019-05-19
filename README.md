# liri-node-app

Application using Node JS which calls BandsInTown, OMDB, and Spotify APIs.

## LIRI Installation Instructions

### Node JS

You must have Node JS and a terminal/command line application installed on your machine.

[How to install Node.js on Windows](https://www.guru99.com/download-install-node-js.html)

### Download My Project

Click on the green "Clone or Download" button above. You may clone my repo, but you can also select the "downlaod zip" option and unzip the downloaded file in any directory you please.

Make sure you have the following files:
* `liri.js`
* `keys.js`
* `bandsintown.js`
* `spotify.js`
* `omdb.js`
* `package.JSON`
* `random.txt`

### API Keys

LIRI makes calls to the BandsInTown, Spotify, and OMDB APIs. You must ensure that you have API keys for these services. Take note that the Soptify API needs a `client ID` and `client secret` instead of a single key value.

### Environment File

Once you have the neccessary API keys, navigate to the `liri-node-app` directory and create a new file named `.env`.

On a Windows machine you can make this file by creating a new text file and naming it `.env.`. You will be prompted to confirm the name change and after selecting `yes` you should see that the file is named `.env`.

The contents of the .env file should be as follows:

	# Spotify API keys
	SPOTIFY_ID="your_client_id"
	SPOTIFY_SECRET="your_client_secret"

	# OMDB API keys
	OMDB_KEY="your_api_key"

	# BandsInTown API key
	BANDSINTOWN_KEY="your_api_key"

### NPM Install 

In you command line application navigate to the `liri-node-app` directory. Before you run LIRI you must install the various NPM packages that LIRI uses. Once you are under the `liri-node-app` directory, enter 'npm i' into your command line and press the `enter` key. If you have the `package.JSON` file the various packages will install. After the NPM installation you can run LIRI. 

### Running LIRI

Now that you have your API keys added to the `.env` file and the NPM packages installed LIRI is ready to run.

Simply type `node liri` into your command line and press the `enter` key to begin.

## User Log

When you start LIRI for the first time a log file will be created (log.txt).

Your searches and interactions with LIRI will be documented in this log file.

I recommend that you use WordPad (or equivalent Rich Text editor) when viewing the log file, becase Plain Text editors (i.e. NotePad) do not seem to render line break characters correctly.



## LIRI User Manual

You can use LIRI to search for a musical artist's upcoming concerts, information about a specific movie, and information about a specific song.

When you start LIRI you will be prompted to select a command and then provide search terms.

The available commands are:

* Concert This Band
* Spotify This Song
* OMDB This Movie
* Let LIRI Decide



### Searching For Concerts

Select "Concert This Band" and enter the name of an musical artist/band. 

LIRI will search [BandsInTown](https://www.bandsintown.com/) for that specific artist and return information on any upcoming concerts for that artist.

Data returned:

* Number of upcoming events
* Date and Time of the event
* Venue name
* venue city, state, and country
* List of artists performing at the concert
* Link to informtion on [BandsInTown](https://www.bandsintown.com/) 
       
![BandsInTown Search](/documentation/bitSearch.gif)

### Searching For Songs

Select "Spotify This Song" and enter the title of a song. LIRI will search [Spotify](https://www.spotify.com/us/) for that specific song.

Data returned:

* A preview link of the song from Spotify
* The album that the song is from

![Spotify Search](/documentation/spotifySearch.gif)

### Searching For Movies

Select "OMDB This Movie" and enter the title of a movie. LIRI will search [OMDB](http://www.omdbapi.com/) for that specific movie.

Data returned:

* Year movie was filmed
* [IMDB](https://www.imdb.com/) rating
* [Rotten Tomatoes](https://www.rottentomatoes.com/) rating
* [MetaCritic](https://www.metacritic.com/) rating
* Country the movie was filmed in
* Language the movie was filmed in
* Plot synopsis
* Actors staring in the movie

![OMDB Search](/documentation/omdbSearch.gif)


### Letting LIRI Decide What To Search For

If you would like to take a roll of the dice, let LIRI determine what to search for!

Select "Let LIRI Decide" and enter something for LIRI to look up.

LIRI will randomly decide on whether to search BandsInTown, Spotify, or OMDB for the search terms you requested.

![LIRI w/ Data](/documentation/liriSearch_data.gif)

You do not hve to provide LIRI with search terms. 

If you choose to not provide any context, LIRI searches for one of her personal favorites.

![LIRI w/o Data](/documentation/liriSearch_noData.gif)



