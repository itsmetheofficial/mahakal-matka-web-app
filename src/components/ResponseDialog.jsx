import React from 'react';
import Warning from '../assets/imgs/warning.png';

const ResponseDialog = ({ isOpen, isSuccess, message, onClose, showTelegram = false, telegramLink = null }) => {
    if (!isOpen) return null;

    const handleJoinTelegram = () => {
        if (telegramLink) {
            window.open(telegramLink, '_blank');
        }
    };

    return (
        <div className="w-full fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4 z-50">
            <div className="bg-white p-6 rounded-2xl text-center w-full max-w-[400px]">
                {
                    isSuccess ?
                        <svg width="60px" height="60px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ margin: "0 auto" }}>
                            <circle cx="12" cy="12" r="12" fill="green" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z" fill="#fff" />
                        </svg>
                        :
                        <img src={Warning} alt="" className='w-24 h-16 m-auto' />
                }

                <div className="mb-4 mt-8">
                    {message ? (
                        <>
                            <h2 className="text-xl font-semibold">{message.split('\n')[0]}</h2>
                            {message.split('\n').slice(1).join('\n') && (
                                <div className="text-base mt-3 whitespace-pre-line leading-relaxed">
                                    {message.split('\n').slice(1).join('\n')}
                                </div>
                            )}
                        </>
                    ) : (
                        <h2 className="text-xl">Message not received</h2>
                    )}
                </div>

                {isSuccess && showTelegram && telegramLink && (
                    <div className="my-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-700 mb-2">
                            Updates और winning tips के लिए join करें!
                        </p>
                        <button
                            className="bg-[#0088cc] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#006ba3] transition-colors flex items-center justify-center gap-2 w-full"
                            onClick={handleJoinTelegram}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.52-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 3.99-1.74 6.65-2.89 7.98-3.46 3.8-1.65 4.59-1.94 5.11-1.95.11 0 .37.03.54.17.14.12.18.28.2.41-.01.06.01.24 0 .38z" />
                            </svg>
                            Join Telegram
                        </button>
                    </div>
                )}

                <button className="bg-[#e4ae39] text-white px-12 py-2 rounded" onClick={onClose}>
                    Okay
                </button>
            </div>
        </div>
    );
};

export default ResponseDialog;

