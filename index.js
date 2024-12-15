let root = __dirname

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
      title:data.title,
      description:data.description
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
    let data = await fs.readFile(`${root}/serve/meta/${filename}.json`, "utf8")
    console.log(data)
    data = JSON.parse(data)
    console.log(data)
    console.log(data.locked)
    if(data.locked){
      console.log("THIS IS LOCKED")
      if(req.headers.authentication){
        console.log("AUTH EXISTS")
        let hashedpassword = hash(data.password)
        let userpass = req.headers.authentication
        userpass = userpass.slice(7)
        userpass = hash(atob(userpass))
        console.log(userpass, hashedpassword)
        if(userpass===hashedpassword){
          console.log("Granted auth")
          res.sendFile(`${root}/serve/files/${filename}.${data.extension || data.filetype}`)
          return;
        } else {
          console.log("Granted auth? nope")
          res.sendFile(`${root}/auth.html`)
          return;
        }
      } else {
        console.log("AUTH DOES NOT WORK")
        res.sendFile(`${root}/auth2.html`)
        return;
      }
      
    } else{
      console.log("AUTH is failing")
      res.sendFile(`${root}/serve/files/${filename}.${data.extension || data.filetype}`)
    }
  } else {
    res.status(404).end("ERROR 404: File not found. This should absolutely NOT happen. If it did, go find whoever made this and show this to them...")
  }
})



app.get('/', (req, res, next)=>{
    res.sendFile(__dirname+"/assets/index.html")
})



app.get('/:src/:id', (req, res) =>{
  let description = ""
  let scriptrun = ""
  let filepath = req.params.id
  let titlev = "Ambersys Files"
  let src=req.params.src
  let id = req.params.id
  let viewer = ''
  if(id && src){
    if(src=="db"){
      id=atob(id)
      let key = req.query.key
      if(!key){
        viewer='/assets/msg/msg.html?<h1>Error: Invalid Key</h1>'
      }
      viewer=`https://www.dropbox.com/${id}?rlkey=${key}&dl=0&raw=1'`
    } else if(src=="gh"){
      filepath = atob(id)
      if(filepath.startsWith('/')){
        filepath = filepath.slice(1)
      }
      viewer=`https://raw.githubusercontent.com/${filepath}`

    } else if(src=="nv"){
      filepath = atob(id)
      if(filepath.startsWith('/')){
        filepath = filepath.slice(1)
      }
      filepath = filepath.split(".")
      filepath.pop()
      filepath = filepath.join(".")

      titlev = `File Viewer - Ambersys Files`
      viewer="/assets/msg/load.html"
      description = ""
      scriptrun = '<script src="/assets/viewer/viewer.js"></script>'
    } else {
        viewer=`/assets/msg/msg.html?Error: Provide valid source`
    }
  } else {
    viewer=`/assets/msg/msg.html?Error: Provide valid link</h1`
  }


  res.send(`<!DOCTYPE html>
<html>

<head>
  <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-JPHW1JN9QN"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-JPHW1JN9QN');
</script>


  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>${titlev}</title>
  <link rel="icon" type="image/x-icon" href="/assets/img/logo.png">
  <link rel="stylesheet" type="text/css" href="/assets/viewer/viewer.css">
</head>

<body style='text-align: center; '>
  <div id='header' style='text-align:left; width:100%; height:4vh; background-color:#242526ff;outline: 10px solid #242526ff;vertical-align: top;'>
    <a href="/">
    <img style='height:3vh; width:3vh; margin-top:0.5vh; margin-left:1vw;' src='/assets/img/logo.png'>
  <span>&nbsp;&nbsp;&nbsp;</span>
  <span style="height:4vh;color:white; font-size:3vh;line-height: 4vh;"><b>Ambersys Files</b></span>
  </a>
  </div>
    <div id='spacer' style='height:5vh' >
      
    </div>
    <div id="flexsec" class = "flexsec">
        <div id='viewer' class = "viewer" style='text-align:center; max-width:100%; align-items: center; align-content: center;'>
            <div id="headbar" class="headbar">
              <div id="headbarcontent" style="align-content:left;align-items: center; height:100%;line-height: 50px; vertical-align: middle; margin-left:20px; margin-right:20px; display:flex">
                <span style="flex:3;align-content:left;align-items:left;text-align:left">File Viewer v1.30</span>
                <span style="flex:6;align-content:left;align-items:left;max-width:50%">
                  <div id="innertxt" class="innertxt">${titlev}</div>
                </span>
                <span style="flex:3;align-content:right;align-items:right;text-align:right;">
                  <button onclick="fs()" class="sbutton"><img style="filter:invert(1)" src="/assets/img/expand.png" width="15px" height="15px"></button>
                  <a id="newtab" href="#" target="_blank"><button class="sbutton"><img style="filter:invert(1)" src="/assets/img/newtab.png" width="15px" height="15px"></button></a>
                  <a id="dl" href="#" download><button class="sbutton"><img style="filter:invert(1)" src="/assets/img/download.png" width="15px" height="15px"></button></a>
      
                </span>
              </div>
            </div>
            <iframe id="viewr" src="${viewer}"></iframe><div class="bottombar"></div>
          </div>
          <div id="description" class="description">
            <b style="margin-bottom:100px">Description</b>
            <div id="desc" class = "desc">
                ${description}
            </div>
          </div>
    </div>
  <script>
    window["filepath"]="${filepath}"
  </script>
  ${scriptrun}
  <script type="text/javascript" src="https://www.dropbox.com/static/api/2/dropins.js" id="dropboxjs" data-app-key="41ly3tw2brykru7"></script>
</body>
</html>`)
})
app.listen(5000)

  



