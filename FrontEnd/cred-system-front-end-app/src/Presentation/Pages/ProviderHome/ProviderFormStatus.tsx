import Blurb from "../../../Application/sharedComponents/blurb";
import PageTitle from "../../../Application/sharedComponents/pageTitle";
import IMAGES from "../../../Application/images/images";
import { msalInstance } from "../../..";
import { useAxiosInterceptors } from "../../../Infraestructure/axiosConfig";
import {
  FormStatus,
  ProviderSubmitInterface,
} from "../../../Application/interfaces";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NonActionableRow from "./Components/nonActionableRow";
import { getProviderFormStatusColor } from "../../../Application/utils/helperMethods";
import { Button, ButtonGroup, Link } from "@trussworks/react-uswds";
import { ROLE, STATUS } from "../../../Application/utils/enums";
import { getProviderFormStatusList } from "../../../Infraestructure/Services/provider.service";
import { LIMIT_PER_PAGE } from "../../../Application/utils/constants";
import BackButton from "../CredForm/Components/BackButton";

const ProviderFormStatus = () => {
  const api = useAxiosInterceptors();
  const navigate = useNavigate();
  const role = msalInstance.getActiveAccount()?.idTokenClaims?.extension_Role as string;
  const [providerInfo, setProviderInfo] = useState<ProviderSubmitInterface>();
  const [summaryStatus, setSummaryStatus] = useState<string | STATUS>("");
  const [hasReturnedStatus, setReturnedStatus] = useState(false);
  const [approvedStatusCount, setApprovedStatusCount] = useState(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limitPerPage, setLimitPerPage] = useState<number>(LIMIT_PER_PAGE);
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    const fetchProviders = async () => {
      const provider = JSON.parse(sessionStorage.getItem('provider') || '{}');
      let email;
      if (role === ROLE.Provider) {
        email = msalInstance.getActiveAccount()?.username;
      } else {
        email = provider.email;
      }

      const response = await getProviderFormStatusList(api, provider.providerId, currentPage, limitPerPage);
      if (response) {
        response.content.email = email;
        setProviderInfo(response.content);
        setCurrentPage(response.currentPage);
        setLimitPerPage(response.limitPerPage);
        setDoctorName(`${response.content?.name ?? ""} ${response.content?.middleName ?? ""} ${response.content?.lastName ?? ""} ${response.content?.surname ?? ""}`)
      
        const statusArray = ["Approved", "Rejected", "Returned to Provider"];
        const summaryStatus = statusArray.find((status) =>
          response?.content?.insurerStatusList?.some((info: FormStatus) => info.status === status)
        );
        setSummaryStatus(summaryStatus ?? STATUS.SUBMITTED);

      } else {
        setProviderInfo({
          providerId: provider.providerId,
          name: provider.name,
          middleName: provider.middleName,
          lastName: provider.lastName,
          surname: provider.surName,
          email: provider.email,
          renderingNPI: provider.renderingNPI,
          summary: {
              lastSubmitDate: "",
          },
          insurerStatusList: []
        });
        setDoctorName(`${provider.name ?? ""} ${provider.middleName ?? ""} ${provider.lastName ?? ""} ${provider.surName ?? ""}`);
        setSummaryStatus(provider.statusName);
      }

      setReturnedStatus(response?.content?.insurerStatusList?.some(
        (info: FormStatus) => info.status === STATUS.RETURNED
      ) ?? false);

      setApprovedStatusCount(response?.content?.insurerStatusList?.filter(
        (info: FormStatus) => (info.status === STATUS.APPROVED || info.status === STATUS.REJECTED)
      ).length ?? 0);
    };
    fetchProviders();
  }, [api]);

  const navigateToCredentialForm = () => {
    navigate('/form-setup');
  }

  return (
    <>
      <section>
        {role !== ROLE.Provider && <BackButton label="Go back" onClick={() => navigate(-1)} paddingTop={0} />}
        <div className="flex">  
          <div className="w-1/2">
            <div>
              <PageTitle
                title={`Dr. ${doctorName}`}
                subtitle={
                  <div className="flex flex-col">
                    <p className="text-xl">NPI: {providerInfo?.renderingNPI}</p>
                    <p className="text-xl">Email: {providerInfo?.email}</p>
                  </div>
                }
              />
            </div>
            <Blurb title="Summary"  minHeight="110px" minWidth="450px">
              <ul className=" flex flex-col gap-2 ml-6">
                <li className=" list-disc -mb-1">
                  <b>Status:</b>{" "}
                  <b
                    style={{
                      color: getProviderFormStatusColor(
                        summaryStatus === STATUS.APPROVED || summaryStatus === STATUS.REJECTED ? STATUS.APPROVED
                      : summaryStatus === STATUS.PENDING || summaryStatus === STATUS.RETURNED ? STATUS.SUBMITTED
                      : summaryStatus
                      ),
                    }}
                  >
                    {/* {summaryStatus === (STATUS.APPROVED || STATUS.REJECTED) ? `Completed (${approvedStatusCount}/${providerInfo?.insurerStatusList?.length})` : summaryStatus} */}
                    {summaryStatus === STATUS.APPROVED || summaryStatus === STATUS.REJECTED
                      ? approvedStatusCount > 0
                        ? `Completed (${approvedStatusCount}/${providerInfo?.insurerStatusList?.length})`
                        : "Completed"
                      : summaryStatus === STATUS.PENDING || summaryStatus === STATUS.RETURNED
                      ? `Submitted`
                      : summaryStatus}
                  </b>
                </li>
                {(summaryStatus !== STATUS.DRAFT && approvedStatusCount !== providerInfo?.insurerStatusList?.length) && <li className=" list-disc -mb-1">
                  <b>Since: </b> {providerInfo?.summary?.lastSubmitDate}
                </li>}
                {hasReturnedStatus && <li className=" list-disc -mb-1">
                  <b>Note:</b> One or more insurance companies require that you
                  edit your credentialing application. See the notes below and
                  proceed to edit the form.
                </li>
                }
              </ul>
            </Blurb>
            <div className="mt-8">
              <ButtonGroup type="default">
                <Link
                  href="/documents"
                  className="usa-button usa-button--outline"
                >
                  {role === ROLE.Provider ? "My Documents" : "Provider Documents"}
                </Link>
                { role  === ROLE.Provider && <Link
                  href="/manage-delegates"
                  className="usa-button usa-button--outline"
                >
                  Manage Delegates
                </Link>}
                {hasReturnedStatus && role !== ROLE.Admin && <Button type="button" onClick={navigateToCredentialForm}>
                  Edit My Credentialing Application
                </Button>}
              </ButtonGroup>
            </div>
          </div>
          <div className="w-7/12">
            <div>
              <img className=" block mx-auto" src={IMAGES.providerWelcome} />
            </div>
          </div>
        </div>
      </section>
      { summaryStatus !== STATUS.DRAFT &&
        <section>
          <div>
            <div className=" my-10">
              <PageTitle
                title="Progress in credentialing by insurance companies."
                subtitle="You can check the status of each insurance company."
              />
              <div className=" my-5 flex flex-col gap-5 max-w-[900px]">
                {providerInfo?.insurerStatusList?.map(
                  (resultData: FormStatus) => (
                    <NonActionableRow
                      key={resultData.name}
                      resultData={resultData}
                    />
                  )
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-row mt-12 items-center">
        </div>
        </section>
      }
    </>
  );
};

export default ProviderFormStatus;
