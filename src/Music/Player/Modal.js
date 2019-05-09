import React from 'react';
import {withState,compose,withHandlers,withPropsOnChange} from 'recompose'
//COMPONENTS//
  import Card from '@material-ui/core/Card';
  import CardContent from '@material-ui/core/CardContent';
  import CardMedia from '@material-ui/core/CardMedia';
  import IconButton from '@material-ui/core/IconButton';
  import Typography from '@material-ui/core/Typography';
  import FA from 'react-fontawesome'
  import DB from 'Firebase/GetWrapper'
  import Sound from 'react-sound'
  import ReactPlayer from 'react-player'
//ACTIONS//


const COMPONENT_NAME = ({
  //PROPS FROM PARENT//
    songId,
    playing,onToggle,
  //STATE
    beenLoaded,setBeenLoaded,
  //HANDLERS

  //OTHER
    ...props
}) => {
  if(!songId&&!beenLoaded){
    return null
  }
  if(!beenLoaded){
    setBeenLoaded(true)
  }
  return (
    <DB path={'songs/'+songId}>
      {({item})=>{
        console.log(item);
        return(
          <Card elevation={6} style={{width:450,position:'fixed',bottom:20,right:20,zIndex:10}} onClick={()=>onToggle(songId)}>
            <div style={{width:'65%'}}>
              <CardContent>
                <Typography component="h5" variant="h5">
                  {item.name}
                </Typography>
              </CardContent>
              <div>
                <IconButton aria-label="Play/pause">
                  {playing?
                    <span><FA name='stop'/></span>
                    :
                    <span><FA name='play'/></span>
                  }
                </IconButton>
              </div>
            </div>
            <div
              style={{
                width:'35%',position:'absolute',height:'100%',right:0,bottom:0,zIndex:-1,
                backgroundImage:"url("+item.cover+")",
                backgroundSize:'cover',backgroundPosition:'center',backgroundRepeat:'no-repeat'
              }}
            />
            {/*item.url&&<Sound
              url={item.url}
              playStatus={playing?Sound.status.PLAYING:Sound.status.STOPPED}
            />*/}
            <div>
              <div></div>
              {<ReactPlayer
                url={item.youtubeUrl}
                playing={playing}
                width={0}
                height={0}
                style={{}}
                config={{ attributes: { autoPlay: true }}}
              />}
            </div>
          </Card>
        )
      }}
    </DB>
  )
}

export default compose(
  withState('beenLoaded','setBeenLoaded',false),
)(COMPONENT_NAME)
