import * as React from 'react';

export interface IGridColumnProps {
    children: React.ReactNode;
}

export default class GridColumn extends React.Component<IGridColumnProps> {
    render(): JSX.Element {
        return (
            <div className="grid-col">
                {this.props.children}
            </div>
        );
    }
}
