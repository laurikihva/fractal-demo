const path = require('path');

class FractalPlugin {

    constructor(options) {
        options            = Object.assign({
            fractal: null,
            isProduction: false,
        }, options);
        this.fractal       = options.fractal;
        this.isProduction  = options.isProduction;
        this.runningServer = false;
        this.builder       = this.fractal.web.builder();
        this.logger        = this.fractal.cli.console;
        this.server        = this.fractal.web.server({
            sync: true
        });
    }

    apply(compiler) {
        compiler.hooks.done.tap('FractalPlugin', (stats) => {
            if (stats.toJson().errors.length) {
                return;
            }

            if (this.isProduction) {
                this.builder.on('start', () => {
                    this.logger.success('Fractal build started...');
                });

                this.builder.on('progress', (completed, total) => {
                    this.logger.update(`Exported ${completed} of ${total} items`, 'info');
                });

                this.builder.start().then((data) => {
                    const e = data.errorCount;

                    this.logger.persist();
                    this.logger[e ? 'warn' : 'success'](`Build finished with ${e === 0 ? 'no' : e} error${e == 1 ? '' : 's'}.`).unslog();
                });
            } else {
                if (!this.runningServer) {
                    this.server.on('error', (err) => {
                        return this.logger.error(err.message);
                    });

                    this.server.start().then(() => {
                        this.runningServer = true;

                        const header = 'Fractal web UI server is running!';
                        const serverUrl = this.server.urls.server;
                        const format = str => this.logger.theme.format(str, 'success', true);
                        let body = '';

                        if (!this.server.isSynced) {
                            body += `Local URL: ${format(serverUrl)}`;
                        } else {
                            const syncUrls = this.server.urls.sync;
                            body += `Local URL:      ${format(syncUrls.local)}`;
                            body += `\nNetwork URL:    ${format(syncUrls.external)}`;
                            body += `\nBrowserSync UI: ${format(syncUrls.ui)}`;
                        }

                        return this.logger.box(header, body).persist();
                    });
                }
            }
        });
    }

}

module.exports = FractalPlugin;
