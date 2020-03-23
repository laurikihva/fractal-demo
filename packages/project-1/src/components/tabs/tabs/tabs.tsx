import * as React from 'react';

export interface ITabsProps {
    children: React.ReactNode;
}

export default class Tabs extends React.Component<ITabsProps> {
    render(): JSX.Element {
        return (
            <div className="tabs">
                {this.props.children}
            </div>
        );
    }
}
