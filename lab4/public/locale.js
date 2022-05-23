document.addEventListener("DOMContentLoaded",() =>{
    const enLink = document.getElementById('en');
    const ruLink = document.getElementById('ru');

    enLink.addEventListener("click", e=>{
        e.preventDefault();
        document.cookie = "lang=en";
        location.reload();
    })
    ruLink.addEventListener("click", e=>{
        e.preventDefault();
        document.cookie = "lang=ru";
        location.reload();
    })
});

// function setFormMessage(formElement, type, message) {
//     const messageElement=formElement.querySelector(".form-message");

//     messageElement.textContent = message;
//     messageElement.classList.remove("form-message-success", "form-message-error");
//     messageElement.classList.add(`form-message-${type}`);
// }

// function setInputError(inputElement, message){
//     inputElement.classList.add("form-input-error");
//     inputElement.parentElement.querySelector(".form-input-error-message").textContent = message;
// }

// function clearInputError(inputElement)
// {
//     inputElement.classList.remove("form-input-error");
//     inputElement.parentElement.querySelector(".form-input-error-message").textContent = "";
// }

// document.addEventListener("DOMContentLoaded",() =>{
//     const loginForm = document.querySelector("#login");

//     loginForm.addEventListener("submit", e=>{
//         e.preventDefault();
//         setFormMessage(loginForm, "error", "Invalid username/password combination");
//     });

// });