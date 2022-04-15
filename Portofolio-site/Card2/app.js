const carusel = [
    {
        id:0,
        name:"Bookmark in one click",
        text:"Easily share your bookmarks and collections with others. Create a shareable link that you can send at the click of a button.",
        img:"images/illustration-features-tab-1.svg"
    },
    {
        id:1,
        name:"Intelligent search",
        text: "Our powerful search feature will help you find saved sites in no time at all.  No need to trawl through all of your bookmarks.",
        img:"images/illustration-features-tab-2.svg"
    },
    {
        id:2,
        name:"Share your bookmarks",
        text:"Easily share your bookmarks and collections with others. Create a shareable link that you can send at the click of a button.",
        img:"images/illustration-features-tab-3.svg"
    }
]
// btn
const btn1 = document.querySelector(".btn1")
const btn2 = document.querySelector(".btn2")
const btn3 = document.querySelector(".btn3")

// id
const img = document.querySelector("#cont-img")
const title = document.querySelector("#title")
const text = document.querySelector("#text")


let currentItem = 0;

// change currentItem
btn1.addEventListener("click", ()=>{
    currentItem = 0;
    showContent(currentItem);
  })
  btn2.addEventListener("click", ()=>{
      currentItem = 1;
      showContent(currentItem);
  })
  btn3.addEventListener("click", ()=>{
      currentItem = 2;
      showContent(currentItem);
  })

// load content
window.addEventListener("DOMContentLoaded",function(){
   showContent(currentItem);
})

// show content
function showContent(content){
    const item = carusel[content]
    img.src = item.img;
    title.textContent = item.name;
    text.textContent = item.text;
}


// jquery add activ

$(document).ready(function () {
    $(document).on('click', '.btn-grp .btn', function(){
        $(this).addClass('active').siblings().removeClass('active')
    })
});