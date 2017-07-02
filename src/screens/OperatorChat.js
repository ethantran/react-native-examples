import React, { Component } from 'react';
import { ScrollView } from 'react-native';

import randomUser from '../randomUser';
import randomImage from '../randomImage';
import InputMessage from '../components/OperatorInputMessage';
import SelectMessage from '../components/OperatorSelectMessage';
import TextMessage from '../components/OperatorTextMessage';
import FormMessage from '../components/OperatorFormMessage';
import QuoteMessage from '../components/OperatorQuoteMessage';
import ProductMessage from '../components/OperatorProductMessage';

const userOperator = { source: { uri: randomUser() } };
const userRobin = { name: 'Robin', source: { uri: randomUser() } };

const messages = [
    { type: 'input', user: userOperator, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisl urna', labelText: 'Lorem ipsum', placeholder: ' Lorem ipsum dolor', buttonTitle: 'Lorem ipsum' },
    { type: 'text', user: userRobin, text: 'Lorem ipsum dolor sit amet' },
    { type: 'input', user: userOperator, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisl urna', labelText: 'Lorem ipsum', placeholder: ' Lorem ipsum dolor', buttonTitle: 'Lorem ipsum', helpText: 'Lorem ipsum dolor sit amet', valid: true },
    { type: 'text', user: userRobin, text: 'Lorem ipsum dolor sit amet' },
    { type: 'select', user: userOperator, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', items: ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet'], selected: 'Lorem', buttonTitle: 'Lorem ipsum', helpText: 'Lorem ipsum dolor sit amet', valid: true },
    { type: 'text', user: userRobin, text: 'Lorem ipsum dolor sit amet' },
    {
        type: 'form', user: userOperator, text: 'Lorem ipsum dolor sit amet.', items: [
            { labelText: 'Lorem', optional: true, type: 'input' },
            { labelText: 'Ipsum', optional: true, type: 'select', items: ['Lorem', 'Ipsum', 'Dolor'] },
            { labelText: 'Dolor', optional: true, type: 'input' },
        ], selected: 'Lorem', valid: true
    },
    { type: 'quote', user: userOperator, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisl urna', time: 'Lorem ipsum' },
    { type: 'product', user: userOperator, text: 'Lorem ipsum dolor sit amet', avatar: { uri: randomUser() }, source: { uri: randomImage(200, 200) }, creator: 'Lorem', name: 'Lorem Ipsum', price: '$24.95', buttonTitle: 'Lorem Ipsum Dolor' }
];
const colorLight = '#E8E8E8';

function renderMessage(message, i) {
    if (message.type === 'input') {
        return <InputMessage key={i} {...message} />;
    } else if (message.type === 'text') {
        return <TextMessage key={i} {...message} me={message.user === userRobin} />;
    } else if (message.type === 'select') {
        return <SelectMessage key={i} {...message} />;
    } else if (message.type === 'form') {
        return <FormMessage key={i} {...message} />;
    } else if (message.type === 'quote') {
        return <QuoteMessage key={i} {...message} />;
    } else if (message.type === 'product') {
        return <ProductMessage key={i} {...message} />;
    }
}

export default class OperatorChat extends Component {
    render() {
        return (
            <ScrollView style={{ backgroundColor: colorLight, padding: 15 }}>
                {messages.map(renderMessage)}
            </ScrollView>
        );
    }
}
