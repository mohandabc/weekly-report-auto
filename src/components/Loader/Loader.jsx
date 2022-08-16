import { useRecoilValue } from "recoil";
import { loaderIsHidden } from "../../shared/globalState";
import spinner from '../../assets/spinner.svg';

export const Loader = () => {
    const isHidden= useRecoilValue(loaderIsHidden);

    return (
        <div className={`absolute mt-36 z-50 text-3xl ${isHidden ? "hidden" : ""}`}><img src={spinner} className="animate-spin w-20" alt="spinner"/></div>
    );
}