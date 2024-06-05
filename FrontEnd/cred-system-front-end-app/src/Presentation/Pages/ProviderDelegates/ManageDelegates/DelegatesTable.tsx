import "./delegatesTable.css"
import Switch from 'react-switch';
import { useEffect, useState } from "react";
import { FaUserLarge } from "react-icons/fa6";
import { DelegatesList } from "../../../../Application/interfaces";
import { updateDelegateStatus } from "../../../../Infraestructure/Services/provider.service";
import { useAxiosInterceptors } from "../../../../Infraestructure/axiosConfig";

type DelegatesTableProps = {
    data: DelegatesList[],
}

const DelegatesTable = ({data }: DelegatesTableProps) => {
    const api = useAxiosInterceptors();

    const initialActiveStates: { [id: string]: boolean } = data.reduce((acc, delegate) => ({
        ...acc, 
        [delegate.id]: delegate.isActive
    }), {});
    const [activeStates, setActiveStates] = useState<{ [id: string]: boolean }>(initialActiveStates);

    const handleToggle = async (delegateId: any, newState: any) => {
        await updateDelegateStatus(api, delegateId, newState).then(res => {
            if (res?.status === 200) {
                setActiveStates(prevState => ({ ...prevState, [delegateId]: newState }));
            }
        })
    }

    useEffect(() => {
        const newActiveStates = data.reduce((acc, delegate) => ({
            ...acc, 
            [delegate.id]: delegate.isActive
        }), {});
    
        setActiveStates(newActiveStates);
    }, [data]);

    return <>
    <table className="usa-table--borderless delegate-table">
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
                                <td>{item.fullName ?? ""}</td>
                                <td className="text-primary-vivid"> 
                                    {item.email}
                                </td>
                                <td>
                                    {item.fullName === "" && <p className="text-red-error font-semibold">Pending...</p>}
                                    <Switch 
                                        checked={activeStates[item.id]}
                                        onChange={(checked) => handleToggle(item.id, checked)}
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
                                        disabled={item.fullName === ""}
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


export default DelegatesTable;
