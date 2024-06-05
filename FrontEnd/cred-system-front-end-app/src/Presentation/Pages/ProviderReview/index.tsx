import Blurb from "../../../Application/sharedComponents/blurb";
import PageTitle from "../../../Application/sharedComponents/pageTitle";
import IMAGES from "../../../Application/images/images";
import { useAxiosInterceptors } from "../../../Infraestructure/axiosConfig";
import {
    ProviderDetail,
    StatusHistory,
} from "../../../Application/interfaces";
import { useEffect, useState } from "react";
import NonActionableRow from "./Components/nonActionableRow";
import { getProviderFormStatusColor } from "../../../Application/utils/helperMethods";
import { Button, Link } from "@trussworks/react-uswds";
import { STATUS_CODE } from "../../../Application/utils/enums";
import BackButton from "../CredForm/Components/BackButton";
import { useNavigate } from "react-router-dom";
import { getProviderStatusHistory, updateInsurerFormStatus } from "../../../Infraestructure/Services/insurer.service";

const ProviderReview = () => {
  const api = useAxiosInterceptors();
  const navigate = useNavigate();
  const [providerInfo, setProviderInfo] = useState<ProviderDetail>();
  const [comment, setComment] = useState("");
  const [alert, setAlert] = useState(false);
  const [count, setCount] = useState(0);

  const handleTextChange = (e: any) => {
    setComment(e.target.value);
    setCount(e.target.value.length)
  }

  const onSubmit = async (newStatus: STATUS_CODE) => {
    setAlert(false);
    if (!comment) {
      setAlert(true);
      return;
    }
    try {
      const id = providerInfo?.StatusSummary?.picsId ?? 0;
      const providerId = providerInfo?.StatusSummary?.providerId ?? 0;
      const response = await updateInsurerFormStatus(api, providerId, id, newStatus, comment);
      if (response?.status === 200) {
        console.log('200 here');
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating provider status:", error);
    }
  };

  const [isLoading, setIsLoading] = useState<boolean | undefined>();

  useEffect(() => {
    setIsLoading(true);
    const fetchProviders = async () => {
      const providerId = JSON.parse(sessionStorage.getItem('provider') || '{}').providerId;
      const response = await getProviderStatusHistory(api, providerId);
      if (response) {
        const provApplication = JSON.parse(sessionStorage.getItem('provider') || '{}');
        response.name = provApplication.name;
        response.middleName = provApplication.middleName;
        response.lastName = provApplication.lastName;
        response.surName = provApplication.surName;
        response.renderingNPI = provApplication.renderingNPI;
        response.email = provApplication.email;
        setProviderInfo(response);
        setIsLoading(false);
      }
    };
    fetchProviders();
  }, [api]);

    const title = isLoading
        ? "Loading..."
        : `Dr. ${providerInfo?.name} ${providerInfo?.middleName} ${providerInfo?.lastName} ${providerInfo?.surName}`;

  return (
    <>
      <section>
      <BackButton label="Go back" onClick={() => navigate(-1)} paddingTop={0} />
        <div className="flex">
          <div className="w-1/2">
            <div>
              <PageTitle
                title={title}
                subtitle={
                  <div className="flex flex-col">
                    <p className="text-xl">Email: {providerInfo?.email}</p>
                    <p className="text-xl">NPI: {providerInfo?.renderingNPI}</p>
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
                        providerInfo?.StatusSummary?.insurerStatusTypeId
                      ),
                    }}
                  >
                    {providerInfo?.StatusSummary?.insurerStatusTypeId === STATUS_CODE.RETURNED ? "Returned to Provider" : providerInfo?.StatusSummary?.insurerStatusTypeId}
                  </b>
                </li>
                {providerInfo?.StatusSummary?.insurerStatusTypeId === STATUS_CODE.PENDING ? <li className=" list-disc -mb-1">
                  <b>Since: </b> {providerInfo?.StatusSummary?.submitDate}
                </li> 
                : <li className=" list-disc -mb-1">
                  <b>Date: </b> {providerInfo?.StatusSummary?.submitDate}
                </li>}
              </ul>
            </Blurb>
            <div className="mt-8">
                {providerInfo?.StatusSummary?.insurerStatusTypeId !== STATUS_CODE.REJECTED && <Link
                    href="/documents"
                    className="usa-button usa-button--outline"
                >
                    Provider Documents
                </Link>}
            </div>
          </div>
          <div className="w-7/12">
            <div>
              <img className=" block mx-auto" src={IMAGES.providerWelcome} />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div>
          <div className=" my-10">
            <PageTitle
              title="Progress in credentialing:"
              subtitle={providerInfo?.StatusSummary?.insurerStatusTypeId === STATUS_CODE.PENDING ? <p>You can approve or return to provider in your review.</p> 
              : providerInfo?.StatusSummary?.insurerStatusTypeId === STATUS_CODE.RETURNED && <p>If you will not continue this review, you can close it by pressing the reject button.</p>}
            />
            {providerInfo?.StatusSummary?.insurerStatusTypeId !== STATUS_CODE.REJECTED && providerInfo?.StatusSummary?.insurerStatusTypeId !== STATUS_CODE.APPROVED &&
            <div className="max-w-[900px]">
                <p className="text-gray-50 text-sm pb-1 pl-2">{count}/500 characters</p>
                <textarea id="insurer-comment" rows={6} maxLength={500}
                    className="block p-2.5 w-full text-gray-800 rounded-md border border-button-disabled focus:ring-sky-500 focus:border-2" 
                    placeholder="Write your comment..."
                    onChange={handleTextChange}
                    >
                </textarea>
                {alert && <p className="font-bold text-red-error" role="alert">
                    Comment is required.
                </p>}
                <div className="mt-4 mb-12 flex justify-end">
                    {providerInfo?.StatusSummary?.insurerStatusTypeId === STATUS_CODE.RETURNED ? 
                    <Button type="submit" onClick={() => onSubmit(STATUS_CODE.REJECTED)}
                      style={{ backgroundColor: getProviderFormStatusColor(STATUS_CODE.REJECTED) }}>
                    Reject
                    </Button> : <span>
                    <Button type="submit" onClick={() => onSubmit(STATUS_CODE.RETURNED)}
                      style={{ backgroundColor: getProviderFormStatusColor(STATUS_CODE.RETURNED) }}>
                    Returned to Provider
                    </Button>
                    <Button type="submit" onClick={() => onSubmit(STATUS_CODE.APPROVED)}
                      style={{ backgroundColor: getProviderFormStatusColor(STATUS_CODE.APPROVED) }}>
                    Approve
                    </Button>
                    </span>}
                </div>
            </div>}
            <h5 className=' text-base-ink font-light'>Status history list of the provider.</h5>
            <div className=" my-5 flex flex-col gap-5 max-w-[900px]">
              {providerInfo?.StatusHistory?.map(
                (resultData: StatusHistory, i) => (
                  <NonActionableRow
                    key={i}
                    resultData={resultData}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProviderReview;
