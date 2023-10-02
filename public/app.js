const express = require('express');
const dotenv = require('dotenv');
const { RtcTokenBuilder, RtcRole, RtmTokenBuilder, RtmRole } = require('agora-access-token');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

const nocache = (_, resp, next) => {
    resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next();
}


const generateRTCToken = (req, resp) => {
    resp.header('Access-Control-Allow-Origin', '*');

    const channelName = req.params.channel;
    if (!channelName) {
        return resp.status(400).json({ 'error': 'channel is required' });
    }

    let uid = req.params.uid;
    if (!uid || uid === '') {
        return resp.status(400).json({ 'error': 'uid is required' });
    }

    let role = RtcRole.PUBLISHER;

    let expireTime = 3600;

    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;

    let token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);

    return resp.json({ 'rtcToken': token });
}

app.get('/rtc/:channel/:uid', nocache, generateRTCToken);

app.get('/', function (req, res) {
    console.log("Render Working");
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
