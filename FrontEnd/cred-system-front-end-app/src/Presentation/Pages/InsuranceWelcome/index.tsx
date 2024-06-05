import Blurb from "../../../Application/sharedComponents/blurb";
import PageTitle from "../../../Application/sharedComponents/pageTitle";
import IMAGES from "../../../Application/images/images";
import { AiOutlineSearch } from "react-icons/ai";
import { msalInstance } from "../../..";
import { useAxiosInterceptors } from "../../../Infraestructure/axiosConfig";
import { ProvidersList } from "../../../Application/interfaces";
import { useLocation, useNavigate } from "react-router-dom";
import ActionableRow from "../SearchResults/actionableRow";
import { Pagination } from "@trussworks/react-uswds";
import { useEffect, useState } from "react";
import { ROLE } from "../../../Application/utils/enums";
import { LIMIT_PER_PAGE } from "../../../Application/utils/constants";
import SwitchGroup from "../../../Application/sharedComponents/SwitchGroup";
import { searchProviderList } from "../../../Infraestructure/Services/search.service";
import { getInsurerProviderList } from "../../../Infraestructure/Services/insurerEmployee.service";

const InsuranceWelcome = () => {
  const api = useAxiosInterceptors();
  const navigate = useNavigate();
  const location = useLocation();
  const [providerList, setProviderList] = useState<ProvidersList[] | undefined>(
    undefined
  );
  const name = msalInstance.getActiveAccount()?.idTokenClaims
    ?.given_name as string;
  const lastName =
    (msalInstance?.getActiveAccount()?.idTokenClaims
      ?.extension_LastName as string) ?? "";
  const role = msalInstance?.getActiveAccount()?.idTokenClaims
    ?.extension_Role as string;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limitPerPage, setLimitPerPage] = useState<number>(LIMIT_PER_PAGE);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isInsurerActive, setIsInsurerActive] = useState(false);
  const [searchedValue, setValue] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleOnPageChangeAt = async (
    event: React.MouseEvent<HTMLButtonElement>,
    page: number
  ) => {
    setCurrentPage(page);
    console.log(event);
    let newData;
    if (searchedValue) {
      newData = await searchProviderList(api, page, limitPerPage, searchedValue);
    } else {
      newData = await getInsurerProviderList(api, page, limitPerPage);
    }
    setProviderList(newData.content);
  };

  const handleOnNextPage = async () => {
    if (currentPage < totalPage) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      let newData;
      if (searchedValue) {
        newData = await searchProviderList(api, nextPage, limitPerPage, searchedValue);
      } else {
        newData = await getInsurerProviderList(api, nextPage, limitPerPage);
      }
      setProviderList(newData.content);
    }
  };

  const handleOnPreviousPage = async () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      let newData;
      if (searchedValue) {
        newData = await searchProviderList(api, prevPage, limitPerPage, searchedValue);
      } else {
        newData = await getInsurerProviderList(api, prevPage, limitPerPage);
      }
      setProviderList(newData.content);
    }
  };

  const handleNavigation = (label: string) => {
    if (label === "Insurer's Employees") {
      setIsInsurerActive(true);
      navigate("/admin-insurer");
    }
  };

  useEffect(() => {
    const fetchProviders = async () => {
      const response = await getInsurerProviderList(
        api,
        currentPage,
        limitPerPage
      );
      setShowResults(false);

      if (response && response.content) {
        setProviderList(response.content);
        setCurrentPage(response.currentPage);
        setLimitPerPage(response.limitPerPage);
        setTotalPage(response.totalNumberOfPages);
      }
    };
    fetchProviders();
  }, [api]);

  useEffect(() => {
    const fetch = async () => {
      const searchValue = location.search;
      const val = searchValue.split("=");
      setValue(val[1]);

      let response;
      if (val[1] === undefined) {
        response = await getInsurerProviderList(api, currentPage, limitPerPage);
        setShowResults(false);
      } else {
        response = await searchProviderList(api, 1, LIMIT_PER_PAGE, val[1]);
        setShowResults(true);
      }
      if (response && response.content) {
        setProviderList(response.content);
        setCurrentPage(response.currentPage);
        setLimitPerPage(response.limitPerPage);
        setTotalPage(response.totalNumberOfPages);
      }
    };
    fetch();
  }, [api, location]);

  return (
    <section>
      <div className="flex justify-between">
        <PageTitle
          title={`Hello ${name} ${lastName}`}
          subtitle="Welcome to your workspace."
        />
        {role === ROLE.AdminInsurer && (
          <SwitchGroup
            isActive={isInsurerActive}
            onToggle={handleNavigation}
            labels={["Insurer's Employees", "Providers"]}
          />
        )}
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
                  You can fill forms and download documents in pdf format.
                </li>
                <li className=" list-disc">
                  In case you need more information.{" "}
                  <a
                    className="usa-link cursor-pointer"
                    onClick={() => navigate("/glossary")}
                  >
                  Learn More here
                  </a>.
                </li>
              </ul>
            </Blurb>

            <div className=" mt-10">
              <Blurb
                title="Search by"
                iconComponent={<AiOutlineSearch size={35} />}
              >
                <p>Quickly search by the Provider full name</p>
                <p>or enter the complete NPI number.</p>
              </Blurb>
            </div>
          </div>
          <div className=" w-6/12">
            <img className=" block" src={IMAGES.insuranceWelcome}></img>
          </div>
        </div>
        <div className=" w-4/6">
          {providerList?.length ? (
            <div className=" my-10">
              <div className="flex flex-col gap-2">
                <h2 className=" font-bold">Providers in the list</h2>
                {showResults && (
                  <h5 className=" text-base-ink font-light">
                    {searchedValue === "" ? (
                      `${providerList.length} results in this section`
                    ) : (
                      <>
                        {providerList.length} results for "
                        <em>{decodeURIComponent(searchedValue)}</em>" in this section
                      </>
                    )}
                  </h5>
                )}
              </div>
              <div className=" my-5 flex flex-col gap-5">
                {providerList?.map((resultData: ProvidersList) => (
                  <ActionableRow
                    key={resultData.providerId}
                    resultData={resultData}
                    isDelegate={false}
                    api={api}
                    navigate={navigate}
                  />
                ))}
              </div>
            </div>
          ) : showResults ? (<p className=" mt-10 font-semibold">No results found for your search.</p>) : (
            <p className=" mt-10">You do not have providers yet</p>
          )}
        </div>
      </div>
      <div className="flex flex-row mt-12 items-center">
        {totalPage !== 0 &&
          <Pagination
            className="ml-auto"
            pathname="/insurance"
            currentPage={currentPage}
            totalPages={totalPage}
            onClickNext={handleOnNextPage}
            onClickPrevious={handleOnPreviousPage}
            onClickPageNumber={handleOnPageChangeAt}
          ></Pagination>
        }
      </div>
    </section>
  );
};

export default InsuranceWelcome;
