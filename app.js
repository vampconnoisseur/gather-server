const express = require('express');
const dotenv = require('dotenv');
const { RtcTokenBuilder, RtcRole, RtmTokenBuilder, RtmRole } = require('agora-token');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

const generateRTCToken = (req, resp) => {

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

    let token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, 0, privilegeExpireTime);

    return resp.json({ 'rtcToken': token });
}

app.get('/rtc/:channel/:uid', generateRTCToken);

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
