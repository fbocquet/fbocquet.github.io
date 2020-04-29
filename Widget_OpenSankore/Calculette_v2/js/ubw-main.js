/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var writeLine = "";
var resultLine = "";

var displayTrunk = "";
var historyTrunk = "";
var lastHistory = "";
var subtrunk = 0;
var itrunk = 0;
var trunkpos = 0;
var lastchar = {
	type:"NaN",
	value:"null"
};

var lastResult = "0";
var gDecimalSeparator = ".";
var gThousandsSeparator = ",";

var historyTxt = "0";

/*
 * Append the character at the end of the writeLine
 * This function will also refresh the view
 */
function appendToWriteLine( character ) {
	writeLine += character;
	$("#display").text(writeLine);
}

/*
 * This function will calculate the result of the writeLine
 */
function calculateResult(){
	var result;
	if(writeLine.length <= 1)
		result = eval(writeLine);
	else{
		var fNumber, lNumber, operation = "", fMinus = "";
		if(writeLine.charAt(0) == '-'){
			fMinus = "-";
			writeLine = writeLine.substr(1, writeLine.length);
		}
		operation = (writeLine.indexOf("+", 0) != -1)?writeLine.charAt(writeLine.indexOf("+", 0)):((writeLine.indexOf("*", 0) != -1)?writeLine.charAt(writeLine.indexOf("*", 0)):((writeLine.indexOf("/", 0) != -1)?writeLine.charAt(writeLine.indexOf("/", 0)):((writeLine.indexOf("-", 0) != -1)?writeLine.charAt(writeLine.indexOf("-", 0)):"")));
		fNumber = fMinus + writeLine.substring(0, writeLine.indexOf(operation, 0));
		lNumber = writeLine.substring(writeLine.indexOf(operation, 0)+1, writeLine.length);
		result = calcIt(fNumber, operation, lNumber);
	}

	$("#display").text(updateNumberForm(result));
	lastResult = result;
	lastchar.type = "Nan";
	lastchar.value = "";

	$("#historyBox").val($("#historyBox").val()+historyTrunk+"\n= "+updateNumberForm(result)+"\n\n");
	$("#historyBox").scrollTop(99999);

	displayTrunk = "";
	historyTrunk = "";

	if(window.sankore){
		window.sankore.setPreference('historyTxt', $("#historyBox").val());
	}

	lastHistory = $("#historyBox").val();
}

function calcIt(fNumber, operation, lNumber){
	var result, fCount = "", lCount = "", length = 0;
	//fCount = (fNumber.indexOf(".", 0) != -1)?fNumber.substring(fNumber.indexOf(".", 0)+1, fNumber.length):"";
	//lCount = (lNumber.indexOf(".", 0) != -1)?lNumber.substring(lNumber.indexOf(".", 0)+1, lNumber.length):"";
	//length = (fCount.length >= lCount.length)?fCount.length:lCount.length;
	//length = Math.pow(10, length);
	//fNumber = Math.round(fNumber * length);
	//lNumber = Math.round(lNumber * length);
	result = fNumber;
	
	switch(operation) {
		case "+":
			result = fNumber + lNumber;
			break;
		case "-":
			result = fNumber - lNumber;
			break;
		case "*":
			result = fNumber * lNumber;
			break;
		case "/":
			result = fNumber/lNumber;
			break;
	}
	return result;
}

function reset(){
	$("#display").text("0");
	writeLine="";
	lastchar.type = "NaN";
	displayTrunk="";
	historyTrunk="";
	$("#historyBox").val(lastHistory);
	$("#historyBox").scrollTop(99999);
}

function formatNumberWithDelimiters(number) {
	var delimiter = gThousandsSeparator;
	var numString = number.toString();

	if (!numString)
		return "0";
	
	var dot = numString.indexOf(gDecimalSeparator);
	if (dot == -1)
		dot = numString.length;
	
	var stop = numString.length-dot;
	var characteristic = numString.substr(0, dot);
	if (!parseInt(characteristic))
		return numString;

	// see if it's a negative number
	var numIsNegative =  (parseInt(characteristic) < 0)

	var newNumber = "";
	var delimiterCount = Math.floor((characteristic.length-1) / 3);
	var extras = characteristic.length % 3;
	if (!extras && characteristic.length > 2)
		extras = 3;

	if (extras)
		newNumber = newNumber + characteristic.substr(0, extras);

	for (var i=0;i< delimiterCount; i++) {

		if ( (0 == i) && numIsNegative && (extras == 1))
			newNumber = newNumber + characteristic.substr(extras + (i * 3), 3);
		else
			newNumber = newNumber + delimiter + characteristic.substr(extras + (i * 3), 3);
	}

	return (dot ? (newNumber + numString.substr(dot, stop)) : newNumber);
}

/*
 * Update the calculator screen,
 * the Client decide that we have to 
 * cut the number if its length is
 * up to 10 and round the number.
 * Quite strange but we did.
 */
function updateNumberForm(number) {
	if(String(number).length > 10) {
		// Convert the number into string to delete some numbers
		number = String(number).substr(0,10);
		// Convert the previous String into Integer and round it
		number = parseInt(number) + 1;
	}
	return formatNumberWithDelimiters(number);
}

function appendToDisplay(_char, v){
	var char = _char;

	// Display
	if($("#historyBox").val() === "0"){
		$("#historyBox").val("");
	};

	if(char == "-" && lastchar.type == "NaN"){
		char = "m";
	};

	// char is a number <
	if(char <= 0 || char > 0 || char == "." || char == "m" || char == "(" || char == ")"){
		if(char == "m"){
			char = "-";
		};
	
		if(lastchar.type == "NaN"){
			displayTrunk = "";
		};
	
		if(lastchar.value == "." && char == "."){
			writeLine = writeLine.substr(0, writeLine.length-1);
			displayTrunk = displayTrunk.substr(0, displayTrunk.length-1);
		};

		if(writeLine == "0"){
			if(char != "0"){
				if(char != "."){
					writeLine = String(char);
					displayTrunk = String(char);
					historyTrunk = String(char);
					lastchar.type = "Number";
				} else{
					writeLine += String(char);
					displayTrunk += String(char);
					historyTrunk += String(char);
					lastchar.type = "Number";
				}
			}
		} else {
			char = (char == ".")?((displayTrunk.indexOf(".", 0) != -1)?"":"."):char;
			writeLine += String(char);
			displayTrunk += String(char);
			historyTrunk += String(char);
			lastchar.type = "Number";
		}
	}
	// char is an operator
	else {
		if(writeLine.length === 0){
			var endCalc = writeLine;
			writeLine = lastResult + endCalc;
			historyTrunk = updateDisplay(lastResult);
		}
	
		if(lastchar.type == "NaN"){
			writeLine = writeLine.substr(0, writeLine.length-1);
			writeLine += char;
			$("#historyBox").val($("#historyBox").val().substr(0, $("#historyBox").val().length-1));
		}
		else{
			try{
				writeLine = eval(writeLine) + String(char);
			}catch(e){}
		}
	
		lastchar.type = "NaN";
		try{
			displayTrunk = eval(writeLine.substr(0, writeLine.length-1));
		}catch(e){}
		$("#historyBox").val($("#historyBox").val()+historyTrunk+char);
		$("#historyBox").scrollTop(99999);
		historyTrunk = "";
	}
	
	lastchar.value = char;
	$("#display").text(updateNumberForm(displayTrunk));
}
