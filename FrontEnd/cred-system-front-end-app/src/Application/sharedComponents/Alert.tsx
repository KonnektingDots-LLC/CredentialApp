import { useState, useEffect } from "react";

interface Props {
    showAlert: boolean
    message?: string
    type: "error" | "success"
}
const ErrorAlert = ({ showAlert, message, type }: Props) => {

    const [isVisible, setIsVisible] = useState(showAlert);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        setIsVisible(showAlert);

        if (showAlert) {
            setFadeOut(false);
            const timer = setTimeout(() => {
                setFadeOut(true);
                setTimeout(() => {
                    setIsVisible(false);
                }, 2000);
            }, 15000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    if (!isVisible) return null;

    const handleClose = () => {
        setFadeOut(true);
        setTimeout(() => {
            setIsVisible(false);
        }, 1000);
    };

    return (
        <div style={{ position: 'fixed', bottom: 0, right: 0, padding: 20, zIndex: 1000 }}>
            {type === "error" ? <div className={`${fadeOut ? 'fade-out' : 'fade-in'} flex items-center gap-2 bg-red-100 border border-red-error text-red-error pl-6 pr-4 py-3 rounded relative`} role="alert">
                <span className="max-w-xl">
                <strong className="font-bold">Oops! </strong>
                <span className="block sm:inline">{message}</span>
                </span>
                <span onClick={handleClose}>
                    <svg className="fill-current h-6 w-6 text-red-error" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                </span>
            </div> :
            <div className={`${fadeOut ? 'fade-out' : 'fade-in'} flex items-center gap-2 bg-green-50 border border-green-600 text-green-700 pl-6 pr-4 py-3 rounded relative`} role="alert">
            <span className="max-w-xl">
            <span className="block sm:inline">{message}</span>
            </span>
            <span onClick={handleClose}>
                <svg className="fill-current h-6 w-6 text-green-700" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
        </div> }
        </div>
    );
};

export default ErrorAlert;