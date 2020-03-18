/* To prevent error in detailed preview tabs otherwise app.publicFolder is defined on preview render */
global.app = {
    publicFolder: '/'
};

/* eslint-env es6, node */
'use strict';

/* Create a new Fractal instance and export it for use elsewhereRequire the Fractal module */
const fractal = module.exports = require('@frctl/fractal').create();
/* Create handlebars instance with custom helpers */
const hbs = require('@frctl/handlebars')({
    helpers: {
        or: function () {
            return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
        }
    }
});
// Require the React adapter
const tsxAdapter = require('@gotoandplay/fractal-tsx-adapter');

/*
 * Project-related metadata
 */
fractal.set('project.title', 'project-2');

/*
 * Configuring components
 */
fractal.components.set('path', __dirname + '/src');
fractal.components.set('default.preview', '@preview');
fractal.components.set('default.status', 'wip');
fractal.components.engine(tsxAdapter);
fractal.components.set('ext', '.tsx');

// Global context data that will be made available to all components when rendering previews,
fractal.components.set('default.context', {});

fractal.components.set('default.collated', true);

fractal.components.set('statuses', {
    prototype: {
        key: 'prototype',
        label: 'Prototype',
        description: 'Do not implement.'
    },
    wip: {
        key: 'wip',
        label: 'WIP',
        description: 'Work in progress. Implement with caution.'
    },
    ready: {
        key: 'ready',
        label: 'Ready',
        description: 'Ready to implement.'
    }
});

/*
 * Configuring documentation pages.
 */
fractal.docs.engine(hbs);
fractal.docs.set('default.context', {
    project2: true,
});
fractal.docs.set('path', __dirname + '/docs');

/*
 * Configuring the web UI
 */
// static assets path.
fractal.web.set('static.path', __dirname + '/public');
// static build path
fractal.web.set('builder.dest', __dirname + '/build');
