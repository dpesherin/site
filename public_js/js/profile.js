document.addEventListener('DOMContentLoaded', function() {
    const userId = document.getElementById("userId").value

    // Элементы DOM
    const editProfileBtn = document.getElementById('editProfileBtn')
    const changePasswordBtn = document.getElementById('changePasswordBtn')
    
    // Модальные окна
    const editProfileModal = document.getElementById('editProfileModal')
    const passwordModal = document.getElementById('passwordModal')
    
    // Кнопки закрытия модалок
    const closeEditModal = document.getElementById('closeEditModal')
    const closePasswordModal = document.getElementById('closePasswordModal')
    const cancelEdit = document.getElementById('cancelEdit')
    const cancelPassword = document.getElementById('cancelPassword')
    
    // Формы
    const editProfileForm = document.getElementById('editProfileForm')
    const passwordForm = document.getElementById('passwordForm')
    
    // Поля для отображения
    const emailDisplay = document.getElementById('email-display')
    const nameDisplay = document.getElementById('name-display')
    const lastnameDisplay = document.getElementById('lastname-display')

    // Открытие модального окна редактирования профиля
    editProfileBtn.addEventListener('click', function() {
        openModal(editProfileModal)
    })

    // Открытие модального окна смены пароля
    changePasswordBtn.addEventListener('click', function() {
        openModal(passwordModal)
    })

    // Функция открытия модального окна
    function openModal(modal) {
        modal.classList.add('active')
        document.body.style.overflow = 'hidden'
    }

    // Функция закрытия модального окна
    function closeModal(modal) {
        modal.classList.remove('active')
        document.body.style.overflow = ''
        
        // Сбрасываем формы
        if (modal === editProfileModal) {
            editProfileForm.reset()
        } else if (modal === passwordModal) {
            passwordForm.reset()
        }
    }

    // Закрытие модальных окон
    closeEditModal.addEventListener('click', () => closeModal(editProfileModal))
    cancelEdit.addEventListener('click', () => closeModal(editProfileModal))
    
    closePasswordModal.addEventListener('click', () => closeModal(passwordModal))
    cancelPassword.addEventListener('click', () => closeModal(passwordModal))

    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (editProfileModal.classList.contains('active')) {
                closeModal(editProfileModal)
            } else if (passwordModal.classList.contains('active')) {
                closeModal(passwordModal)
            }
        }
    })

    // Обработка формы редактирования профиля
    editProfileForm.addEventListener('submit', async function(e) {
        e.preventDefault()
        
        const saveBtn = document.getElementById('saveProfileBtn')
        const originalText = saveBtn.textContent
        
        // Получаем данные формы
        const formData = {
            email: document.getElementById('edit-email').value.trim(),
            name: document.getElementById('edit-name').value.trim(),
            lastname: document.getElementById('edit-lastname').value.trim(),
            id: userId
        }
        
        // Валидация
        if (!formData.email) {
            alert('Пожалуйста, введите email')
            return
        }
        
        // Блокируем кнопку
        saveBtn.disabled = true
        saveBtn.textContent = 'Сохранение...'
        
        try {
            // Здесь должна быть отправка данных на сервер
            // Например:
            
            const response = await fetch('/user/update/info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            
            const result = await response.json()
            
            if (result.status) {
                // Обновляем данные на странице
                updateDisplayedData(formData)
                window.AlertMsg('Профиль успешно обновлен')
                closeModal(editProfileModal)
            } else {
                window.AlertMsg(result.message || 'Ошибка при обновлении профиля')
            }
            
            closeModal(editProfileModal)
            
        } catch (error) {
            console.error('Ошибка:', error)
            alert('Произошла ошибка при сохранении данных')
        } finally {
            // Разблокируем кнопку
            saveBtn.disabled = false
            saveBtn.textContent = originalText
        }
    })

    // Функция обновления отображаемых данных
    function updateDisplayedData(data) {
        // Обновляем отображение
        emailDisplay.textContent = data.email
        
        if (data.name) {
            nameDisplay.textContent = data.name
            nameDisplay.classList.remove('empty')
        } else {
            nameDisplay.textContent = 'Не указано'
            nameDisplay.classList.add('empty')
        }
        
        if (data.lastname) {
            lastnameDisplay.textContent = data.lastname
            lastnameDisplay.classList.remove('empty')
        } else {
            lastnameDisplay.textContent = 'Не указано'
            lastnameDisplay.classList.add('empty')
        }
        
        // Обновляем заголовок
        document.querySelector('.profile-header h2').textContent = data.login
    }

    // Обработка формы смены пароля
    passwordForm.addEventListener('submit', async function(e) {
        e.preventDefault()
        
        const newPassword = document.getElementById('newPassword').value
        const confirmPassword = document.getElementById('confirmPassword').value
        
        // Валидация
        if (newPassword.length < 6) {
            window.AlertMsg('Пароль должен содержать минимум 6 символов')
            return
        }
        
        if (newPassword !== confirmPassword) {
            window.AlertMsg('Новый пароль и подтверждение не совпадают')
            return
        }
        
        try {
            const response = await fetch('/user/update/pass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userId,
                    pass: newPassword
                })
            })
            
            const result = await response.json()
            
            if (result.status) {
                window.AlertMsg('Пароль успешно изменен')
                closeModal(passwordModal)
            } else {
                window.AlertMsg(result.msg || 'Ошибка при смене пароля')
            }
        } catch (error) {
            alert('Произошла ошибка при отправке запроса')
        }
        
        closeModal(passwordModal)
    })
    
    // Валидация пароля в реальном времени
    const newPasswordInput = document.getElementById('newPassword')
    const confirmPasswordInput = document.getElementById('confirmPassword')
    
    function validatePasswords() {
        const newPassword = newPasswordInput.value
        const confirmPassword = confirmPasswordInput.value
        
        if (confirmPassword && newPassword !== confirmPassword) {
            confirmPasswordInput.style.borderColor = '#ff416c'
        } else {
            confirmPasswordInput.style.borderColor = ''
        }
    }
    
    newPasswordInput.addEventListener('input', validatePasswords)
    confirmPasswordInput.addEventListener('input', validatePasswords)
})