import React from 'react';

import './Message.css';

import ReactEmoji from 'react-emoji';

function Message({ message: { author, content }, name }) {
  let isSentByCurrentUser = false;

  if(author === name) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div className='messageContainer justifyEnd'>
      <div className='messageBox backgroundBlue'>
        <p className='messageText colorWhite'>{ReactEmoji.emojify(content)}</p>
      </div>
    </div>
  ) : (
    <div className='messageContainer justifyStart'>
      <div className='messageBox backgroundLight'>
          <p className='messageText colorDark'>{ReactEmoji.emojify(content)}</p>
      </div>
    </div>
  )
}

export default Message;
