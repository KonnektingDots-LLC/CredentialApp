import { Button } from "@trussworks/react-uswds";
import { PiWarningBold } from "react-icons/pi";
import Modal from "../../../../Application/sharedComponents/modal";

export const DeleteModal = ({
    closeModal,
    onConfirm,
}: {
    closeModal: () => void;
    onConfirm: () => void;
}) => {
    return (
        <Modal closeModal={closeModal}>
            <div className="flex flex-col gap-3 p-6 w-94">
                <div className="mt-3"/>
                <div className="flex gap-4 justify-center text-center">
                    <PiWarningBold color="#B50909" className="-mt-2" size={30} />

                    <p className="text-ink">Are you sure you want to delete this entry?</p>
                </div>
                <p className="text-ink text-center">
                    This action will save your current progress.
                </p>
                <div className="my-3"/>
                <div className="flex justify-center">
                    <Button
                        type="button"
                        onClick={() => {
                            onConfirm();
                            closeModal();
                        }}
                    >
                        Yes
                    </Button>
                    <Button
                        type="button"
                        outline
                        onClick={closeModal}
                    >
                        No
                    </Button>
                </div>
            </div>
        </Modal>
    );
};


