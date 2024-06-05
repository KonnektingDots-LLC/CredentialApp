import { useState } from 'react';
import layoutImages from "../images/images";
import { useLocation, useNavigate } from 'react-router-dom';

type SearchBarProps = {
    hint?: string,
    searchLabel?: string,
}

const SearchBar = ({ hint, searchLabel = "Search"}: SearchBarProps) => {
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const handleSearchSubmit = (event: any) => {
        event.preventDefault(); 

        if (location.pathname.includes('admin-insurer')) {
            searchValue === '' ? navigate(`/admin-insurer`) : navigate(`/admin-insurer?search=${searchValue}`);
        } else if (location.pathname.includes('insurance')) {
            searchValue === '' ? navigate(`/insurance`) : navigate(`/insurance?search=${searchValue}`);
        } else if (location.pathname === '/delegate') {
            searchValue === '' ? navigate(`/delegate`) : navigate(`/delegate?search=${searchValue}`);
        } else if (location.pathname.includes('admin')) {
            searchValue === '' ? navigate(`/admin`) : navigate(`/admin?search=${searchValue}`);
        }
    }

    const handleSearchChange = (event: any) => {
        setSearchValue(event.target.value);
      };
    
    return <>
        <form className="usa-search usa-search--small" role="search" onSubmit={handleSearchSubmit}>
            <div className='flex w-full'>
                <label className="usa-sr-only" htmlFor="search-field-en-small">{searchLabel}</label>
                <input id="search-field-en-small"
                    className="usa-input" 
                    type="search" 
                    name="search" 
                    placeholder={hint} 
                    value={searchValue}
                    onChange={handleSearchChange}
                />
                <button className="usa-button" type="submit">
                    <img
                        src={layoutImages.iconSearch}
                        className="usa-search__submit-icon"
                        style={{height: "15px", width: "15px", margin: "auto"}}
                        alt="Search"
                    />
                </button>
            </div>
        </form>
    </>
}

export default SearchBar;