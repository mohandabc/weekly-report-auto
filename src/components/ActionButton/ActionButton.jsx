
export const ActionButton = ({className, text, action, args}) =>{
    const execAction = () =>{
        if (args && args.length){
            action(...args);
        }
        else{
            action();
        }
    }
    return (
        <button className={className} 
                onClick={execAction}>
            {text}
        </button>
    );
}