let getInputNumbersValue = function(input) {
	return input.value.replace(/\D/g, "")
}

let onPhoneInput = function(e) {
	let input = e.target,
		 inputNumbersValue = getInputNumbersValue(input),
		 formattedInputValue = "",
		 selectionStart = input.selectionStart

	if (!inputNumbersValue) {
		return input.value = ""
	}

	if (input.value.length != selectionStart) {
		return
	}

	if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
		// Russian phone number
		if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue
		let firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7"
		formattedInputValue = firstSymbols + " "
		if (inputNumbersValue.length > 1){
			formattedInputValue += "(" + inputNumbersValue.substring(1,4)
		}
		if (inputNumbersValue.length >= 5){
			formattedInputValue += ") " + inputNumbersValue.substring(4,7)
		}
		if (inputNumbersValue.length >= 8){
			formattedInputValue += "-" + inputNumbersValue.substring(7,9)
		}
		if (inputNumbersValue.length >= 10){
			formattedInputValue += "-" + inputNumbersValue.substring(9,11)
		}
	} else {
		// Not Russian phone number
		formattedInputValue = "+" + inputNumbersValue.substring(0, 16)
	}
	input.value = formattedInputValue;
}

let onPhoneKeyDown = function(e) {
	let input = e.target
	 if (e.keyCode == 8 && getInputNumbersValue(input).length == 1) {
	 	input.value = ""
	 }
}

$('input[data-tel-input]').on("input", onPhoneInput)
$('input[data-tel-input]').on("keydown", onPhoneKeyDown)