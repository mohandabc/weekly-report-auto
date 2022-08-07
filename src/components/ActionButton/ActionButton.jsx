
export const ActionButton = ({text, action, args}) =>{
    const execAction = () =>{
        if (args && args.length){
            action(...args);
        }
        else{
            action();
        }
    }
    return (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-base py-2 px-4 rounded" 
                onClick={execAction}>
            {text}
        </button>
    );
}