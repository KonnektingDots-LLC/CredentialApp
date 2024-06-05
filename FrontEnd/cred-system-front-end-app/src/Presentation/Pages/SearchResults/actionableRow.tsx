import { ButtonGroup, Button } from "@trussworks/react-uswds";
import { ProvidersList } from "../../../Application/interfaces";
import { AxiosInstance } from "axios";
import { NavigateFunction } from "react-router-dom";
import { getProviderFormStatusColor } from "../../../Application/utils/helperMethods";
import { msalInstance } from "../../..";
import { ROLE, STATUS } from "../../../Application/utils/enums";
import { useGetForm } from "../../../Infraestructure/Hooks/useGetForm";

interface ActionableRowProps {
  resultData: ProvidersList;  
  isDelegate?: boolean;
  api: AxiosInstance;
  navigate: NavigateFunction;
}

const ActionableRow = ({ resultData, isDelegate = false, api, navigate }:ActionableRowProps) => {

  const role = msalInstance.getActiveAccount()?.idTokenClaims?.extension_Role as ROLE;

    const { data: formData } = useGetForm(api, {
        // query enabled for the following roles
        enabled: [ROLE.Delegate, ROLE.Insurance, ROLE.AdminInsurer, ROLE.Admin].includes(role),
        providerId: resultData.providerId,
    });

  const goToForm = async () => {
      if (formData) {
          sessionStorage.setItem("provider", JSON.stringify(resultData));

          navigate("/form-setup");
          window.scrollTo({
              top: 0,
              behavior: "smooth",
          });
      }
  }

  const goToProviderDetails = () => {
    sessionStorage.setItem('provider', JSON.stringify(resultData));
    if (role === ROLE.Insurance || role === ROLE.AdminInsurer) {
      navigate('/provider-review');
      window.scrollTo({
        top: 0, 
        behavior: 'smooth'
      });
      return;
    } else {
      navigate('/provider-status');
      window.scrollTo({
        top: 0, 
        behavior: 'smooth'
      });
      return;
    }
  }

  return (
    <div className="bg-info-lighter border border-info-light p-3 rounded">
      <div className="flex justify-between items-center gap-5">
        <div className="w-full">
          <h3 className="text-primary font-bold flex whitespace-nowrap">Dr. {resultData.name} {resultData.middleName} {resultData.lastName} {resultData.surName}</h3>
          <h3 className="text-gray-600 font-normal flex gap-1">Email:
            <span className="text-gray-800 font-medium"> {resultData.email}</span>
          </h3>
          {/* {resultData.phoneNumber ? <h3 className="text-gray-500 font-normal flex whitespace-nowrap gap-1">phone number:
            <span className="text-gray-600 font-medium"> {resultData.phoneNumber}</span>
          </h3> : <></>} */}
          {resultData.renderingNPI ? <h3 className="text-gray-600 font-normal flex whitespace-nowrap gap-1">NPI:
            <span className="text-gray-800 font-medium"> {resultData.renderingNPI}</span>
          </h3> : <></>}
          <h3 className="text-gray-600 font-normal flex gap-1">Status:
            <p className="font-semibold"
              style={{ color: getProviderFormStatusColor(resultData.statusName) }}> {resultData.statusName}</p>
          </h3>
        </div>
        <div className="flex justify-end w-full">
          {isDelegate ? (
            <ButtonGroup type="default" className="flex">
              {[STATUS.DRAFT, STATUS.RETURNED].includes(resultData.statusName) && (
                  <button className="usa-button usa-button--outline" onClick={goToForm}>
                      Fill Form
                  </button>
              )}
              <Button type="button" onClick={goToProviderDetails}>View Details</Button>
            </ButtonGroup>
          ) : (
            <Button type="button" onClick={goToProviderDetails}>View Details</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionableRow;
