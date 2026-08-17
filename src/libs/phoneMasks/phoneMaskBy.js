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

	if (["1", "2", "3", "4"].indexOf(inputNumbersValue[0]) > -1) {
		// Belorussian phone number
		
        if (inputNumbersValue.length == 1){
			formattedInputValue += "+375 (" + inputNumbersValue
		}
		if (inputNumbersValue.length > 1){
			formattedInputValue += "+375 (" + inputNumbersValue.substring(3, 5)
		}
		if (inputNumbersValue.length > 5){
			formattedInputValue += ") " + inputNumbersValue.substring(5, 8)
		}
		if (inputNumbersValue.length > 8){
			formattedInputValue += "-" + inputNumbersValue.substring(8, 10)
		}
		if (inputNumbersValue.length > 10){
			formattedInputValue += "-" + inputNumbersValue.substring(10, 12)
		}
	} else {
		// Not Belarussian phone number
		formattedInputValue = "+" + inputNumbersValue.substring(0, 16)
	}
	input.value = formattedInputValue;
}

let onPhoneKeyDown = function(e) {
	let input = e.target
	 if (e.keyCode == 8 && getInputNumbersValue(input).length == 3) {
	 	input.value = ""
	 }
}

$('input[data-tel-by-input]').on("input", onPhoneInput)
$('input[data-tel-by-input]').on("keydown", onPhoneKeyDown)