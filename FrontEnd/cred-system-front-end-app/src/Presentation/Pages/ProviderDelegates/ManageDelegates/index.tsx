import { useState, useEffect } from "react";
import { Button, Pagination } from "@trussworks/react-uswds";
import "./delegatesTable.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAxiosInterceptors } from "../../../../Infraestructure/axiosConfig";
import { msalInstance } from "../../../..";
import { DelegatesList } from "../../../../Application/interfaces";
import { getDelegatesList } from "../../../../Infraestructure/Services/provider.service";
import PageTitle from "../../../../Application/sharedComponents/pageTitle";
import Blurb from "../../../../Application/sharedComponents/blurb";
import IMAGES from "../../../../Application/images/images";
import DelegatesTable from "./DelegatesTable";
import InviteDelegateModal from "../../../../Application/modals/inviteDelegateModal";
import PageSubtitle from "../../../../Application/sharedComponents/pageSubtitle";
import { LIMIT_PER_PAGE } from "../../../../Application/utils/constants";
import BackButton from "../../CredForm/Components/BackButton";

const ManageDelegates = () => {
  const api = useAxiosInterceptors();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [delegatesList, setDelegatesList] = useState<DelegatesList[]>([]);
  const name = msalInstance.getActiveAccount()?.idTokenClaims
    ?.given_name as string;
  const lastName =
    (msalInstance?.getActiveAccount()?.idTokenClaims
      ?.extension_LastName as string) ?? "";
  
  const providerId = JSON.parse(sessionStorage.getItem('provider') || '{}').providerId;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    window.location.reload();
    setIsModalOpen(false);
  }
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limitPerPage, setLimitPerPage] = useState<number>(LIMIT_PER_PAGE);
  const [totalPage, setTotalPage] = useState<number>(1);

  const handleOnPageChangeAt = async (
    event: React.MouseEvent<HTMLButtonElement>,
    page: number
  ) => {
    updateUrl(page);
    console.log(event);
  
    const newData = await getDelegatesList(api, providerId, page, limitPerPage);
    setDelegatesList(newData.content);
  };

  const handleOnNextPage = async () => {
    if (currentPage < totalPage) {
      const nextPage = currentPage + 1;
      updateUrl(nextPage);

      const newData = await getDelegatesList(api, providerId, nextPage, limitPerPage);
      setDelegatesList(newData.content);
    }
  };

  const handleOnPreviousPage = async () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      updateUrl(prevPage);

      const newData = await getDelegatesList(api, providerId, prevPage, limitPerPage);
      setDelegatesList(newData.content);
    }
  };

  const updateUrl = (page: number) => {
    setCurrentPage(page);
    navigate(`/manage-delegates?page=${page}`);
  };

  useEffect(() => {
    const fetchDelegates = async () => {
      const pageParam = searchParams.get("page");
      const initialPage = pageParam ? parseInt(pageParam, 10) : 1;
      let pageNum = initialPage;
      if (initialPage > totalPage) {
        updateUrl(1);
        pageNum = 1;
      }

      const response = await getDelegatesList(api, providerId, pageNum, limitPerPage);
      setDelegatesList(response.content);
      setLimitPerPage(response.limitPerPage);
      setTotalPage(response.totalNumberOfPages);

      if (initialPage > totalPage) {
        updateUrl(1);
      }
    };
    fetchDelegates();
  }, [api]);

  return (
    <div>
      <div id="content" className="-mt-7">        
      <BackButton
        label="Back to Home"
        onClick={() => navigate("/provider")}
        paddingTop={0}
      />
        <div className=" flex mt-5">
          <div className=" w-6/12">
          <PageTitle
              title={`Hello Dr. ${name} ${lastName}`}
              subtitle="Welcome to your workspace."
            />
            <Blurb title="Key Information">
              <ul className=" flex flex-col gap-2">
                <li className=" list-disc">
                  You can view, add, or deactivate delegates. You cannot delete them.
                </li>
                <li className=" list-disc">
                  By deactivating them, they will not be able to access your information anymore.
                </li>
                <li className=" list-disc">
                  In case you need more information{" "}
                  <a
                    className="usa-link cursor-pointer"
                    onClick={() => navigate("/glossary")}
                  >Learn More here
                  </a>.
                </li>
              </ul>
            </Blurb>
          </div>
          <div className=" w-6/12 mt-10 ml-5">
            <img className=" block" src={IMAGES.delegatesWelcome}></img>
          </div>
        </div>
          <PageSubtitle
            title={"Delegates in the list:"}
            subtitle="Manage your delegates."
          />
        <div className="flex flex-row">
          {delegatesList?.length ? (
            <DelegatesTable data={delegatesList} />
          ) :  (
            <p className=" font-bold">You do not have delegates to manage yet.</p>
          )}
        </div>
        <div className="h-8"></div>
        <Button type="button" outline={true} onClick={openModal}>
            Add Delegate
          </Button>
      </div>
      <div className="flex flex-row mt-12 items-center">
        {totalPage !== 0 &&
          <Pagination
            className="ml-auto"
            pathname="/manage-delegates"
            currentPage={currentPage}
            totalPages={totalPage}
            onClickNext={handleOnNextPage}
            onClickPrevious={handleOnPreviousPage}
            onClickPageNumber={handleOnPageChangeAt}
          ></Pagination>
        }
      </div>
      {isModalOpen && <InviteDelegateModal closeModal={closeModal} />}
    </div>
  );
};

export default ManageDelegates;
