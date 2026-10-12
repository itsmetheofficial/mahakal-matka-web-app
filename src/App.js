import { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './assets/css/Global.css';
import Home from './views/Home';
import Main from './layouts/Main';
import EditProfile from './views/EditProfile';
import AppDetails from './views/AppDetails';
import History from './views/History';
import BonusReport from './views/BonusReport';
import ResultHistory from './views/ResultHistory';
import FreeGift from './views/FreeGift';
import TermsAndConditions from './views/TermsAndConditions';
import GamePosting from './views/GamePosting';
import Default from './layouts/Default';
import Wallet from './views/Wallet';

import SingleDigits from './views/SingleDigits'
import SingleDigitBulk from './views/SingleDigitBulk'
import JodiDigits from './views/JodiDigits'
import SinglePana from './views/SinglePana'
import SinglePanaBulk from './views/SinglePanaBulk'
import DualPana from './views/DualPana'
import DoublePanaBulk from './views/DoublePanaBulk'
import TripalPana from './views/TripalPana'
import SPDPTPBoard from './views/SPDPTPBoard'
import HalfSangam from './views/HalfSangam'
import FullSangam from './views/FullSangam'


import Help from './views/Help';
import Auth from './layouts/Auth';
import Login from './views/Login';
import GeneralSubGames from './views/GeneralSubGames'
import Notifications from './views/Notifications';
import Play from './views/Play';
import PlayGame from './views/PlayGame';
import Modal from './components/Modal';
import Logo from './assets/imgs/Logo.png';
import Game from './layouts/Game';
import Chat from './views/Chat';
import { ToastContainer, toast } from 'react-toastify';
import { getAppData } from './repository/DataRepository';
import { setAppData } from './store/features/appData/appDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import Splash from './views/Splash';
import { getMarkets } from './repository/MarketRepository';
import { setMarkets } from './store/features/markets/marketSlice';
import { ModalContextProvider } from './context/ModalContext';
import { DeferredPromptContextProvider } from './context/DeferredPromptContext';
import GameRate from './views/GameRate';
import NotFound from './views/NotFound';
import ProtectedRoute from './utils/ProtectedRoute';
import GameChart from './views/GameChart';
import MaintenancePage from './views/MaintenancePage';
import OfflinePage from './views/OfflinePage';
import InviteAndEarn from './views/InviteAndEarn';
import PaymentPage from './views/PaymentPage';
import ExternalGame, { ExternalGameReturn } from './views/ExternalGame';

export const routes = [
    {
        path: '/external-games/aviator',
        element: <ProtectedRoute><ExternalGame /></ProtectedRoute>,
    },
    {
        path: '/external-games/return',
        element: <ExternalGameReturn />,
    },
	{
		element: <Main />,
		children: [
			{
				path: '/',
				element: <Home />,
				name: 'Home',
			},
			{
				path: '/play',
				element: (
					<ProtectedRoute>
						<Play />
					</ProtectedRoute>
				),
				name: 'Play',
			},
			{
				path: '/profile',
				element: (
					<ProtectedRoute>
						<EditProfile />
					</ProtectedRoute>
				),
				name: 'Profile',
			},
			{
				path: '/app-details',
				element: (
					<ProtectedRoute>
						<AppDetails />
					</ProtectedRoute>
				),
				name: 'App Details',
			},
			{
				path: '/history',
				element: (
					<ProtectedRoute>
						<History />
					</ProtectedRoute>
				),
				name: 'History',
			},
			{
				path: '/game-rate',
				element: (
					<ProtectedRoute>
						<GameRate />
					</ProtectedRoute>
				),
				name: 'Game Rate',
			},
			{
				path: '/bonus-report',
				element: (
					<ProtectedRoute>
						<BonusReport />
					</ProtectedRoute>
				),
				name: 'Bonus Report',
			},
			{
				path: '/result-history',
				element: (
					<ProtectedRoute>
						<ResultHistory />
					</ProtectedRoute>
				),
				name: 'Result History',
			},
			{
				path: '/free-gift',
				element: (
					<ProtectedRoute>
						<FreeGift />
					</ProtectedRoute>
				),
				name: 'Get Free Bonus',
			},
			{
				path: '/terms-and-condition',
				element: (
					<ProtectedRoute>
						<TermsAndConditions />
					</ProtectedRoute>
				),
				name: 'Terms And Conditions',
			},
			{
				path: '/invite-and-earn',
				element: (
					<ProtectedRoute>
						<InviteAndEarn />
					</ProtectedRoute>
				),
				name: 'Invite and Earn',
			},
			{
				path: '/wallet',
				element: (
					<ProtectedRoute>
						<Wallet />
					</ProtectedRoute>
				),
				name: 'Wallet',
			},
			{
				path: '/help',
				element: (
					<ProtectedRoute>
						<Help />
					</ProtectedRoute>
				),
				name: 'Help',
			},
			{
				path: '/notifications',
				element: (
					<ProtectedRoute>
						<Notifications />
					</ProtectedRoute>
				),
				name: 'Notifications',
			},
		],
	},
	{
		element: <Auth />,
		children: [
			{
				path: '/auth/login',
				element: <Login />,
			},
		],
	},
	{
		element: <Default />,
		children: [
			{
				path: '/game-posting',
				element: (
					<ProtectedRoute>
						<GamePosting />
					</ProtectedRoute>
				),
				name: 'Game Posting',
			},
			{
				path: '/withdrawal-chat',
				element: (
					<ProtectedRoute>
						<Chat />
					</ProtectedRoute>
				),
				name: 'Withdrawal Chat',
			},
			{
				path: '/deposit-chat',
				element: (
					<ProtectedRoute>
						<Chat />
					</ProtectedRoute>
				),
				name: 'Deposit Chat',
			},
		],
	},
	{
		element: <Game />,
		children: [
			{
				path: '/play-game',
				element: (
					<ProtectedRoute>
						<PlayGame />
					</ProtectedRoute>
				),
				name: 'Play Game',
			},
			{
				path: '/general-sub-games',
				element: (
					<ProtectedRoute>
						<GeneralSubGames />
					</ProtectedRoute>
				),
				name: 'General Sub Games',
			},
			{
				path: '/general-sub-games/single-digits',
				element: (
					<ProtectedRoute>
						<SingleDigits />
					</ProtectedRoute>
				),
				name: 'Single Digits',
			},
			{
				path: '/general-sub-games/single-digit-bulk',
				element: (
					<ProtectedRoute>
						<SingleDigitBulk />
					</ProtectedRoute>
				),
				name: 'Single Digit Bulk',
			},
			{
				path: '/general-sub-games/jodi-digits',
				element: (
					<ProtectedRoute>
						<JodiDigits />
					</ProtectedRoute>
				),
				name: 'Jodi Digits',
			},
			{
				path: '/general-sub-games/single-pana',
				element: (
					<ProtectedRoute>
						<SinglePana />
					</ProtectedRoute>
				),
				name: 'Single Pana',
			},
			{
				path: '/general-sub-games/single-pana-bulk',
				element: (
					<ProtectedRoute>
						<SinglePanaBulk />
					</ProtectedRoute>
				),
				name: 'Single Pana Bulk',
			},
			{
				path: '/general-sub-games/double-pana',
				element: (
					<ProtectedRoute>
						<DualPana />
					</ProtectedRoute>
				),
				name: 'Dual Pana',
			},
			{
				path: '/general-sub-games/double-pana-bulk',
				element: (
					<ProtectedRoute>
						<DoublePanaBulk />
					</ProtectedRoute>
				),
				name: 'Double Pana Bulk',
			},
			{
				path: '/general-sub-games/tripal-pana',
				element: (
					<ProtectedRoute>
						<TripalPana />
					</ProtectedRoute>
				),
				name: 'Triple Pana',
			},
			{
				path: '/general-sub-games/sp-dp-tp-board',
				element: (
					<ProtectedRoute>
						<SPDPTPBoard />
					</ProtectedRoute>
				),
				name: 'SP DP TP Board',
			},
			{
				path: '/general-sub-games/half-sangam',
				element: (
					<ProtectedRoute>
						<HalfSangam />
					</ProtectedRoute>
				),
				name: 'Half Sangam',
			},
			{
				path: '/general-sub-games/full-sangam',
				element: (
					<ProtectedRoute>
						<FullSangam />
					</ProtectedRoute>
				),
				name: 'Full Sangam',
			},

		],
	},
	{
		element: <GameChart />,
		path: "/game-chart",

	},
	{
		element: <PaymentPage />,
		path: "/payment",

	},
	{
		path: '*',
		element: <NotFound />,
	},
];

const App = () => {
	const router = createBrowserRouter(routes);
	const dispatch = useDispatch();
	const [isOpen, setOpen] = useState(false);
	const [isOpenWebApp, setOpenWebApp] = useState(false);
	const { appData, user } = useSelector(state => state.appData.appData);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [isOnline, setIsOnline] = useState(navigator.onLine);
	const [updateVersionModalOpen, setUpdateVersionModalOpen] = useState(false);
	const [myAuthToken, setMyAuthToken] = useState(null)

	useEffect(() => {
		function handleOnline() {
			setIsOnline(true);
		}
		function handleOffline() {
			setIsOnline(false);
		}

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, []);

	let [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
	let [successMessage, setSuccessMessage] = useState('');
	const toggleSuccessModalOpen = () => {
		setSuccessModalOpen(prevState => !prevState);
	};

	const [deferredPrompt, setDeferredPrompt] = useState(null);

	useEffect(() => {
		const handleBeforeInstallPrompt = e => {
			e.preventDefault();
			setDeferredPrompt(e);
		};

		window.addEventListener(
			'beforeinstallprompt',
			handleBeforeInstallPrompt
		);

		return () => {
			window.removeEventListener(
				'beforeinstallprompt',
				handleBeforeInstallPrompt
			);
		};
	}, []);

	useEffect(() => {
		const handleStorageChange = (event) => {
			if (event.key === 'authToken') {
				setMyAuthToken(event.newValue)
			}
		};

		// Listen for changes to localStorage
		window.addEventListener('storage', handleStorageChange);

		// Cleanup listener on component unmount
		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	}, []);

	useEffect(() => {
		document.title = 'Mahakal Matka';
		const fetchData = async () => {
			if (localStorage.getItem('authToken') === null) {
				// window.location.href="/auth/login";
				// setLoading(false)
				// return;

			}
			// if(localStorage.getItem('authToken')===null && window.location.pathname !=="/auth/login"){
			// 	window.location.href="/auth/login";
			// 	return;
			// }
			try {
				setLoading(true);
				const fetchAppDataPromise = getAppData();
				const fetchDesawarMarketsPromise = localStorage.getItem('authToken') || true ? getMarkets('desawar') : Promise.resolve();
				const fetchGeneralMarketsPromise = localStorage.getItem('authToken') || true ? getMarkets('general') : Promise.resolve();

				const [appDataResponse, desawarMarketsResponse, generalMarketsResponse] = await Promise.all([fetchAppDataPromise, fetchDesawarMarketsPromise, fetchGeneralMarketsPromise]);

				if (appDataResponse?.data?.error === false) {
					dispatch(setAppData(appDataResponse.data.response));
				} else {
					setError(appDataResponse?.data?.message);
				}

				if (desawarMarketsResponse?.data?.error === false && generalMarketsResponse?.data?.error === false) {
					dispatch(setMarkets({ desawar: desawarMarketsResponse.data.response, general: generalMarketsResponse.data.response }));
				} else if (desawarMarketsResponse) {
					toast.error(desawarMarketsResponse.data.message);
				}
			} catch (err) {
				toast.error(err.message);
			} finally {
				setTimeout(() => {
					setLoading(false);
				}, 1000);
			}
		};

		fetchData();
	}, [myAuthToken]);

	useEffect(() => {
		if (user?.blocked === 1) {
			localStorage.clear();
			toast.error(
				"Sorry, you have been blocked. You'll be redirected back to login page."
			);
			window.setTimeout(() => {
				window.location.href = '/';
			}, 2000);
		}
		if (user) {
			setOpen(
				!JSON.parse(localStorage.getItem('isModelOpenedAlready')) ??
				true
			);

		}

		setOpenWebApp(true);
	}, [user]);

	useEffect(() => {
		if (localStorage.getItem('appVersion') && appData?.version !== undefined && appData?.version !== null && (localStorage.getItem('appVersion') !== (appData?.version).toString())) {
			setUpdateVersionModalOpen(true);

		} else if (appData?.version !== undefined && appData?.version !== null && !localStorage.getItem('appVersion')) {
			localStorage.setItem('appVersion', appData?.version);
		}

	}, [appData])

	const errorMode = message => {
		return (
			<div className='font-poppins border border-black/20 overflow-hidden relative max-w-[480px] w-full mx-auto h-[100vh]'>
				<div className='flex flex-col items-center py-8'>
					<img src={Logo} width={100} alt='Logo' />
					<h2 className='mt-8 text-4xl font-extrabold'>
						Ohh... SH*T
					</h2>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						data-name='Layer 1'
						viewBox='0 0 1119.60911 699'
						className='w-full max-w-[420px] mt-6'
						xmlnsXlink='http://www.w3.org/1999/xlink'
					>
						<circle
							cx='292.60911'
							cy={213}
							r={213}
							fill='#f2f2f2'
						/>
						<path
							d='M31.39089,151.64237c0,77.49789,48.6181,140.20819,108.70073,140.20819'
							transform='translate(-31.39089 -100.5)'
							fill='#2f2e41'
						/>
						<path
							d='M140.09162,291.85056c0-78.36865,54.255-141.78356,121.30372-141.78356'
							transform='translate(-31.39089 -100.5)'
							fill='#0098c7'
						/>
						<path
							d='M70.77521,158.66768c0,73.61476,31.00285,133.18288,69.31641,133.18288'
							transform='translate(-31.39089 -100.5)'
							fill='#0098c7'
						/>
						<path
							d='M140.09162,291.85056c0-100.13772,62.7103-181.16788,140.20819-181.16788'
							transform='translate(-31.39089 -100.5)'
							fill='#2f2e41'
						/>
						<path
							d='M117.22379,292.83905s15.41555-.47479,20.06141-3.783,23.713-7.2585,24.86553-1.95278,23.16671,26.38821,5.76263,26.5286-40.43935-2.711-45.07627-5.53549S117.22379,292.83905,117.22379,292.83905Z'
							transform='translate(-31.39089 -100.5)'
							fill='#a8a8a8'
						/>
						<path
							d='M168.224,311.78489c-17.40408.14042-40.43933-2.71094-45.07626-5.53548-3.53126-2.151-4.93843-9.86945-5.40926-13.43043-.32607.014-.51463.02-.51463.02s.97638,12.43276,5.61331,15.2573,27.67217,5.67589,45.07626,5.53547c5.02386-.04052,6.7592-1.82793,6.66391-4.47526C173.87935,310.756,171.96329,311.75474,168.224,311.78489Z'
							transform='translate(-31.39089 -100.5)'
							opacity='0.2'
						/>
						<ellipse
							cx='198.60911'
							cy='424.5'
							rx={187}
							ry='25.43993'
							fill='#3f3d56'
						/>
						<ellipse
							cx='198.60911'
							cy='424.5'
							rx={157}
							ry='21.35866'
							opacity='0.1'
						/>
						<ellipse
							cx='836.60911'
							cy='660.5'
							rx={283}
							ry='38.5'
							fill='#3f3d56'
						/>
						<ellipse
							cx='310.60911'
							cy='645.5'
							rx={170}
							ry='23.12721'
							fill='#3f3d56'
						/>
						<path
							d='M494,726.5c90,23,263-30,282-90'
							transform='translate(-31.39089 -100.5)'
							fill='none'
							stroke='#2f2e41'
							strokeMiterlimit={10}
							strokeWidth={2}
						/>
						<path
							d='M341,359.5s130-36,138,80-107,149-17,172'
							transform='translate(-31.39089 -100.5)'
							fill='none'
							stroke='#2f2e41'
							strokeMiterlimit={10}
							strokeWidth={2}
						/>
						<path
							d='M215.40233,637.78332s39.0723-10.82,41.47675,24.04449-32.15951,44.78287-5.10946,51.69566'
							transform='translate(-31.39089 -100.5)'
							fill='none'
							stroke='#2f2e41'
							strokeMiterlimit={10}
							strokeWidth={2}
						/>
						<path
							d='M810.09554,663.73988,802.218,714.03505s-38.78182,20.60284-11.51335,21.20881,155.73324,0,155.73324,0,24.84461,0-14.54318-21.81478l-7.87756-52.719Z'
							transform='translate(-31.39089 -100.5)'
							fill='#2f2e41'
						/>
						<path
							d='M785.21906,734.69812c6.193-5.51039,16.9989-11.252,16.9989-11.252l7.87756-50.2952,113.9216.10717,7.87756,49.582c9.185,5.08711,14.8749,8.987,18.20362,11.97818,5.05882-1.15422,10.58716-5.44353-18.20362-21.38921l-7.87756-52.719-113.9216,3.02983L802.218,714.03506S769.62985,731.34968,785.21906,734.69812Z'
							transform='translate(-31.39089 -100.5)'
							opacity='0.1'
						/>
						<rect
							x='578.43291'
							y='212.68859'
							width='513.25314'
							height='357.51989'
							rx='18.04568'
							fill='#2f2e41'
						/>
						<rect
							x='595.70294'
							y='231.77652'
							width='478.71308'
							height='267.83694'
							fill='#3f3d56'
						/>
						<circle
							cx='835.05948'
							cy='223.29299'
							r='3.02983'
							fill='#f2f2f2'
						/>
						<path
							d='M1123.07694,621.32226V652.6628a18.04341,18.04341,0,0,1-18.04568,18.04568H627.86949A18.04341,18.04341,0,0,1,609.8238,652.6628V621.32226Z'
							transform='translate(-31.39089 -100.5)'
							fill='#2f2e41'
						/>
						<polygon
							points='968.978 667.466 968.978 673.526 642.968 673.526 642.968 668.678 643.417 667.466 651.452 645.651 962.312 645.651 968.978 667.466'
							fill='#2f2e41'
						/>
						<path
							d='M1125.828,762.03359c-.59383,2.539-2.83591,5.21743-7.90178,7.75032-18.179,9.08949-55.1429-2.42386-55.1429-2.42386s-28.4804-4.84773-28.4804-17.573a22.72457,22.72457,0,0,1,2.49658-1.48459c7.64294-4.04351,32.98449-14.02122,77.9177.42248a18.73921,18.73921,0,0,1,8.54106,5.59715C1125.07908,756.45353,1126.50669,759.15715,1125.828,762.03359Z'
							transform='translate(-31.39089 -100.5)'
							fill='#2f2e41'
						/>
						<path
							d='M1125.828,762.03359c-22.251,8.526-42.0843,9.1622-62.43871-4.975-10.26507-7.12617-19.59089-8.88955-26.58979-8.75618,7.64294-4.04351,32.98449-14.02122,77.9177.42248a18.73921,18.73921,0,0,1,8.54106,5.59715C1125.07908,756.45353,1126.50669,759.15715,1125.828,762.03359Z'
							transform='translate(-31.39089 -100.5)'
							opacity='0.1'
						/>
						<ellipse
							cx='1066.53846'
							cy='654.13477'
							rx='7.87756'
							ry='2.42386'
							fill='#f2f2f2'
						/>
						<circle
							cx='835.05948'
							cy='545.66686'
							r='11.51335'
							fill='#f2f2f2'
						/>
						<polygon
							points='968.978 667.466 968.978 673.526 642.968 673.526 642.968 668.678 643.417 667.466 968.978 667.466'
							opacity='0.1'
						/>
						<rect
							x='108.60911'
							y={159}
							width={208}
							height={242}
							fill='#2f2e41'
						/>
						<rect
							x='87.60911'
							y={135}
							width={250}
							height={86}
							fill='#3f3d56'
						/>
						<rect
							x='87.60911'
							y={237}
							width={250}
							height={86}
							fill='#3f3d56'
						/>
						<rect
							x='87.60911'
							y={339}
							width={250}
							height={86}
							fill='#3f3d56'
						/>
						<rect
							x='271.60911'
							y={150}
							width={16}
							height={16}
							fill='#0098c7'
							opacity='0.4'
						/>
						<rect
							x='294.60911'
							y={150}
							width={16}
							height={16}
							fill='#0098c7'
							opacity='0.8'
						/>
						<rect
							x='317.60911'
							y={150}
							width={16}
							height={16}
							fill='#0098c7'
						/>
						<rect
							x='271.60911'
							y={251}
							width={16}
							height={16}
							fill='#0098c7'
							opacity='0.4'
						/>
						<rect
							x='294.60911'
							y={251}
							width={16}
							height={16}
							fill='#0098c7'
							opacity='0.8'
						/>
						<rect
							x='317.60911'
							y={251}
							width={16}
							height={16}
							fill='#0098c7'
						/>
						<rect
							x='271.60911'
							y={352}
							width={16}
							height={16}
							fill='#0098c7'
							opacity='0.4'
						/>
						<rect
							x='294.60911'
							y={352}
							width={16}
							height={16}
							fill='#0098c7'
							opacity='0.8'
						/>
						<rect
							x='317.60911'
							y={352}
							width={16}
							height={16}
							fill='#0098c7'
						/>
						<circle cx='316.60911' cy={538} r={79} fill='#2f2e41' />
						<rect
							x='280.60911'
							y={600}
							width={24}
							height={43}
							fill='#2f2e41'
						/>
						<rect
							x='328.60911'
							y={600}
							width={24}
							height={43}
							fill='#2f2e41'
						/>
						<ellipse
							cx='300.60911'
							cy='643.5'
							rx={20}
							ry='7.5'
							fill='#2f2e41'
						/>
						<ellipse
							cx='348.60911'
							cy='642.5'
							rx={20}
							ry='7.5'
							fill='#2f2e41'
						/>
						<circle cx='318.60911' cy={518} r={27} fill='#fff' />
						<circle cx='318.60911' cy={518} r={9} fill='#3f3d56' />
						<path
							d='M271.36733,565.03228c-6.37889-28.56758,14.01185-57.43392,45.544-64.47477s62.2651,10.41,68.644,38.9776-14.51861,39.10379-46.05075,46.14464S277.74622,593.59986,271.36733,565.03228Z'
							transform='translate(-31.39089 -100.5)'
							fill='#0098c7'
						/>
						<ellipse
							cx='417.21511'
							cy='611.34365'
							rx='39.5'
							ry='12.40027'
							transform='translate(-238.28665 112.98044) rotate(-23.17116)'
							fill='#2f2e41'
						/>
						<ellipse
							cx='269.21511'
							cy='664.34365'
							rx='39.5'
							ry='12.40027'
							transform='translate(-271.07969 59.02084) rotate(-23.17116)'
							fill='#2f2e41'
						/>
						<path
							d='M394,661.5c0,7.732-19.90861,23-42,23s-43-14.268-43-22,20.90861-6,43-6S394,653.768,394,661.5Z'
							transform='translate(-31.39089 -100.5)'
							fill='#fff'
						/>
					</svg>

					<p className='mt-8'>Something went wrong.</p>
					<small>{message}</small>
				</div>
			</div>
		);
	};

	const handleUpdateVersion = async () => {
		if ('caches' in window) {
			const cacheNames = await caches.keys();
			for (const name of cacheNames) {
				await caches.delete(name);
			}
		}

		localStorage.setItem('appVersion', appData?.version);
		// reload fresh build
		window.location.reload(true);
	}

	return !isOnline ? (
		<OfflinePage />
	) : loading ? (
		<div className='flex justify-center items-center h-[100vh]'>
			<Splash />
		</div>
	) : error !== '' ? (
		errorMode(error)
	) : (appData?.maintain_mode !== 0 && appData?.maintain_mode !== undefined) ? (
		<MaintenancePage />
	) : (
		<>
			<ToastContainer />
			<DeferredPromptContextProvider
				value={{
					deferredPrompt,
					setDeferredPrompt,
				}}
			>
				<ModalContextProvider
					value={{
						isSuccessModalOpen,
						setSuccessModalOpen,
						successMessage,
						setSuccessMessage,
						toggleSuccessModalOpen,
					}}
				>
					<RouterProvider router={router} />

					{/* Model for install web app */}
					{/* {
						deferredPrompt&&user &&
							<Modal isOpen={isOpenWebApp} toggle={webAppToggle}>
								<div className='font-semibold text-black bg-white' style={{width:300}}>
									<div className='flex justify-end p-3 border-b border-black'>
										<button onClick={webAppToggle}>
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
									<div>
									<p style={{textAlign:"center",fontSize:"16px",color:"#000", margin:"10px 0 15px"}}>For better experience </p>
										<div className="px-5 w-[250px] max-w-full mx-auto">
											<InstallButton />
										</div>
									</div>
									<br /><br />
								</div>
							</Modal>
					} */}

				</ModalContextProvider>
			</DeferredPromptContextProvider>
			{/* <Modal isOpen={isOpen} toggle={toggle}>
				<div className='font-semibold text-white bg-primary'>
					<div className='flex justify-end p-3 border-b border-white'>
						<button onClick={toggle}>
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
					<div className='p-3 pb-1 text-center text-md'>
						 {appData.info_dialog_message} 
					</div>
					<div className='flex items-center justify-center gap-4 p-3 py-1'>
						<a
							href={`https://wa.me/${appData.whatsapp_number}`}
							className='flex items-center justify-center w-16 h-16 font-bold text-white bg-red-600 rounded-full'
						>
							<i className='text-2xl fab fa-whatsapp'></i>
						</a>
						<div className='w-24 h-24'>
							<img
								src={Logo}
								alt='Logo'
								className='w-full h-full'
							/>
						</div>
						<a
							href={`tel:${appData.support_number}`}
							className='flex items-center justify-center w-16 h-16 font-bold text-white bg-red-600 rounded-full'
						>
							<i className='text-2xl fas fa-phone'></i>
						</a>
					</div>
					<div className='p-3 pt-1 text-center'>
						{appData.info_dialog_bottom_text}
					</div>
				</div>
			</Modal> */}


			<Modal isOpen={isSuccessModalOpen} toggle={toggleSuccessModalOpen}>
				<div className='font-semibold text-black bg-white w-[300px]'>
					<div className='flex justify-end p-3 border-b border-black'>
						<button onClick={toggleSuccessModalOpen}>
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
					<div className='p-5 px-3 flex flex-col items-center'>
						<i className='far text-8xl text-green-500 fa-check-circle'></i>
						<span className='mt-10'>{successMessage}</span>
						<button
							onClick={toggleSuccessModalOpen}
							className='px-8 py-2 mt-4 rounded-md bg-green-400'
						>
							OK
						</button>
					</div>
				</div>
			</Modal>
			{
				(updateVersionModalOpen && localStorage.getItem('authToken')) ?
					<Modal
						isOpen={updateVersionModalOpen}
						toggle={handleUpdateVersion}
						className="custom-modal"
						centered
					>
						<div className="font-semibold text-white bg-primary " style={{ width: "400px", maxWidth: "90vw" }}>
							<div className="flex justify-between p-3 border-b border-white">
								<h4>Important</h4>
								<button onClick={() => setUpdateVersionModalOpen(false)}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
							<div className='flex flex-col items-center gap-6 py-4 pb-8'>
								<div className="text-md px-2 text-center">
									Please update App to get latest changes
								</div>
								<div>
									<button className='px-8 py-2 rounded-md bg-green-400' onClick={handleUpdateVersion}>
										Update Version
									</button>
								</div>
							</div>
						</div>
					</Modal>

					: null
			}

		</>
	);
};

export default App;
