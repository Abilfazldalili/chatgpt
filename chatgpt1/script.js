const prompt1 = document.querySelector("#prompt")
const sprompt1 = document.querySelector(".submit")
const chatContainer = document.querySelector(".chat-container")
const imagebtn = document.querySelector("#image")
const image = document.querySelector("#image>img")
const imageinput = document.querySelector("#image>input")
const Api_Url ="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAlTk_UVJpE81tiQWc4pUyNouZ8_Rfm0FE"
let user = {
    message:null,
    file:{
        mime_type:null,
        data:null
    }
}
async function generResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area")
    let RequestOption = {
        method:"POST",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
            "contents":[
                {"parts":[{"text":user.message},(user.file.data?[{"inline_data":user.file}]:[])

                ]
            }]
        })
    }
    try{
        let response = await fetch(Api_Url,RequestOption)
        let data = await response.json()
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
        text.innerHTML = apiResponse
    }
    catch(error){
        console.log(error)
    }
    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
        image.src=`./img/img.svg`
        image.classList.remove('choose')
        user.file = {}
    }
}
function createChatBox(html,classes){
    let div = document.createElement("div")
    div.innerHTML = html
    div.classList.add(classes)
    return div
}
function handlechatResponse(userMessage){
    user.message = userMessage
    let html = `<img src="./img/user.png" alt="" id="userImage" width="8%">
<div class="user-chat-area">
${user.message}
${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
</div>`
prompt1.value = ""
let userChatBox = createChatBox(html,"user-chat-box")
chatContainer.appendChild(userChatBox)
chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
setTimeout(() => {
    let html = `<img src="./img/ai.png" id="aiImg" width="10%">
    <div class="ai-chat-area">
    <img src="./img/loading.gif" class="load" width="50px">
    </div>`
    let aiChatBox = createChatBox(html,"ai-chat-box")
    chatContainer.appendChild(aiChatBox)
    generResponse(aiChatBox)
},600)
}
prompt1.addEventListener("keydown",(e) => {
    if(e.key == 'Enter'){
        handlechatResponse(prompt1.value)
    }
})
sprompt1.addEventListener("click",() => {
    handlechatResponse(prompt1.value)    
})
imageinput.addEventListener("change",() => {
    const file = imageinput.files[0]
    if(!file) return
    let reader = new FileReader()
    reader.onload = (e) => {
        let base64string = e.target.result.split(",")[1]
        user.file = {
        mime_type: file.type,
        data: base64string
    }
    image.src = `data:${user.file.mime_type};base64,${user.file.data}`
    image.classList.add('choose')
    }
    
    reader.readAsDataURL(file)
})
imagebtn.addEventListener("click",() => {
    imagebtn.querySelector("input").click()
})