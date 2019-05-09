import React, { Component } from 'react';
import {withState,compose,withHandlers} from 'recompose'
import logo from './logo.svg';
import './App.css';
import SongList from 'Music/List/SongList'
import AddSong from 'Music/Song/Add'
import Video from 'Video/Modal'

const App = ({
  //PROPS FROM PARENT//

  //STATE

  //HANDLERS

  //OTHER
    ...props
}) => {
  return (
    <div className="App">
      {/*<AddSong/>
      <SongList/>*/}
      <Video/>
    </div>
  )
}

export default compose(

)(App)
