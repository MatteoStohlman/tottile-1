import React, { Component } from 'react';
import fire from 'fire';
import {withState,compose,withHandlers,lifecycle} from 'recompose'
import DB from 'Firebase/GetWrapper'
import MusicTile from 'Music/Song/Tile'
import GridList from '@material-ui/core/GridList';
import Player from 'Music/Player/Modal'
const SongList = ({
  firebase,setFirebase,path,
  playingSongId,setPlayingSongId,
  isPlaying,setIsPlaying,
  handleTileClick,
  ...props
}) => {
  return(
    <div>
      <Player
        songId={playingSongId}
        playing={isPlaying}
        onToggle={(songId)=>handleTileClick(songId)}
      />
      <GridList cellHeight={180}>
        <DB path='songs'>
          {({songs})=>{
            console.log(songs);
            return(
              <div>
                {songs&&songs.map((song)=>(
                  <MusicTile
                    id={song.id}
                    cover={song.cover}
                    title={song.name}
                    url={song.url}
                    youtubeUrl={song.youtubeUrl}
                    playing={(song.id==playingSongId)&&isPlaying}
                    onClick={handleTileClick}
                  />
                ))}
              </div>
            )
          }}
        </DB>
      </GridList>
    </div>
  )
}
export default compose(
  withState('playingSongId','setPlayingSongId',false),
  withState('isPlaying','setIsPlaying',false),
  withHandlers({
    handleTileClick:props => (songId) => {
      props.setIsPlaying(props.playingSongId!=songId?true:!props.isPlaying)
      props.setPlayingSongId(songId)
    }
  })
)(SongList);
