$(document).ready(function() {
    // Конфигурация (можно менять под свои нужды)
    var tabsConfig = {
        containerAttr: 'data-tabs-container',
        triggerAttr: 'data-tab-trigger',
        targetAttr: 'data-tab-target',
        idAttr: 'data-tab-id',
        activeClass: 'is-active',
        hiddenClass: 'is-hidden',
        showClass: 'is-visible'
    };
    
    // Инициализация табов
    function initCustomTabs() {
        // Находим все контейнеры
        $('[' + tabsConfig.containerAttr + ']').each(function() {
            var $container = $(this);
            
            // Находим триггеры и цели
            var $triggers = $container.find(`[${tabsConfig.triggerAttr}]`);
            var $targets = $container.find(`[${tabsConfig.targetAttr}]`);
            
            // Обработчик клика
            $triggers.on('click', function(e) {
                e.preventDefault();
                
                var $trigger = $(this);
                var tabId = $trigger.attr(tabsConfig.idAttr);
                
                // Деактивируем все
                $triggers.removeClass(tabsConfig.activeClass);
                $targets.removeClass(tabsConfig.showClass).addClass(tabsConfig.hiddenClass);
                
                // Активируем текущий
                $trigger.addClass(tabsConfig.activeClass); 
                $(`[${tabsConfig.targetAttr}][${tabsConfig.idAttr}="${tabId}"]`).removeClass(tabsConfig.hiddenClass).addClass(tabsConfig.showClass);
            });
        });
    }
    
    initCustomTabs();
});