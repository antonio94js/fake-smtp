import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 80;

app.set('port', process.env.PORT || 80);

app.use(express.static(path.join(__dirname, '../assets')));
// console.log(path.join(__dirname, '../assets'));

app.use(function(req, res, next) {

    res.status(404).send({
        message: "No HTTP resource was found that matches the request URI",
        endpoint: req.url,
        method: req.method
    });
});

app.use(function(err, req, res, next) {
    // console.error(err.stack);
    res.status(500).json(err);
});

const server = app.listen(app.get('port'), (error) => {
    if (error)
        throw error;
    else
        console.info(`sever running on port ${port}`);

});
