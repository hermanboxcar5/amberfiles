// let baseurl = "redesigned-garbanzo-69rj4797rwr6hxpg-4000.app.github.dev"
// let baseurl = "files.ambersys.app"

// let thisurl = `https://${baseurl}/`

let root = __dirname
// let root = ""

let express = require('express');
let app = express();
let fs = require('fs/promises')
let crypto = require('crypto');
let hashkey = "ambersys"
app.use("/assets", express.static(__dirname + "/assets"));


function btoa(txt){
  return Buffer.from(txt, "utf-8").toString('base64')
}

function atob(txt){
  return Buffer.from(txt, 'base64').toString("utf-8")
}




function hash(val){
  let browns = crypto.createHash('sha256', hashkey).update(val).digest('hex');
  return browns
}

async function filecheck(filename){
  let exists = true;
  try {
    await fs.access(`${root}/serve/meta/${filename}.json`)
  } catch (e){
    exists = false;
  }
  return exists
}







app.get("/api/check/:file", async (req, res)=>{
  let filename = req.params.file
  let exists=await filecheck(filename)
  //exists done
  if(exists){
    let data = await fs.readFile(`serve/meta/${filename}.json`, "utf8")
    data = JSON.parse(data)
    res.json({
      exists:true,
      filetype:data.filetype,
      locked:data.locked,
      title:data.title
    })
  } else {
    res.json({
      exists:false
    })
  }
})


app.get("/api/fetch/:file", async (req, res)=>{
  let filename = req.params.file
  let exists = await filecheck(filename)
  //exists done
  if(exists){
    let data = await fs.readFile(`serve/meta/${filename}.json`, "utf8")
    data = JSON.parse(data)
    if(data.locked){
      if(req.headers.authentication){
        let hashedpassword = hash(data.password)
        let userpass = req.headers.authentication
        userpass = userpass.slice(7)
        userpass = hash(atob(userpass))
        if(userpass===hashedpassword){
          res.sendFile(`${__dirname}/serve/files/${filename}.${data.extension || data.filetype}`)
        } else {
          res.sendFile(`${__dirname}/auth.html`)
        }
      } else {
        res.sendFile(`${root}/auth2.html`)
      }
      
    } else {
      res.sendFile(`${__dirname}/serve/files/${filename}.${data.extension || data.filetype}`)
    }
  } else {
    res.status(404).end("ERROR 404: File not found. This should absolutely NOT happen. If it did, go find whoever made this and show this to them...")
  }
})





app.get('/', (req, res, next)=>{
    res.send(`<!DOCTYPE html>
  <html>

  <head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-JDWX1PFHXB"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-JDWX1PFHXB');
    </script>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Ambersys Files</title>
    <link rel="icon" type="image/x-icon" href="/assets/logo.png">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Comfortaa&family=Inter:wght@300&family=Work+Sans:wght@400;500&display=swap');
      body, div, h1, input, button {

        font-family:'Inter', sans-serif;
      }
      button {
      background-color:#242526ff;
      border: none;
      margin:5px;
      padding:5px;
      color:white;
      border-radius:20px;
      font-size:20px;
      }
      a {
      color:inherit;
      text-decoration:none;
      }
    </style>
  </head>

  <body style='text-align: center; '>
    <div id='header' style='text-align:left; width:100%; height:4vh; background-color:#242526ff;outline: 10px solid #242526ff;vertical-align: top;'>
      <img style='height:3vh; width:3vh; margin-top:0.5vh; margin-left:1vw;' src='/assets/logo.png'>
    <span>&nbsp;&nbsp;&nbsp;</span>
    <span style="height:4vh;color:white; font-size:3vh;line-height: 4vh;"><b>Ambersys Files</b></span>
    </div>
      <div id='spacer' style='height:6vh' >

      </div>
      <div id='viewer' style='text-align:center;width:80%; margin-left: auto;
        margin-right: auto; align-items: center; align-content: center;'>
        <h1>Welcome to Ambersys Files.</h1> <br>
    If you did not get a file url, there isn't too much here for you to see. In the meantime, 
    <br><button><a href="https://ambersys.app">Visit my website</a></button>
      </div>
    <script type="text/javascript" src="https://www.dropbox.com/static/api/2/dropins.js" id="dropboxjs" data-app-key="41ly3tw2brykru7"></script>
  </body>

  </html>`)
})



app.get('/:src/:id', (req, res) =>{
  let titlev = "Ambersys Files"
  let src=req.params.src
  let id = req.params.id
  let viewer = ''
  if(id && src){
    if(src=="db"){
      id=atob(id)
      let key = req.query.key
      if(!key){
        viewer='<h1>Error: Invalid Key</h1>'
      }
      viewer=`
    <iframe style='width:80vw; height:80vh; border:none;' src='https://www.dropbox.com/${id}?rlkey=${key}&dl=0&raw=1'></iframe>`
    } else if(src=="gh"){
      let filepath = atob(id)
      if(filepath.startsWith('/')){
        filepath = filepath.slice(1)
      }
      viewer=`<iframe src="https://raw.githubusercontent.com/${filepath}"</iframe>`

    } else if(src=="nv"){
      let filepath = atob(id)
      if(filepath.startsWith('/')){
        filepath = filepath.slice(1)
      }
      filepath = filepath.split(".")
      filepath.pop()
      filepath = filepath.join(".")

      titlev = `File Loading... - Ambersys Files`
      viewer=`File Viewer<br> <button><a href="/">Home</a></button><br>
      <iframe id="viewr" src="/assets/load.html"></iframe>`
      viewer +=`
      <button><a id="newtab" target="_blank" href="#">Open in a new tab</a></button>
      <button onclick="fs()">Fullscreen</button>
      <button><a id="dl" href = "#" download>Download</a></button>
      <script>
      function fs(){
        let elem = document.getElementById("viewr")
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
          elem.msRequestFullscreen();
        }
      }
  function populateIframe(iframe, url, headers) {
 fetch(url, {method:"GET", headers:headers}).then(res=>{console.log("1st stage done"); return res.blob()}).then(blob=>{
  console.log ("2nd stage done!")
  let bloburl = URL.createObjectURL(blob);
  iframe.src=bloburl
  //+"#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0"
  document.getElementById("newtab").href=bloburl
  document.getElementById("dl").href=bloburl
  
 })
  }
      </script>
      <script>

        async function main(){
            
            let obj = await fetch("/api/check/${filepath}")
            obj = await obj.json()
            if(obj.exists){
              document.title=obj.title + " - Ambersys Files"
              document.getElementById("dl").setAttribute("download", obj.title+"."+obj.filetype)
              if(obj.locked){
                let userpass = window.prompt("This file is password protected. Please enter the password")
                populateIframe(document.querySelector('#viewr'), "/api/fetch/${filepath}", {"Authentication":"Bearer "+btoa(userpass)})
              } else {
                //#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0
                populateIframe(document.querySelector('#viewr'), "/api/fetch/${filepath}", {})
              }
            } else {
              populateIframe(document.querySelector('#viewr'), "/assets/fail.html", {})
            }
            
        }
        main()
      </script>
      `
    } else {
        viewer=`<h1>Error: Provide Valid Source</h1>
        <button><a href="/">Home</a></button>
        `
    }
  } else {
    viewer=`<h1>Welcome to Ambersys Files.</h1> <br>
    That's an invalid link.<br>
    <button><a href="/">Home</a></button>
    <br>
    `
  }
  res.send(`<!DOCTYPE html>
<html>

<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-JDWX1PFHXB"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-JDWX1PFHXB');
  </script>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>${titlev}</title>
  <link rel="icon" type="image/x-icon" href="/assets/logo.png">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Comfortaa&family=Inter:wght@300&family=Work+Sans:wght@400;500&display=swap');
    body, div, h1, input, button {

      font-family:'Inter', sans-serif;
    }
    iframe {
    width: 90%;
    height:80vh;
    }
    button {
    background-color:#242526ff;
    border: none;
    margin:5px;
    padding:5px;
    color:white;
    border-radius:20px;
    font-size:20px;
    }
    a {
    color:inherit;
    text-decoration:none;
    }
  </style>
</head>

<body style='text-align: center; '>
  <div id='header' style='text-align:left; width:100%; height:4vh; background-color:#242526ff;outline: 10px solid #242526ff;vertical-align: top;'>
    <img style='height:3vh; width:3vh; margin-top:0.5vh; margin-left:1vw;' src='/assets/logo.png'>
  <span>&nbsp;&nbsp;&nbsp;</span>
  <span style="height:4vh;color:white; font-size:3vh;line-height: 4vh;"><b>Ambersys Files</b></span>
  </div>
    <div id='spacer' style='height:6vh' >
      
    </div>
    <div id='viewer' style='text-align:center;width:100%; align-items: center; align-content: center;'>
      ${viewer}
    </div>
  <script type="text/javascript" src="https://www.dropbox.com/static/api/2/dropins.js" id="dropboxjs" data-app-key="41ly3tw2brykru7"></script>
</body>

</html>`)
})
app.listen(5000)

  



