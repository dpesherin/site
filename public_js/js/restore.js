document.addEventListener("DOMContentLoaded", ()=>{
    let code = document.getElementById("code")
    let send = document.getElementById("send")
    let hrefArr = window.location.href.split("/")
    let guid = hrefArr[5]

    send.addEventListener("click", async (e)=>{
        send.setAttribute("disabled", "disabled")
        e.preventDefault()
        if(code.value){
            let data = {
                code: code.value,
                guid: guid
            }
            let response = await fetch("/auth/checkcode", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            let res = await response.json()
            if(res.status){
                document.getElementById("form").remove()
                let formChange = document.createElement("div")
                formChange.classList.add("fields")
                let header = document.createElement("h1")
                header.classList.add("modern")
                header.innerText = "Смена пароля"
                formChange.append(header)
                let row = document.createElement("div")
                row.classList.add("row")
                let label = document.createElement("label")
                label.classList.add("modern")
                label.setAttribute("for", "pass")
                label.innerText = "Введите новый пароль"
                row.append(label)
                let pass = document.createElement("input")
                pass.setAttribute("type", "password")
                pass.classList.add("modern")
                pass.id = "pass"
                row.append(pass)
                formChange.append(row)
                let btn = document.createElement('button')
                btn.classList.add("orange-btn", "w-100")
                btn.id = "sendPass"
                btn.innerText = "Сменить пароль"
                btn.addEventListener("click", async (e)=>{
                    e.preventDefault()
                    if(pass.value){
                        let data = {
                            password: pass.value,
                            guid: guid
                        }
                        let response = await fetch("/auth/changepass", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
                        })
                        let res = await response.json()
                        if(res.status){
                            window.location.href = "/auth/login"
                        }else{
                            Alert(res.msg)
                        }
                    }else{
                        pass.classList.add("wrong")
                    }
                })
                formChange.append(btn)
                document.querySelector("div.content").append(formChange)
            }else{
                send.removeAttribute("disabled")
                window.AlertMsg(res.msg)
            }
        }else{
            code.classList.add("wrong")
        }
    })
})