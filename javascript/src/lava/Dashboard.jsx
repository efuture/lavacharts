/* jshint undef: true */
/* globals document, google, require, module */

import Renderable from './Renderable.jsx'

/**
 * Dashboard module
 *
 * @class     Dashboard
 * @module    lava/Dashboard
 * @author    Kevin Hill <kevinkhill@gmail.com>
 * @copyright (c) 2017, KHill Designs
 * @license   MIT
 */
const Q = require('q');

/**
 * Dashboard Class
 *
 * This is the javascript version of a dashboard with methods for interacting with
 * the google chart and the PHP lavachart output.
 *
 * @param {String} label
 * @constructor
 */
export default class Dashboard extends Renderable
{
    constructor(label) {
        super('Dashboard', label);

        this.bindings  = [];
        this.dashboard = null;
        this.deferred  = Q.defer();
    }
}
