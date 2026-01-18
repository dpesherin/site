document.addEventListener("DOMContentLoaded", ()=>{
    const filterLine = document.getElementById('filter-line');
    const filterContainer = document.getElementById('filter');
    const filterModal = document.getElementById('filter-modal');
    const filterOptions = document.querySelectorAll('.filter-option');
    
    // Тексты для отображения
    const optionTexts = {
        'new': 'Новые',
        'canceled': 'Клиент отказался',
        'success': 'Создана фотосессия'
    };

     // Получаем текущий параметр из URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlType = urlParams.get('type');
    let selectedStatus = urlType;

    // Инициализация: показываем бадж если есть параметр в URL
    if (selectedStatus && optionTexts[selectedStatus]) {
        addBadge(selectedStatus);
    }

    // Показываем модальное окно при клике на строку
    filterLine.addEventListener('click', function(e) {
        // Не открываем окно при клике на крестик баджа
        if (!e.target.closest('.badge-remove')) {
            filterModal.style.display = 'block';
            
            // Позиционируем модальное окно
            const rect = filterLine.getBoundingClientRect();
            filterModal.style.top = (rect.height + 4) + 'px';
            filterModal.style.left = '0';
            filterModal.style.width = rect.width + 'px';
        }
    });

    // Обработка выбора опции
    filterOptions.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.dataset.value;
            
            // Убираем выделение со всех опций
            filterOptions.forEach(opt => opt.classList.remove('selected'));
            // Выделяем выбранную опцию
            this.classList.add('selected');
            
            // Добавляем бадж, если его еще нет
            if (value !== selectedStatus) {
                addBadge(value);
                selectedStatus = value;
            }
            
            // Скрываем модальное окно
            filterModal.style.display = 'none';
        });
    });

    // Функция добавления баджа
    function addBadge(value) {
        // Очищаем контейнер от старых баджей
        filterContainer.innerHTML = '';
        
        // Создаем новый бадж
        const badge = document.createElement('div');
        badge.className = 'filter-badge';
        badge.innerHTML = `
            <span class="badge-text">${optionTexts[value]}</span>
            <button class="badge-remove" data-value="${value}">×</button>
        `;
        
        filterContainer.appendChild(badge);
        
        // Добавляем обработчик удаления баджа
        const removeBtn = badge.querySelector('.badge-remove');
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            removeBadge();
        });
    }

    // Функция удаления баджа
    function removeBadge() {
        filterContainer.innerHTML = '';
        selectedStatus = null;
        
        // Снимаем выделение со всех опций
        filterOptions.forEach(opt => opt.classList.remove('selected'));
    }

    // Скрываем модальное окно при клике вне его
    document.addEventListener('click', function(e) {
        if (!filterLine.contains(e.target) && !filterModal.contains(e.target)) {
            filterModal.style.display = 'none';
        }
    });

    // Обработка кнопки "Найти"
    document.getElementById('filter-btn').addEventListener('click', function() {
        if (selectedStatus) {
            window.location.href = `?type=${selectedStatus}`
        } else {
            window.location.href="/admin/applications"   
        }
    });

    // Закрытие модального окна по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            filterModal.style.display = 'none';
        }
    });

    // Обновление позиции модального окна при ресайзе
    window.addEventListener('resize', function() {
        if (filterModal.style.display === 'block') {
            const rect = filterLine.getBoundingClientRect();
            filterModal.style.top = (rect.height + 4) + 'px';
            filterModal.style.left = '0';
            filterModal.style.width = rect.width + 'px';
        }
    });
})