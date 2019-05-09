import React, { Component } from 'react';
import fire from 'fire';
import {withState,compose,withHandlers,lifecycle,withProps,withPropsOnChange} from 'recompose'

const FirebaseWrapper = ({firebase,setFirebase,path,...props}) => {
  var lastPath = path
  if(path.split('/').length%2==0){
    lastPath='item'
  }
  props[lastPath]=firebase
  const Children=props.children
  return(
    <Children {...props}/>
  )
}
export default compose(
  withState('firebase','setFirebase',[]),
  withHandlers({
    firebase_push:props => (item) => {
      props.setFirebase(props.firebase.concat(item))
    }
  }),
  withPropsOnChange(
    ['path'],
    props=>{
      var path = props.path
      let dbRef = fire.database().ref(path).orderByKey().limitToLast(500)
      if(path.split('/').length%2==0){
        console.log("SINGLE");
        dbRef.on('value',(snapshot)=>{
          console.log(snapshot.val());
          props.setFirebase(snapshot.val())
        })
      }else{
        console.log("COLLECTION");
        dbRef.on('child_added',(snapshot)=>{
          let item = { ...snapshot.val(), id: snapshot.key };
          props.firebase_push(item)
        })
      }
      return({})
    }
  ),
  lifecycle({
    componentWillMount(){
      // var path = this.props.path
      // let dbRef = fire.database().ref(path).orderByKey().limitToLast(500)
      // if(path.split('/').length%2==0){
      //   console.log("SINGLE");
      //   dbRef.on('value',(snapshot)=>{
      //     console.log(snapshot.val());
      //     this.props.setFirebase(snapshot.val())
      //   })
      // }else{
      //   console.log("COLLECTION");
      //   dbRef.on('child_added',(snapshot)=>{
      //     let item = { ...snapshot.val(), id: snapshot.key };
      //     this.props.setFirebase(this.props.firebase.concat(item))
      //   })
      // }



      // if(props.path.split('/').length%2==0){//IF ABSOLUTE PATH TO ITEM
      //   console.log('ITEM');
      //   fire.database().ref(props.path).once('value').then((snapshot)=>{
      //     props.setFirebase(snapshot.val())
      //   });
      // }else{//IF PATH TO ARRAY
      //   console.log('ARRAY');
      //   var items = []
      //   fire.database().ref(props.path)
      //   .once('value',snapshot=>{
      //     console.log(snapshot.val())
      //     var items = []
      //     snapshot.forEach((childSnapshot)=>{
      //       console.log(childSnapshot.val());
      //       items.push({
      //         id:childSnapshot.key,
      //         ...childSnapshot.val()
      //       })
      //     })
      //     console.log(items);
      //     props.setFirebase(items)
      //     return
      //   })
      // }
    }
  })
)(FirebaseWrapper);
