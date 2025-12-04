document.addEventListener("DOMContentLoaded", ()=>{
    let send = document.getElementById("send")
    let login = document.getElementById("login")

    send.addEventListener("click", async(e)=>{
        e.preventDefault()
        if(!login.value){
            login.classList.add("wrong")
        }else{
            send.setAttribute("disabled", "disabled")
            let data = {
                login: login.value
            }
            let res = await fetch("/auth/forgot", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            send.removeAttribute("disabled")
            Alert(result.msg)
        }
    })
})