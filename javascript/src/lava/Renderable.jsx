/* jshint undef: true */
/* globals document, google, require */

import * as errors from './Errors.jsx'
import * as _ from 'lodash'

/**
 * Chart module
 *
 * @class     Chart
 * @module    lava/Chart
 * @author    Kevin Hill <kevinkhill@gmail.com>
 * @copyright (c) 2017, KHill Designs
 * @license   MIT
 */
//const _ = require('lodash');

/**
 * Renderable Class
 *
 * This is the parent class to both Chart and Dashboard providing common properties and methods.
 *
 * @param {String} type
 * @param {String} label
 * @constructor
 */
export default class Renderable
{
    constructor(type, label) {
        this._errors   = errors;
        this.label     = label;
        this.type      = type;
        this.element   = null;
        this.data      = {};
        this.init      = _.noop();
        this.configure = _.noop();
        this.render    = _.noop();
        this.uuid      = () => {
            return this.type+'::'+this.label;
        };
    }

    /**
     * Sets the data for the chart by creating a new DataTable
     *
     * @public
     * @external "google.visualization.DataTable"
     * @see   {@link https://developers.google.com/chart/interactive/docs/reference#DataTable|DataTable Class}
     * @param {object}        data      Json representation of a DataTable
     * @param {Array.<Array>} data.cols Array of column definitions
     * @param {Array.<Array>} data.rows Array of row definitions
     */
    setData(data) {
        this.data = new google.visualization.DataTable(data);
    }

    /**
     * Set the ID of the output element for the Dashboard.
     *
     * @public
     * @param  {string} elemId
     * @throws ElementIdNotFound
     */
    setElement(elemId) {
        this.element = document.getElementById(elemId);

        if (! this.element) {
            throw new this._errors.ElementIdNotFound(elemId);
        }
    }
}
