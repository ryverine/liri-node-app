# liri-node-app

Application using Node JS which calls BandsInTown, OMDB, and Spotify APIs.



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



## LIRI Installation Instructions