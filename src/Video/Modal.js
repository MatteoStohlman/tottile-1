import React,{ forwardRef } from 'react';
import {withState,compose,withHandlers,withProps,lifecycle} from 'recompose'
import fire from 'fire';

var database = fire.database().ref('stream')
var servers = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'Bre10112!','username': 'matteo@tech4trades.com'}]};
var pc = new RTCPeerConnection(servers);

//const myVideo = React.createRef();


const COMPONENT_NAME = ({
  //PROPS FROM PARENT//

  //STATE
    myVideo,otherVideo,
  //HANDLERS
    showFriendsFace,
  //OTHER
    ...props
}) => {
  return (
    <div>
      <video ref={myVideo} width="320" height="240" autoPlay muted playsinline/>
      <video ref={otherVideo} width="320" height="240" autoPlay muted playsinline/>
      <button
        onClick={()=>showFriendsFace()}
      >Call</button>
    </div>
  )
}

export default compose(
  withProps(props => {
    var myId=Math.floor(Math.random()*1000000000);
    return({
      myId:myId
    })
  }),
  withState('myVideo','setMyVideo',props=>React.createRef()),
  withState('otherVideo','setOtherVideo',props=>React.createRef()),
  withHandlers({
    sendMessage:props => (senderId, data) => {
      var msg = database.push({ sender: senderId, message: data });
      msg.remove();
    },
  }),
  withHandlers({
    readMessage:props=>(data)=>{
      var msg = JSON.parse(data.val().message);
      var sender = data.val().sender;
      if (sender != props.myId) {
          if (msg.ice != undefined)
              pc.addIceCandidate(new RTCIceCandidate(msg.ice));
          else if (msg.sdp.type == "offer")
              pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
                .then(() => pc.createAnswer())
                .then(answer => pc.setLocalDescription(answer))
                .then(() => props.sendMessage(props.myId, JSON.stringify({'sdp': pc.localDescription})));
          else if (msg.sdp.type == "answer")
              pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
      }
    },
    showMyFace:props => () => {
      //console.log(myVideo);
      navigator.mediaDevices.getUserMedia({audio:true, video:true})
      .then(stream => props.myVideo.current.srcObject = stream)
      .then(stream => pc.addStream(stream));
    },
    showFriendsFace:props => () => {
      pc.createOffer()
      .then(offer => pc.setLocalDescription(offer) )
      .then(() => props.sendMessage(props.myId, JSON.stringify({'sdp': pc.localDescription})) );
    }
  }),
  lifecycle({
    componentWillMount(){
      pc.onicecandidate = (event => event.candidate?this.props.sendMessage(this.props.myId, JSON.stringify({'ice': event.candidate})):console.log("Sent All Ice") );
      pc.onaddstream = (event => this.props.otherVideo.current.srcObject = event.stream);
      database.on('child_added', this.props.readMessage);
    },
    componentDidMount(){
      this.props.showMyFace()
    }
  })
)(COMPONENT_NAME)
