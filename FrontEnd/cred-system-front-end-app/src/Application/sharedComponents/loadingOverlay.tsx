// import { Card, CardBody, CardHeader } from "@trussworks/react-uswds";
// import ReactLoading from "react-loading";

import ReactLoading from "react-loading";

const LoadingOverlay = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255,255,255,0.5)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {/* <Card className="list-none"
        containerProps={{ className: ' drop-shadow-md flex items-center' }}>
             <CardHeader>
                <div>Loading, please wait...</div>   
            </CardHeader>
            <CardBody> */}
                <ReactLoading type="spin" color="#005EA2" height={60} width={60}/>  
            {/* </CardBody>
          </Card>   */}
        </div>
    );
}

export default LoadingOverlay;
