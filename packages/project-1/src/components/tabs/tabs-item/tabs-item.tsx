import * as React from 'react';

export interface ITabsItemProps {
    children: React.ReactNode;
}

export default class TabsItem extends React.Component<ITabsItemProps> {
    render(): JSX.Element {
        return (
            <div className="tabs__item">
                {this.props.children}
            </div>
        );
    }
}
