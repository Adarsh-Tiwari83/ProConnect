import React, { forwardRef, useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

function Post(props, ref) {
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = 'grey';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const addPost = () => {
    // Add functionality to handle post addition (this will be handled by the parent component)
    console.log('Post added:', text);
    closeModal();
  };

  return (
    <div>
      <button ref={ref} onClick={openModal} style={{ display: 'none' }}>Open Modal</button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Post Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>What do you want to talk about?</h2>
        <TextField
          onChange={(e) => setText(e.target.value)}
          sx={{ width: '500px' }}
          id="outlined-multiline-static"
          label="Type here..."
          multiline
          rows={4}
        />
        <br />
        <Button sx={{ mt: '10px' }} variant="outlined" size="small" onClick={closeModal}>Cancel</Button>
        <Button sx={{ ml: '10px', mt: '10px' }} variant="contained" size="small" onClick={addPost}>Done</Button>
      </Modal>
    </div>
  );
}

export default forwardRef(Post);
