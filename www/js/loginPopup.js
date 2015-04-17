/**
 * Created by jsung on 4/15/15.
 */
var a = document.querySelector("pre");
var interval = setInterval(function(){
    if (a.innerHTML) {
        clearInterval(interval);
        localStorage.setItem("TSquareData",a.innerHTML);
    }
}, 300);