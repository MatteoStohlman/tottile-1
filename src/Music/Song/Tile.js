import React from 'react';
import {withState,compose,withHandlers,withProps} from 'recompose'
//import moment from 'moment'
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import FA from 'react-fontawesome'
//COMPONENTS//
  //import TextField from 'material-ui/TextField';

//ACTIONS//




const COMPONENT_NAME = ({
  cover,title,url,youtubeUrl,
  width=window.innerWidth/4-5,height=220,
  isPlaying,setIsPlaying,
  handleClick,
  ...props
}) => {
  const styles = {
    wrapper:{
      width:width,height:height,backgroundImage:"url("+cover+")",border:'3px solid white',
      backgroundRepeat:'no-repeat',backgroundSize:'cover',display:'inline-block',verticalAlign:'top',
      cursor:'pointer',position:'relative'
    }
  }
  return (
    <GridListTile
      key={title} style={{width:width,height:height,display:'inline-block',padding:2,paddingTop:0,paddingBottom:0}}
      onClick={handleClick}
    >
      <img src={cover} alt={title} />
      <GridListTileBar
        title={title}
        //subtitle={<span>by: {title}</span>}
        actionIcon={
          <IconButton>
            <span style={{color:'#e0e0e0'}}><FA name={isPlaying?'music':'play'}/></span>
          </IconButton>
        }
      />
    </GridListTile>
  )
}
export default compose(
  withState('isPlayingState','setIsPlayingState',false),
  withProps(props=>({
    isPlaying:props.isPlayingState||props.playing
  })),
  withHandlers({
    handleClick:props => () => {
      props.setIsPlayingState(!props.isPlayingState)
      props.onClick&&props.onClick(props.id)
    }
  })
)(COMPONENT_NAME)
