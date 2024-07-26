const fs = require('fs');
const path = require('path');



describe('showToast', () => {

    beforeEach(() => {
        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        document.body.innerHTML = html;

        require('../script.js');

        mockOnConfirm = jest.fn();
        mockOnCancel = jest.fn();
        toastContainer = document.getElementById('toast-container');
        messageText = document.getElementById('message-text');
        confirmButton = document.getElementById('confirm-button');
        cancelButton = document.getElementById('cancel-button');

        jest.useFakeTimers();

    });

    afterEach(() => {

        jest.useRealTimers();
    });

    it('should display toast with correct message', () => {
        showToast('Test message', mockOnConfirm, mockOnCancel);

        expect(toastContainer.style.display).toBe('flex');
        expect(messageText.textContent).toBe('Test message');
    });

    it('should call onConfirm and hide toast when confirm button is clicked', () => {
        showToast('Test message', mockOnConfirm, mockOnCancel);

        confirmButton.click();

        expect(mockOnConfirm).toHaveBeenCalled();
        expect(toastContainer.style.display).toBe('none');
    });

    it('should call onCancel and hide toast when cancel button is clicked', () => {
        showToast('Test message', mockOnConfirm, mockOnCancel);

        cancelButton.click();

        expect(mockOnCancel).toHaveBeenCalled();
        expect(toastContainer.style.display).toBe('none');
    });


    // it('should not display toast if required elements are missing', () => {

    //     document.getElementById('toast-container').remove();
        
    //     const mockOnConfirm = jest.fn();
    //     const mockOnCancel = jest.fn();
      
    //     showToast('Test message', mockOnConfirm, mockOnCancel);
    
    //     expect(mockOnConfirm).not.toHaveBeenCalled();
    //     expect(mockOnCancel).not.toHaveBeenCalled();
    // });

    it('should handle Enter and Escape key presses', () => {

        const mockOnConfirm = jest.fn();
        const mockOnCancel = jest.fn();
    
        showToast('Test message', mockOnConfirm, mockOnCancel);
    
        const eventEnter = new KeyboardEvent('keydown', { key: 'Enter' });
        document.dispatchEvent(eventEnter);
        expect(mockOnConfirm).toHaveBeenCalled();
        expect(document.getElementById('toast-container').style.display).toBe('none');
    
        // Reset mocks and test Escape key
        mockOnConfirm.mockReset();
        mockOnCancel.mockReset();
        showToast('Test message', mockOnConfirm, mockOnCancel);
    
        const eventEscape = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(eventEscape);
        expect(mockOnCancel).toHaveBeenCalled();
        expect(document.getElementById('toast-container').style.display).toBe('none');
    });

    test('should handle an unhandled key press', () => {

        const mockOnConfirm = jest.fn();
        const mockOnCancel = jest.fn();
        
        showToast('Test message', mockOnConfirm, mockOnCancel);

        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        document.dispatchEvent(event);


        expect(toastContainer.style.display).toBe('flex');
        expect(mockOnConfirm).not.toHaveBeenCalled();
        expect(mockOnCancel).not.toHaveBeenCalled();
    });


    it('should keep the toast visible if no interaction occurs', () => {
        const mockOnConfirm = jest.fn();
        const mockOnCancel = jest.fn();
    
        showToast('Test message', mockOnConfirm, mockOnCancel);
    
        const toastContainer = document.getElementById('toast-container');
        expect(toastContainer.style.display).toBe('flex');
    
        jest.advanceTimersByTime(5000);
        expect(toastContainer.style.display).toBe('flex');
    });

    
    
    
    
    
});
