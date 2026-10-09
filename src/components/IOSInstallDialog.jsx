import React from 'react';
import Modal from './Modal';
import { isIOSChrome } from '../utils/installation';
import './styles.css';

export function IOSInstallInstructions({ onClose }) {
    const chrome = isIOSChrome();
    return (
        <div className="ios-install-content">
            <div className="ios-install-heading">
                <span className="ios-install-icon">📲</span>
                <div>
                    <h3>Install Mahakal Matka</h3>
                    <p>Add the app to your Home Screen in three steps.</p>
                </div>
                <button type="button" className="ios-install-close" aria-label="Close install instructions" onClick={onClose}>×</button>
            </div>
            <ol className="ios-install-steps">
                <li><span>1</span><p>Tap <strong>Share</strong> {chrome ? 'beside the address bar' : '(or Page Menu → Share)'}.</p></li>
                <li><span>2</span><p>Choose <strong>Add to Home Screen</strong>.</p></li>
                <li><span>3</span><p>Keep <strong>Open as Web App</strong> on if shown, then tap <strong>Add</strong>.</p></li>
            </ol>
            <p className="ios-install-browser">{chrome ? 'Using Chrome on iPhone or iPad' : 'Using Safari on iPhone or iPad'}</p>
            <button type="button" className="ios-install-done" onClick={onClose}>Got it</button>
        </div>
    );
}

export default function IOSInstallDialog({ isOpen, onClose }) {
    return (
        <Modal isOpen={isOpen} toggle={onClose} zIndex={60}>
            <IOSInstallInstructions onClose={onClose} />
        </Modal>
    );
}
