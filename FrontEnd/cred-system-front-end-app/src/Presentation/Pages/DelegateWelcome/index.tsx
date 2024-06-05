import { useState, useEffect } from "react";
import Blurb from "../../../Application/sharedComponents/blurb";
import PageTitle from "../../../Application/sharedComponents/pageTitle";
import IMAGES from "../../../Application/images/images";
import { ProvidersList } from "../../../Application/interfaces";
import ActionableRow from "../SearchResults/actionableRow";
import { getDelegate, getDelegateProviderList } from "../../../Infraestructure/Services/delegate.service";
import { useAxiosInterceptors } from "../../../Infraestructure/axiosConfig";
import { useLocation, useNavigate } from "react-router-dom";
import { msalInstance } from "../../..";
import SearchService from "../../../Infraestructure/Services/search.service";

const DelegateWelcome = () => {
  const api = useAxiosInterceptors();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchedValue, setValue] = useState("");
  const [showResults, setShowResults] = useState(false);
  const email = msalInstance.getActiveAccount()?.username ?? "";
  const [providerList, setProviderList] = useState<ProvidersList[]>([]);
  const name = msalInstance.getActiveAccount()?.idTokenClaims?.given_name as string;
  const lastName = msalInstance?.getActiveAccount()?.idTokenClaims?.extension_LastName as string ?? ""; 
  const [originalList, setOriginalList] = useState<ProvidersList[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const delegate = await getDelegate(api, email);

      if (delegate) {
        const list = await getDelegateProviderList(api, delegate.id);
          if (list?.length) {
              setProviderList(list);
              setOriginalList(list);
              setShowResults(false);
          }
      }
    };
    fetchData();
}, []);

useEffect(() => {
    const searchValue = location.search;
    const val = searchValue.split("=");
    const decodedVal = decodeURIComponent(val[1]);
    setValue(decodedVal);

    if (searchValue) {
      const searchedList = SearchService.getSearchResults(originalList, decodedVal);
      setProviderList(searchedList);
      setShowResults(true);
   } else {
      setProviderList(originalList);
      setShowResults(false);
   }
}, [location]);

  return (
    <section>
      <PageTitle title={`Hello ${name} ${lastName}`} subtitle="Welcome to your workspace" />

      <div id="content">
        <div className=" flex">
          <div className=" w-2/3">
            <Blurb title="Key Information">
              <ul className=" flex flex-col gap-2">
                <li className=" list-disc">
                  Choose a provider from your list to begin credentialing or see
                  documents.
                </li>
                <li className=" list-disc">
                  Using the search bar on top you can make a search by Provider name or
                  email.
                </li>
                <li className=" list-disc">
                  You can fill forms and download documents in pdf format.
                </li>
                <li className=" list-disc">
                  In case you need more information.{" "}
                  <a
                    className="usa-link cursor-pointer"
                    onClick={() => navigate("/glossary")}
                  >Learn More here</a>.
                </li>
              </ul>
            </Blurb>
            <h2 className=" font-bold mt-6">Providers you are assisting</h2>
                {showResults && (
                <h5 className=" text-base-ink font-light">
                  {searchedValue === "" ? (
                    `${providerList?.length} results in this section`
                  ) : (
                    <>
                      {providerList?.length} results for "<em>{searchedValue}</em>"
                      in this section
                    </>
                  )}
                </h5>
              )}
            {providerList?.length ? (
              <div className=" my-10">
                <div className=" my-5 flex flex-col gap-5">
                  {providerList.map((resultData: ProvidersList) => (
                    <ActionableRow 
                      key={resultData.providerId}
                      resultData={resultData} 
                      isDelegate={true} 
                      api={api} 
                      navigate={navigate} 
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className=" mt-10">You are not assisting any providers</p>
            )}
          </div>
          <div className=" w-6/12">
            <img className=" block mx-auto" src={IMAGES.delegatesWelcome}></img>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DelegateWelcome;
