var kue = require('kue')
var queue = kue.createQueue()
var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')

const app = express()
const port = 3000
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

//enables cors
app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }));

function enqueue(code) {
    var job = queue.create('code', { title: 'some c++ code', code: code })
        .save(function (err) {
            if (!err) {
                console.log('saved ' + " " + job.id);
            } else {
                console.log(err)
            }
        });
    return job
}

queue.on('error', function(err) {
    console.log('error ' + err)
})

app.post('/run', (req, res) => {
    const job = enqueue(req.body.code)
    job.on('complete', (result) => {
        console.log("Job " + job.id + " completed: ")
        console.log(result)
        res.send(result)
    })
    job.on('failed', (err) => {
        res.send("Job " + job.id + " failed to run: " + err)
        console.log("job " + job.id + " failed to run")
    })
})

function test(next) {
    const code = `
    #include <iostream>
    using namespace std;

    int main() {
        cout << "Hello World " << endl;
        cerr << "Hello Dark Side " << endl;
        cout<<ans<<endl;
    }
    `
    const job = enqueue(code)
    job.on('complete', (result) => {
        console.log(result)
        next()
    })
}
test(() => {
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
})