// const form = document.querySelector("form");

// if (form)
// {
//     form.addEventListener("submit", async(e) => {
//         e.preventDefault();

//         const url = "http://localhost:3000/message";

//         const formData = new FormData(form);
//         const formDataSerialized = Object.fromEntries(formData);
//         console.log(formDataSerialized);

//         try {
//             const response = await fetch(url, {
//               method: "POST",
//               body: JSON.stringify(formDataSerialized),
//               headers: {
//                 "Content-Type": "application/json",
//               },
//             });

//             //const json = await response.json();
//             // console.log(json);
//           } catch (e) {
//             console.error(e);
//         }
//         // var  username_text = document.getElementsByClassName("username")[0].value;
//         // var message_text = document.getElementsByClassName("message")[0].value;
        
//         // var lines = message_text.split('\n');
//         // var my_text = `<b>${username_text} sent you a message:</b>%0A`;
//         // for(var i = 0; i < lines.length; i++){
//         //     my_text += `${lines[i]}%0A`;
//         // }

//         // // var my_text = `<b>${username_text} sent you a message:</b>%0A${message_text}`;

//         // var token = "5229361122:AAEX4f_7wI76f4UHVNDoOX-RcqVlkQbgRs4";
//         // var chat_id = -630008424;
//         // var url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${my_text}&parse_mode=html`

//         // var api = new XMLHttpRequest();
//         // api.open("GET", url, true);
//         // api.send();

//         // console.log("Message sucessfully sent:",username_text, message_text)
//     })
// }
