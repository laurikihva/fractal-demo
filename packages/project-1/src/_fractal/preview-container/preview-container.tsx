import * as React from 'react';

import Preview from '../preview/preview';

export default class PreviewContainer extends Preview {
    render(): JSX.Element {
        return (
            <Preview {...this.props}>
                {this.getRoot()}
            </Preview>
        );
    }
}
