window.onload = function() {
    let captchaPassed = document.cookie.split(';').some((item) => item.trim().startsWith('captcha_passed='));
    
    if (!captchaPassed) {
        window.location.href = "/captcha/vietcong_captcha";
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.animated-button');

    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.classList.add('hover');
        });

        button.addEventListener('mouseleave', () => {
            button.classList.remove('hover');
        });
    });
});
