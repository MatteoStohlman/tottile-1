import React, { Component } from 'react';
import fire from 'fire';
import {withState,compose,withHandlers,lifecycle} from 'recompose'

const FirebaseWrapper = ({firebase,setFirebase,path,...props}) => {
  props[path]=firebase
  const Children=props.children
  return(
    <Children {...props}/>
  )
}
export default compose(
  withState('firebase','setFirebase',[]),
  lifecycle({
    componentWillMount(){
      let itemsRef = fire.database().ref(this.props.path).orderByKey().limitToLast(100);
      itemsRef.on('child_added', snapshot => {
        /* Update React state when message is added at Firebase Database */
        let item = { ...snapshot.val(), id: snapshot.key };
        this.props.setFirebase(this.props.firebase.concat(item))
      })
    }
  })
)(FirebaseWrapper);
