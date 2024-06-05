import {FC, ReactNode} from 'react';
import layoutImages from "../../Application/images/images";

interface Props {
    closeModal: () => void
    children: ReactNode
}
const Modal: FC<Props> = ({closeModal, children})=>{

    return(
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black-overlay">
            <div className="relative bg-base-lightest py-6 shadow-lg max-w-94">
                {/* this is the X icon */}
                <img
                    src={layoutImages.iconClose} 
                    alt="Close modal." 
                    onClick={closeModal} 
                    className="text-black absolute top-3 right-3 cursor-pointer"/>

                    {children}
            </div>
        </div>
    );
}

export default Modal;