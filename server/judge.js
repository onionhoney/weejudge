const kue = require('kue');
const fs = require('fs');
const { exec } = require('child_process');
const queue = kue.createQueue();

queue.process('code', 2, function(job, done){
    run(job.data.code, done);
});

function run(code, done) {
    const path = './code.cpp';

    function run(){
        exec(`./a.out`, (err, stdout, stderr) => {
            if (err){
                done(null, {type:'RE', msg:stderr})
            } else {
                done(null, {type:'OK', stdout, stderr})
            }
        })
    }

    function compile() {
        exec(`g++ -std=c++14 ${path}`, (err, stdout, stderr) => {
            if (err){
                done(null, {type:'CE', msg:stderr});
            } else {
                run()
            }
        })
    }

    fs.writeFile(path, code, (err) => {
        if (err) throw err;
        compile()
    })
}
