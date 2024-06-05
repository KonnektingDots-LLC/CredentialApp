import { Tooltip } from "@trussworks/react-uswds";

interface Props {
    label: string;
    img: string | undefined;
    alt?: string;
    backgroundColor?: string;
    border?: string;
    color?: string;
}
const TooltipItem = ({label, img, alt="", backgroundColor= "transparent", border= "none", color= "#A9AEB1"}: Props) => {
    return (
        <Tooltip 
            style={{backgroundColor: backgroundColor, border: border, color: color}}
            label={label}>
            <img src={img} alt={alt}/>
        </Tooltip>
    )
}

export default TooltipItem;