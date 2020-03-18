import * as React from 'react';

import { default as MyComponentCore, IMyComponentProps } from '@project-1/my-component';

export default class MyComponent extends React.Component<IMyComponentProps> {
    render(): JSX.Element {
        return (
            <MyComponentCore
                {...this.props}
            />
        );
    }
}

export { IMyComponentProps };
