import { PropsWithChildren, ReactNode } from "react";


interface BlurbProps {
    title:string;
    iconComponent?: ReactNode;
    minHeight?: string;
    minWidth?: string;
}

const Blurb = ({title,iconComponent,children, minHeight, minWidth}:PropsWithChildren<BlurbProps>)=>{

  const blurbStyle = {
    minHeight: minHeight || 'auto',
    minWidth: minWidth || 'auto',
  };

  return(<div
      id="image-caption-wrap"
      className="flex gap-3 mt-8 bg-accent-cool-lighter border border-info-light rounded w-fit p-4"
      style={blurbStyle}
    >
      <div className=" self-center">
        {iconComponent}
      </div>
      <div className="">
        <h3 className=" font-bold mb-2">
          {title}
        </h3>
        <div className=" text-sm text-left">
          {children}
        </div>
      </div>
    </div>);
}

export default Blurb;