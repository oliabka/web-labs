function setFormMessage(formElement, type, message) {
    const messageElement=formElement.querySelector(".form-message");

    messageElement.textContent = message;
    messageElement.classList.remove("form-message-success", "form-message-error");
    messageElement.classList.add(`form-message-${type}`);
}

function setInputError(inputElement, message){
    inputElement.classList.add("form-input-error");
    inputElement.parentElement.querySelector(".form-input-error-message").textContent = message;
}

function clearInputError(inputElement)
{
    inputElement.classList.remove("form-input-error");
    inputElement.parentElement.querySelector(".form-input-error-message").textContent = "";
}

document.addEventListener("DOMContentLoaded",() =>{
    document.querySelectorAll(".form-input").forEach(inputElement =>{
        inputElement.addEventListener("blur", e=>{ 
            if (e.target.id =="signupUsername"  &&  e.target.value == ""){
                setInputError(inputElement, "Please enter data");
            }
            if (e.target.id =="signupEmail"  && !e.target.value.match(/^[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9.-]{1,255}$/u)){
                setInputError(inputElement, "Invalid email address");
            }
            if (e.target.id =="signupPassword"  &&  e.target.value == ""){
                setInputError(inputElement, "Please enter data");
            }
        });
        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});