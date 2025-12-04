document.addEventListener("DOMContentLoaded", ()=>{
    let send = document.getElementById("send")
    let login = document.getElementById("login")
    let pass = document.getElementById("pass")
    send.addEventListener("click", async (e)=>{
        let canCand = checkReq()
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
                window.location.href = "/"
            }else{
                send.removeAttribute("disabled")
                Alert(res.msg)
            }
        }
    })
    
})