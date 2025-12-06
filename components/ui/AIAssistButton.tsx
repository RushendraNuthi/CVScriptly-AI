import React, { useState } from 'react';
import { improveText } from '../../services/geminiService';

interface AIAssistButtonProps {
    currentText: string;
    onImprove: (text: string) => void;
    context: string;
    className?: string;
}

const AIAssistButton: React.FC<AIAssistButtonProps> = ({ currentText, onImprove, context, className = '' }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [improved, setImproved] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleClick = async () => {
        if (!currentText) return;

        setIsLoading(true);
        setError(null);
        try {
            const result = await improveText(currentText, context);
            setImproved(result);
            setShowModal(true);
        } catch (err) {
            setError("Failed to improve text. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccept = () => {
        if (improved) {
            onImprove(improved);
        }
        setShowModal(false);
        setImproved(null);
    };

    return (
        <>
            <button
                type="button"
                onClick={handleClick}
                disabled={isLoading || !currentText}
                className={`flex items-center space-x-1 text-xs font-medium text-primary-600 hover:text-primary-800 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
                title="Improve with AI"
            >
                {isLoading ? (
                    <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                )}
                <span>{isLoading ? 'Improving...' : 'AI Assist'}</span>
            </button>
            {error && <span className="text-xs text-danger-500 ml-2">{error}</span>}

            {showModal && improved && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 animate-fade-in">
                        <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            AI Suggestion
                        </h3>

                        <div className="grid grid-cols-1 gap-4 mb-6">
                            <div>
                                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Original</h4>
                                <div className="p-3 bg-neutral-50 rounded border border-neutral-200 text-sm text-neutral-700 whitespace-pre-wrap">
                                    {currentText}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-success-600 uppercase tracking-wider mb-2">Improved</h4>
                                <div className="p-3 bg-success-50 rounded border border-success-200 text-sm text-neutral-800 whitespace-pre-wrap">
                                    {improved}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAccept}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                            >
                                Accept Change
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIAssistButton;
