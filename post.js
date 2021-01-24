const axios = require('axios').default;

run();

function apoidae() {
    axios.get(`https://bugs-per-hour.amymorgan.vercel.app/api/apoidae/?pass=${process.argv[2]}`)
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        if(err.reponse) {
            if(err.response.status = 401) {
                console.log(err);
            }
            else if(err.response.status = 502) {
                console.log('attempt failed, retrying')
                apoidae();
            }
            else console.log(err);
        }
        else console.log(err)
    });
}

function isopods() {
    axios.get(`https://bugs-per-hour.amymorgan.vercel.app/api/isopods/?pass=${process.argv[2]}`)
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        if(err.reponse) {
            if(err.response.status = 401) {
                console.log(err);
            }
            else if(err.response.status = 502) {
                console.log('attempt failed, retrying')
                isopods();
            }
            else console.log(err);
        }
        else console.log(err)
    });
}

function run() {
    apoidae();
    isopods();
}

