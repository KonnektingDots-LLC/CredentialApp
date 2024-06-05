import { FormStatus } from "../../../../Application/interfaces";
import { STATUS } from "../../../../Application/utils/enums";
import { getProviderFormStatusColor } from "../../../../Application/utils/helperMethods";

interface NonActionableRowProps {
  resultData: FormStatus;
}

const NonActionableRow = ({ resultData }: NonActionableRowProps) => {
  return (
    <div className="bg-info-lighter border border-info-light p-4 rounded">
      <div className="flex justify-between items-center gap-6">
        <div className="w-1/2">
          <h3 className="text-primary font-bold flex text-xl">
            {resultData.name}
          </h3>
        </div>
        <div className="flex w-full flex-col gap-2 text-center">
          <span className="flex gap-1">
            <h3 className="font-semibold">
              Status:
            </h3>
            <p className="font-semibold"
              style={{ color: getProviderFormStatusColor(resultData.status) }}
            >
              {resultData.status === STATUS.RETURNED ? "Returned to Provider" : resultData.status}
            </p>
          </span>
          <span className="flex gap-1">
            {resultData.status === STATUS.DRAFT ? (
              <h3 className="font-semibold flex whitespace-nowrap">
                Since:
              </h3>
            ) : (
              <h3 className="font-semibold flex whitespace-nowrap">
                Date:
              </h3>
            )}
            <p className="font-medium">{resultData.currentStatusDate}</p>
          </span>
          {resultData.note ? (
            <span className="flex gap-1">
              <h3 className="font-semibold flex whitespace-nowrap">
                Note:
              </h3>
              <span className="font-medium">
                {resultData.note}
              </span>
            </span>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default NonActionableRow;
