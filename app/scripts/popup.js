window.addEventListener('click',function(e){
  if(e.target.href!==undefined && e.target.href.indexOf("http://www.ratemyprofessors.com/") !== -1){
    chrome.tabs.create({url:e.target.href})
  }
})