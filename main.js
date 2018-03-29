// // // var x, y, z;    
// // // x=5;
// // // y=6;
// // // z=x+y;

// // // document.getElementById('demo').innerHTML= "The value of z is " + z + ".";

// // // x= (-b +sqrt(b^2 + 4*a*c))/2*a

// // // x= (-b + sqrt((b ^ 2) - (4* a * c))) / (2 * a)

// // var a;
// /* Basic reset */
// *// Get all the keys from document
// var keys = document.querySelectorAll('#calculator span');
// var operators = ['+', '-', 'x', '÷'];
// var decimalAdded = false;

// // Add onclick event to all the keys and perform operations
// for(var i = 0; i < keys.length; i++) {
// 	keys[i].onclick = function(e) {
// 		// Get the input and button values
// 		var input = document.querySelector('.screen');
// 		var inputVal = input.innerHTML;
// 		var btnVal = this.innerHTML;
		
// 		// Now, just append the key values (btnValue) to the input string and finally use javascript's eval function to get the result
// 		// If clear key is pressed, erase everything
// 		if(btnVal == 'C') {
// 			input.innerHTML = '';
// 			decimalAdded = false;
// 		}
		
// 		// If eval key is pressed, calculate and display the result
// 		else if(btnVal == '=') {
// 			var equation = inputVal;
// 			var lastChar = equation[equation.length - 1];
			
// 			// Replace all instances of x and ÷ with * and / respectively. This can be done easily using regex and the 'g' tag which will replace all instances of the matched character/substring
// 			equation = equation.replace(/x/g, '*').replace(/÷/g, '/');
			
// 			// Final thing left to do is checking the last character of the equation. If it's an operator or a decimal, remove it
// 			if(operators.indexOf(lastChar) > -1 || lastChar == '.')
// 				equation = equation.replace(/.$/, '');
			
// 			if(equation)
// 				input.innerHTML = eval(equation);
				
// 			decimalAdded = false;
// 		}
		
// 		// Basic functionality of the calculator is complete. But there are some problems like 
// 		// 1. No two operators should be added consecutively.
// 		// 2. The equation shouldn't start from an operator except minus
// 		// 3. not more than 1 decimal should be there in a number
		
// 		// We'll fix these issues using some simple checks
		
// 		// indexOf works only in IE9+
// 		else if(operators.indexOf(btnVal) > -1) {
// 			// Operator is clicked
// 			// Get the last character from the equation
// 			var lastChar = inputVal[inputVal.length - 1];
			
// 			// Only add operator if input is not empty and there is no operator at the last
// 			if(inputVal != '' && operators.indexOf(lastChar) == -1) 
// 				input.innerHTML += btnVal;
			
// 			// Allow minus if the string is empty
// 			else if(inputVal == '' && btnVal == '-') 
// 				input.innerHTML += btnVal;
			
// 			// Replace the last operator (if exists) with the newly pressed operator
// 			if(operators.indexOf(lastChar) > -1 && inputVal.length > 1) {
// 				// Here, '.' matches any character while $ denotes the end of string, so anything (will be an operator in this case) at the end of string will get replaced by new operator
// 				input.innerHTML = inputVal.replace(/.$/, btnVal);
// 			}
			
// 			decimalAdded =false;
// 		}
		
// 		// Now only the decimal problem is left. We can solve it easily using a flag 'decimalAdded' which we'll set once the decimal is added and prevent more decimals to be added once it's set. It will be reset when an operator, eval or clear key is pressed.
// 		else if(btnVal == '.') {
// 			if(!decimalAdded) {
// 				input.innerHTML += btnVal;
// 				decimalAdded = true;
// 			}
// 		}
		
// 		// if any other key is pressed, just append it
// 		else {
// 			input.innerHTML += btnVal;
// 		}
		
// 		// prevent page jumps
// 		e.preventDefault();
// 	} 
// }
var ans = "0"; // current answer
var pressed = "0"; // keeps track of everything that has been pressed
var resultsScreen = $("#results");
var needsNumber = true; // keeps track of whether or not an operation was selected previously
var allButtons = $("button");
var decimalUsed = false; // makes sure that the user uses the decimal only once

$(document).ready(function(){
    allButtons.on("click", function(){
        var content = $(this).html();
        // special cases
        switch (content) {
            case "=":
                computeAnswer();
                break;
            case "AC":
                pressed = "0";
                break;
            case "CE":
                removeLastPressed();
                break;
            case "Ans":
                if (lastPressedOperation()) {
                    pressed += ans;
                }
                if (pressed == "0") { // if refreshed by pressing AC
                    pressed = ans;
                }
                break;
            default:
                var val = $(this).attr("value");
                console.log("You pressed " + val);
                if (val == null) { // if its an operation
                    if (!lastPressedOperation()) { // if allowed to press operation again
                        pressed += content;
                    }
                } else {
                    if (!(val == "." && decimalUsed)) {
                        if (pressed == "0") {
                            pressed = val;
                        } else {
                            pressed += val;
                        }
                        if (val ==".") {
                            decimalUsed = true;
                        }
                    }
                }
                console.log(pressed);
                break;
        }
        refreshDisplay();
    });
});

// post: displays the most current equation or answer
function refreshDisplay(){
    resultsScreen.html(pressed);
    console.log("Your current equation is " + pressed);
}

// post: calculates the answer;
// displays "syntax error" if there is one and alerts the user
function computeAnswer() {
    var val = 0;
    if (lastPressedOperation()) {
        pressed = "Error!";
        refreshDisplay();
        // alert("Syntax Error!");
    } else {
        pressed = pressed.replace("x", "*");
        pressed = eval(pressed) + "";
        ans = pressed;
        refreshDisplay();
    }
}

// post: returns true if the last pressed button was an operation; false otherwise
function lastPressedOperation() {
    var lastPressed = pressed.charAt(pressed.length - 1);
    return lastPressed == "x" || lastPressed == "+" || lastPressed == "-" || lastPressed == "/" || lastPressed == "%";
}

// post: removes the last pressed button from the screen and memory
function removeLastPressed() {
    if (pressed.length > 0) {
        pressed = pressed.substring(0, pressed.length - 1); // forget the last pressed button
        if (pressed == "") {
            pressed = "0";
        }
    }
}