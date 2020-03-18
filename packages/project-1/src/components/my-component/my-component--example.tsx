import * as React from 'react';

import MyComponent, {IMyComponentProps} from './my-component';

export default class MyComponentExample extends React.Component<IMyComponentProps> {
    render(): JSX.Element {
        return (
            <MyComponent {...this.props} />
        );
    }
}
