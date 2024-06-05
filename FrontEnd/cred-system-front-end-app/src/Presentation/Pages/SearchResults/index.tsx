import { useState, useEffect } from "react";
import PageTitle from "../../../Application/sharedComponents/pageTitle";
import SearchResultsTable from "./searchResultsTable";
import { InsurersList, ProvidersList } from "../../../Application/interfaces";
import SearchService, { searchInsurersList, searchProviderList } from "../../../Infraestructure/Services/search.service";
import NotFoundResults from "../../../Application/sharedComponents/NotFoundResults";
import { useLocation } from 'react-router-dom';
import { getDelegate, getDelegateProviderList } from "../../../Infraestructure/Services/delegate.service";
import { useAxiosInterceptors } from "../../../Infraestructure/axiosConfig";
import { msalInstance } from "../../..";
import { ROLE } from "../../../Application/utils/enums";
import { LIMIT_PER_PAGE } from "../../../Application/utils/constants";
import { Pagination } from "@trussworks/react-uswds";
import Blurb from "../../../Application/sharedComponents/blurb";
import { AiOutlineSearch } from "react-icons/ai";
import InsurersTable from "../../../Application/sharedComponents/InsurersTable";

const SearchResults = () => {
  const api = useAxiosInterceptors()
  const [providersResults, setProvidersResults] = useState<ProvidersList[]>([]);
  const [insurersResults, setInsurersResults] = useState<InsurersList[]>([]);

  const [searchedValue, setValue] = useState('');
  const [list, setList] = useState('');
  const location = useLocation();
  const email = msalInstance.getActiveAccount()?.username ?? "";
  const role = msalInstance.getActiveAccount()?.idTokenClaims?.extension_Role as string;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limitPerPage, setLimitPerPage] = useState<number>(LIMIT_PER_PAGE);
  const [totalPage, setTotalPage] = useState<number>(0);

  const loadData = async () => {
    const searchParams = new URLSearchParams(location.search);
    // const searchType = searchParams.get('searchType');
    const searchValue = searchParams.get('search') || '';
    setValue(searchValue);

    const searchList= searchParams.get('list') || '';
    setList(searchList);

    if (role === ROLE.Delegate) {
      const delegateInfo = await getDelegate(api, email);
      const providerList = await getDelegateProviderList(api, delegateInfo?.id);

        if(providerList){
            const searchedList = SearchService.getSearchResults(providerList, searchValue);
            setProvidersResults(searchedList);  
        }

    } else {
      if (searchList === 'prov') {
        console.log('hereeee')
        const searchedList = await searchProviderList(api, 1, LIMIT_PER_PAGE, searchValue);
        if (searchedList && searchedList.content) {
          setProvidersResults(searchedList?.content ?? []);
          setCurrentPage(searchedList.currentPage);
          setLimitPerPage(searchedList.limitPerPage);
          setTotalPage(searchedList.totalNumberOfPages);
        } else {
          setProvidersResults([]);
          setCurrentPage(1);
          setTotalPage(0);
        }
      } else if (searchList === 'ins') {
        const searchedList = await searchInsurersList(api, 1, LIMIT_PER_PAGE, searchValue);
        if (searchedList && searchedList.content) {
          setInsurersResults(searchedList?.content ?? []);
          setCurrentPage(searchedList.currentPage);
          setLimitPerPage(searchedList.limitPerPage);
          setTotalPage(searchedList.totalNumberOfPages);
        } else {
          setInsurersResults([]);
          setCurrentPage(1);
          setTotalPage(0);
        }
      }
    }

  };

  const handleOnPageChangeAt = async (event: React.MouseEvent<HTMLButtonElement>, page: number) => {
    setCurrentPage(page);
    console.log(event);
    if (list === 'prov') {
      const newData = await searchProviderList(api, page, limitPerPage, searchedValue);
      setProvidersResults(newData.content);
    } else if (list === 'ins') {
      const newData = await searchInsurersList(api, 1, limitPerPage, searchedValue);
      setInsurersResults(newData.content);
    }
  }

  const handleOnNextPage = async () => {
    if (currentPage < totalPage) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      if (list === 'prov') {
        const newData = await searchProviderList(api, nextPage, limitPerPage, searchedValue);
        setProvidersResults(newData.content);
      } else if (list === 'ins') {
        const newData = await searchInsurersList(api, nextPage, limitPerPage, searchedValue);
        setInsurersResults(newData.content);
      }
    }
  }

  const handleOnPreviousPage = async () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      if (list === 'prov') {
        const newData = await searchProviderList(api, prevPage, limitPerPage, searchedValue);
        setProvidersResults(newData.content);
      } else if (list === 'ins') {
        const newData = await searchInsurersList(api, prevPage, limitPerPage, searchedValue);
        setInsurersResults(newData.content);
      }
    }
  }

  useEffect(() => {
    loadData();
  }, [location]);

  return (
    <div>
      <section></section>
      <section>
      {role === ROLE.AdminInsurer && list === 'ins' ? (
      <>
      <div className="flex justify-between mb-5">
              <PageTitle
              title="Your Results"
              subtitle={searchedValue === '' ? `${insurersResults.length} results in this section` : <>{insurersResults.length} results for "<em>{searchedValue}</em>" in this section</>}
              />
              <div>
                <Blurb
                    title="Search by"
                    iconComponent={<AiOutlineSearch size={35} />}
                >
                    <p>Quickly search by the Provider name</p>
                    <p>or enter the complete NPI number.</p>
                </Blurb>
              </div>
            </div>
            <InsurersTable data={insurersResults} /> 
            </>) :
        providersResults.length > 0 ? 
          (<>
            <div className="flex justify-between mb-5">
              <PageTitle
              title="Your Results"
              subtitle={searchedValue === '' ? `${providersResults.length} results in this section` : <>{providersResults.length} results for "<em>{searchedValue}</em>" in this section</>}
              />
              <div>
                <Blurb
                    title="Search by"
                    iconComponent={<AiOutlineSearch size={35} />}
                >
                    <p>Quickly search by the Provider name</p>
                    <p>or enter the complete NPI number.</p>
                </Blurb>
              </div>
            </div>
            <SearchResultsTable data={providersResults} />
          </>)
         : 
          (<NotFoundResults searchedQuery={searchedValue}/>)
        }
      </section>
      <div className="flex flex-row mt-12 items-center">
                <Pagination
                    className="ml-auto"
                    pathname="/results"
                    currentPage={currentPage}
                    totalPages={totalPage}
                    onClickNext={handleOnNextPage}
                    onClickPrevious={handleOnPreviousPage}
                    onClickPageNumber={handleOnPageChangeAt}>

                </Pagination>
            </div>
    </div>
  );
};

export default SearchResults;
