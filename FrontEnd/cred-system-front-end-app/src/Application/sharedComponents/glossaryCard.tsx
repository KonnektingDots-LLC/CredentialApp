import {
    Card,
    CardBody,
    CardHeader,
  } from "@trussworks/react-uswds";
import { ReactNode } from "react";

interface CardProps {
    title:string;
    children: ReactNode;
} 

const GlossaryCard = ({title,children}:CardProps)=>{
    return(
        <Card className="list-none"
        containerProps={{ className: ' drop-shadow-md' }}>
             <CardHeader>
              <h3 className="usa-card__heading font-bold">
                {title}
              </h3>
            </CardHeader>           
            <CardBody className="padding-top-3">
                {children}
            </CardBody>
          </Card>
    );
}

export default GlossaryCard;