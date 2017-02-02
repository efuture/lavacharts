/* jshint undef: true */

/**
 * Errors module
 *
 * @module    lava/Errors
 * @author    Kevin Hill <kevinkhill@gmail.com>
 * @copyright (c) 2017, KHill Designs
 * @license   MIT
 */
export class LavachartsError extends Error
{
    constructor (message) {
        super();
        this.message = (message || '');
        this.name = 'LavachartsError';
    };
}

/**
 * InvalidCallback Error
 *
 * thrown when when anything but a function is given as a callback
 * @type {function}
 */
export class InvalidCallback extends LavachartsError
{
    constructor (callback) {
        super('[Lavacharts] ' + typeof callback + ' is not a valid callback.');
        this.name = 'InvalidCallback';
    }
}

/**
 * InvalidLabel Error
 *
 * Thrown when when anything but a string is given as a label.
 *
 * @type {function}
 */
export class InvalidLabel extends LavachartsError
{
    constructor (label) {
        super('[Lavacharts] "' + typeof label + '" is not a valid label.');
        this.name = 'InvalidLabel';
    }
}

/**
 * ElementIdNotFound Error
 *
 * Thrown when when anything but a string is given as a label.
 *
 * @type {function}
 */
export class ElementIdNotFound extends LavachartsError
{
    constructor (elemId) {
        super('[Lavacharts] DOM node with id "' + elemId + '" was not found.');
        this.name = 'ElementIdNotFound';
    }
}

/**
 * ChartNotFound Error
 *
 * Thrown when when the getChart() method cannot find a chart with the given label.
 *
 * @type {function}
 */
export class ChartNotFound extends LavachartsError
{
    constructor (label) {
        super('[Lavacharts] Chart with label "' + label + '" was not found.');
        this.name = 'ChartNotFound';
    }
}

/**
 * DashboardNotFound Error
 *
 * Thrown when when the getDashboard() method cannot find a chart with the given label.
 *
 * @type {function}
 */
export class DashboardNotFound extends LavachartsError
{
    constructor (label) {
        super('[Lavacharts] Dashboard with label "' + label + '" was not found.');
        this.name = 'DashboardNotFound';
    }
}
