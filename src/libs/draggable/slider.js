try {

    let mouseDown = false;
    let isDragging = false;
    let startX, scrollLeft;
    const slider = $('.draggable');
    
    const startDragging = function(e) {
        mouseDown = true;
        isDragging = false; // сбрасываем флаг перетаскивания
        startX = e.pageX - this.offsetLeft;
        scrollLeft = this.scrollLeft;
    }
    
    const stopDragging = function(e) {
        mouseDown = false;
    }
    
    const move = function(e) {
        e.preventDefault();
        if (!mouseDown) { return; }
        
        const x = e.pageX - this.offsetLeft;
        const scroll = x - startX;
        this.scrollLeft = scrollLeft - scroll;
        
        if (Math.abs(scroll) > 5) { // если движение больше 5px, считаем, что началось перетаскивание
            isDragging = true;
        }
    }
    
    // Предотвращаем переход по ссылке, если было перетаскивание
    slider.find('a').each(function(i, link) {
        link.addEventListener('click', (e) => {
            if (isDragging) {
                e.preventDefault(); // отменяем переход по ссылке
            }
        });
    });
    
    // Добавляем обработчики событий
    slider.on('mousemove', move);
    slider.on('mousedown', startDragging);
    slider.on('mouseup', stopDragging);
    slider.on('mouseleave', stopDragging);
    
} catch {

}
