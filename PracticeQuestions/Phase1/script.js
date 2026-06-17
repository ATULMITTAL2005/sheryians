
console.log(parseInt("500px"));

var str = "Hello    World    from   Javacript   ";
console.log(str.length);
console.log(str.toUpperCase());
console.log(str.toLowerCase()); 
console.log(str.includes("JavaScript"));
console.log(str.replace("World", "chutyion"));
var str2 = str.trim("  ");
console.log(str2);
var word = "Hi";
console.log(word.repeat(3));
console.log(str[1])


var num = 5.56789;
console.log(Math.round(num));

var num2 = 7;
console.log(Math.sqrt(num2));


var numveer = 25;
console.log(Number.isInteger(numveer));


let year = 2024;

if(year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) 
){    console.log(year + " is a leap year.");
}
else 
    {    console.log(year + " is not a leap year.");
}


var symbol = "A";
if(symbol === "a" || symbol === "e" || symbol === "i" || symbol === "o" || symbol === "u" ||
   symbol === "A" || symbol === "E" || symbol === "I" || symbol === "O" || symbol === "U") 
   {    console.log(symbol + " is a vowel.");
}
else {    console.log(symbol + " is a consonant.");
}

var num1 = 10;
var num2 = 5;
var operator = "%";

switch(operator) {
    case "+":
        console.log(num1 + num2);
        break;
    case "-":
        console.log(num1 - num2);
        break;  
    case "*":
        console.log(num1 * num2);
        break;  
    case "/":
        console.log(num1 / num2);
        break;  
    default:
        console.log("Invalid operator");
}
    
let day = 3;

switch(day) {
    case 1:
        console.log("Monday");
        break;
    case 2:

        console.log("Tuesday");
        break;      
    case 3:
        console.log("Wednesday");
        break;
    case 4:
        console.log("Thursday");


        break;  

    case 5:
        console.log("Friday");
        break;
    case 6:
        console.log("Saturday");
        break;
    case 7:
        console.log("Sunday");  
        break;
    default:
        console.log("Invalid day");
}   


// Check whether a number is even or odd using ternary operator

var number = 10;
var result = (number%2 === 0) ? "Even" : "Odd";
console.log(result);

var age= 19;
var checkvote = (age>=18) ? "Eligible to vote" : "Not eligible to vote";
console.log(checkvote);

var a = 10;
var b = 5;
var bda = (a > b) ? "a is greater than b" : (a < b) ? "a is less than b" : "a and b are equal";
console.log(bda);


var atew= "lolipop";
if(atew.startsWith("lo")) {
    console.log("The string starts with 'lo'");
}   
    else {
            console.log("The string does not start with 'lo'");


            // 10. Count characters excluding spaces
let sentence = "I love JavaScript";

let count = sentence.replace(/\s/g, "").length;

console.log("Total characters excluding spaces =", count);
    } 


    var number = (Math.random() * 100)*100;;
    console.log(Math.floor(number));
    var randp = Math.floor(1000 + Math.random() * 9000);
    console.log(randp);

    var str2 = "abc";
    console.log(str2);


    let fullName = "Aman Sharma";

let names = fullName.split(" ");
console.log(names);

let initials =
    names[0][0].toUpperCase() +
    names[1][4].toUpperCase();

console.log("Initials =", initials);
let light = "green";

switch(light){
    case "red":
        console.log("Stop");
        break;
    case "yellow":
        console.log("Ready");
        break;
    case "green":
        console.log("Go");
        break;
    default:
        console.log("Invalid traffic light color");
}



let x = 1;


console.log(++x);