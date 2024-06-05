import { FaUserLarge } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import SearchBar from "../../../Application/sharedComponents/SearchBar";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { ROLE } from "../../../Application/utils/enums";
import { useEffect, useState } from "react";
import useAuthStore from "../../../Infraestructure/Store/authStore";
import { logout } from "../../../Application/utils/auth";

const TopNav = () => {
  const { instance } = useMsal();
  const role = instance.getActiveAccount()?.idTokenClaims?.extension_Role as string;
  const isAuthenticated = useIsAuthenticated();
  const [username, setUsername] = useState("");
  const updateAuthStore = useAuthStore((s) => s.changeCurrentUser);
  const location = useLocation();

  const handleSignIn = () => {
    instance.loginRedirect().catch((error:any) => console.log(error));
  };

  const handleSignOut = () => {
        logout();
  };

  useEffect(() => {
    if(isAuthenticated){
    const currentAccount = instance.getActiveAccount();
    console.log('curr account:',currentAccount)
    if (currentAccount) {
      updateAuthStore(currentAccount)
      setUsername(currentAccount.username);
    }
  }else{
    updateAuthStore({});
  }
  }, [isAuthenticated]);

  return (
    <>
      {isAuthenticated ? (
        <div id="login_top_menu" className=" flex gap-16 justify-end">
          <Link to="/glossary" className={` font-bold my-auto ${location.pathname === "/" ? "text-secondary-blue" : "text-[#565c65]"}`}>
            Glossary
          </Link>
          <Link to="/" className={`font-bold my-auto ${location.pathname === "/" ? "text-secondary-blue" : "text-[#565c65]"}`}>
            <div className="flex">
              <FaUserLarge color={`${location.pathname === "/" ? "2496EF" : "#71767A"}`} className="my-auto" />
              <p className={`my-auto mx-5 ${location.pathname === "/" ? "text-secondary-blue" : "text-[#565c65]"}`}>{username}</p>
            </div>
          </Link>
          {role !== ROLE.Provider && location.pathname !== "/documents" && <SearchBar hint="Search" />}
          <button
            className={` font-bold my-auto ${location.pathname === "/" ? "text-secondary-blue" : "text-[#565c65]"}`}
            onClick={handleSignOut}
          >
            Logout
          </button>
        </div>
      ) : (
        <div id="top_menu" className=" flex gap-16 justify-end">
          <Link to="/glossary" className={` font-bold my-auto ${location.pathname === "/" ? "text-secondary-blue" : "text-[#565c65]"}`}>
            Glossary
          </Link>
          {location.pathname === "/glossary" && <Link to="/" className={` font-bold my-auto ${"text-[#565c65]"}`}>
            Home
          </Link>}
          <button
            className={` font-bold my-auto ${location.pathname === "/" ? "text-secondary-blue" : "text-[#565c65]"}`}
            onClick={handleSignIn}
          >
            Log In
          </button>
          
          <button type="button" className="usa-button" onClick={handleSignIn}
              style={{ backgroundColor: `${location.pathname === "/" ? "#2496EF" : ""}`}}
          >
            Create your Account
          </button>
        </div>
      )}
    </>
  );
};

export default TopNav;
