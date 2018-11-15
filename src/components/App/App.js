import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: [],
            playlistName: 'playlistName',
            playlistTracks: [],
            filteredResults: [],
            searchTerm: ''
        }
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
        this.updateSearchTerm = this.updateSearchTerm.bind(this);
    }

    addTrack(track) {
        let tempPlaylist = this.state.playlistTracks;
        let found = false;
        for(let i=0; i<tempPlaylist.length; i++) {
          if (tempPlaylist[i].id === track.id) {
            found = true;
            break;
          }
        }

        if (found === false) {
          tempPlaylist.push(track);
        }

        this.setState( {playlistTracks: tempPlaylist} );
    }

    removeTrack(track) {
        let tempPlaylist = this.state.playlistTracks.filter(t => t !== track);
        this.setState( {playlistTracks: tempPlaylist} );
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
        if (this.state.searchTerm.length > 0) {
          Spotify.search(this.state.searchTerm).then(results => {
            this.setState({searchResults: results})
          });
        } else {
          this.setState({searchResults: []});
        }
    }

    updateSearchTerm(term) {
      this.setState({searchTerm: term});
    }

  render() {
    return (
        <div>
          <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
            <SearchBar onSearch={this.search} onTermChange={this.updateSearchTerm}/>
            <div className="App-playlist">
              <SearchResults searchResults={this.state.searchResults}
                             onAdd={this.addTrack}/>
              <Playlist playlistName={this.state.playlistName}
                        playlistTracks={this.state.playlistTracks}
                        onRemove={this.removeTrack}
                        onNameChange={this.updatePlaylistName}
                        onSave={this.savePlaylist}/>
            </div>
          </div>
        </div>
    );
  }
}

export default App;
