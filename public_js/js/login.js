document.addEventListener("DOMContentLoaded", ()=>{
    let send = document.getElementById("send")
    let login = document.getElementById("login")
    let pass = document.getElementById("pass")
    send.addEventListener("click", async (e)=>{
        let canCand = window.checkReq()
        if(canCand){
            send.setAttribute("disabled", "disabled")
            let data = {
                login: login.value,
                password: pass.value
            }
            let response = await fetch("/auth/login",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            let res = await response.json()
            if(res.status){
                if (res.redirectTo && !res.redirectTo.startsWith('/auth/')) {
                    window.location.href = res.redirectTo
                } else {
                    window.location.href = '/'
                }
            }else{
                send.removeAttribute("disabled")
                window.AlertMsg(res.msg)
            }
        }
    })
    
})