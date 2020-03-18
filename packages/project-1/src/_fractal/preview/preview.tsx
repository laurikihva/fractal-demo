import * as React from 'react';

import moment from 'moment';

export interface IPreviewProps {
    yield: string;
    _target: any;
    _config: any;
    _env: any;
}

export interface IPreviewBodyAttributes {
    className: string;
    style?: React.CSSProperties;
}

export default class Preview extends React.Component<IPreviewProps, {}> {
    getStyles(): JSX.Element[] {
        const stylesheets: string[] = ['styles'];

        return stylesheets.map((item: string, key: number) => {
            return (
                <link media="all" rel="stylesheet" href={this.props._env.publicPath + 'css/' + item + '.css'} key={key} />
            );
        });
    }

    getScripts(): JSX.Element[] {
        const scripts = ['runtime~index', 'vendors~index', 'index'];

        return scripts.map((item: string, key: number) => {
            return (
                <script src={this.props._env.publicPath + 'js/' + item + '.js'} key={key} />
            );
        });
    }

    getHydrateScript() {
        const replacer = ({}, value: any) => {
            return moment(value, moment.ISO_8601).isValid()
                ? `new Date('${value}')`
                : value;
        };
        const componentSettings: object = {
            className: this.props._env.reactClass,
            context: this.props._target.context,
            parseJsxFrom: this.props._target.meta && this.props._target.meta.parseJsxFrom ? this.props._target.meta.parseJsxFrom : undefined,
        };
        const contents: string = 'window.componentSettings = ' + JSON.stringify(componentSettings, replacer).replace(/"new Date\(([^)]+)\)"/g, 'new Date($1)') + ';';

        return (
            <script dangerouslySetInnerHTML={{ __html: contents }} />
        );
    }

    getBodyAttributes(): React.HTMLAttributes<HTMLElement> | null {
        if (this.props._target.meta) {
            return {
                className: ['theme', this.props._target.meta.bodyClass].join(' '),
                style: this.props._target.meta.bodyStyle,
            };
        }

        return null;
    }

    getRootAttributes(): React.HTMLAttributes<HTMLDivElement> | null {
        if (this.props._target.meta && this.props._target.meta.rootAttributes) {
            return this.props._target.meta.rootAttributes;
        }

        return null;
    }

    getContent() {
        if (this.props.children) {
            return this.props.children;
        }

        return this.getRoot();
    }

    getRoot(): JSX.Element {
        return (
            <div
                id="page-container"
                dangerouslySetInnerHTML={{ __html: this.props.yield }}
                {...this.getRootAttributes()}
            />
        );
    }

    render(): JSX.Element {
        return (
            <html>
                <head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
                    <title>{this.props._target.title} | Preview Layout</title>
                    <link rel="icon" href={this.props._env.publicPath + '_theme/favicon.ico'} />
                    {this.getStyles()}
                </head>
                <body {...this.getBodyAttributes()}>
                    {this.getContent()}
                    <script dangerouslySetInnerHTML={{ __html: 'var app = { publicFolder: "' + app.publicFolder + '"}' }} />
                    {this.getHydrateScript()}
                    {this.getScripts()}
                </body>
            </html>
        );
    }
}
