/** Namespace used to create SVGElements from JavaScript */
const XMLNS = 'http://www.w3.org/2000/svg';

/** Class for creating and moving a rectangle in a SVGElement */
export class InteractiveSVGRect {


    /**
     * Create and initialize the box
     * @param {SVGElement} svgElement the SVGElement to append the box to
     * @param {Number} x the x coordinate of the top-left corner 
     * @param {Number} y the y coordinate of the top-left corner
     * @param {Number} width the width of the box
     * @param {Number} height the height of the box
     */
    constructor(svgElement, x = 0, y = 0, width = 0, height = 0) {
        this.svgRect = document.createElementNS(XMLNS, 'rect');
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.moving = false;
        this.svgElement = svgElement;
        this.svgElement.appendChild(this.svgRect);
    }

    /**
     * Accessor to get the moving status of the box (is beign modified)
     */
    get moving() {
        return this._moving;
    }

    /**
     * Setter to change the moving status of the box.
     * Putting it to false delete startX and startY coordinates (no need to update anymore)
     */
    set moving(moving) {
        this._moving = moving;
        if (!moving) {
            this.startX = undefined;
            this.startY = undefined;
        }
    }

    /**
     * Accessor to get the x coordiante of top-left corner of the box
     */
    get x() {
        return this._x;
    }

    /**
     * Setter to update the x coordinate of the top-left corner of the box.
     * This should set the startX value if it's not.
     * This should update SVGRectElement's x attribute.
     */
    set x(x) {
        if (x !== this._x) {
            this._x = x;
            if (this.startX === undefined) {
                this.startX = x;
            }
            this.svgRect.setAttributeNS(null, 'x', x);
        }
    }

    /**
     * Accessor to get the y coordiante of top-left corner of the box
     */
    get y() {
        return this._y;
    }

    /**
     * Setter to update the y coordinate of the top-left corner of the box.
     * This should set the startY value if it's not.
     * This should update SVGRectElement's y attribute.
     */
    set y(y) {
        if (y !== this._y) {
            this._y = y;
            if (this.startY === undefined) {
                this.startY = y;
            }
            this.svgRect.setAttributeNS(null, 'y', y);
        }
    }

    /**
     * Accessor the get the width of the box
     */
    get width() {
        return this._width;
    }

    /**
     * Setter to update the width of the box.
     * This should update SVGRectElement's width attribute.
     */
    set width(width) {
        if (width !== this._width) {
            this._width = width;
            this.svgRect.setAttributeNS(null, 'width', width);
        }
    }

    /**
     * Accessor to get the height of the box
     */
    get height() {
        return this._height;
    }

    /**
     * Setter to update the height of the box.
     * This should update SVGRectElement's height attribute.
     */
    set height(height) {
        if (height !== this._height) {
            this._height = height;
            this.svgRect.setAttributeNS(null, 'height', height);
        }
    }

    /** Put the box in its default position and size */
    resetToDefault() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.moving = false;
    }
}
