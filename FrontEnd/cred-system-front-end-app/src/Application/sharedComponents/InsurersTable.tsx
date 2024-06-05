import "../../Presentation/Pages/AdminInsurerWelcome/insurerTable.css"
import Switch from 'react-switch';
import { InsurersList } from "../interfaces";
import { useEffect, useState } from "react";
import { FaUserLarge } from "react-icons/fa6";
import { updateInsurerStatus } from "../../Infraestructure/Services/insurer.service";
import { useAxiosInterceptors } from "../../Infraestructure/axiosConfig";

type InsurersTableProps = {
    data: InsurersList[],
}

const InsurersTable = ({data }: InsurersTableProps) => {
    const api = useAxiosInterceptors();

    const initialActiveStates: { [email: string]: boolean } = data.reduce((acc, insurer) => ({
        ...acc, 
        [insurer.email]: insurer.isActive
    }), {});
    const [activeStates, setActiveStates] = useState<{ [email: string]: boolean }>(initialActiveStates);

    const handleToggle = async (insurerEmail: any, newState: any) => {
        await updateInsurerStatus(api, insurerEmail, newState).then(res => {
            if (res?.status === 200) {
                setActiveStates(prevState => ({ ...prevState, [insurerEmail]: newState }));
            }
        })
    }

    useEffect(() => {
        const newActiveStates = data.reduce((acc, insurer) => ({
            ...acc, 
            [insurer.email]: insurer.isActive
        }), {});
    
        setActiveStates(newActiveStates);
    }, [data]);

    return <>
    <table className="usa-table--borderless insurer-table">
            <thead>
                <tr>
                    <th></th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Active</th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map( function(item){
                        return <>
                            <tr key={item.email}>
                                <td>
                                <FaUserLarge color="#71767A" className="ml-2"/>
                                </td>
                                <td>{item.name ?? ""} {item.middleName ?? ""} {item.lastName ?? ""} {item.surname ?? ""}</td>
                                <td className="text-primary-vivid"> 
                                    {item.email}
                                </td>
                                <td>
                                    {item.name === null && <p className="text-red-error font-semibold">Pending...</p>}
                                    <Switch 
                                        checked={activeStates[item.email]}
                                        onChange={(checked) => handleToggle(item.email, checked)}
                                        onColor="#005EA2"
                                        onHandleColor="#f0f0f0"
                                        handleDiameter={30}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                        height={20}
                                        width={48}
                                        className="react-switch"
                                        id="material-switch"
                                        disabled={item.name === null}
                                    />
                                    </td>
                            </tr>
                        </>
                    })
                }
            </tbody>
        </table>
    </>
}


export default InsurersTable;
