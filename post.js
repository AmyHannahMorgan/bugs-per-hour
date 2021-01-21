const axios = require('axios').default;

run();

function run() {
    axios.get('https://bugs-per-hour.amymorgan.vercel.app/api/apoidae')
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
        run();
    });
}

