import React, { Component } from 'react';
import './App.css';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import Spotify from './util/Spotify';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: [
                {
                    name: '',
                    artist: '',
                    album: '',
                    id: ''
                },
                {
                    name: '',
                    artist: '',
                    album: '',
                    id: ''
                }
            ],
            playlistName: 'playlistName',
            playlistTracks: [
                {
                    name: '',
                    artist: '',
                    album: '',
                    id: ''
                },
                {
                    name: '',
                    artist: '',
                    album: '',
                    id: ''
                }
            ]
        }
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
    }

    addTrack(track) {
        if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
          return;
      } else {
          this.setState(this.state.playlistTracks.push({
              name: track.name,
              artist: track.artist,
              album: track.album,
              id: track.id,
          }))
      }
    }

    removeTrack(track) {
        this.state.playlistTracks.filter( function(savedTrack) {
            return savedTrack.id === track.id;
        });
    }

    updatePlaylistName(name) {
        this.setState({playlistName: name})
    }

    savePlaylist() {
        // get all URIs from the current playlist tracks
        const trackURIs = this.state.playlistTracks.map(track => track.uri);
        // create and save a playlist to spotify
        Spotify.saveplaylist(this.state.playlistName, trackURIs);
        // reset playlist back to new and empty
        this.setState({playlistTracks: [], playlistName: 'New Play List'});
        // refilter the search result by the modified playlist, the removed track may or may not be added
        // back to the search result
        let newfilteredResults = this.state.searchResults;
        this.setState({filteredResults: newfilteredResults});
    }

    search(term) {
        // set the search result back to both search result and filtered result(filtered by tracks existing in playlist)
        let resulttracks = Spotify.search(term).then(unfilteredtracks=>{
          this.setState({searchResults: unfilteredtracks});
          // if playlist exists, remove the tracks in playlist from searchresult
          debugger
          let playlist = this.state.playlistTracks;
          if (playlist.length >0) {
            let newfilteredResults = unfilteredtracks.filter(searchResult => {
              // return !(playlist.indexOf(searchResult) >-1); IndexOf does not work here
              // filter out tracks exist inside playlist by comparing id
              let x = playlist.filter(track => track.id === searchResult.id);
              return (x.length == 0)
            });
            this.setState({filteredResults: newfilteredResults});
          } else {
            this.setState({filteredResults: unfilteredtracks});
          }
        });
    }

  render() {
    return (
        <div>
          <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
            <SearchBar />
            <div className="App-playlist">
              <SearchResults searchResults={this.state.searchResults}
                             onAdd={this.state.addTrack}
                             isRemoval={this.isRemoval}
                             onSearch={this.search}/>
              <Playlist playlistName={this.state.playlistName}
                        playlistTracks={this.state.playlistTracks}
                        onRemove={this.removeTrack}
                        onNameChange={this.state.updatePlaylistName}
                        onSave={this.savePlaylist}/>
            </div>
          </div>
        </div>
    );
  }
}

export default App;
