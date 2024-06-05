import { Outlet } from "react-router-dom";
import FormNavigationOptions from "../../Pages/CredForm/Components/FormNavigationOptions";
import Banner from "../../../Application/sharedComponents/banner";
import { useState } from "react";
import InviteDelegateModal from "../../../Application/modals/inviteDelegateModal";
import ErrorPage from "../../../Application/sharedComponents/ErrorPage";
import { msalInstance } from "../../..";
import { ROLE } from "../../../Application/utils/enums";
import { useGetForm } from "../../../Infraestructure/Hooks/useGetForm";
import { useAxiosInterceptors } from "../../../Infraestructure/axiosConfig";

const FormLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBannerOpen, setIsBannerOpen] = useState(true);
  const api = useAxiosInterceptors();
  const { data: formData } = useGetForm(api)
  const role = msalInstance.getActiveAccount()?.idTokenClaims?.extension_Role as string;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const closeBanner = () => setIsBannerOpen(false);
  return (
    <main className=" bg-base-lightest">
      {formData === null ? <ErrorPage/> : <>
        <div className="">
          {isBannerOpen && role === ROLE.Provider && (
          <Banner closeBanner={closeBanner}>
            <div className="flex space-x-4">
              <p className="text-white">Do you want to invite your delegate to fill out this form?</p>
              <a href="#" onClick={openModal} className='text-white underline cursor-pointer'>Yes</a>
              <a href="#" onClick={closeBanner} className='text-white underline cursor-pointer'>Not Now</a>
            </div>
          </Banner>)}
        </div>
        <section>
          <div className="h-full grid bg-base-lightest grid-cols-4">
            <FormNavigationOptions />
            <Outlet />
          </div>
        </section>
        {isModalOpen && <InviteDelegateModal closeModal={closeModal} />}
      </>
      }
    </main>
  );
};

export default FormLayout;
