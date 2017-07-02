import React from 'react';

import Message from './OperatorMessage';
import MessageText from './OperatorMessageText';

const TextMessage = (props) => (
    <Message {...props}>
        <MessageText {...props} />
    </Message>
);
export default TextMessage;
