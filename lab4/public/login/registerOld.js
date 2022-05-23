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

    const createAccountForm = document.querySelector("#createAccount");
    const url = "http://localhost:3000/register";
    var wrongInput = 0;

    createAccountForm.addEventListener("submit", async(e)=>{
        e.preventDefault();
        
        const formData = new FormData(createAccountForm);
        const formDataSerialized = Object.fromEntries(formData);
        console.log(formDataSerialized);


        document.querySelectorAll(".form-input").forEach(inputElement =>
        {
            if (inputElement.parentElement.querySelector(".form-input-error-message").textContent != "")
            {
                wrongInput+=1;
            }
        })

        console.log(wrongInput);
        // if (wrongInput>0)
        // {
        //     setFormMessage(createAccountForm, "error", "All fields must be filled correctly");
        // }else{
            // setFormMessage(createAccountForm, "success", "Registration complete");
            try {
                const response = await fetch(url, {
                  method: "POST",
                  body: JSON.stringify(formDataSerialized),
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
              } catch (e) {
                setFormMessage(createAccountForm, "error", "Server error");
                console.error(e);
            }
        // }
        
        wrongInput = 0;
    });

    document.querySelectorAll(".form-input").forEach(inputElement =>{
        setInputError(inputElement, "Please enter data");
        const firstPasswordInput = document.querySelector("#signupPassword");
        inputElement.addEventListener("blur", e=>{
            if (e.target.id =="signupUsername"  && !e.target.value.match(/^[A-Z]{1}[a-z]{1,29}$/u)){
                setInputError(inputElement, "Username must start with a big letter and contain only letters");
            }
            if (e.target.id =="signupEmail"  && !e.target.value.match(/^[A-Za-z0-9._%+-]{5,253}@[A-Za-z0-9.-]{1,63}\.[A-Za-z]{2,}$/u)){
                setInputError(inputElement, "Invalid email address");
            }
            if (e.target.id =="signupPassword"  && 
            !e.target.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)){
                setInputError(inputElement, "Password must include minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&)");
            }
            if (e.target.id =="signupConfirmPassword" && e.target.value!=firstPasswordInput.value){
                setInputError(inputElement, "Passwords must match");
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});