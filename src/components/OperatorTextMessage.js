import React from 'react'

import Message from './OperatorMessage'
import MessageText from './OperatorMessageText'
import MessageButton from './OperatorMessageButton'

const TextMessage = (props) => (
    <Message {...props}>
        <MessageText {...props} />
    </Message>
)
export default TextMessage