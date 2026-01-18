document.addEventListener("DOMContentLoaded", ()=>{
    document.querySelectorAll("button.nav-btn").forEach((btn)=>{
        btn.addEventListener("click", (e)=>{
            let page = e.target.getAttribute("data-page")
            if(!e.target.disabled){
                window.location.href = `?page=${page}`
            }
        })
    })
})