import { useState, useEffect } from "react";
import { Button, Pagination } from "@trussworks/react-uswds";
import PageTitle from "../../../Application/sharedComponents/pageTitle";
import "./insurerTable.css";
import { InsurersList } from "../../../Application/interfaces";
import { msalInstance } from "../../..";
import { useAxiosInterceptors } from "../../../Infraestructure/axiosConfig";
import IMAGES from "../../../Application/images/images";
import Blurb from "../../../Application/sharedComponents/blurb";
import { AiOutlineSearch } from "react-icons/ai";
import InsurersTable from "../../../Application/sharedComponents/InsurersTable";
import { getInsurersList } from "../../../Infraestructure/Services/insurer.service";
import { useLocation, useNavigate } from "react-router-dom";
import { LIMIT_PER_PAGE } from "../../../Application/utils/constants";
import SwitchGroup from "../../../Application/sharedComponents/SwitchGroup";
import InviteInsurerModal from "../../../Application/modals/inviteInsurerModal";
import { searchInsurersList } from "../../../Infraestructure/Services/search.service";

const AdminInsurerWelcome = () => {
  const api = useAxiosInterceptors();
  const navigate = useNavigate();
  const location = useLocation();
  const [insurerEmployeesList, setInsurersList] = useState<InsurersList[]>([]);
  const name = msalInstance.getActiveAccount()?.idTokenClaims
    ?.given_name as string;
  const lastName =
    (msalInstance?.getActiveAccount()?.idTokenClaims
      ?.extension_LastName as string) ?? "";

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limitPerPage, setLimitPerPage] = useState<number>(LIMIT_PER_PAGE);
  const [totalPage, setTotalPage] = useState<number>(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [isInsurerActive, setIsInsurerActive] = useState(true);
  const [searchedValue, setValue] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleOnPageChangeAt = async (
    event: React.MouseEvent<HTMLButtonElement>,
    page: number
  ) => {
    setCurrentPage(page);
    let newData;
    if (searchedValue) {
      newData = await searchInsurersList(api, page, limitPerPage, searchedValue);
    } else {
      newData = await getInsurersList(api, page, limitPerPage);
    }
    setInsurersList(newData.content);
    console.log(event);
  };

  const handleOnNextPage = async () => {
    if (currentPage < totalPage) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      let newData;
      if (searchedValue) {
        newData = await searchInsurersList(api, nextPage, limitPerPage, searchedValue);
      } else {
        newData = await getInsurersList(api, nextPage, limitPerPage);
      }
      setInsurersList(newData.content);
    }
  };

  const handleOnPreviousPage = async () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      let newData;
      if (searchedValue) {
        newData = await searchInsurersList(api, prevPage, limitPerPage, searchedValue);
      } else {
        newData = await getInsurersList(api, prevPage, limitPerPage);
      }
      setInsurersList(newData.content);
    }
  };

  const handleNavigation = (label: string) => {
    if (label === "Providers") {
      setIsInsurerActive(false);
      navigate("/insurance");
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await getInsurersList(api, currentPage, limitPerPage);
    setShowResults(false);
      if (response && response.content) {
        setInsurersList(response.content);
        setCurrentPage(response.currentPage);
        setLimitPerPage(response.limitPerPage);
        setTotalPage(response.totalNumberOfPages);
      }
    };
    fetchEmployees();
  }, [api]);

  useEffect(() => {
    const fetch = async () => {
      const searchValue = location.search;
      const val = searchValue.split("=");
      setValue(val[1]);

      let response;
      if (val[1] === undefined) {
        response = await getInsurersList(api, currentPage, limitPerPage);
        setShowResults(false);
      } else {
        response = await searchInsurersList(api, 1, LIMIT_PER_PAGE, val[1]);
        setShowResults(true);
      }
      if (response && response.content) {
        setInsurersList(response.content);
        setCurrentPage(response.currentPage);
        setLimitPerPage(response.limitPerPage);
        setTotalPage(response.totalNumberOfPages);
      }
    };
    fetch();
  }, [api, location]);

  return (
    <div>
      <div className="flex justify-between">
        <PageTitle
          title={`Hello ${name} ${lastName}`}
          subtitle="Welcome to your workspace."
        />
        <SwitchGroup
          key={"admin-insurer-switch"}
          isActive={isInsurerActive}
          onToggle={handleNavigation}
          labels={["Insurer's Employees", "Providers"]}
        />
      </div>
      <div id="content">
        <div className=" flex">
          <div className=" w-6/12">
            <Blurb title="Key Information">
              <ul className=" flex flex-col gap-2">
                <li className=" list-disc">
                  Using the search bar on top you can make a search by Name or
                  NPI.
                </li>
                <li className=" list-disc">
                  You can view forms and download documents in pdf format.
                </li>
                <li className=" list-disc">
                  In case you need more information.{" "}
                  <a
                    className="usa-link cursor-pointer"
                    onClick={() => navigate("/glossary")}
                  >Learn More here
                  </a>.
                </li>
              </ul>
            </Blurb>

            <div className=" mt-10">
              <Blurb
                title="Search by"
                iconComponent={<AiOutlineSearch size={35} />}
              >
                <p>Quickly search by the Insurer's employee email</p>
                <p>or enter the full name.</p>
              </Blurb>
            </div>
          </div>
          <div className=" w-6/12">
            <img className=" block" src={IMAGES.insuranceWelcome}></img>
          </div>
        </div>
        <div className="mt-8 mb-3 flex justify-between">
          <div className="flex flex-col gap-2">
            <h2 className=" font-bold">Insurer's Employees in the list</h2>
            {showResults && (
              <h5 className=" text-base-ink font-light">
                {searchedValue === "" ? (
                  `${insurerEmployeesList.length} results in this section`
                ) : (
                  <>
                    {insurerEmployeesList.length} results for "<em>{decodeURIComponent(searchedValue)}</em>"
                    in this section
                  </>
                )}
              </h5>
            )}
          </div>
          <Button type="button" outline={true} onClick={openModal}>
            Add Insurer's Employee
          </Button>
        </div>
        <div className="flex flex-row">
          {insurerEmployeesList?.length ? (
            <InsurersTable data={insurerEmployeesList} />
          ) : showResults ? (<p className=" mt-10 font-semibold">No results found for your search.</p>) :  (
            <p className=" mt-10">You do not have insurer's employees</p>
          )}
        </div>
        <div className="flex flex-row mt-12 items-center">
          {totalPage !== 0 &&
            <Pagination
              className="ml-auto"
              pathname="/admin-insurer"
              currentPage={currentPage}
              totalPages={totalPage}
              onClickNext={handleOnNextPage}
              onClickPrevious={handleOnPreviousPage}
              onClickPageNumber={handleOnPageChangeAt}
            ></Pagination>
          }
        </div>
      </div>
      {isModalOpen && <InviteInsurerModal closeModal={closeModal} />}
    </div>
  );
};

export default AdminInsurerWelcome;
