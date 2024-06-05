import { Accordion } from '@trussworks/react-uswds';
import { AccordionItemProps } from "@trussworks/react-uswds/lib/components/Accordion/Accordion";

interface CollaspsibleProps {
    accordionItems: AccordionItemProps[];
}

const Collaspsible = ({accordionItems}:CollaspsibleProps) => {
    return <>
        <div className='w-[680px]'>
            <Accordion items={accordionItems} />
        </div>
        
    </>
};

export default Collaspsible;