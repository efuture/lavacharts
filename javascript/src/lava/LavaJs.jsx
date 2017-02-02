/* jshint undef: true, unused: true */
/* globals window, document, console, google, require */

import Chart from './Chart.jsx'
import Dashboard from './Dashboard.jsx'
import * as Errors from './Errors.jsx'

/**
 * LavaJs module
 *
 * @module    lava/Lava
 * @author    Kevin Hill <kevinkhill@gmail.com>
 * @copyright (c) 2017, KHill Designs
 * @license   MIT
 */
const Q = require('q');
const _ = require('lodash');
const util = require('util');
const EventEmitter = require('events');
const GOOGLE_LOADER_URL = 'https://www.gstatic.com/charts/loader.js';

export default class LavaJs extends EventEmitter
{
    constructor() {
        super();

        /**
         * Setting the debug flag
         *
         * @type {boolean}
         * @private
         */
        this._debug = true;

        /**
         * Error functions to be thrown
         *
         * @type {object.<Function>}
         * @private
         */
        this._errors = Errors;

        /**
         * JSON object of config items.
         *
         * @type {Array}
         * @private
         */
        this._config = (function() {
            if (typeof CONFIG_JSON == 'undefined') {
                return {};
            } else {
                return CONFIG_JSON;
            }
        })();

        /**
         * Loading Chart class into LavaJs
         *
         * @type {Class.<Chart>}
         */
        this.Chart = Chart;

        /**
         * Loading Dashboard class into LavaJs
         *
         * @type {Class.<Dashboard>}
         */
        this.Dashboard = Dashboard;

        /**
         * Array of charts stored in the module.
         *
         * @type {Array.<Chart>}
         * @private
         */
        this._charts = [];

        /**
         * Array of dashboards stored in the module.
         *
         * @type {Array.<Dashboard>}
         * @private
         */
        this._dashboards = [];

        /**
         * Ready callback to be called when the module is finished running.
         *
         * @callback _readyCallback
         * @private
         */
        this._readyCallback = _.noop();
    }

    /**
     * Logging function for debugging the rendering process
     *
     * Toggleable with the _debug attribute
     *
     * @param {string} msg
     */
    log (msg) {
        if (this._debug) {
            console.log(msg);
        }
    }

    /**
     * Initialize the Lava.js module by attaching the event listeners
     * and calling the charts' and dashboards' init methods
     *
     * @public
     */
    init() {
        this.log('lava.js init');

        this.emit('initialized');

        var readyCount = 0;

        this.on('ready', renderable => {
            this.log(renderable.uuid() + ' ready');

            readyCount++;

            if (readyCount == this._getRenderables().length) {
                this.log('loading google');

                this._loadGoogle().then(() => {
                    return this._mapRenderables(renderable => {
                        this.log('configuring ' + renderable.uuid());

                        return renderable.configure();
                    });
                }).then(() => {
                    return this._mapRenderables(renderable => {
                        this.log('rendering ' + renderable.uuid());

                        return renderable.render();
                    });
                }).then(() => {
                    this.log('lava.js ready');

                    this._readyCallback();
                });
            }
        });
    }


    /**
     * Runs the Lava.js module by calling all the renderables' init methods
     *
     * @public
     */
    run() {
        this.log('lava.js running');

        this._forEachRenderable(renderable => {
            this.log('init ' + renderable.uuid());

            renderable.init();
        });
    }

    /**
     * Assigns a callback for when the charts are ready to be interacted with.
     *
     * This is used to wrap calls to lava.loadData() or lava.loadOptions()
     * to protect against accessing charts that aren't loaded yet
     *
     * @public
     * @param {Function} callback
     */
    ready(callback) {
        if (typeof callback !== 'function') {
            throw new this._errors.InvalidCallback(callback);
        }

        this._readyCallback = callback;
    }

    /**
     * Event wrapper for chart events.
     *
     *
     * Used internally when events are applied so the user event function has
     * access to the chart within the event callback.
     *
     * @param {Object} event
     * @param {Object} chart
     * @param {Function} callback
     * @return {Function}
     */
    event(event, chart, callback) {
        if (typeof callback !== 'function') {
            throw new this._errors.InvalidCallback(callback);
        }

        return callback(event, chart);
    }

    /**
     * Stores a renderable lava object within the module.
     *
     * @param {Chart|Dashboard} renderable
     */
    store(renderable) {
        if (renderable instanceof this.Chart) {
            this.storeChart(renderable);
        }

        if (renderable instanceof this.Dashboard) {
            this.storeDashboard(renderable);
        }
    }

    /**
     * Loads new data into the chart and redraws.
     *
     *
     * Used with an AJAX call to a PHP method returning DataTable->toJson(),
     * a chart can be dynamically update in page, without reloads.
     *
     * @public
     * @param {String} label
     * @param {String} json
     * @param {Function} callback
     */
    loadData(label, json, callback) {
        if (typeof callback == 'undefined') {
            callback = _.noop;
        }

        if (typeof callback !== 'function') {
            throw new this._errors.InvalidCallback(callback);
        }

        this.getChart(label, chart => {
            if (typeof json.data != 'undefined') {
                chart.setData(json.data);
            } else {
                chart.setData(json);
            }

            if (typeof json.formats != 'undefined') {
                chart.applyFormats(json.formats);
            }

            chart.redraw();

            callback(chart);
        });
    }

    /**
     * Loads new options into a chart and redraws.
     *
     *
     * Used with an AJAX call, or javascript events, to load a new array of options into a chart.
     * This can be used to update a chart dynamically, without reloads.
     *
     * @public
     * @param {String} label
     * @param {String} json
     * @param {Function} callback
     */
    loadOptions(label, json, callback) {
        if (typeof callback == 'undefined') {
            callback = _.noop;
        }

        if (typeof callback !== 'function') {
            throw new this._errors.InvalidCallback(callback);
        }

        this.getChart(label, chart => {
            chart.setOptions(json);

            chart.redraw();

            callback(chart);
        });
    }

    /**
     * Redraws all of the registered charts on screen.
     *
     * This method is attached to the window resize event with a 300ms debounce
     * to make the charts responsive to the browser resizing.
     */
    redrawCharts() {
        _.debounce(_.bind(() => {
            this._forEachRenderable(renderable => {
                renderable.redraw();
            });
        }, this), 300);
    }

    /**
     * Create a new Chart.
     *
     * @public
     * @param  {String} type Type of chart to create
     * @param  {String} type Label for the chart
     * @return {Chart}
     */
    createChart(type, label) {
        return new this.Chart(type, label);
    }

    /**
     * Stores a chart within the module.
     *
     * @public
     * @param {Chart} chart
     */
    storeChart(chart) {
        this._charts.push(chart);
    }

    /**
     * Returns the LavaChart javascript objects
     *
     *
     * The LavaChart object holds all the user defined properties such as data, options, formats,
     * the GoogleChart object, and relative methods for internal use.
     *
     * The GoogleChart object is available as ".chart" from the returned LavaChart.
     * It can be used to access any of the available methods such as
     * getImageURI() or getChartLayoutInterface().
     * See https://google-developers.appspot.com/chart/interactive/docs/gallery/linechart#methods
     * for some examples relative to LineCharts.
     *
     * @public
     * @param  {String}   label
     * @param  {Function} callback
     * @throws InvalidLabel
     * @throws InvalidCallback
     * @throws ChartNotFound
     */
    getChart(label, callback) {
        if (typeof label != 'string') {
            throw new this._errors.InvalidLabel(label);
        }

        if (typeof callback != 'function') {
            throw new this._errors.InvalidCallback(callback);
        }

        var chart = _.find(this._charts, {label: label});

        if (!chart) {
            throw new this._errors.ChartNotFound(label);
        }

        callback(chart);
    }

    /**
     * Create a new Dashboard with a given label.
     *
     * @public
     * @param  {String} label
     * @return {Dashboard}
     */
    createDashboard(label) {
        return new this.Dashboard(label);
    }

    /**
     * Stores a dashboard within the module.
     *
     * @public
     * @param {Dashboard} dash
     */
    storeDashboard(dash) {
        this._dashboards.push(dash);
    }

    /**
     * Retrieve a Dashboard from Lava.js
     *
     * @public
     * @param  {String}   label    Dashboard label.
     * @param  {Function} callback Callback function
     * @throws InvalidLabel
     * @throws InvalidCallback
     * @throws DashboardNotFound
     */
    getDashboard(label, callback) {
        if (typeof label != 'string') {
            throw new this._errors.InvalidLabel(label);
        }

        if (typeof callback !== 'function') {
            throw new this._errors.InvalidCallback(callback);
        }

        var dash = _.find(this._dashboards, {label: label});

        if (dash instanceof this.Dashboard === false) {
            throw new this._errors.DashboardNotFound(label);
        }

        callback(dash);
    }

    /**
     * Returns an array with the charts and dashboards.
     *
     * @private
     * @return {Array}
     */
    _getRenderables() {
        return _.concat(this._charts, this._dashboards);
    }

    /**
     * Applies the callback to each of the charts and dashboards.
     *
     * @private
     * @param {Function} callback
     */
    _forEachRenderable(callback) {
        _.forEach(this._getRenderables(), callback);
    }

    /**
     * Applies the callback and builds an array of return values
     * for each of the charts and dashboards.
     *
     * @private
     * @param {Function} callback
     * @return {Array}
     */
    _mapRenderables(callback) {
        return _.map(this._getRenderables(), callback);
    }

    /**
     * Returns the defined locale of the charts.
     *
     * @private
     * @return {String}
     */
    _getLocale() {
        return this._config.locale;
    }

    /**
     * Returns an array of the google packages to load.
     *
     * @private
     * @return {Array}
     */
    _getPackages() {
        return _.union(
            _.map(this._charts, 'package'),
            _.flatten(_.map(this._dashboards, 'packages'))
        );
    }

    /**
     * Load Google's apis and resolve the promise when ready.
     */
    _loadGoogle() {
        var $lava = this;
        var s = document.createElement('script');
        var deferred = Q.defer();

        s.type = 'text/javascript';
        s.async = true;
        s.src = GOOGLE_LOADER_URL;
        s.onload = s.onreadystatechange = function (event) {
            event = event || window.event;

            if (event.type === "load" || (/loaded|complete/.test(this.readyState))) {
                this.onload = this.onreadystatechange = null;

                var packages = $lava._getPackages();
                var locale   = $lava._getLocale();

                this.log('google loaded');
                this.log(packages);

                google.charts.load('current', {
                    packages: packages,
                    language: locale
                });

                google.charts.setOnLoadCallback(deferred.resolve);
            }
        };

        document.head.appendChild(s);

        return deferred.promise;
    }

}
