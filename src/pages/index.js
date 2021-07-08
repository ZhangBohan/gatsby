import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import '../styles/index.css';

function Index() {
  const [date, setDate] = useState(null);
  const [keyInfo, setKeyInfo] = useState({appId: '', appSecret: ''});
  const [referrer, setReferrer] = useState(isSSR ? document.referrer : '');
  const isSSR = typeof window === "undefined"
  
  if (!isSSR) {
    console.log('document.referrer', document.referrer);
  }


  useEffect(() => {
    async function getDate() {
      const res = await fetch('/api/date');
      const newDate = await res.text();
      setDate(newDate);
    }
    getDate();

    const keyInfoString = localStorage.getItem('KEY_INFO_STRING')
    if (keyInfoString) {
      setKeyInfo(JSON.parse(keyInfoString))
    }
  }, []);

  function handleChange (key, value) {
    console.log('handleChange', key, value, keyInfo);
    keyInfo[key] = value;
    setKeyInfo({
      ...keyInfo
    });
    localStorage.setItem('KEY_INFO_STRING', JSON.stringify(keyInfo))
  }

  function handleChangeAppId (event) {
    handleChange('appId', event.target.value);
  }

  function handleChangeAppSecret (event) {
    handleChange('appSecret', event.target.value);
  }

  function getHoseUserInfo () {
    console.log('jump to hose', referrer)
    window.location = `${referrer}api/auth/redirect?callback=${window.location}`
  }

  return (
    <main>
      <Helmet>
        <title>Gatsby + Node.js (TypeScript) API</title>
      </Helmet>
      <h1>Gatsby + Node.js (TypeScript) API</h1>
      <h2>The date according to Node.js is:</h2>
      <p>{date ? date : 'Loading date...'}</p>

      <input value={keyInfo.appId} onChange={handleChangeAppId}></input>
      <p></p>
      <input value={keyInfo.appSecret} onChange={handleChangeAppSecret}></input>
      <p></p>

      <button onClick={getHoseUserInfo}>获取用户信息</button>
    </main>
  );
}

export default Index;
