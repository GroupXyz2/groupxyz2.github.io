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
