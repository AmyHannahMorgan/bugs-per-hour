const axios = require('axios').default;

run();

function run() {
    axios.get(`https://bugs-per-hour.amymorgan.vercel.app/api/apoidae/?pass=${process.env.PASS}`)
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
                run();
            }
            else console.log(err);
        }
        else console.log(err)
    });
}

