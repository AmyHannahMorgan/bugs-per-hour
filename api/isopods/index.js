const axios = require('axios').default;
const Twitter = require('twitter');
const { Writable } = require('stream');
const limit = 51000;

module.exports = async (req, res) => {
    if(process.env.bph_pass === req.query.pass){
        let time = Date.now()
        const client = new Twitter({
            consumer_key: process.env.twitter_api_key,
            consumer_secret: process.env.twitter_api_secret,
            access_token_key: process.env.isopods_token,
            access_token_secret: process.env.isopods_secret
        });
    
        let accReq = await axios.get(`https://api.gbif.org/v1/occurrence/search?taxon_key=643&offset=${rng(0, limit)}&limit=1&mediaType=StillImage`);
        let imageReq = await axios.get(accReq.data.results[0].media[0].identifier, {
            responseType: 'stream'
        });
        let twitMedInit = await client.post('media/upload', {
            command: 'INIT',
            total_bytes: imageReq.headers['content-length'],
            media_type: imageReq.headers['content-type']
        });
    
        let index = 0
        let requestArray = []
        let twitWriable = new Writable({
            async write(chunk, encoding, callback) {
                let req = client.post('media/upload', {
                    command: 'APPEND',
                    media_id: twitMedInit.media_id_string,
                    media: chunk,
                    segment_index: index
                });
                requestArray.push(req);
                console.log(index);
                index++;
                callback();
            }
        })
        imageReq.data.on('close', () => {
            Promise.all(requestArray).then(async requests => {
                console.log('finalizing')
                let req = await client.post('media/upload', {
                    command: 'FINALIZE',
                    media_id: twitMedInit.media_id_string
                }).catch(err => {
                    if(err.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    }
                    console.log(err)
                });
                let post = await client.post('statuses/update', {
                    status: `Species: ${accReq.data.results[0].species} \n\nPhoto credit: ${accReq.data.results[0].rights}`,
                    media_ids: req.media_id_string
                })
                console.log(post);
                console.log(Date.now() - time);
                res.send(post);
            })
        })
        imageReq.data.pipe(twitWriable);
    }
    else {
        res.status(401).send('No.');
    }
}

function rng(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}