document.addEventListener('DOMContentLoaded', function() {
    const cardsContainer = document.querySelector('.cards');
    const cards = document.querySelectorAll('.card');
    const carouselDots = document.getElementById('carousel-dots');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentIndex = 0;
    let cardWidth = cards[0].offsetWidth + 25;
    let cardsVisible = 3;
    let totalCards = cards.length;
    
    
    // Функция для обновления количества видимых карточек в зависимости от ширины экрана
    function updateCardsVisible() {
        if (window.innerWidth <= 768) {
            cardsVisible = 1;
        } else if (window.innerWidth <= 992) {
            cardsVisible = 2;
        } else {
            cardsVisible = 3;
        }
        
        // Обновляем позицию карусели
        updateCarouselPosition();
        
        // Обновляем точки навигации
        updateDots();
    }
    
    // Генерация точек навигации
    function generateDots() {
        carouselDots.innerHTML = '';
        const dotsCount = totalCards - cardsVisible + 1;
        
        // Убедимся, что dotsCount не меньше 1
        const actualDotsCount = Math.max(1, dotsCount);
        
        for (let i = 0; i < actualDotsCount; i++) {
            const dot = document.createElement('div');
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dot.dataset.index = i;
            dot.addEventListener('click', function() {
                currentIndex = parseInt(this.dataset.index);
                updateCarouselPosition();
                updateDots();
            });
            carouselDots.appendChild(dot);
        }
    }
    
    // Обновление активной точки
    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        const dotsCount = Math.max(1, totalCards - cardsVisible + 1);
        
        // Если количество точек не соответствует, пересоздаем их
        if (dots.length !== dotsCount) {
            generateDots();
            return;
        }
        
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Обновление позиции карусели
    function updateCarouselPosition() {
        const translateX = -currentIndex * cardWidth;
        cardsContainer.style.transform = `translateX(${translateX}px)`;
    }
    
    // Переход к следующей карточке
    function nextCard() {
        const maxIndex = Math.max(0, totalCards - cardsVisible);
        
        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            currentIndex = 0; // Возвращаемся к началу
        }
        
        updateCarouselPosition();
        updateDots();
    }
    
    // Переход к предыдущей карточке
    function prevCard() {
        const maxIndex = Math.max(0, totalCards - cardsVisible);
        
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = maxIndex; // Переходим к концу
        }
        
        updateCarouselPosition();
        updateDots();
    }
    // Инициализация
    function initCarousel() {
        // Вычисляем ширину карточки с учетом gap
        const computedStyle = getComputedStyle(cardsContainer);
        const gap = parseInt(computedStyle.gap) || 25;
        cardWidth = cards[0].offsetWidth + gap;
        
        updateCardsVisible();
        generateDots();
        
        // Обработчики событий
        prevBtn.addEventListener('click', function() {
            prevCard();
        });
        
        nextBtn.addEventListener('click', function() {
            nextCard();
        });
        
        // Обновление при изменении размера окна
        window.addEventListener('resize', function() {
            // Пересчитываем ширину карточки
            cardWidth = cards[0].offsetWidth + 25;
            updateCardsVisible();
            updateCarouselPosition();
        });
    }
    
    // Запуск карусели
    initCarousel();

    cards.forEach( card =>{
        card.addEventListener("click", (e)=>{
            e.preventDefault()
            let index = card.getAttribute("data-index")
            let cardContent = document.querySelectorAll(".card-content")
            cardContent.forEach(content => {
                let contentIndex = content.getAttribute("data-index")
                if(index == contentIndex){
                    content.classList.remove("hidden")
                }else{
                    content.classList.add("hidden")
                }
            });
        })
    })

    let name = document.getElementById("name")
    let email = document.getElementById("email")
    let link = document.getElementById("link")
    let date = document.getElementById("date")
    let desc = document.getElementById("desc")
    let agreement = document.getElementById("agreement")
    let send = document.getElementById("send")

    send.addEventListener("click", async (e)=>{
        e.preventDefault()
        let status = checkReq()
        if(!agreement.checked){
            status = false
            Alert("Для отправки заявки необходимо подтвердить свое согласие на обработку персональных данных")
        }
        if(status){
            send.setAttribute("disabled", "disabled")
            let body = {
                name: name.value,
                email: email.value,
                priority_contact: link.value,
                description: desc.value,
                date: date.value,
                agreement_confirmed: agreement.checked
            }

            let response = await fetch("/application/add",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
            let result = await response.json()
            Alert(result.msg)
            send.removeAttribute("disabled")
        }
    })
});