import { ReactNode } from 'react';
import IMAGES from '../images/images';

interface TitleProps {
    title:string;
    subtitle:string | ReactNode;
    displayLogo?:boolean;
}

const PageTitle = ({title, subtitle, displayLogo = false}:TitleProps)=>{
    return(
        
            <div id='title_wrapper' className='flex justify-between mb-9'>
                <div id='headline'>
                    <h1 className=' font-black mb-2'>{title}</h1>
                    <h5 className=' text-base-ink font-light'>{subtitle}</h5>
                </div>
                {displayLogo ? <div id='gov_logo' className='w-3/12 -m-[45px]'><img src={IMAGES.logoDeptBlack}/></div> : null}
            </div>
        
    );
}

export default PageTitle;