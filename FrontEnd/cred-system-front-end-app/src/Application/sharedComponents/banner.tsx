import { FC, ReactNode, useState } from 'react';
import layoutImages from "../../Application/images/images";

interface Props {
    closeBanner: () => void;
    children: ReactNode
}
const Banner: FC<Props> = ({ closeBanner, children }) => {
  const [isVisible, setIsVisible] = useState(true);

  const close = () => {
    setIsVisible(false);
    closeBanner();
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-min z-10 bg-primary-blue hover:bg-blue-info px-8 py-2 flex items-center justify-between">
        {children}
        <img
            src={layoutImages.iconClose} 
            alt="Close modal." 
            onClick={close} 
            className="cursor-pointer" style={{filter: "invert(100%)"}}/>
    </div>
  );
}

export default Banner;
