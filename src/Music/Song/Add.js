import React from 'react';
import {withState,compose,withHandlers} from 'recompose'
import fire from 'fire'
//COMPONENTS//
  import TextField from '@material-ui/core/TextField';
  import Button from '@material-ui/core/Button';
  import Input from '@material-ui/core/Input';
  import DialogTitle from '@material-ui/core/DialogTitle';
  import Dialog from '@material-ui/core/Dialog';
  import Snackbar from '@material-ui/core/Snackbar';
  import FA from 'react-fontawesome'
  import searchYoutube from 'youtube-api-v3-search';
  import Paper from '@material-ui/core/Paper';
  import Fab from '@material-ui/core/Fab';
//ACTIONS//




const AddSong = ({
  //PROPS FROM PARENT//

  //STATE
    name,setName,
    song,setSong,
    cover,setCover,
    youtubeUrl,setYoutubeUrl,
    isOpen,setIsOpen,
    showSnackbar,setShowSnackbar,
    snackMessage,setSnackMessage,
    coverUrl,setCoverUrl,
    manualUpload,setManualUpload,
    search,setSearch,
    searchResults,setSearchResults,
    selectedResultIndex,setSelectedResultIndex,
  //HANDLERS
    handleAddSong,handleYoutubeSearch,handleResultIndexShift,
  //OTHER
    ...props
}) => {
  return (
    <div>
      <Fab color="secondary" onClick={()=>setIsOpen(true)} style={{position:'absolute',top:10,right:10,zIndex:10}}>
        <FA name='plus' size='2x'/>
      </Fab>
      <Snackbar
        anchor={document.body}
        anchorOrigin={{ vertical:'bottom', horizontal:'right' }}
        open={showSnackbar}
        onClose={()=>setShowSnackbar(false)}
        message={<span>{snackMessage}</span>}
        autoHideDuration={6000}
      />
      <Dialog open={isOpen} onClose={()=>setIsOpen(false)}>
        <span style={{position:'absolute',top:10,right:10}}
          onClick={()=>setIsOpen(false)}
        >
          <FA name='times'/>
        </span>
        <DialogTitle>Add A Song</DialogTitle>
        <div style={{padding:10}}>
          <TextField
            label="Search"
            value={search}
            onChange={(e)=>handleYoutubeSearch(e.target.value)}
            fullWidth={true}
            key='search'
            InputLabelProps={{
              shrink: true,
            }}
            style={{marginTop:10}}
            placeholder=""
          />
          {/*<TextField
            label="Youtube URL"
            value={youtubeUrl}
            onChange={(e)=>handleYoutubeSearch(e.target.value)}
            fullWidth={true}
            key='youtubeUrl'
            InputLabelProps={{
              shrink: true,
            }}
            style={{marginTop:10}}
            placeholder=""
          />*/}
          <TextField
            label="Song Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            fullWidth={true}
            key='songName'
            InputLabelProps={{
              shrink: true,
            }}
            style={{marginTop:10}}
            placeholder=""
          />
          {/*<TextField
            label="Cover Art URL"
            value={coverUrl}
            onChange={(e)=>setCoverUrl(e.target.value)}
            fullWidth={true}
            key='coverArtUrl'
            InputLabelProps={{
              shrink: true,
            }}
            style={{marginTop:10}}
            placeholder=""
          />*/}
          <Paper
            elevation={1}
            style={{
              height:200,width:290,margin:'auto',marginTop:10,
              backgroundImage:'url('+(coverUrl||'https://upload.wikimedia.org/wikipedia/commons/b/b1/Missing-image-232x150.png')+')',
              backgroundPosition:'center',
              backgroundRepeat: 'no-repeat',backgroundSize:'auto',position:'relative'
            }}
          >
            <span className='hoverRed' style={{position:'absolute',top:65,left:-30}}onClick={()=>handleResultIndexShift(selectedResultIndex-1)}><FA name='angle-left' size='4x'/></span>
            <span className='hoverRed' style={{position:'absolute',top:65,right:-30}}onClick={()=>handleResultIndexShift(selectedResultIndex+1)}><FA name='angle-right' size='4x'/></span>
          </Paper>
          {manualUpload&&
            <div>
              Song File:
              <Input type='file' label='Upload Song' onChange={(e)=>setSong(e.target.files[0])}/>
              <br/>
              <br/>
              Cover Art File:
              <Input type='file' label='Upload Cover' onChange={(e)=>setCover(e.target.files[0])}/>
            </div>
          }
        </div>
        <Button color="secondary" onClick={handleAddSong} variant='contained'>
          Add Song
        </Button>
      </Dialog>
    </div>
  )
}

export default compose(
  withState('name','setName',null),
  withState('youtubeUrl','setYoutubeUrl',null),
  withState('song','setSong',''),
  withState('cover','setCover',''),
  withState('coverUrl','setCoverUrl',''),
  withState('manualUpload','setManualUpload',false),
  withState('isOpen','setIsOpen',false),
  withState('showSnackbar','setShowSnackbar',false),
  withState('snackMessage','setSnackMessage','Song Added'),
  withState('search','setSearch',null),
  withState('searchResults','setSearchResults',false),
  withState('selectedResultIndex','setSelectedResultIndex',0),
  withHandlers({
    handleAddSong: props => () => {
      console.log(props);
      var storageRef = fire.storage().ref()
      var songsRef = storageRef.child('songs/'+props.name)
      var coversRef = storageRef.child('covers/'+props.name)
      var url = false
      var cover = false
      var promise = Promise.resolve(123)
      promise
      .then(()=>{
        if(props.song){
          return songsRef.put(props.song)
            .then(function(snapshot) {
              return snapshot.ref.getDownloadURL().then((downloadUrl)=>url=downloadUrl)
            })
        }else{return}
      })
      .then(()=>{
        if(props.cover){
          return coversRef.put(props.cover)
            .then(function(snapshot) {
              return snapshot.ref.getDownloadURL().then((downloadUrl)=>cover=downloadUrl)
            })
        }else{return}
      })
      .then(()=>{
        var songObj = {
          name:props.name,
          url:url,
          cover:(cover||props.coverUrl),
          youtubeUrl:props.youtubeUrl
        }
        console.log(songObj);
        return fire.database().ref('songs').push( songObj );
      })
      .then((resp)=>{
        console.log(resp);
        props.setSnackMessage('Song Added')
        props.setShowSnackbar(true)
        props.setIsOpen(false)
      })
    },
    handleYoutubeSearch: props => (term) => {
      props.setSearch(term)
      const options = {
        q:term,
        part:'snippet',
        type:'video'
      }
      searchYoutube('AIzaSyCT5YNj0WpEUrt_4K8b3GZ6NoBZTOImXMA',options)
      .then(resp=>{
        console.log(resp);
        props.setSearchResults(resp.items)
        props.setSelectedResultIndex(0)
        var url = resp.items[0].snippet.thumbnails.high.url
        var name = resp.items[0].snippet.title
        var videoId = resp.items[0].id.videoId
        props.setCoverUrl(url)
        props.setName(name)
        props.setYoutubeUrl("https://www.youtube.com/watch?v="+videoId)
      })
    },
    handleResultIndexShift:props => (index) => {
      var index = index%5
      props.setSelectedResultIndex(index)
      var url = props.searchResults[index].snippet.thumbnails.high.url
      var name = props.searchResults[index].snippet.title
      var videoId = props.searchResults[index].id.videoId
      props.setCoverUrl(url)
      props.setName(name)
      props.setYoutubeUrl("https://www.youtube.com/watch?v="+videoId)
    }
  })
)(AddSong)
