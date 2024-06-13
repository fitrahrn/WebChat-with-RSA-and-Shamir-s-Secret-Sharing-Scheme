/* eslint-disable no-undef */
import React, { useState, memo } from 'react';
import {decryptRSA} from '../algorithm/RSA';
import {constructSecret} from '../algorithm/Shamir'
function Primary({ data: { user, text, time } }) {
  return (
    <div className="column is-12 has-text-right is-paddingless is-clearfix secondary">
      <strong className="is-block">{user}</strong>
      <div className="text is-pulled-right">
        {text}
        <time className="is-block has-text-right">{time}</time>
      </div>
    </div>
  );
}

function Information({ data: { user, text } }) {
  return (
    <div className="column is-12 has-text-centered is-paddingless">
      <strong>{user}</strong> {text}
    </div>
  );
}

function Secondary({ data: { user, text, time } }) {
  return (
    <div className="column is-12 is-paddingless primary">
      <strong className="is-block">{user}</strong>
      <div className="text">
        {text}
        <time className="is-block has-text-right">{time}</time>
      </div>
    </div>
  );
}
function Unlock({ data: { user, text,minimum,n,p ,ownShare,t, filename} }) {
  const [key,setKey] = useState("");
  const [shares,setShares] = useState([]);
  const [newShares,setNewShares] = useState("");
  const [newT,setNewT] = useState("");
  const [message,setMessage] = useState("")
  const unlockMessage = async (event)=>{
    event.preventDefault();
    let privateKey={
      d : key,
      n : n
    }
    console.log(text)
    console.log(privateKey)
    setMessage(decryptRSA(text,privateKey))
  }
  const constructKey = async (event)=>{
    event.preventDefault();
    console.log(shares)
    setKey(constructSecret(shares,BigInt(p)))
    console.log(key)
  }
  return (
    <div className="column is-12 is-paddingless primary">
      <strong className="is-block">{user}</strong>
      <div className="text">
        <p>This Message is Locked</p>
        <form onSubmit={unlockMessage}>
          <label>Enter Decrypt Key to Unlock Message: </label>
          <input type="text" value={key} onInput={(event)=>setKey(event.target.value)}/>
          <button className="button" type="submit" value="Verify" >Decrypt Message</button>
        </form>
        <form onSubmit={constructKey}>
          <label>Enter All Shares to Unlock Decrypt Key: </label>
          <input type="text" placeholder='Insert N Value' value={newShares} onInput={(event)=>setNewShares(event.target.value)}/>
          <input type="text" placeholder='Insert T Value' value={newT} onInput={(event)=>setNewT(event.target.value)}/>
          <button type='button' onClick={()=>{setShares([
          ...shares,
          {
            t: BigInt(newT),
            n: BigInt(newShares)
          }
          ]);}}>Add Shares</button>
          <p>{shares.length}/{minimum} Shares needed to Unlock Key</p>
          <button className="button" type="submit" value="Verify">Create Key</button>
        </form>
        <p>Share your key shares to other people: <br/>
          N: {ownShare}<br/>
          Participant T: {t}<br/>
          
        </p>
        <button className="button" type="button" onClick={() =>  navigator.clipboard.writeText(ownShare)}>Copy Share</button>

        {key !=="" ? 
        <div>
          <p>Decrypt Key= {key.toString()}</p>
          <button className="button" type="button" onClick={() =>  navigator.clipboard.writeText(key)}>Copy Key</button>
        </div> :<div></div> }
        { message !=="" && filename ==="" ? 
          <p>Decrypted Message= {message}</p> : 
          message !=="" && filename !=="" ? 
          <div>
            <p>Decrypted File= </p>
            <button onClick={() => {
              const buffer = Uint8Array.from(message, c => c.charCodeAt(0));
              const file = new Blob([buffer], { type:"text/plain"});
              const link = document.createElement("a");
              link.href = URL.createObjectURL(file);
              link.download = filename;
              link.click();
              }}>Download File
            </button>
          </div> :
          <div></div> }
      </div>
    </div>
  );
}

function Message({ data }) {
  switch (data.type) {
    case 'primary':
      return <Primary data={data} />;
    case 'information':
      return <Information data={data} />;
    case 'secondary':
      return <Secondary data={data} />;
    case 'unlock':
      return <Unlock data={data}/>
    default:
      return <>Grrr</>;
  }
}

export default memo(Message);
