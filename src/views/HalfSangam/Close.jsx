import React, { useState } from "react";
import { FaTrash } from 'react-icons/fa';
import Popup from '../../components/Submit_Bet_Popup';
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";

const Close = () => {
    const [rows, setRows] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [inputError, setInputError] = useState({});
    const { appData: initialAppData } = useSelector((state) => state.appData);
    const numbers = [
        127, 136, 145, 190, 235, 280, 370, 389, 460, 479, 569, 578, 128, 137, 146, 236, 245, 290, 380, 470, 489, 560, 579,
        678, 129, 138, 147, 156, 237, 246, 345, 390, 480, 570, 589, 679, 120, 139, 148, 157, 238, 247, 256, 346, 490, 580,
        670, 689, 130, 149, 158, 167, 239, 248, 257, 347, 356, 590, 680, 789, 140, 159, 168, 230, 249, 258, 267, 348, 357,
        456, 690, 780, 123, 150, 169, 178, 240, 259, 268, 349, 358, 367, 457, 790, 124, 160, 179, 250, 269, 278, 340, 359,
        368, 458, 467, 890, 125, 134, 170, 189, 260, 279, 350, 369, 378, 459, 468, 567, 126, 135, 180, 234, 270, 289, 360,
        379, 450, 469, 478, 568, 118, 226, 244, 299, 334, 488, 550, 668, 677, 119, 155, 227, 335, 344, 399, 588, 669, 110,
        688, 778, 166, 229, 337, 355, 445, 599, 779, 788, 112, 220, 266, 338, 446, 455, 699, 770, 113, 122, 177, 339, 366,
        447, 799, 889, 114, 277, 330, 448, 466, 556, 880, 899, 115, 133, 188, 223, 377, 449, 557, 566, 116, 224, 233, 288,
        440, 477, 558, 990, 117, 144, 199, 225, 388, 559, 577, 667, 0, 111, 222, 333, 444, 555, 666, 777, 888, 999, 228,
        255, 336, 499, 660
    ];


    const handlePanaInputChange = (e) => {
        const value = e.target.value;
        const id = e.target.id;

        if (value.length <= 3 && /^\d*$/.test(value)) {
            if (value.length === 3 && !numbers.includes(parseInt(value, 10))) {
                setInputError(prevError => ({ ...prevError, [id]: true }));
                toast.error("Invalid Pana.");
            } else {
                setInputError(prevError => ({ ...prevError, [id]: false }));
            }
            e.target.value = value;
        } else {
            e.target.value = value.slice(0, 3);
        }
    };

    const handleAnkInputChange = (e) => {
        const value = e.target.value;
        if (value.length <= 1 && /^\d*$/.test(value)) {
            e.target.value = value;
        } else {
            e.target.value = value.slice(0, 1);
        }
    };


    const handleAddRow = () => {
        const pana = document.getElementById('pana').value;
        const ank = document.getElementById('ank').value;
        const amount = document.getElementById('amount').value;

        // check for minimum bid
        if (initialAppData?.appData?.min_bid_amount && parseInt(amount) < initialAppData?.appData?.min_bid_amount) {
            toast.error(`Bid amount cannot be less than ${initialAppData.appData.min_bid_amount}!`);
            return;
        }

        // Check if the pana exists in the numbers array
        if (!numbers.includes(parseInt(pana, 10))) {
            toast.error(`Invalid Pana`);
            return;
        }

        if (pana.length === 3 && ank.length === 1 && amount) {
            setRows([...rows, { pana, ank, amount }]);
            document.getElementById('pana').value = '';
            document.getElementById('ank').value = '';
            document.getElementById('amount').value = '';
        } else {
            toast.error("Pana must be 3 digits and Ank must be 1 digit.");
        }
    };

    const handleDeleteRow = (index) => {
        const newRows = [...rows];
        newRows.splice(index, 1);
        setRows(newRows);
    };

    const handleSubmit = () => {
        if (rows.length === 0) {
            toast.error('No records to submit.');
            return;
        }
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const formattedData = rows.map(row => ({
        pair: row.pana + "x" + row.ank,
        value: row.amount,
        type: '',
        gameTypeId: 7
    }));

    const totalBids = formattedData.length;
    const totalPoints = formattedData.reduce((sum, item) => sum + parseInt(item.value || 0), 0);

    return (
        <div className="min-h-screen flex flex-col justify-between">
            <div className="flex-grow">
                <div className="container mx-auto pt-1">
                    <div className="flex justify-center pb-1">
                        <div className="w-full bg-white rounded-lg shadow-sm flex justify-center items-center gap-2 p-1 m-1">
                            <div className="w-full  rounded-sm flex justify-center items-center gap-2">
                                <div className="flex flex-col w-full">
                                    <label className="text-md font-semibold">Ank</label>
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        id="ank"
                                        required
                                        className="w-full p-1 mt-1 border rounded border-black/40 outline-0 focus:border-primary"
                                        placeholder=""
                                        onChange={handleAnkInputChange}
                                    />
                                </div>
                                <div className="flex flex-col w-full">
                                    <label className="text-md font-semibold">Pana</label>
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        id="pana"
                                        required
                                        className="w-full p-1 mt-1 border rounded border-black/40 outline-0 focus:border-primary"
                                        placeholder=""
                                        onChange={handlePanaInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center bg-blue-gray-100 ">
                        <div className="w-full bg-white rounded-lg shadow-sm flex justify-center items-center gap-2 p-1 mx-1 mb-2">
                            <div className="flex flex-col w-full">
                                <label className="text-md font-semibold">Amount</label>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    id="amount"
                                    required
                                    className="w-full p-1 mt-1 border rounded border-black/40 outline-0 focus:border-primary"
                                    placeholder=""
                                />
                            </div>
                            <div className="w-full relative bg-white rounded-sm">
                                <button
                                    type="button"
                                    id="submit"
                                    className="w-full h-[33px] bg-[#e4ae39] text-white font-sans font-medium py-1 shadow-sm mt-7 rounded"
                                    onClick={handleAddRow}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pb-20">
                        <div className="text-center p-1">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="bg-white text-[#000] border border-gray-300 shadow-md w-full flex justify-between items-center py-1 text-md">
                                        <th className="py-1 text-[13px] border-r border-gray-300">Open Ank</th>
                                        <th className="py-1 text-[13px] border-r border-gray-300">Close Pana</th>
                                        <th className="py-1 text-[13px] border-r border-gray-300">Amount</th>
                                        <th className="py-1 text-[13px] border-r border-gray-300">Del</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, index) => (
                                        <tr key={index} className="w-full flex justify-between items-center py-2 px-2 text-md">
                                            <td className="py-1 bg-white text-black border-none">{row.ank}</td>
                                            <td className="py-1 bg-white text-black border-none">{row.pana}</td>
                                            <td className="py-1 bg-white text-black border-none">{row.amount}</td>
                                            <td className="py-1 border-none text-[#fff] bg-[#fff]">
                                                <button onClick={() => handleDeleteRow(index)}>
                                                    <FaTrash color="#ff2d2d" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Summary and Continue Button */}
            <div className='w-[480px] max-w-full mx-auto fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-10'>
                <div className='px-4 py-3'>
                    <div className='flex justify-between items-center mb-2'>
                        <span className='text-sm text-gray-600'>
                            <span className='font-bold text-gray-800'>{totalBids}</span> Bids
                        </span>
                        <span className='text-sm text-gray-600'>
                            <span className='font-bold text-gray-800'>{totalPoints}</span> Points
                        </span>
                    </div>
                    <button
                        className='w-full p-2.5 bg-[#e4ae39] text-white rounded font-semibold shadow hover:bg-[#d49d2d] transition-colors'
                        onClick={handleSubmit}
                    >
                        Continue
                    </button>
                </div>
            </div>

            <Popup show={showPopup} data={formattedData} onClose={closePopup} onSubmitted={() => { setRows([]) }} />
        </div>
    );
};

export default Close;
