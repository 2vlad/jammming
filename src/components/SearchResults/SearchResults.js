import React from 'react';
import './SearchResults.css';
import TrackList from '../TrackList/TrackList';

class SearchResults extends React.Component {
    render() {
        let isRemoval = false;

        return (
            <div className="SearchResults">
              <h2>Results</h2>
              <TrackList tracks={this.props.searchResults}
                         onAdd={this.props.onAdd}
                         isRemoval={this.isRemoval} />
            </div>
        );
    }
}

export default SearchResults;
