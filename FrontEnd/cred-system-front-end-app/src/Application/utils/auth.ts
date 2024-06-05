import { msalInstance } from "../..";

export function logout() {
    sessionStorage.clear();
    msalInstance.logoutRedirect();
}
