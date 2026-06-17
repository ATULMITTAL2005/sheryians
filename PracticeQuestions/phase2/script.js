// function sum(...args) {
//     let total = 0;
//     for(let i = 0; i < args.length; i++) {
//         total += args[i];
//     }   
//     return total;
// }
// console.log(sum(1, 2, 3)); // Output: 6
// console.log(sum(4, 5));


// function countvowels(str) {
//     let count = 0;
//     for(let i = 0; i < str.length; i++) {
//         let char = str[i].toLowerCase();
//         if(char === "a" || char === "e" || char === "i" || char === "o" || char === "u") {
//             count++;
//         }   
//     }
//     return count;
// }
// console.log(countvowels("Hello World")); // Output: 3
// console.log(countvowels("JavaScript")); // Output: 3


// function palindrome(str) {
  
//     let reversedStr = str.split("").reverse().join("");
//     return str === reversedStr;
// }
// console.log(palindrome("racecar")); // Output: true
// console.log(palindrome("hello")); // Output: false 


// function main(callback) {
//     callback();
//     callback();
// }

// function count() {
//     var count = 0;
//    while(count < 5) {
//     console.log(count+"hello");
//     count++;
   
//     }
//      return count;
// }


// var vv =main(count);
// console.log(vv);



// function outer(){
//     return function inner() {
//         console.log("This is the inner function");
//     }
// }
// var innerFunction = outer();
// console.log(innerFunction()());



function Login(Name , callback) {
    console.log("Welcome " + Name);
    callback();
}


function display() {
    console.log("You have successfully logged in");
}

Login("Alice", display);

(function() {
    console.log("I run immediately!");
})();

(function (name) {
    console.log("Hello, " + name + "!");
})("Bob");


let nums = [1, 2, 3, 4, 5];
nums.forEach((value, index ) => {
    console.log(index, value);
})


let users = [{name: "A", age: 20}, {name: "B", age: 30}];
let user = users.find(u => u.age > 25);
console.log(user); 


let nums2 = [1, 2, 3, 4, 5];
var hello = [...nums2,8,9,10];
console.log(hello);
let max = Math.max(...nums2);
console.log(max);

