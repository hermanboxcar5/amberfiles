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
      //       function populateIframe(iframe, url, headers) {
      // var xhr = new XMLHttpRequest();
    
      // xhr.open('GET', url);
      // xhr.onreadystatechange = handler;
      // xhr.responseType = 'blob';
      // headers.forEach(function(header) {
      //   xhr.setRequestHeader(header[0], header[1]);
      // });
      // xhr.send();
    
      // function handler() {
      //   if (this.readyState === this.DONE) {
      //     if (this.status === 200) {
      //       // this.response is a Blob, because we set responseType above
      //       iframe.src = URL.createObjectURL(this.response);
      //     } else {
      //       console.error('XHR failed', this);
      //     }
      //   }
      // }
      // }
      function populateIframe(iframe, url, headers) {
     fetch(url, {method:"GET", headers:headers}).then(res=>{
        window.alert("1st stage done"); return res.blob()
    }).then(blob=>{
      window.alert("2nd stage done!")
      iframe.src=URL.createObjectURL(blob);
     })
      }
          // window.alert("/api/fetch/${filepath}")
          // populateIframe(document.querySelector('#viewr'), "/api/fetch/${filepath}", [])
            async function main(){
                let obj = await fetch("/api/check/${filepath}")
                obj = await obj.json()
                if(obj.locked){
    
                } else {
                    //#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0
                    populateIframe(document.querySelector('#viewr'), "/api/fetch/${filepath}", [])
                }
            }
            main()