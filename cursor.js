document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');
    
    if (window.matchMedia('(pointer: fine)').matches) {
        cursor.classList.remove('hidden');
        
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        function updateCursor() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(updateCursor);
        }
        
        updateCursor();
        
        document.addEventListener('mousedown', () => {
            cursor.classList.add('cursor-click');
        });
        
        document.addEventListener('mouseup', () => {
            cursor.classList.remove('cursor-click');
        });
        
        const interactiveElements = [
            'button', 'a', 'input', 'textarea', 'select',
            '.movie-card', '.mood-btn', '.play-btn', '.more-info-btn'
        ].join(', ');
        
        document.querySelectorAll(interactiveElements).forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
            });
        });
        
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
            });
            
            btn.addEventListener('mouseleave', () => {
                cursor.style.transform = '';
            });
        });
    }
});
