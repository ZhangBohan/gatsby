import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { getUrlParams } from '../../gatsby-browser';
import '../styles/index.css';

function Index() {
  const [date, setDate] = useState(null);
  const [keyInfo, setKeyInfo] = useState({appId: '', appSecret: ''});
  const isSSR = typeof window === "undefined"

  const urlParams = !isSSR ? getUrlParams(): {};

  console.log('urlParams', urlParams);
  
  if (!isSSR) {
    console.log('document.referrer', document.referrer);
  }


  useEffect(() => {

    const keyInfoString = localStorage.getItem('KEY_INFO_STRING');
    if (keyInfoString) {
      setKeyInfo(JSON.parse(keyInfoString));
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

  function jumpHose () {
    console.log('jump to hose', document.referrer);
    window.location = `${document.referrer}api/openapi/v3/auth/redirect?redirectUrl=${window.location}`;
  }

  async function getHoseUserInfo () {
    console.log('do getHoseUserInfo', keyInfo);
    if (!keyInfo.appId || !keyInfo.appSecret) {
      alert('appId 与 appSecret不能为空');
      return;
    }

    const res = await fetch('/api/hose/staff', {
      method: 'POST', // or 'PUT'
      body: JSON.stringify({
          "baseUrl": document.referrer,
          "appId": keyInfo.appId,
          "appSecret": keyInfo.appSecret,
          "code": urlParams.code
      }), // data can be `string` or {object}!
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    console.log('getHoseUserInfo', res)
  }

  return (
    <main>
      <Helmet>
        <title>Gatsby + Node.js (TypeScript) API</title>
      </Helmet>
      <h1>Gatsby + Node.js (TypeScript) API</h1>
      <h2>The date according to Node.js is:</h2>
      <p>{date ? date : 'Loading date...'}</p>

      AppId: <input value={keyInfo.appId} onChange={handleChangeAppId}></input>
      <p></p>
      AppSecret: <input value={keyInfo.appSecret} onChange={handleChangeAppSecret}></input>
      <p></p>

      {
        urlParams.code ? (<button onClick={getHoseUserInfo}>已有code</button>) : (<button onClick={jumpHose}>获取用户信息</button>)
      }
    </main>
  );
}

export default Index;
