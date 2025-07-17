document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.querySelector('#email');
    const nameInput = document.querySelector('#name');
    const phoneInput = document.querySelector('#phone');

    if (emailInput) {
        emailInput.addEventListener('input', () => {
            if (emailInput.value.length > 0) {
                if (nameInput) nameInput.style.display = 'block';
                if (phoneInput) phoneInput.style.display = 'block';
            } else {
                if (nameInput) nameInput.style.display = 'none';
                if (phoneInput) phoneInput.style.display = 'none';
            }
        });
    }

    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });

    const countdown = () => {
        const countDate = new Date('August 11, 2025 00:00:00').getTime();
        const now = new Date().getTime();
        const gap = countDate - now;

        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const textDay = Math.floor(gap / day);
        const textHour = Math.floor((gap % day) / hour);
        const textMinute = Math.floor((gap % hour) / minute);
        const textSecond = Math.floor((gap % minute) / second);

        document.querySelector('#timer').innerText = `${textDay}d ${textHour}h ${textMinute}m ${textSecond}s`;
    };

    setInterval(countdown, 1000);

    const swiper = new Swiper('.swiper-container', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
});