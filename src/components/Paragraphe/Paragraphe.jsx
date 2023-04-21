import React, { useState } from 'react';
import './scrollbar.css'
export const Paragraphe = (props) => {
  const [text, setText] = useState(props.text);
  const [editing, setEditing] = useState(false);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = () => {
    setEditing(false);
    props.onSave(props.id, text);
  };

  const handleCancelClick = () => {
    setEditing(false);
    setText(props.text);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div className="border border-gray-400 rounded p-4">
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-medium">{props.title}</h2>
      <button
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full border-2 border-purple-600 w-1/6"
        onClick={handleEditClick}
      >
        Edit
      </button>
    </div>
    {editing ? (
      <div className="flex flex-col items-center">
        <textarea
          className="border border-gray-400 rounded w-full mt-4 h-80 px-2 py-1 resize-none focus:outline-none focus:ring focus:ring-gray-400 focus:border-transparent 
          bg-gradient-to-r from-slate-400 to-slate-300 text-black scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 focus:border-transparent"
          value={text}
          onChange={handleTextChange}
        />
        <div className="flex justify-between mt-4 w-full">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full border-2 border-green-600 w-1/6 mx-2"
            onClick={handleSaveClick}
          >
            Save
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full border-2 border-gray-600 w-1/6 mx-2"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <p className="mt-4 whitespace-pre-wrap">{text}</p>
    )}
  </div>
);
}
