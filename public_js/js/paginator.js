document.addEventListener("DOMContentLoaded", ()=>{
    document.querySelectorAll("button.nav-btn").forEach((btn)=>{
        btn.addEventListener("click", (e)=>{
            let page = e.target.getAttribute("data-page")
            if(!e.target.disabled){
                const urlParams = new URLSearchParams(window.location.search);
                const urlType = urlParams.get('type');
                let selectedStatus = urlType;
                if(selectedStatus){
                    window.location.href = `?type=${selectedStatus}&page=${page}`
                }else{
                    window.location.href = `?page=${page}`
                }
                
            }
        })
    })
})