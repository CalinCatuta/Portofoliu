const btn = document.querySelector(".navbtn")
const activ = document.querySelector("nav ul")

btn.addEventListener('click', ()=>{
    activ.classList.toggle('active')
})