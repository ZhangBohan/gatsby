import { VercelRequest, VercelResponse } from '@vercel/node';

const axios = require('axios');


export default async (req: VercelRequest, res: VercelResponse) => {
    try {
        console.log(req.body);
        const { baseUrl, appId, appSecret, code } = req.body;

        // 鉴权
        const tokenRes = await axios.post(baseUrl + 'api/openapi/v1/auth/getAccessToken', {
            "appKey": appId,
            "appSecurity": appSecret
        })
        console.log('tokenRes', tokenRes.data);
        const token = tokenRes.data.value.accessToken;

        const staffRes = await axios({
            method: 'get',
            url: `${baseUrl}api/openapi/v3/auth/redirect/\$${code}`,
            params: {
                accessToken: token
            }
        })
        console.log('staffRes', staffRes.data);
        res.status(200).send(staffRes.data);
    } catch (e) {
        console.error('e', e);
        res.status(500).send(e.data);
    }
    
};
