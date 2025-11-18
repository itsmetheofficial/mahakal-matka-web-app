import { useSelector } from 'react-redux';
import { APP_IDENTIFIER } from '../credentials';

export const useShowEverything = () => {
    const { appData } = useSelector((state) => state.appData.appData);
    const showEverything = appData?.app_visibility?.[APP_IDENTIFIER] || false;

    return {
        showEverything,
        appIdentifier: APP_IDENTIFIER,
        isLoading: !appData,
    };
};

