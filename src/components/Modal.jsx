import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function Modal({ children, isOpen = false, toggle, zIndex = 10, closeOnBackdrop = true, initialFocusRef, panelClassName = "sm:max-w-lg", containerClassName = "p-4 sm:p-0" }) {
  const cancelButtonRef = useRef(null);

  const handleClose = () => {
    if (closeOnBackdrop) {
      toggle();
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative"
        style={{ zIndex: zIndex }}
        initialFocus={initialFocusRef || cancelButtonRef}
        onClose={handleClose}
      >
        <Transition.Child
          as="div"  // Changed from Fragment to 'div' to allow passthrough of props
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className={`flex items-center justify-center min-h-full text-center ${containerClassName}`}>
            <Transition.Child
              as="div"  // Changed from Fragment to 'div' here too
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className={`relative text-left transition-all transform rounded-lg shadow-xl sm:my-8 sm:w-full ${panelClassName}`}>
                <div className="bg-white rounded-xl">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
