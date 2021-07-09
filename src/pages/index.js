import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { getUrlParams } from '../../gatsby-browser';
import '../styles/index.css';

function Index() {
  const [keyInfo, setKeyInfo] = useState({appId: '', appSecret: '', corpId: ''});
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

  function handleChangeCorpId (event) {
    handleChange('corpId', event.target.value);
  }

  function jumpHose () {
    if (!keyInfo.corpId) {
      alert('corpId不能为空');
      return;
    }

    console.log('jump to hose', document.referrer);
    window.location = `${document.referrer}api/openapi/v3/auth/redirect?redirectUrl=${window.location}&corpId=${keyInfo.corpId}`;
  }

  async function getHoseUserInfo () {
    console.log('do getHoseUserInfo', keyInfo);
    if (!keyInfo.appId || !keyInfo.appSecret || !keyInfo.corpId) {
      alert('corpId 与 appId 与 appSecret不能为空');
      return;
    }

    const res = await fetch('/api/staff', {
      method: 'POST', // or 'PUT'
      body: JSON.stringify({
          "baseUrl": document.referrer,
          "appId": keyInfo.appId,
          "appSecret": keyInfo.appSecret,
          "code": urlParams.hoseCode
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
        <title>平台跳转测试</title>
      </Helmet>

      AppId: <input value={keyInfo.corpId} onChange={handleChangeCorpId}></input>
      <p></p>
      AppId: <input value={keyInfo.appId} onChange={handleChangeAppId}></input>
      <p></p>
      AppSecret: <input value={keyInfo.appSecret} onChange={handleChangeAppSecret}></input>
      <p></p>

      {
        urlParams.hoseCode ? (<button onClick={getHoseUserInfo}>已有code</button>) : (<button onClick={jumpHose}>获取用户信息</button>)
      }
    </main>
  );
}

export default Index;
