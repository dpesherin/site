document.addEventListener('DOMContentLoaded', function() {
    const editToggle = document.getElementById('editToggle');
    const editableFields = document.querySelectorAll('#name, #lastname');
    const originalValues = {};

    // Сохраняем оригинальные значения
    editableFields.forEach(field => {
        originalValues[field.id] = field.value || '';
    });

    editToggle.addEventListener('click', function() {
        const isEditing = this.classList.toggle('editing');
        
        editableFields.forEach(field => {
            field.disabled = !isEditing;
            
            if (isEditing) {
                field.style.backgroundColor = '#fff';
                field.style.borderColor = '#624129';
                field.style.color = '#333';
                if (field.value === 'Не указано') {
                    field.value = '';
                }
                field.focus();
            } else {
                field.style.backgroundColor = '';
                field.style.borderColor = '';
                field.style.color = '';
                
                // Восстанавливаем оригинальное значение, если поле пустое
                if (!field.value.trim()) {
                    field.value = originalValues[field.id] || 'Не указано';
                }
            }
        });

        // Обновляем текст кнопки
        if (isEditing) {
            this.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Сохранить изменения
            `;
        } else {
            this.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Редактировать профиль
            `;
        }
    });
    
    // Обработка потери фокуса при редактировании
    editableFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (!editToggle.classList.contains('editing')) return;
            
            if (!this.value.trim()) {
                this.value = originalValues[this.id] || 'Не указано';
            }
        });
    });
});