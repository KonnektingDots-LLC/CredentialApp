import { Button } from "@trussworks/react-uswds";
import Modal from "../sharedComponents/modal";
import { PiWarningBold } from "react-icons/pi";
interface Props {
  closeModal: () => void;
  onConfirm: () => void;
}

const IncorporateModal = ({ closeModal, onConfirm }: Props) => {
  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-3 p-6 w-94">
        <div className="flex gap-4 justify-center my-6 text-center">
          <PiWarningBold color="#B50909" className='-mt-2' size={30} />
          <p className="text-ink">
            Are you sure you want to skip this section?
          </p>
        </div>

        <div className="flex justify-center text-center mb-5 w-full">
            <p className="text-ink text-center px-4">
                This action will remove the information and documents added in this step.
            </p>
        </div>

        <div className="flex gap-6 items-center ml-8">
          <Button
            type="button"
            onClick={() => {
              onConfirm();
              closeModal();
            }}
          >
            Yes
          </Button>
          <a className="text-blue-700 cursor-pointer" onClick={closeModal}>
            No
          </a>
        </div>
      </div>
    </Modal>
  );
};

export default IncorporateModal;
