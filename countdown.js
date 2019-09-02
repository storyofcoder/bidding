
   <%

          function initializeClock(id, endtime){
  var timeinterval = setInterval(function(){
    var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
    var html = new EJS({url: 'index.ejs'}).render(t);
   document.getElementById("id").innerHTML=html;
    if(t.total<=0){
      clearInterval(timeinterval);
    }
  },1000);
}
 %>