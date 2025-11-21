import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import p_fs from '../assets/imgs/ic_choicepana.webp';
import doublePannaImg from '../assets/imgs/ic_choicepana.webp';
import p_hs from '../assets/imgs/ic_choicepana.webp';
import jodiDigitImg from '../assets/imgs/ic_jodidigits.webp';
import singleDigitImg from '../assets/imgs/signle_digit.PNG';
import singlePannaImg from '../assets/imgs/single_pana.webp';
import triplePannaImg from '../assets/imgs/ic_triplepana.webp';
import { toast } from 'react-toastify';
import ResponseDialog from '../components/ResponseDialog';

const gameTypes = [
    { name: 'Single Digit', path: '/general-sub-games/single-digits', card_img: singleDigitImg, bidType: 'Single Digit', color: '#9C27B0' },
    { name: 'Single Digit Bulk', path: '/general-sub-games/single-digit-bulk', card_img: singleDigitImg, bidType: 'Single Digit', color: '#2196F3' },
    { name: 'Jodi Digit', path: '/general-sub-games/jodi-digits', card_img: jodiDigitImg, openGame: true, bidType: 'Jodi Digits', color: '#00BCD4' },
    { name: 'Single Pana', path: '/general-sub-games/single-pana', card_img: singlePannaImg, bidType: 'Single Pana', color: '#4CAF50' },
    { name: 'Single Pana Bulk', path: '/general-sub-games/single-pana-bulk', card_img: singlePannaImg, bidType: 'Single Pana', color: '#00BCD4' },
    { name: 'Double Pana', path: '/general-sub-games/double-pana', card_img: doublePannaImg, bidType: 'Double Pana', color: '#9C27B0' },
    { name: 'Double Pana Bulk', path: '/general-sub-games/double-pana-bulk', card_img: doublePannaImg, bidType: 'Double Pana', color: '#2196F3' },
    { name: 'Triple Pana', path: '/general-sub-games/tripal-pana', card_img: triplePannaImg, bidType: 'Triple Pana', color: '#FF9800' },
    { name: 'SP, DP, TP Board', path: '/general-sub-games/sp-dp-tp-board', card_img: triplePannaImg, bidType: 'SP DP TP', color: '#673AB7' },
    { name: 'Half Sangam', path: '/general-sub-games/half-sangam', card_img: p_hs, openGame: true, bidType: 'Half Sangam', color: '#E91E63' },
    { name: 'Full Sangam', path: '/general-sub-games/full-sangam', card_img: p_fs, openGame: true, bidType: 'Full Sangam', color: '#4CAF50' },
];

const GeneralSubGames = () => {
    const [searchParams] = useSearchParams();
    const tabType = searchParams.get('tabType');
    const gameType = searchParams.get('gameType');
    const market_id = searchParams.get('market_id');
    const marketClose = searchParams.get('close');
    const marketOpen = searchParams.get('open');

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");

    const checkGameAvailability = (e, game) => {
        if (game?.openGame && (!(marketClose == "true") || !(marketOpen == "true"))) {
            setDialogMessage(game?.name + " game is not open at the moment!");
            setIsDialogOpen(true);
            e.preventDefault();
        }
    };

    return (
        <div>
            <div className="grid grid-cols-2 gap-4 p-4">
                {gameTypes.map((game, index) => (
                    <Link
                        key={index}
                        to={{
                            pathname: game.path,
                            search: `?gameType=${gameType}&tabType=${tabType}&market_id=${market_id}&bidType=${game.bidType || game.name}&gameName=${game.name}`
                        }}
                        onClick={(e) => checkGameAvailability(e, game)}
                        className="flex flex-col items-center py-6 px-4 bg-white shadow-md rounded-lg"
                    >
                        <div className='w-20 h-20 mb-3 flex items-center justify-center'>
                            <img src={game.card_img} alt={game.name} className='w-full h-full object-contain' />
                        </div>
                        <div className='w-full h-[3px] mb-2' style={{ backgroundColor: game.color }}></div>
                        <span className='text-center font-semibold text-sm leading-tight'>{game.name}</span>
                    </Link>
                ))}
            </div>
            <br />
            <br />
            <br />

            <ResponseDialog
                isOpen={isDialogOpen}
                isSuccess={false}
                message={dialogMessage}
                onClose={() => {
                    setIsDialogOpen(false);
                    setDialogMessage("");
                }}
            />
        </div>
    );
};

export default GeneralSubGames;
