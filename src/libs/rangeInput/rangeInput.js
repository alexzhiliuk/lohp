export function getNumberValue(input) {
	return input.value.replace(/\D/g, "")
}

export function addSpaces(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ' ' + '$2');
    }
    return x1 + x2;
}

$(".range-input input[type='range']").on('input', function() {
    let maxValue = $(this).attr('max'),
        currentValue = $(this).val()
    
    $(this).parent().children(".range-input__progress").css("width", `${currentValue / maxValue * 100}%`)

    $(this).parent().children(".range-input__number").val(addSpaces(currentValue))
})

$(".range-input input[type='range']").each(function(i, el) {
    let maxValue = $(el).attr('max'),
        currentValue = $(el).val()

    $(el).parent().children(".range-input__progress").css("width", `${currentValue / maxValue * 100}%`) 
})

$(".range-input__number").on('input', function(e) {
    let currentValue = getNumberValue(e.target),
        rangeInput = $(this).parent().children("input[type='range']"),
        maxValue = rangeInput.attr('max')

    if (!currentValue) currentValue = rangeInput.attr("min")
    if (Number(currentValue) > Number(maxValue)) currentValue = maxValue
    $(this).val(addSpaces(currentValue))
    
    $(this).parent().children(".range-input__progress").css("width", `${currentValue / maxValue * 100}%`)

    rangeInput.val(currentValue)
})


$(".double-range-input input[type='range']").on('input', function() {
    let maxValue = Number($(this).attr('max')),
        currentValue = Number($(this).val()),
        rangeInputMax = $(this).parent().find(".double-range-input__range_max"),
        rangeInputMin = $(this).parent().find(".double-range-input__range_min"),
        valueGap = Number($(this).parent().parent().attr("data-value-gap"))

    if ($(this).hasClass("double-range-input__range_min")) {

        if (currentValue + valueGap > rangeInputMax.val()) {

            currentValue = rangeInputMax.val() - valueGap
            $(this).val(currentValue)
            
        }
        
        $(this).parent().find(".double-range-input__progress-line").css("left", `${currentValue / maxValue * 100 + 1}%`)
        $(this).parent().parent().find(".double-range-input__number_min").val(addSpaces(currentValue))

    } else if ($(this).hasClass("double-range-input__range_max")) {

        if (currentValue - valueGap < rangeInputMin.val()) {

            currentValue = Number(rangeInputMin.val()) + valueGap
            $(this).val(currentValue)
            
        }

        $(this).parent().find(".double-range-input__progress-line").css("right", `${100 - currentValue / maxValue * 100 + 1}%`)
        $(this).parent().parent().find(".double-range-input__number_max").val(addSpaces(currentValue))

    }
    
})


$(".double-range-input__number").on('input', function(e) {
    let currentValue = getNumberValue(e.target),
        rangeInputMin = $(this).parent().parent().find(".double-range-input__range_min"),
        rangeInputMax = $(this).parent().parent().find(".double-range-input__range_max"),
        maxValue = rangeInputMin.attr('max'),
        valueGap = Number($(this).parent().parent().attr("data-value-gap"))

    if ($(this).hasClass("double-range-input__number_min")) {
        if (!currentValue) currentValue = rangeInputMin.attr("min")
        if (Number(currentValue) > Number(rangeInputMax.val()) - valueGap) { 
            currentValue = rangeInputMax.val() - valueGap
        }
        $(this).parent().parent().find(".double-range-input__progress-line").css("left", `${currentValue / maxValue * 100 + 1}%`)
        rangeInputMin.val(currentValue)
        $(this).val(addSpaces(currentValue))

    } else if ($(this).hasClass("double-range-input__number_max")) {
        if (!currentValue) currentValue = Number(rangeInputMin.val()) + valueGap
        if (Number(currentValue) > Number(maxValue)) {
            currentValue = maxValue
            $(this).val(addSpaces(currentValue))
        }
        if (Number(currentValue) < Number(rangeInputMin.val()) + valueGap) { 
            $(this).val(addSpaces(currentValue))
            currentValue = Number(rangeInputMin.val()) + valueGap
        } else {
            $(this).val(addSpaces(currentValue))
        }
        $(this).parent().parent().find(".double-range-input__progress-line").css("right", `${100 - currentValue / maxValue * 100 + 1}%`)
        rangeInputMax.val(currentValue)

    }

})