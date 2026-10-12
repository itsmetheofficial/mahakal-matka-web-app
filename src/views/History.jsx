import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import DesawarHistory from "./PlayHistory/DesawarHistory";
import GeneralHistory from "./PlayHistory/GeneralHistory";
import AviatorHistory from "./PlayHistory/AviatorHistory";

const History = () => {
    const appData = useSelector(state => state.appData.appData.appData);
    const { GameHistory } = useSelector(state => state.FlowApp);
    const [params, setParams] = useSearchParams();
    const desawarOnly = !GameHistory || Number(appData?.enable_desawar_only) === 1;
    const tabs = [
        ...(!desawarOnly ? [{ id: 'kalyan', label: 'Kalyan', component: GeneralHistory }] : []),
        ...(desawarOnly || Number(appData?.enable_desawar) === 1 ? [{ id: 'desawar', label: 'Desawar', component: DesawarHistory }] : []),
        { id: 'aviator', label: 'Aviator', component: AviatorHistory },
    ];
    const selected = tabs.find(tab => tab.id === params.get('tab')) || tabs[0];
    const Panel = selected.component;

    return (
        <>
            <nav aria-label="Game history categories" className="mx-3 mt-3 mb-2 flex gap-1 rounded-xl bg-slate-200 p-1">
                {tabs.map(tab => (
                    <button key={tab.id} aria-current={selected.id === tab.id ? 'page' : undefined}
                        onClick={() => { const next = new URLSearchParams(params); next.set('tab', tab.id); setParams(next, { replace: true }); }}
                        className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${selected.id === tab.id ? 'bg-primary text-white shadow-sm' : 'text-slate-700'}`}>
                        {tab.label}
                    </button>
                ))}
            </nav>
            <Panel key={selected.id} />
        </>
    );
};

export default History;
