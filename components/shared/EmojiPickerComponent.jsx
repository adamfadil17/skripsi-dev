import EmojiPicker from 'emoji-picker-react';
import React, { useState } from 'react';

const EmojiPickerComponent = ({ children, setEmoji }) => {
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  return (
    <div>
      <div onClick={() => setOpenEmojiPicker(true)}>{children}</div>

      {openEmojiPicker && (
        <div className="absolute z-10 py-2">
          <EmojiPicker
            emojiStyle="facebook"
            onEmojiClick={(e) => {
              setEmoji(e.emoji);
              setOpenEmojiPicker(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerComponent;
