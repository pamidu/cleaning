/**
 * @module
 * @prototype
 * @dependencies [ SmoothScrollbar, #showTrack, #addTrack, setStyle ]
 */

import { setStyle } from '../utils/index';
import { SmoothScrollbar } from '../smooth_scrollbar';

export { SmoothScrollbar };

/**
 * @method
 * @internal
 * Set thumb position in track
 */
let __setThumbPosition = function() {
    let { x, y } = this.offset;
    let { xAxis, yAxis } = this.target;

    let styleX = `translate3d(${x / this.size.content.width * this.size.container.width}px, 0, 0)`;
    let styleY = `translate3d(0, ${y / this.size.content.height * this.size.container.height}px, 0)`;

    setStyle(xAxis.thumb, {
        '-webkit-transform': styleX,
        'transform': styleX
    });

    setStyle(yAxis.thumb, {
        '-webkit-transform': styleY,
        'transform': styleY
    });
};

Object.defineProperty(SmoothScrollbar.prototype, '__setThumbPosition', {
    value: __setThumbPosition,
    writable: true,
    configurable: true
});
