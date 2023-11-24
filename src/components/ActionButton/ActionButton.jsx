export const ActionButton = ({className, text, action, args, disabled}) =>{
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
                onClick={execAction}
                disabled={disabled}>
            {text}
        </button>
    );
}