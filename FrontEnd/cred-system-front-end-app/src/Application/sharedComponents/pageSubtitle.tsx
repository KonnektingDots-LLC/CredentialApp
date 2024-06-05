import { ReactNode } from 'react';
import IMAGES from '../images/images';

interface SubtitleProps {
    title:string;
    subtitle:string | ReactNode;
    displayLogo?:boolean;
}

const PageSubtitle = ({title, subtitle, displayLogo = false}:SubtitleProps)=>{
    return(
        
            <div id='title_wrapper' className='flex justify-between mb-9'>
                <div id='headline'>
                    <h2 className='text-2xl font-black mb-1'>{title}</h2>
                    <h5 className=' text-base-ink font-light'>{subtitle}</h5>
                </div>
                {displayLogo ? <div id='gov_logo' className='w-3/12 -m-[45px]'><img src={IMAGES.logoDeptBlack}/></div> : null}
            </div>
        
    );
}

export default PageSubtitle;