(function(){
  function drawItems(title, items){
    if (!title || !items || !items.length || title.toLowerCase()==='recipes'){
      return;
    }
    var container = document.getElementById('beersmithtaplist'),
    h2 = document.createElement('h2'),
    titleNode = document.createTextNode(title),
    beersUl = document.createElement('ul');
    h2.appendChild(titleNode);
    container.appendChild(h2);
    for (var i=0; i<items.length; i++){
      var beer = items[i],
      li = document.createElement('li'),
      name = document.createElement('h3'),
      nameNode = document.createTextNode(beer.name),
      abv = (beer.og_measured - beer.fg_measured) * 131.25,
      abvSpan = document.createElement('span'),
      abvText = document.createTextNode(Math.round(abv * 100) / 100);
      name.appendChild(nameNode);
      abvSpan.appendChild(abvText);
      li.appendChild(name);
      li.appendChild(abvSpan);
      beersUl.appendChild(li);
    }
    container.appendChild(beersUl);
  }

  function getTapList(url){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var taplist = JSON.parse(xmlhttp.responseText);
          for (var key in taplist){
            if (taplist.hasOwnProperty(key)){
              drawItems(key, taplist[key]);
            }
          }
          console.log(taplist);
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
  getTapList(beersmith_app_url);
})()
