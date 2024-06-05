import PageTitle from "./pageTitle"
import layoutImages from "../../Application/images/images"
import { AiOutlineSearch } from "react-icons/ai"
import Blurb from "./blurb"

type NotFoundResultsProps = {
    searchedQuery: string,
    displayLogo?: boolean,
}

const NotFoundResults = ({searchedQuery, displayLogo}:NotFoundResultsProps) => {
    return <>
        <div className="flex justify-between mb-5">
            <PageTitle title="Ooops! Entry not found" 
                    subtitle={`Sorry. It seems that "${searchedQuery}" is not in our database right now.`}
                    displayLogo={displayLogo}
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
        <img className="mx-auto" src={layoutImages.imgNotFound} />
    </>
}

export default NotFoundResults;