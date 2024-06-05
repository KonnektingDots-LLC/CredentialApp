import { StatusHistory } from "../../../../Application/interfaces";
import { STATUS_CODE } from "../../../../Application/utils/enums";
import { getProviderFormStatusColor } from "../../../../Application/utils/helperMethods";

interface NonActionableRowProps {
  resultData: StatusHistory;
}

const NonActionableRow = ({ resultData }: NonActionableRowProps) => {
  return (
    <div className="bg-info-lighter border border-info-light py-4 rounded px-8 min-w-[550px]">
      <div className="flex justify-between gap-6">
        <div className="w-3/4 flex flex-col gap-1 whitespace-nowrap">
          <span className="flex gap-1">
            <h3 className="font-semibold">
              Status:
            </h3>
            <p className="font-semibold"
              style={{ color: getProviderFormStatusColor(resultData.insurerStatusTypeId) }}
            >
              {resultData.insurerStatusTypeId === STATUS_CODE.RETURNED ? "Returned to Provider" : resultData.insurerStatusTypeId}
            </p>
          </span>
          <span className="flex gap-1">
            <h3 className="font-semibold flex">
              Date:
            </h3>
            <p className="font-medium">{resultData.statusDate}</p>
          </span>
          {resultData.insurerStatusTypeId !== STATUS_CODE.PENDING  && <span className="flex gap-1">
            <h3 className="font-semibold flex">
              By:
            </h3>
            <p className="font-medium">{resultData.createdBy}</p>
          </span>}
        </div>
        {resultData.comment && <div className="flex gap-2 w-full">
          <span className="flex gap-1">
            <h3 className="font-semibold flex">
              Comment:
            </h3>
            <span className="font-medium">
              {resultData.comment}
            </span>
          </span>
        </div>}
      </div>
    </div>
  );
};

export default NonActionableRow;
