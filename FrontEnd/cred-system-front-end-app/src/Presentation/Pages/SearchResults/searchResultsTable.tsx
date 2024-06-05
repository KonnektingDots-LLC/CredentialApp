import ActionableRow from "./actionableRow";
import { ProvidersList } from "../../../Application/interfaces";
import { ROLE } from "../../../Application/utils/enums";
import { msalInstance } from "../../..";
import { useNavigate } from "react-router-dom";
import { useAxiosInterceptors } from "../../../Infraestructure/axiosConfig";

interface SearchResultsTableProps{
    data:ProvidersList[];
}
const SearchResultsTable = ({data}:SearchResultsTableProps)=>{
    const navigate = useNavigate();
    const api = useAxiosInterceptors();
    const role = msalInstance?.getActiveAccount()?.idTokenClaims?.extension_Role as string;
    return(
     <div className=" flex flex-col gap-4 w-7/12">
        {data.map((resultData:ProvidersList)=><ActionableRow key={resultData.providerId+'_'+resultData.name} 
            resultData={resultData} 
            isDelegate={role===ROLE.Delegate}
            api={api} navigate={navigate}
            />)}
     </div>
    );
}
export default SearchResultsTable;