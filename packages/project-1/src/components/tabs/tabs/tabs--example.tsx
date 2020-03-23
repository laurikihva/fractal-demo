import * as React from 'react';

import TabsItem from '../tabs-item/tabs-item';
import Tabs from './tabs';

export interface ITabsExample {
    tabsItemContent: string;
}

export default class TabsExample extends React.Component<ITabsExample, {}> {
    render(): JSX.Element {
        return (
            <Tabs>
                <TabsItem>
                    {this.props.tabsItemContent}
                </TabsItem>
            </Tabs>
        );
    }
}
