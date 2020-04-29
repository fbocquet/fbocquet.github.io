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

// Used to store the displayed formula
var displayLine = "";

// Used to store the computatable formula
var calculatedLine = "";
/* We use two vars because some characters are not the same for the
 * Code and for the Displaying.
 */

// Used to store the hidden memory of the calculator
var memoryResult = 0;

// Used to store the hidden OP
var hiddenOP = "";

// History
var history	= "";

/*
 * Append the character at the end of the displayLine
 * This function will also refresh the view
 */
function appendToWriteLine(calculatedCharacter, displayedCharacter) {
	calculatedLine += calculatedCharacter;
	
	if( displayLine === "0" ) {
		displayLine = displayedCharacter;
		$("#displayResult").text("");
	} else {
		displayLine += displayedCharacter;
	}
	
	$("#displayFormula").text(displayLine);
}

/*
 * This function will calculate the result of the displayLine
 */
function calculateResult() {
	result = eval(calculatedLine);
	$("#historyBox").val(calculatedLine);
	
	$("#displayResult").text(result);
	
	history += displayLine + " = " + result + "\n";
	$("#historyBox").val(history);
		
	resetCalculateLine();
}

/*
 * This function will reset the displayLine and the resultLine
 */
function reset() {
	resetCalculateLine();
	hiddenOP = "";
	history = "0";
	$("#historyBox").val(history);
	$("#displayFormula").text(displayLine);
	$("#displayResult").text("0");
}

/*
 * Reset the calculate field, both hidden and displayed
 */
function resetCalculateLine() {
	displayLine = "0";
	calculatedLine = "";
}

/*
 * Define the value of the operator when hit the OP button
 */
function defineOperator() {
	hiddenOP = calculatedLine;
	resetCalculateLine();
}

/*
 * Use the operation store in hiddenOP
 */
function useOperator() {
	calculatedLine += hiddenOP;
	//appendToWriteLine(calculatedLine);
	calculateResult();
}

/*
 * Add the calculatedLine to the memory slot
 * reset both display and resultLine
 */
function memoryAdd() {
	appendToWriteLine("","M+");
	memoryResult = parseInt(memoryResult) + eval(calculatedLine);
	$("#displayFormula").text(displayLine);
	displayMemoryActive();
	resetCalculateLine();
}

/*
 * Substract the calculatedLine to the memory slot
 * reset both displayLine and calculatedLine
 */
function memorySub() {
	appendToWriteLine("","M-");
	memoryResult = parseInt(memoryResult) - eval(calculatedLine);
	$("#displayFormula").text(displayLine);
	displayMemoryActive();
	resetCalculateLine();
}

/*
 * Insert into the calculatedLine the result of the memory
 * then you can use it to store something and use it after
 */
function memoryRead() {
	appendToWriteLine("memoryResult","MR");
	$("#displayFormula").text(displayLine);
}

/*
 * Just reset the memory...
 */
function memoryReset() {
	appendToWriteLine("","MC");
	memoryResult = 0;
	$("#displayResult").text(memoryResult);
	hideMemoryActive();
	resetCalculateLine();
}

/*
 * Display a "m" letter if the memory is active
 */
function displayMemoryActive() {
	$("#memoryActive").text("M");
}

/*
 * Remove the "m" letter when reset the memory
 */
function hideMemoryActive() {
	$("#memoryActive").text("");
}