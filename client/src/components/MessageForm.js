/* eslint-disable no-undef */
import { useEffect, useRef, useState } from 'react';
import { useMessagesDispatch } from '../contexts/MessagesContext';
import socket from '../Socket';
import {generateRSA,encryptRSA,encryptRSAKey} from '../algorithm/RSA.js';
import {generateShares} from '../algorithm/Shamir.js';
function MessageForm({ fullName }) {
  const textareaRef = useRef(null);
  const minUnlockRef = useRef(null);
  const [file,setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const dispatch = useMessagesDispatch();
  const checkSubmit = (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.keyCode === 13 || e.keyCode === 10)) {
      handleSubmit();
    }
  }

  const showFile = async (e) => {
    e.preventDefault()
    
    const reader = new FileReader()
    reader.onload = async (e) => { 
      setFile(e.target.result)
    };
    reader.readAsText(e.target.files[0])
    setFileName(e.target.files[0].name);
    
  }
  const handleSubmit = () => {
    let textarea = textareaRef.current;
    
    socket.emit('send message', {
      user: fullName,
      text: textarea.value
    });

    dispatch({
      type: 'newmessage',
      message: {
        type: 'primary',
        user: fullName,
        text: textarea.value
      }
    });

    textarea.value = '';
  }
  const handleSecretSubmit= () =>{
    let textarea = textareaRef.current;
    let publicKeyE = localStorage.getItem('publicKeyE');
    let publicKeyN = localStorage.getItem('publicKeyN');
    let {publicKey,privateKey} = generateRSA();
    let encryptedSecret = encryptRSA(textarea.value,publicKey.e,publicKey.n);
    let stringPrivateKeyD = privateKey.d.toString()
    let stringPrivateKeyN = privateKey.n.toString() 
    console.log(privateKey)
    console.log(encryptedSecret)
    let keyPartD = []
    let keyPartN = []
    keyPartD.push(encryptRSAKey(stringPrivateKeyD.slice(0,stringPrivateKeyD.length/2),publicKeyE,publicKeyN))
    keyPartD.push(encryptRSAKey(stringPrivateKeyD.slice(stringPrivateKeyD.length/2),publicKeyE,publicKeyN))
    keyPartN.push(encryptRSAKey(stringPrivateKeyN.slice(0,stringPrivateKeyN.length/2),publicKeyE,publicKeyN))
    keyPartN.push(encryptRSAKey(stringPrivateKeyN.slice(stringPrivateKeyN.length/2),publicKeyE,publicKeyN))
    socket.emit('send encrypted', {
      user: fullName,
      text: encryptedSecret,
      keyD: keyPartD,
      keyN: keyPartN,
      filename:""
    });
      dispatch({
        type: 'newmessage',
        message: {
          type: 'primary',
          user: fullName,
          text: "Secret Message Send: " +textarea.value
        }
      });
    
    
  
    textarea.value = '';
  }
  const handleSecretSubmitFile= () =>{
    if(file!==""){
      let publicKeyE = localStorage.getItem('publicKeyE');
      let publicKeyN = localStorage.getItem('publicKeyN');
      let {publicKey,privateKey} = generateRSA();
      let encryptedSecret = encryptRSA(file,publicKey.e,publicKey.n);
      let stringPrivateKeyD = privateKey.d.toString()
      let stringPrivateKeyN = privateKey.n.toString() 
      console.log(privateKey)
      console.log(encryptedSecret)
      let keyPartD = []
      let keyPartN = []
      keyPartD.push(encryptRSAKey(stringPrivateKeyD.slice(0,stringPrivateKeyD.length/2),publicKeyE,publicKeyN))
      keyPartD.push(encryptRSAKey(stringPrivateKeyD.slice(stringPrivateKeyD.length/2),publicKeyE,publicKeyN))
      keyPartN.push(encryptRSAKey(stringPrivateKeyN.slice(0,stringPrivateKeyN.length/2),publicKeyE,publicKeyN))
      keyPartN.push(encryptRSAKey(stringPrivateKeyN.slice(stringPrivateKeyN.length/2),publicKeyE,publicKeyN))
      socket.emit('send encrypted', {
        user: fullName,
        text: encryptedSecret,
        keyD: keyPartD,
        keyN: keyPartN,
        filename: fileName
      });
        dispatch({
          type: 'newmessage',
          message: {
            type: 'primary',
            user: fullName,
            text: "Secret File Send: " +fileName
          }
        });
    }
      
  }


  return (
    <>
      <div className="column is-paddingless">
        <textarea ref={textareaRef} autoFocus={true} className="textarea is-shadowless" rows="2" placeholder="Type a message" onKeyDown={checkSubmit}></textarea>
        <input type="number" ref={minUnlockRef} className="textarea is-shadowless" rows="2" placeholder="Minimum Person to Unlock"></input>
        <input className="button is-medium is-paddingless is-white"type="file" id="uploadFile" name="uploadFile"  onChange={(e) => showFile(e)}/>
      </div>

      <div className="column is-2-mobile is-1-tablet is-paddingless">
        
        <button className="button is-medium is-paddingless is-white" onClick={handleSubmit}><i className="far fa-paper-plane"></i></button>
        <button className="button is-medium is-paddingless is-white" onClick={handleSecretSubmit}><i className="far fa-paper-plane"></i>Secret</button>
        <button className="button is-medium is-paddingless is-white" onClick={handleSecretSubmitFile}><i className="far fa-paper-plane"></i>Secret File</button>
      </div>
        
    </>
  );
}

export default MessageForm;
