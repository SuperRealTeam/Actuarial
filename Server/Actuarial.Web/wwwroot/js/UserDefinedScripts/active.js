function InitSideMenu() {
    var pgurl = window.location.href.substr(window.location.href
        .lastIndexOf("/") + 1);
    $("ul.nav li.nav-item a.nav-link").each(function () {
        var href = $(this).attr("href").substr($(this).attr("href")
            .lastIndexOf("/") + 1);
        if (href === pgurl)
            $(this).parent().addClass("active-page");
    })
}
/* here's the code if u want to use plain javascript

function setActive() {
  aObj = document.getElementById('nav').getElementsByTagName('a');
  for(i=0;i<aObj.length;i++) { 
    if(document.location.href.indexOf(aObj[i].href)>=0) {
      aObj[i].className='active';
    }
  }
}

window.onload = setActive;

*/