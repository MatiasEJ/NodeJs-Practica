const fs = require("fs");   

const requestHandler = (req,res)=>{
    const url = req.url;
    const method = req.method;
    if(url==='/'){
        res.setHeader("Content-Type","text/html");
        res.write('<html>');
        res.write('<head><title>Enter Mesagge</title></head>');
        res.write('<body><form action="/message" method="POST"><input type"text" name="message"><button type="submit">SEND</button> </input></form></body>');
        res.write('</html>');
        return res.end();
    }
    if(url==='/message' && method==='POST'){
        const body=[];
        req.on('data', (chunk)=>{
            console.log(chunk);
            body.push(chunk);
        });
        req.on('end',()=>{
            const parsedBody = Buffer.concat(body).toString();
            console.log(parsedBody);
            const message = parsedBody.split('=');
            fs.writeFile('message.txt',message, err =>{
                res.writeHead(302,{});
                console.log("ENVIO MENSAJE");
                return res.end();
            });
        });
    res.write('<html><body><h1>WAT</h1></body></html>');
    res.end();
    
    }
};


module.exports = {
    handler: requestHandler,
    someText: "Some text" 
};
