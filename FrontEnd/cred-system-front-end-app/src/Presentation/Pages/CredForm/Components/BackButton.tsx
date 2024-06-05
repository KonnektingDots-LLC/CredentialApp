import { MdArrowBack } from "react-icons/md";

type BackButtonProps = {
    label: string,
    onClick: () => void;
    paddingTop?: number;
}

const BackButton = ({label, onClick, paddingTop}: BackButtonProps) => {
    return <div className="flex flex-row justify-items-center cursor-pointer w-max"
        style={{paddingTop: paddingTop ?? "80px"}} onClick={onClick}>
        <div style={{paddingTop: "6px"}}><MdArrowBack size={24} style={{ fill: '#005ea2' }}/></div>
        <p style={{paddingTop: "8px", paddingLeft: "8px", fontWeight: "500", fontSize: "18px"}} className="text-primary">{label}</p>
    </div>
}

export default BackButton;