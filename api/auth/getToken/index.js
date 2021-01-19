const oauth = require('oauth');

module.exports = async (req, res) => {
    let tokens = new oauth.OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        process.env.twitter_api_key,
        process.env.twitter_api_secret,
        '1.0A',
        'https://bugs-per-hour.amymorgan.vercel.app/api/auth/getAccess',
        'HMAC-SHA1'
    );
    tokens.getOAuthRequestToken({}, (err, token, secret, result) => {
        res.redirect(`https://api.twitter.com/oauth/authorize?oauth_token=${token}`);
    })
}