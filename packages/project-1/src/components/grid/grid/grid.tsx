import * as React from 'react';

export interface IGridProps {
    children: React.ReactNode;
}

export default class Grid extends React.Component<IGridProps> {
    render(): JSX.Element {
        return (
            <div className="grid">
                {this.props.children}
            </div>
        );
    }
}
