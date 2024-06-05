import { Link } from "react-router-dom"

const FooterNav = ()=>{
    return (
        <div id='top_menu' className=" flex gap-11 justify-start">
            <Link to='/glossary'  className=" font-bold text-base-darkest ">Glossary</Link>
        </div>
    )
}

export default FooterNav