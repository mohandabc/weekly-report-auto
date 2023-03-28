import React, { useState } from 'react';

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
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-medium">{props.title}</h2>
      <button
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full border-2 border-purple-600"
        onClick={handleEditClick}
      >
        Edit
      </button>
    </div>
    {editing ? (
      <div>
        <textarea
          className="border border-gray-400 rounded w-full mt-4"
          value={text}
          onChange={handleTextChange}
        />
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full border-2 border-green-600"
          onClick={handleSaveClick}
        >
          Save
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full border-2 border-gray-600"
          onClick={handleCancelClick}
        >
          Cancel
        </button>
      </div>
    ) : (
      <p className="mt-4">{text}</p>
    )}
  </div>
);
}
