const axios = require('axios');
const limit = 100000;

module.exports = async (req, res) => {
    let initReq = await axios.get('https://api.gbif.org/v1/occurrence/search?taxon_key=4334&taxon_key=10544522&taxon_key=4332&taxon_key=10111891&taxon_key=10614842&taxon_key=7906&taxon_key=4951600&taxon_key=4671595&taxon_key=9846461&taxon_key=4352&taxon_key=7901&taxon_key=7905&taxon_key=7908&taxon_key=7911&taxon_key=4345&taxon_key=7916&offset=0&limit=1');
    let accReq = await axios.get(`https://api.gbif.org/v1/occurrence/search?taxon_key=4334&taxon_key=10544522&taxon_key=4332&taxon_key=10111891&taxon_key=10614842&taxon_key=7906&taxon_key=4951600&taxon_key=4671595&taxon_key=9846461&taxon_key=4352&taxon_key=7901&taxon_key=7905&taxon_key=7908&taxon_key=7911&taxon_key=4345&taxon_key=7916&offset=${rng(0, (limit < initReq.data.count ? limit : initReq.data.count))}&limit=1`);
    res.send(accReq.data);
}

function rng(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}