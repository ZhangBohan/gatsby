import React, { useEffect, useState } from 'react';
import GitHubForkRibbon from 'react-github-fork-ribbon';
import { Helmet } from 'react-helmet';
import { getUrlParams } from '../../gatsby-browser';
import '../styles/index.css';
import axios from 'axios';

const Content = () => (
  <GitHubForkRibbon href="https://github.com/ZhangBohan/gatsby"
                    target="_blank"
                    position="right">
    Fork me on GitHub
  </GitHubForkRibbon>
);

function Index() {
  const [keyInfo, setKeyInfo] = useState({appId: '', appSecret: '', corpId: '', baseUrl: ''});
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

  function handleChangeBaseUrl (event) {
    handleChange('baseUrl', event.target.value);
  }

  function jumpHose () {
    if (!keyInfo.corpId || !keyInfo.baseUrl) {
      alert('baseUrl与corpId不能为空');
      return;
    }

    console.log('jump to hose', document.referrer);
    window.location = `${keyInfo.baseUrl}api/openapi/v3/auth/redirect?redirectUrl=${window.location}&corpId=${keyInfo.corpId}`;
  }

  async function getHoseUserInfo () {
    console.log('do getHoseUserInfo', keyInfo);
    if (!keyInfo.appId || !keyInfo.appSecret || !keyInfo.corpId) {
      alert('baseUrl与corpId 与 appId 与 appSecret不能为空');
      return;
    }

    const res = await axios.post('/api/staff', {
      "baseUrl": keyInfo.baseUrl,
      "appId": keyInfo.appId,
      "appSecret": keyInfo.appSecret,
      "code": urlParams.hoseCode
    })
    console.log('getHoseUserInfo', res)
    alert(`返回。状态：${res.status}. 正文：${JSON.stringify(res.data)}`)
  }

  return (
    <main>
      <Content />
      <Helmet>
        <title>平台跳转测试</title>
      </Helmet>

      待跳转平台地址: <input value={keyInfo.baseUrl} onChange={handleChangeBaseUrl}></input>
      <p></p>
      企业 ID: <input value={keyInfo.corpId} onChange={handleChangeCorpId}></input>
      <p></p>
      AppKey: <input value={keyInfo.appId} onChange={handleChangeAppId}></input>
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
