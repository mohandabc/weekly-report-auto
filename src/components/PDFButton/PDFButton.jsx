import { useState } from 'react';

export const PDFButton = ({ className, text, action, args }) => {
  const [isLoading, setIsLoading] = useState(false);

  const execAction = async () => {
    setIsLoading(true);

    try {
        if (args && args.length) {
            await action(...args);
        } else {
            await action();
        }

        await action();
    } catch (error) {
      console.warn('An error occurred inside the Action Promise:', error);
    }

    setIsLoading(false);
};


  return (
    <button className={className} onClick={execAction} disabled={isLoading}>
      {isLoading ? 'Generating...' : text}
    </button>
  );
};
