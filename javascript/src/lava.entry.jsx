/* jshint undef: true, unused: true */
/* globals window, require */

import LavaJs from './lava/LavaJs.jsx'
import ready from 'document-ready'

/**
 * Lava.js entry point for Browserify
 */
(function() {
    "use strict";


    this.lava = new LavaJs;

    ready(() => {

        /**
         * Adding the resize event listener for redrawing charts.
         */
        this.addEventListener('resize', this.lava.redrawCharts);

        /**
         * Let's go!
         */
        this.lava.init();
        this.lava.run();
    });
}.apply(window));
