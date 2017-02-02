/* jshint undef: true */
/* globals document, google, require, module */

import Renderable from './Renderable.jsx'

/**
 * Chart module
 *
 * @class     Chart
 * @module    lava/Chart
 * @author    Kevin Hill <kevinkhill@gmail.com>
 * @copyright (c) 2017, KHill Designs
 * @license   MIT
 */
const Q = require('q');
const _ = require('lodash');

/**
 * Chart Class
 *
 * This is the javascript version of a lavachart with methods for interacting with
 * the google chart and the PHP lavachart output.
 *
 * @param {String} type
 * @param {String} label
 * @constructor
 */
export default class Chart extends Renderable
{
    constructor(type, label) {
        super(type, label);

        this.options   = {};
        this.chart     = null;
        this.package   = null;
        this.pngOutput = false;
        this.formats   = [];
        this.promises  = {
            configure: Q.defer(),
            rendered:  Q.defer()
        };
    }

    /**
     * Sets the options for the chart.
     *
     * @public
     * @param {object} options
     */
    setOptions(options) {
        this.options = options;
    }

    /**
     * Sets whether the chart is to be rendered as PNG or SVG
     *
     * @public
     * @param {string|int} png
     */
    setPngOutput(png) {
        this.pngOutput = Boolean(typeof png == 'undefined' ? false : png);
    }

    /**
     * Redraws the chart.
     *
     * @public
     */
    redraw() {
        this.chart.draw(this.data, this.options);
    }

    /**
     * Draws the chart as a PNG instead of the standard SVG
     *
     * @public
     * @external "chart.getImageURI"
     * @see {@link https://developers.google.com/chart/interactive/docs/printing|Printing PNG Charts}
     */
    drawPng() {
        var img = document.createElement('img');
            img.src = this.chart.getImageURI();

        this.element.innerHTML = '';
        this.element.appendChild(img);
    }

    /**
     * Formats columns of the DataTable.
     *
     * @public
     * @param {Array.<Object>} formatArr Array of format definitions
     */
    applyFormats(formatArr) {
        for(var a=0; a < formatArr.length; a++) {
            var formatJson = formatArr[a];
            var formatter = new google.visualization[formatJson.type](formatJson.config);

            formatter.format(this.data, formatJson.index);
        }
    }
}
