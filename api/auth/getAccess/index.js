const Oauth = require('oauth');

module.exports = (req, res) => {
    let oauth = new Oauth.OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        process.env.twitter_api_key,
        process.env.twitter_api_secret,
        '1.0A',
        'https://bugs-per-hour.amymorgan.vercel.app/api/auth/getAccess',
        'HMAC-SHA1'
    );

    oauth.getOAuthAccessToken(req.query.oauth_token, req.cookies.secret, req.query.oauth_verifier, (err, token, secret) => {
        console.log(`token: ${token} \n secret: ${secret}`);
        res.json({
            token: token,
            secret: secret
        })
    })
}