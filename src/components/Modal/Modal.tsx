import css from './Modal.module.css'
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ModalProps } from '../../types/modalProps';


export default function Modal({ onClose, children }: ModalProps) {
    
    const handleClose = (event: React.MouseEvent<HTMLDivElement>) => {

        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    useEffect(() => {

        const handleKeyDown = (e: KeyboardEvent) => {

            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {

            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';

        };
    }, [onClose]);

    return createPortal(
      
        <div
            className={css.backdrop}
            role="dialog"
            aria-modal="true"
            onClick={handleClose} >
            
            <div className={css.modal}>
                {children}
            </div>
            
        </div>,
        document.body
        
    );

}