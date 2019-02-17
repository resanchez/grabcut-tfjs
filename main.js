import { InteractiveSVGRect } from './interactiveSVGRect.js';

// TODO: implement mask method

/** The overlay SVGElement capturing user interactions */
const svg = document.getElementById('interactLayer');
/** The HTMLDivElement containing the image display and the result display */
const inAndoutDiv = document.getElementById('inputoutput');
/** The Element displaying the selected image */
const imgElement = document.getElementById('imageSrc');
/** The InputElement allowing user to select image files */
const inputElement = document.getElementById('fileInput');
/** The id of the canvas used for the output display */
const outputCanvasId = 'outputCanvas';
/** The canvas used for the output display */
const outputCanvas = document.getElementById(outputCanvasId);

/** The rectangle serving as bounding box */
const rect = new InteractiveSVGRect(svg);


/** Define a listener to update the src attribute of the Element displaying the image once one is loaded */
inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);

/** 
 * Define a listener when the image is loaded.
 * This allows us to resive the SVGElement and create an InteractiveSVGRect inside of it
*/
imgElement.onload = function () {
    const imgRect = imgElement.getBoundingClientRect();
    svg.setAttribute('width', `${imgRect.width}`);
    svg.setAttribute('height', `${imgRect.height}`);
    outputCanvas.width = imgRect.width;
    outputCanvas.height = imgRect.height;
    inAndoutDiv.appendChild(svg);
    rect.resetToDefault();
    setUpSVGListeners(svg, rect, grabcut);
}

/** Set up the listener on the SVGElement responsible for the drawing of the box */
function setUpSVGListeners(svg, rect, call) {
    /** Define a mousedown event listener on the SVGElement to set the first corner of the box */
    svg.addEventListener('mousedown', e => {
        if (rect) {
            rect.moving = true;
            rect.x = e.offsetX;
            rect.y = e.offsetY;
            rect.width = 0;
            rect.height = 0;
        }
    });

    /** Define a mousemove event listener on the SVGElement to update the appropriate corner of the box */
    svg.addEventListener('mousemove', e => {
        if (rect && rect.moving) {
            if (e.offsetX >= rect.startX) {
                rect.width = e.offsetX - rect.startX;
                rect.x = rect.startX;
            } else {
                rect.width = rect.startX - e.offsetX;
                rect.x = e.offsetX;
            }
            if (e.offsetY >= rect.startY) {
                rect.height = e.offsetY - rect.startY;
                rect.y = rect.startY;
            } else {
                rect.height = rect.startY - e.offsetY;
                rect.y = e.offsetY;
            }
        }
    });

    /** Define a mouseup event listener on the SVGElement to finalize the box update and launching GrabCut */
    svg.addEventListener('mouseup', e => {
        if (rect) {
            rect.moving = false;
            call(imgElement, outputCanvasId, rect);
        }
    });
}


/** 
 * Function used to abstract OpenCV logic needed for launching cv.grabCut method.
 * We create the necessary masks and rectangle used by the internal method.
 * We execute the cv.grabCut method and use the return to create a new image with background replaced by a fixed color.
 * Then we draw this image on the output canvas identified by its id provided as argument.
*/
function grabcut(imgElement, idCanvasOutput, rect) {
    if (rect.width > 0 && rect.height > 0) {

        // create matricefrom image
        const src = cv.imread(imgElement);
        cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);

        // create the argument for cv.grabCut() call
        // we're using the rectangle-only method here
        const mask = new cv.Mat();
        const bgdModel = new cv.Mat();
        const fgdModel = new cv.Mat();
        const cv_rect = new cv.Rect(rect.x, rect.y, rect.width, rect.height);

        // execute the grabCut algorithm
        cv.grabCut(src, mask, cv_rect, bgdModel, fgdModel, 1, cv.GC_INIT_WITH_RECT);

        // erase background and replace by green
        for (let i = 0; i < src.rows; i++) {
            for (let j = 0; j < src.cols; j++) {
                if (mask.ucharPtr(i, j)[0] == 0 || mask.ucharPtr(i, j)[0] == 2) {
                    src.ucharPtr(i, j)[0] = 0;
                    src.ucharPtr(i, j)[1] = 255;
                    src.ucharPtr(i, j)[2] = 0;
                }
            }
        }

        // draw rectangle used as input in blue
        const color = new cv.Scalar(0, 0, 255);
        const point1 = new cv.Point(rect.x, rect.y);
        const point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
        cv.rectangle(src, point1, point2, color);

        // display the image on the canvas
        cv.imshow(idCanvasOutput, src);

        // clean unused variables
        src.delete(); mask.delete(); bgdModel.delete(); fgdModel.delete();
    }
}