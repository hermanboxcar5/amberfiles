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

async function main(){
            
    let obj = await fetch("/api/check/"+window["filepath"])
    try{
      obj = await obj.json()
    } catch(e){
      console.log(e)
      obj = {exists:false}
    }
    
    console.log(obj)
    if(obj.exists){
      document.title=obj.title + " - Ambersys Files"
      document.getElementById("desc").innerHTML=obj.description
      document.getElementById("innertxt").innerText=obj.title
      document.getElementById("dl").setAttribute("download", obj.title+"."+obj.filetype)
      
      if(obj.locked){
        let userpass = window.prompt("This file is password protected. Please enter the password")
        populateIframe(document.querySelector('#viewr'), "/api/fetch/"+window["filepath"], {"Authentication":"Bearer "+btoa(userpass)})
      } else {
        //#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0
        populateIframe(document.querySelector('#viewr'), "/api/fetch/"+window["filepath"], {})
      }
    } else {
      populateIframe(document.querySelector('#viewr'), "/assets/msg/fail.html", {})
      document.getElementById("desc").innerHTML="None"
      document.getElementById("innertxt").innerText="404 - File not found"
      document.title="404 - File not found - Ambersys Files"
    }
    
}
main()