import * as React from 'react';

import GridColumn from '../grid-column/grid-column';
import Grid from './grid';

export interface IGridExample {
    columnContent: string;
}

export default class GridExample extends React.Component<IGridExample, {}> {
    render(): JSX.Element {
        return (
            <Grid>
                <GridColumn>
                    {this.props.columnContent}
                </GridColumn>
            </Grid>
        );
    }
}
