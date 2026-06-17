// const form = document.querySelector("form");
// const users = document.querySelector(".users");
// const button = document.querySelector("button");

// form.addEventListener("submit", function (event) {
//     event.preventDefault();
//     userData.push({
//         name: document.getElementById("name").value,
//         email: document.getElementById("email").value
//     });
    

//     const name = document.getElementById("name").value;
//     const email = document.getElementById("email").value;
//     if(name.trim() === "" || email.trim() === "") return ;
//        users.innerHTML += `
//         <div class="user-card">
//             <img src="https://via.placeholder.com/150" alt="${name}">
//             <h2>${name}</h2>
//             <p>Roll Number: ${email}</p>
//         </div>
//     `;
//     }
  

// );

// const userData = [
//     {
//         name: "Atul",
//         email: "atul@example.com",
//         roll: 101,
//         image: "https://via.placeholder.com/150"
//     },
//     {
//         name: "Rahul",
//         email: "rahul@example.com",
//         roll: 102,
//         image: "https://via.placeholder.com/150"
//     },
//     {
//         name: "Priya",
//         email: "priya@example.com",
//         roll: 103,
//         image: "https://via.placeholder.com/150"
//     }
// ];

// function displayUsers(usersData) {
//     users.innerHTML = "";
//     usersData.forEach(user => {
    
//     users.innerHTML += `
//         <div class="user-card">
//             <img src="${user.image}" alt="${user.name}">
//             <h2>${user.name}</h2>
//             <p>Roll Number: ${user.roll}</p>
//         </div>
//     `;
// });
// }





 


//     let letname = "letname";
// var varname = "varname";
// const constname = "constname";
   
// }

// //  console.log(letname);
//     console.log(varname);
//     console.log(constname);


for (const i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 10000);
}
// Output: 3 3 3   😱  (not 0 1 2)