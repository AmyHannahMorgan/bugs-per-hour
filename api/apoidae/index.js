const axios = require('axios').default;
const Twitter = require('twitter');
const { Writable, Duplex } = require('stream');
const limit = 100000;
const taxons = [
    '4334',
    '10544522',
    '4332',
    '10111891',
    '10614842',
    '7906',
    '4951600',
    '4671595',
    '9846461',
    '4352',
    '7901',
    '7905',
    '7908',
    '7911',
    '4345',
    '7916'
]

module.exports = async (req, res) => {
    if(process.env.bph_pass === req.query.pass){
        let time = Date.now()
        const client = new Twitter({
            consumer_key: process.env.twitter_api_key,
            consumer_secret: process.env.twitter_api_secret,
            access_token_key: process.env.apoidae_token,
            access_token_secret: process.env.apoidae_secret
        });
    
        let accReq = await axios.get(`https://api.gbif.org/v1/occurrence/search?taxon_key=${taxons[rng(0, taxons.length)]}&offset=${rng(0, limit)}&datasetKey=50c9509d-22c7-4a22-a47d-8c48425ef4a7&limit=1&mediaType=StillImage`);
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
        // let buff = Buffer.alloc(0);
        // let buffIndex = 0
        // let duplexStream = new Duplex({
        //     write(chunk, encoding, callback) {
        //         buff = Buffer.concat([buff, chunk]);
        //         callback();
        //     },
    
        //     read() {
        //         if(Array.isArray(buff)) buff = Buffer.concat(buff);
        //         if(buffIndex * 1000000 > buff.length) {
        //             this.push(null)
        //         }
        //         else {
        //             this.push(buff.slice((buffIndex * 1000000), ((buffIndex + 1) * 1000000 > buffIndex.length ? buffIndex.length : (buffIndex + 1) * 1000000)));
        //             buffIndex++;
        //         }
        //     }
        // });
        
        // res.setHeader('content-type', imageReq.headers['content-type']);
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