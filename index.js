// let baseurl = "shadowy-broomstick-p5rqj5qjj7g37wx7-4000.app.github.dev"
let baseurl = "files.ambersys.app"
let thisurl = `https://${baseurl}/`
let express = require('express');
let app = express();
app.use("/assets", express.static(__dirname + "/assets"));
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
      titlev = `${filepath.split('/')[filepath.split('/').length-1]} - Ambersys Files`
      viewer=`File Viewer<br> <button><a href="${thisurl}">Home</a></button><br>
      <iframe id="viewr" src="${thisurl}assets/host/${filepath}"></iframe>`
      viewer +=`
      <button><a target="_blank" href="${thisurl}assets/host/${filepath}">Open in a new tab</a></button>
      <button onclick="fs()">Fullscreen</button>
      <button onclick="dl()">Download</button>
      <script>
      function download_file(fileURL, fileName) {
// for non-IE
if (!window.ActiveXObject) {
    var save = document.createElement('a');
    save.href = fileURL;
    save.target = '_blank';
    var filename = fileURL.substring(fileURL.lastIndexOf('/')+1);
    save.download = fileName || filename;
       if ( navigator.userAgent.toLowerCase().match(/(ipad|iphone|safari)/) && navigator.userAgent.search("Chrome") < 0) {
            document.location = save.href; 
// window event not working here
        }else{
            var evt = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': false
            });
            save.dispatchEvent(evt);
            (window.URL || window.webkitURL).revokeObjectURL(save.href);
        }   
}

// for IE < 11
else if ( !! window.ActiveXObject && document.execCommand)     {
    var _window = window.open(fileURL, '_blank');
    _window.document.close();
    _window.document.execCommand('SaveAs', true, fileName || fileURL)
    _window.close();
}
}
      function dl(){
        download_file("${thisurl}assets/host/${filepath}", "${filepath.split('/')[filepath.split('/').length-1]}")
      }
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
      </script>
      `
    } else {
        viewer=`<h1>Error: Provide Valid Source</h1>
        <button><a href="${thisurl}">Home</a></button>
        `
    }
  } else {
    viewer=`<h1>Welcome to Ambersys Files.</h1> <br>
    That's an invalid link.<br>
    <button><a href="${thisurl}">Home</a></button>
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
app.listen(4000)

  



