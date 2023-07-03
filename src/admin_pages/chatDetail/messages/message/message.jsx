import React from 'react';
import './Message.css';

import ReactEmoji from 'react-emoji';

function Message({ message: { message, user_id }, name }) {
  let isSentByCurrentUser = false;
  if(user_id === name) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div className='messageContainer justifyEnd'>
      <div className='messageBox backgroundBlue'>
        <p className='messageText colorWhite'>{ReactEmoji.emojify(message)}</p>
      </div>
    </div>
  ) : (
    <div className='messageContainer justifyStart'>
      <div className='messageBox backgroundLight'>
          <p className='messageText colorDark'>{ReactEmoji.emojify(message)}</p>
      </div>
    </div>
  )
}

export default Message;