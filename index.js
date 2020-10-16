
const bodyParser = require('body-parser');
const logger = require('morgan');
const app = require('express')();
const request = require('request');
require('dotenv/config');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.set('view engine', 'ejs');


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log('Listening on port: ', PORT);
    console.log('Open browser on: http://localhost:' + PORT);
});


app.get('/', (req, res) => {
    res.status(200).send('Ok');
});




app.get('/:newsId', (req, res) => {
    const newsId = req.params.newsId;


    getNewsDetails(newsId)
        .then(json => {

            let actualLinks = [];
            let actualMessage = json.fullMessage;


            for (var link in json.links) {
                actualLinks.push({
                    title: link,
                    url: 'https://sinhvien.bvu.edu.vn/' + json.links[link]
                });

                if (actualMessage.includes(link))
                    actualMessage = actualMessage.split(link).join('\n');
            }

            res.render('index', {
                message: actualMessage,
                links: actualLinks
            });
        })
        .catch(err => {
            console.log(err);
            res.send('');
        })
});


function getNewsDetails(id) {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            url: `http://bvu-news-getter.herokuapp.com/details/${id}`
        },
        (err, response, body) => {
            if (err || response.statusCode !== 200) {
                return resolve({});
            }

            try {
                body = JSON.parse(body);
                return resolve(body);
            }
            catch (err) {   //  không tìm thấy thông tin
                return resolve({});
            }
        });
    });
}