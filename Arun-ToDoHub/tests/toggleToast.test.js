const fs = require('fs');
const path = require('path');



beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    document.body.innerHTML = html;

    require('../script.js');
});


describe('toggleToast Function', () => {


    it('should show the toast container when visible is true', () => {

        const toastContainer = document.querySelector("#toast-container");
        toggleToast(true);

        expect(toastContainer.style.display).toBe('flex');
    });



    it('should hide the toast container when visible is false', () => {

        const toastContainer = document.querySelector("#toast-container");
        toggleToast(false);

        expect(toastContainer.style.display).toBe('none');
    });

    it('should handle toggling between visible and hidden states correctly', () => {

        const toastContainer = document.querySelector("#toast-container");
        toggleToast(true);
        expect(toastContainer.style.display).toBe('flex');

        toggleToast(false);
        expect(toastContainer.style.display).toBe('none');

        toggleToast(true);
        expect(toastContainer.style.display).toBe('flex');
    });

    it('should handle undefined and null input gracefully', () => {
        const toastContainer = document.querySelector("#toast-container");
        
        toggleToast(undefined);
        expect(toastContainer.style.display).toBe('none');
        
        toggleToast(null);
        expect(toastContainer.style.display).toBe('none');
    });
    

});