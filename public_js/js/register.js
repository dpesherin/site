document.addEventListener("DOMContentLoaded", ()=>{
    let send = document.getElementById("send")
    let login = document.getElementById("login")
    let pass = document.getElementById("pass")
    let passCheck = document.getElementById("passCheck")
    let email= document.getElementById("email")
    let name = document.getElementById("name")
    let lastname = document.getElementById("lastname")
    
    send.addEventListener("click", async (e)=>{
        e.preventDefault()
        let canSend = window.checkReq()
        if(pass.value !== passCheck.value){
            passCheck.classList.add("wrong")
            canSend = false
        }
        if(canSend){
            send.setAttribute("disabled", "disabled")
            let data = {
                login: login.value,
                password: pass.value,
                email: email.value,
                name: name.value,
                lastname: lastname.value
            }
            let response = await fetch("/auth/register", {
                method: "POST",
                 headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            let res = await response.json()
            if(res.status){
                window.location.href = "/auth/login"
            }else{
                send.removeAttribute("disabled")
                window.AlertMsg(res.msg)
            }
        }
    })
})