import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FloatingMenu from "../components/FloatingMenu";
import { Outlet, useNavigate, useLocation, useNavigationType } from "react-router-dom";
import Modal from "../components/Modal"
import { useSelector } from "react-redux";
import { useShowEverything } from "../credentials";

const Main = () => {
  let navigate = useNavigate();
  let [isExitModal, setExitModal] = useState(false);
  const navigationType = useNavigationType();
  const [prevPath, setPrevPath] = useState(null);
  const [sidebarKey, setSidebarKey] = useState(0);
  let { appData } = useSelector((state) => state?.appData?.appData);

  const toggleSideBar = () => {
    let bodyClassList = document.body.classList;
    if (bodyClassList.contains("sidebar-open")) {
      bodyClassList.remove("sidebar-open");
    } else {
      bodyClassList.add("sidebar-open");
      setSidebarKey((prevKey) => prevKey + 1);
    }
  };
  useEffect(() => {
    let token = localStorage.getItem("authToken");
    if (token == null) navigate("/");
  }, []);
  const toggleExitModal = () => {
    setExitModal(prevState => !prevState)
  }
  const location = useLocation();

  useEffect(() => {
    setPrevPath(location.pathname)
  }, [location])

  useEffect(() => {
    if (navigationType === "POP" && prevPath === "/") {
    }
  }, [navigationType])

  const { showEverything } = useShowEverything();
  let showResultsOnly = !showEverything;

  return (
    <div className="font-poppins border border-black/20 border-t-0 border-b-0 overflow-hidden relative max-w-[480px] w-full mx-auto h-[100vh]">
      <Header toggleSideBar={toggleSideBar} />
      <Sidebar toggleSideBar={toggleSideBar} />
      {
        !showResultsOnly ?
          <FloatingMenu />
          : null
      }
      <div className="h-[calc(100dvh-56px)] bg-primary/5 pb-12 overflow-auto main-wrapper">
        <Outlet />
      </div>
      <Modal isOpen={isExitModal} toggle={toggleExitModal}>
        <div className='font-semibold relative text-black bg-white rounded-xl'>
          <div className='flex justify-end p-3 border-b border-black'>
            <button onClick={toggleExitModal}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6 18 18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
          <div className='p-4 text-left text-md'>
            <h3 className=" text-xl">Are you sure?</h3>
            <div>
              Exit Mahakal Matka
            </div>
            <div className="flex gap-4 justify-end mt-4">
              <button className="py-2 px-6 rounded-md bg-blue-100">No</button>
              <button onClick={() => {
                window.open('', '_self').close();
              }} className="py-2 px-6 rounded-md bg-blue-100">Yes</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Main;
