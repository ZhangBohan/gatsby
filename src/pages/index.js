import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import '../styles/index.css';

function Index() {
  const [date, setDate] = useState(null);
  const [keyInfo, setKeyInfo] = useState({appId: '', appSecret: ''});
  const isSSR = typeof window === "undefined"
  
  if (!isSSR) {
    console.log('document.referrer', document.referrer);
    const keyInfoString = localStorage.getItem('KEY_INFO_STRING')
    if (keyInfoString) {
      setKeyInfo(JSON.parse(keyInfoString))
    }
  }


  useEffect(() => {
    async function getDate() {
      const res = await fetch('/api/date');
      const newDate = await res.text();
      setDate(newDate);
    }
    getDate();
  }, []);

  function handleChange (key, value) {
    console.log('handleChange', key, value, keyInfo);
    keyInfo[key] = value;
    setKeyInfo(keyInfo);
    localStorage.setItem(JSON.stringify(keyInfo))
  }

  function handleChangeAppId (event) {
    handleChange('appId', event.target.value);
  }

  function handleChangeAppSecret (event) {
    handleChange('appSecret', event.target.value);
  }

  return (
    <main>
      <Helmet>
        <title>Gatsby + Node.js (TypeScript) API</title>
      </Helmet>
      <h1>Gatsby + Node.js (TypeScript) API</h1>
      <h2>The date according to Node.js is:</h2>
      <p>{date ? date : 'Loading date...'}</p>

      <input value={keyInfo.appId} onChange={handleChangeAppId} />
      <p />
      <input value={keyInfo.appSecret} onChange={handleChangeAppSecret} />
      <p />

      <input type="button">获取用户信息</input>
    </main>
  );
}

export default Index;
