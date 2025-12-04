const Alert = (msg)=>{
    let alert = document.createElement("div")
    alert.classList.add("alert")
    let span = document.createElement("span")
    span.classList.add("alert-msg")
    span.innerText = msg
    alert.append(span)
    document.querySelector("body").append(alert)
    setTimeout(()=>{
        alert.remove()
    }, 5000)
}