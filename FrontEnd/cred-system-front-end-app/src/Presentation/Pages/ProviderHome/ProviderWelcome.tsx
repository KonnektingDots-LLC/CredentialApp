import { Button, ButtonGroup, Link } from "@trussworks/react-uswds";
import PageTitle from "../../../Application/sharedComponents/pageTitle";
import Blurb from "../../../Application/sharedComponents/blurb";
import IMAGES from "../../../Application/images/images";
import { BsPeopleFill } from "react-icons/bs";
import MediaCard from "../../../Application/sharedComponents/mediaCard";
import { useNavigate } from "react-router-dom";
import {  useMsal } from "@azure/msal-react";
import { useQueryClient } from "@tanstack/react-query"
import { Form } from "../../Layouts/formLayout/credInterfaces";
import { getProvider, useGetForm } from "../../../Infraestructure/Hooks/useGetForm";
import { useAxiosInterceptors } from "../../../Infraestructure/axiosConfig";

const ProviderWelcome = ({ hasFormCompleted }: { hasFormCompleted?: boolean }) => {
  const navigate = useNavigate();
  const { instance } = useMsal();
  const lastName = instance?.getActiveAccount()?.idTokenClaims?.extension_LastName; 
  const api = useAxiosInterceptors();
  useGetForm(api) // NOTE: makes initial data fetch, so its available for children components

    const providerId = getProvider(sessionStorage)?.providerId;

    // `["formData"]` queryKey come from `useGetForm()`
    const cacheFormData = useQueryClient().getQueryData<Form>(['formData', providerId]);
    const canContinue = cacheFormData?.setup.hasStarted && hasFormCompleted;

  const navigateToCredentialForm = () => {
    navigate('/form-setup');
  }

  return (
    <>
      <section>
        <div className="flex">
          <div className="w-1/2">
            <div>
              <PageTitle
                title={`Hello Dr. ${lastName === undefined ? "" : lastName}`}
                subtitle="Welcome to the Individual and Incorporated Providers Credentialing Application. Here are things you can do:"
              />
            </div>
            <Blurb title="Key Information">
              <ul>
                <li className=" list-disc">
                  You can <a href="/form-setup" className="usa-link cursor-pointer">start filling your form</a> or{" "}
                  <a href="/invite" className="usa-link cursor-pointer">invite your delegate any time.</a>
                </li>
                <li className=" list-disc">
                  Find & download your uploaded documents and forms in{" "}
                  <a href="/documents" className="usa-link cursor-pointer">My Documents.</a>
                </li>
                <li className=" list-disc">
                  In case you need more information visit our{" "}
                  <a href="/glossary" className="usa-link cursor-pointer">Glossary</a>.
                </li>
              </ul>
            </Blurb>
            <div className="mt-8">
              <ButtonGroup type="default">
                <Link href="/documents" className="usa-button usa-button--outline">
                  My Documents
                </Link>
                <Link href="/manage-delegates" className="usa-button usa-button--outline">
                  Manage Delegates
                </Link>
                <Button type="button" onClick={navigateToCredentialForm}>{`${canContinue? "Continue":"Fill"}`} My Credentialing Application</Button>
              </ButtonGroup>
            </div>
          </div>
          <div className="w-7/12">
            <div>
              <img
                className=" block mx-auto"
                src={IMAGES.providerWelcome}
              />
            </div>
            <div className="w-[60%] mx-auto">
              <Blurb
                title="Inviting is easy"
                iconComponent={<BsPeopleFill size={35} />}
              >
                You can assign someone in your office or send it to a licensed
                CVO by inviting with their email address.
              </Blurb>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div>
          <PageTitle
            title="Let's get started"
            subtitle="What do you want to know?"
          />
        </div>
        <div id="card_wrapper" className=" flex">
          <div className=" w-3/12">
            <MediaCard
              title="Fill Credentialing Application"
              imageSrc={IMAGES.cardMediaOne}
              body="Get started today with your form, upload documents, save and come back to it later."
              buttonText={canContinue ? "Continue" : "Get Started"}
              url="/form-setup"
            />
          </div>
          <div className=" w-3/12">
            <MediaCard
              title="Assign a Delegate or CVO"
              imageSrc={IMAGES.cardMediaTwo}
              body="Choose someone in your office or send it to a licensed CVO you choose.   "
              buttonText="Get Started"
              url="/invite"
            />
          </div>
          <div className=" w-3/12">
            <MediaCard
              title="Incorporated Provider Profile"
              imageSrc={IMAGES.cardMediaThree}
              body="As an Incorporated Health provider you can add and manage as many NPI you need."
              buttonText="Get Started"
              url="/provider"
            />
          </div>
          <div className=" w-3/12">
            <MediaCard
              title="Understand the concepts with the Glossary"
              imageSrc={IMAGES.cardMediaFour}
              body="If you are a Insurance Clerk in your organization trying to get started, learn more here."
              buttonText="Learn More"
              url="/glossary"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ProviderWelcome;


