import * as React from 'react';

export interface IMyComponentProps {
    title: string;
}

export default class MyComponent extends React.Component<IMyComponentProps, {}> {
    render(): JSX.Element {
        return (
            <h1>{this.props.title}</h1>
        );
    }
}
