import React, { useState, memo } from 'react';

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
// function Unlock({ data: { user, text, time } }) {
//   const [verify,setVerify] = useState(0);
//   const [key,setKey] = useState("");
//   const [requestKey, setRequestKey] = useState("");
//   return (
//     <div className="column is-12 is-paddingless primary">
//       <strong className="is-block">{user}</strong>
//       <div className="text">
//         <time className="is-block has-text-right">{time}</time>
//         <input type="file" id="uploadFile" name="uploadFile"  onChange={(e) => readKey(e)}/>
//         <form onSubmit={recreateSecret}>
//           <label>Public Key Signature: </label>
//           <input type="text" value={key} onInput={(event)=>setKey(event.target.value)}/>
//           <input className="button" type="submit" value="Verify" />
//           {verify===1 && <i className="fa-solid fa-check" style={{color: "#63E6BE"}}></i>}
//           {verify===-1 && <i className="fa-solid fa-xmark" style={{color: "#db380f"}}></i>}
//         </form>
          
//       </div>
//     </div>
//   );
// }

function Message({ data }) {
  console.log('refresh:' + Math.random());
  switch (data.type) {
    case 'primary':
      return <Primary data={data} />;
    case 'information':
      return <Information data={data} />;
    case 'secondary':
      return <Secondary data={data} />;
    // case 'unlock':
    //   return <Unlock data={data}/>
    default:
      return <>Grrr</>;
  }
}

export default memo(Message);
