<?php namespace Khill\Lavacharts\Charts;

/**
 * BarChart Class
 *
 * A vertical bar chart that is rendered within the browser using SVG or VML.
 * Displays tips when hovering over bars. For a horizontal version of this
 * chart, see the Bar Chart.
 *
 *
 * @package    Lavacharts
 * @subpackage Charts
 * @since      v2.3.0
 * @author     Kevin Hill <kevinkhill@gmail.com>
 * @copyright  (c) 2015, KHill Designs
 * @link       http://github.com/kevinkhill/lavacharts GitHub Repository Page
 * @link       http://lavacharts.com                   Official Docs Site
 * @license    http://opensource.org/licenses/MIT MIT
 */

use \Khill\Lavacharts\Utils;
use \Khill\Lavacharts\Configs\Annotation;
use \Khill\Lavacharts\Configs\HorizontalAxis;
use \Khill\Lavacharts\Configs\VerticalAxis;

class BarChart extends Chart
{
    use \Khill\Lavacharts\Traits\AnnotationsTrait;
    use \Khill\Lavacharts\Traits\AxisTitlesPositionTrait;
    use \Khill\Lavacharts\Traits\BarGroupWidthTrait;
    use \Khill\Lavacharts\Traits\DataOpacityTrait;
    use \Khill\Lavacharts\Traits\EnableInteractivityTrait;
    use \Khill\Lavacharts\Traits\FocusTargetTrait;
    use \Khill\Lavacharts\Traits\ForceIFrameTrait;
    use \Khill\Lavacharts\Traits\HorizontalAxesTrait;
    use \Khill\Lavacharts\Traits\HorizontalAxisTrait;
    use \Khill\Lavacharts\Traits\IsStackedTrait;
    use \Khill\Lavacharts\Traits\OrientationTrait;
    use \Khill\Lavacharts\Traits\ReverseCategoriesTrait;
    use \Khill\Lavacharts\Traits\SeriesTrait;
    use \Khill\Lavacharts\Traits\ThemeTrait;
    use \Khill\Lavacharts\Traits\VerticalAxesTrait;
    use \Khill\Lavacharts\Traits\VerticalAxisTrait;

    public $type = 'BarChart';

    private $extraOptions = [
        'annotations',
        'axisTitlesPosition',
        'barGroupWidth',
        //'bars',
        //'chart.subtitle',
        //'chart.title',
        'dataOpacity',
        'enableInteractivity',
        'focusTarget',
        'forceIFrame',
        'hAxes',
        'hAxis',
        'isStacked',
        'orientation',
        'reverseCategories',
        'series',
        'theme',
        //'trendlines',
        'vAxes',
        'vAxis'
    ];

    public function __construct($chartLabel)
    {
        parent::__construct($chartLabel, $this->extraOptions);
    }
}
