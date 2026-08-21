const canvas = document.getElementById("puzzle");
const ctx = canvas.getContext("2d");

const movesDisplay =
    document.getElementById("moves");

const toggleButton =
    document.getElementById("toggle");

const scrambleButton =
    document.getElementById("scramble");

const importButton =
    document.getElementById("importButton");

const importMenu =
    document.getElementById("importMenu");

const menuCamera =
    document.getElementById("menuCamera");

const secretButton =
    document.getElementById("secretButton");

const imageInput =
    document.getElementById("imageInput");

const cameraView =
    document.getElementById("cameraView");

const cameraVideo =
    document.getElementById("cameraVideo");

const takePhotoButton =
    document.getElementById("takePhoto");

const closeCameraButton =
    document.getElementById("closeCamera");

const cropView =
    document.getElementById("cropView");

const cropCanvas =
    document.getElementById("cropCanvas");

const cropCtx =
    cropCanvas.getContext("2d");

const cropUseButton =
    document.getElementById("cropUse");

const cropCancelButton =
    document.getElementById("cropCancel");


const SIZE = 4;

const TILE_GAP = 4;

const MAX_IMAGE_SIZE = 1600;


// ==================================================
// PUZZLE STATE
// ==================================================

let tileSize;

let board = [];

let moves = 0;


// Currently selected image.
// This can be:
// default image,
// user's imported image,
// camera image,
// or secret image.
let puzzleImage = null;


// TRUE  = show current image
// FALSE = show numbers
//
// IMPORTANT:
// Starts FALSE even when default.jpg exists.
let showImage = false;


// ==================================================
// STORED IMAGES
// ==================================================

const DEFAULT_IMAGE =
    "default.jpg";

const SECRET_IMAGE =
    "secret.jpg";


let defaultImage = null;

let secretImage = null;

let userImage = null;


// ==================================================
// CAMERA STATE
// ==================================================

let cameraStream = null;


// ==================================================
// CROP STATE
// ==================================================

let cropImage = null;

let cropScale = 1;

let cropX = 0;
let cropY = 0;

let cropDragging = false;

let cropStartX = 0;
let cropStartY = 0;

let cropSquareSize = 0;


// ==================================================
// CREATE SOLVED BOARD
// ==================================================

function createSolvedBoard() {

    board = [];

    for (
        let i = 1;
        i < SIZE * SIZE;
        i++
    ) {
        board.push(i);
    }

    board.push(0);
}


// ==================================================
// RESIZE CANVAS
// ==================================================

function resizeCanvas() {

    const maxSize =
        Math.min(
            window.innerWidth - 30,
            window.innerHeight - 150,
            500
        );

    canvas.width = maxSize;
    canvas.height = maxSize;

    tileSize =
        canvas.width / SIZE;

    draw();
}


// ==================================================
// DRAW PUZZLE
// ==================================================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    for (
        let i = 0;
        i < board.length;
        i++
    ) {

        const value =
            board[i];


        const row =
            Math.floor(i / SIZE);

        const col =
            i % SIZE;


        const x =
            col * tileSize;

        const y =
            row * tileSize;


        // Empty tile
        if (value === 0) {
            continue;
        }


        const gap =
            TILE_GAP / 2;


        // ==================================================
        // IMAGE MODE
        // ==================================================

        if (
            showImage &&
            puzzleImage
        ) {

            const originalIndex =
                value - 1;


            const imageRow =
                Math.floor(
                    originalIndex / SIZE
                );


            const imageCol =
                originalIndex % SIZE;


            const sourceTileSize =
                puzzleImage.width / SIZE;


            ctx.drawImage(
                puzzleImage,

                imageCol * sourceTileSize,
                imageRow * sourceTileSize,

                sourceTileSize,
                sourceTileSize,

                x + gap,
                y + gap,

                tileSize - TILE_GAP,
                tileSize - TILE_GAP
            );

        }


        // ==================================================
        // NUMBER MODE
        // ==================================================

        else {

            ctx.fillStyle =
                "#444";


            ctx.fillRect(
                x + gap,
                y + gap,

                tileSize - TILE_GAP,
                tileSize - TILE_GAP
            );


            ctx.fillStyle =
                "white";


            ctx.font =
                `${tileSize * 0.35}px Arial`;


            ctx.textAlign =
                "center";

            ctx.textBaseline =
                "middle";


            ctx.fillText(
                value,

                x + tileSize / 2,
                y + tileSize / 2
            );
        }
    }
}


// ==================================================
// TOGGLE IMAGE / NUMBERS
// ==================================================

toggleButton.addEventListener(
    "click",
    () => {

        if (!puzzleImage) {
            return;
        }


        showImage =
            !showImage;


        draw();
    }
);


// ==================================================
// FIND EMPTY TILE
// ==================================================

function getEmptyIndex() {

    return board.indexOf(0);
}


// ==================================================
// MOVE TILE
// ==================================================

function moveTile(index) {

    const empty =
        getEmptyIndex();


    const tileRow =
        Math.floor(index / SIZE);

    const tileCol =
        index % SIZE;


    const emptyRow =
        Math.floor(empty / SIZE);

    const emptyCol =
        empty % SIZE;


    const rowDifference =
        Math.abs(
            tileRow - emptyRow
        );


    const colDifference =
        Math.abs(
            tileCol - emptyCol
        );


    if (
        rowDifference +
        colDifference !== 1
    ) {
        return;
    }


    [
        board[index],
        board[empty]
    ] =
    [
        board[empty],
        board[index]
    ];


    moves++;

    movesDisplay.textContent =
        moves;


    draw();

    checkSolved();
}


// ==================================================
// CHECK SOLVED
// ==================================================

function checkSolved() {

    for (
        let i = 0;
        i < board.length - 1;
        i++
    ) {

        if (
            board[i] !== i + 1
        ) {
            return false;
        }
    }


    if (
        board[board.length - 1] !== 0
    ) {
        return false;
    }


    puzzleSolved();

    return true;
}


// ==================================================
// SOLVED
// ==================================================

function puzzleSolved() {

    console.log(
        "Puzzle solved!"
    );


    setTimeout(
        () => {

            alert(
                `Solved in ${moves} moves!`
            );

        },
        50
    );
}


// ==================================================
// SCRAMBLE
// ==================================================

function scramble() {

    createSolvedBoard();


    let previousEmpty = -1;

    const scrambleMoves = 150;


    for (
        let i = 0;
        i < scrambleMoves;
        i++
    ) {

        const empty =
            getEmptyIndex();


        const emptyRow =
            Math.floor(
                empty / SIZE
            );


        const emptyCol =
            empty % SIZE;


        const possibleMoves = [];


        if (emptyRow > 0) {

            possibleMoves.push(
                empty - SIZE
            );
        }


        if (
            emptyRow <
            SIZE - 1
        ) {

            possibleMoves.push(
                empty + SIZE
            );
        }


        if (emptyCol > 0) {

            possibleMoves.push(
                empty - 1
            );
        }


        if (
            emptyCol <
            SIZE - 1
        ) {

            possibleMoves.push(
                empty + 1
            );
        }


        const filteredMoves =
            possibleMoves.filter(
                index =>
                    index !==
                    previousEmpty
            );


        const choices =
            filteredMoves.length > 0
                ? filteredMoves
                : possibleMoves;


        const chosen =
            choices[
                Math.floor(
                    Math.random() *
                    choices.length
                )
            ];


        previousEmpty =
            empty;


        [
            board[chosen],
            board[empty]
        ] =
        [
            board[empty],
            board[chosen]
        ];
    }


    moves = 0;

    movesDisplay.textContent =
        moves;


    draw();
}


// ==================================================
// IMPORT MENU
// ==================================================

importButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        const rect =
            importButton.getBoundingClientRect();


        importMenu.style.left =
            `${rect.left}px`;


        importMenu.style.top =
            `${rect.bottom + 6}px`;


        importMenu.style.display = "flex";
    }
);


// Close menu when clicking elsewhere
document.addEventListener(
    "pointerdown",
    event => {

        if (
            !importMenu.contains(event.target) &&
            event.target !== importButton
        ) {

            importMenu.style.display =
                "none";
        }
    }
);


// ==================================================
// CREATE FINAL CROPPED IMAGE
// ==================================================

function createPuzzleImageFromCrop() {

    const outputSize =
        Math.min(
            cropImage.naturalWidth,
            cropImage.naturalHeight,
            MAX_IMAGE_SIZE
        );


    const result =
        document.createElement(
            "canvas"
        );


    const resultCtx =
        result.getContext("2d");


    result.width =
        outputSize;

    result.height =
        outputSize;


    const frameX =
        (
            cropCanvas.width -
            cropSquareSize
        ) / 2;


    const frameY =
        (
            cropCanvas.height -
            cropSquareSize
        ) / 2;


    const sourceX =
        (
            frameX - cropX
        ) / cropScale;


    const sourceY =
        (
            frameY - cropY
        ) / cropScale;


    const sourceSize =
        cropSquareSize /
        cropScale;


    resultCtx.drawImage(
        cropImage,

        sourceX,
        sourceY,

        sourceSize,
        sourceSize,

        0,
        0,

        outputSize,
        outputSize
    );


    // Store user's image permanently
    userImage = result;

    // Make user's image the current image
    puzzleImage = userImage;

    // Show it immediately
    showImage = true;


    cropView.style.display =
        "none";


    cropImage = null;


    // New image = new puzzle
    scramble();
}


// ==================================================
// DRAW CROP
// ==================================================

function drawCrop() {

    cropCtx.clearRect(
        0,
        0,
        cropCanvas.width,
        cropCanvas.height
    );


    cropCtx.drawImage(
        cropImage,

        cropX,
        cropY,

        cropImage.naturalWidth *
            cropScale,

        cropImage.naturalHeight *
            cropScale
    );


    const size =
        cropSquareSize;


    cropCtx.fillStyle =
        "rgba(0, 0, 0, 0.60)";


    // Top
    cropCtx.fillRect(
        0,
        0,

        cropCanvas.width,

        (
            cropCanvas.height -
            size
        ) / 2
    );


    // Bottom
    cropCtx.fillRect(
        0,

        (
            cropCanvas.height +
            size
        ) / 2,

        cropCanvas.width,

        (
            cropCanvas.height -
            size
        ) / 2
    );


    // Left
    cropCtx.fillRect(
        0,

        (
            cropCanvas.height -
            size
        ) / 2,

        (
            cropCanvas.width -
            size
        ) / 2,

        size
    );


    // Right
    cropCtx.fillRect(
        (
            cropCanvas.width +
            size
        ) / 2,

        (
            cropCanvas.height -
            size
        ) / 2,

        (
            cropCanvas.width -
            size
        ) / 2,

        size
    );


    cropCtx.strokeStyle =
        "white";

    cropCtx.lineWidth = 2;


    cropCtx.strokeRect(
        (
            cropCanvas.width -
            size
        ) / 2,

        (
            cropCanvas.height -
            size
        ) / 2,

        size,
        size
    );
}


// ==================================================
// OPEN CROP
// ==================================================

function openCrop(image) {

    cropImage = image;


    cropCanvas.width =
        window.innerWidth;

    cropCanvas.height =
        window.innerHeight;


    cropSquareSize =
        Math.min(
            cropCanvas.width * 0.85,
            cropCanvas.height * 0.75
        );


    const scaleX =
        cropSquareSize /
        image.naturalWidth;


    const scaleY =
        cropSquareSize /
        image.naturalHeight;


    cropScale =
        Math.max(
            scaleX,
            scaleY
        );


    const displayedWidth =
        image.naturalWidth *
        cropScale;


    const displayedHeight =
        image.naturalHeight *
        cropScale;


    cropX =
        (
            cropCanvas.width -
            displayedWidth
        ) / 2;


    cropY =
        (
            cropCanvas.height -
            displayedHeight
        ) / 2;


    cropView.style.display =
        "flex";


    drawCrop();
}


// ==================================================
// GALLERY IMPORT
// ==================================================

imageInput.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];


        if (!file) {
            return;
        }


        const image =
            new Image();


        const objectURL =
            URL.createObjectURL(file);


        image.onload = () => {

            openCrop(image);


            URL.revokeObjectURL(
                objectURL
            );


            event.target.value =
                "";
        };


        image.onerror = () => {

            alert(
                "Could not load this image."
            );


            URL.revokeObjectURL(
                objectURL
            );


            event.target.value =
                "";
        };


        image.src =
            objectURL;
    }
);


// ==================================================
// CROP DRAGGING
// ==================================================

function cropPointerDown(event) {

    cropDragging = true;


    cropStartX =
        event.clientX -
        cropX;


    cropStartY =
        event.clientY -
        cropY;


    cropCanvas.setPointerCapture(
        event.pointerId
    );
}


function cropPointerMove(event) {

    if (!cropDragging) {
        return;
    }


    cropX =
        event.clientX -
        cropStartX;


    cropY =
        event.clientY -
        cropStartY;


    const displayedWidth =
        cropImage.naturalWidth *
        cropScale;


    const displayedHeight =
        cropImage.naturalHeight *
        cropScale;


    const leftLimit =
        (
            cropCanvas.width +
            cropSquareSize
        ) / 2 -
        displayedWidth;


    const rightLimit =
        (
            cropCanvas.width -
            cropSquareSize
        ) / 2;


    const topLimit =
        (
            cropCanvas.height +
            cropSquareSize
        ) / 2 -
        displayedHeight;


    const bottomLimit =
        (
            cropCanvas.height -
            cropSquareSize
        ) / 2;


    cropX =
        Math.min(
            rightLimit,
            Math.max(
                leftLimit,
                cropX
            )
        );


    cropY =
        Math.min(
            bottomLimit,
            Math.max(
                topLimit,
                cropY
            )
        );


    drawCrop();
}


function cropPointerUp() {

    cropDragging = false;
}


cropCanvas.addEventListener(
    "pointerdown",
    cropPointerDown
);


cropCanvas.addEventListener(
    "pointermove",
    cropPointerMove
);


cropCanvas.addEventListener(
    "pointerup",
    cropPointerUp
);


cropCanvas.addEventListener(
    "pointercancel",
    cropPointerUp
);


// ==================================================
// CROP BUTTONS
// ==================================================

cropUseButton.addEventListener(
    "click",
    createPuzzleImageFromCrop
);


cropCancelButton.addEventListener(
    "click",
    () => {

        cropView.style.display =
            "none";

        cropImage = null;
    }
);


// ==================================================
// OPEN CAMERA
// ==================================================

async function openCamera() {

    importMenu.style.display =
        "none";


    try {

        cameraStream =
            await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: {
                        ideal: "environment"
                    }
                },

                audio: false
            });


        cameraVideo.srcObject =
            cameraStream;


        cameraView.style.display =
            "flex";

    } catch (error) {

        console.error(
            "Could not access camera:",
            error
        );


        alert(
            "Could not access the camera."
        );
    }
}


// ==================================================
// CAMERA MENU BUTTON
// ==================================================

menuCamera.addEventListener(
    "click",
    openCamera
);


// ==================================================
// TAKE CAMERA PHOTO
// ==================================================

takePhotoButton.addEventListener(
    "click",
    () => {

        if (!cameraStream) {
            return;
        }


        const videoWidth =
            cameraVideo.videoWidth;


        const videoHeight =
            cameraVideo.videoHeight;


        if (
            !videoWidth ||
            !videoHeight
        ) {
            return;
        }


        const viewWidth =
            cameraView.clientWidth;


        const viewHeight =
            cameraView.clientHeight;


        const scale =
            Math.max(
                viewWidth / videoWidth,
                viewHeight / videoHeight
            );


        const displayedWidth =
            videoWidth * scale;


        const displayedHeight =
            videoHeight * scale;


        const videoLeft =
            (
                viewWidth -
                displayedWidth
            ) / 2;


        const videoTop =
            (
                viewHeight -
                displayedHeight
            ) / 2;


        const guide =
            document.getElementById(
                "cameraGuide"
            );


        const guideRect =
            guide.getBoundingClientRect();


        const sourceX =
            (
                guideRect.left -
                videoLeft
            ) / scale;


        const sourceY =
            (
                guideRect.top -
                videoTop
            ) / scale;


        const sourceSize =
            guideRect.width /
            scale;


        const outputSize =
            Math.min(
                Math.round(sourceSize),
                MAX_IMAGE_SIZE
            );


        const photoCanvas =
            document.createElement(
                "canvas"
            );


        const photoCtx =
            photoCanvas.getContext(
                "2d"
            );


        photoCanvas.width =
            outputSize;

        photoCanvas.height =
            outputSize;


        photoCtx.drawImage(
            cameraVideo,

            sourceX,
            sourceY,

            sourceSize,
            sourceSize,

            0,
            0,

            outputSize,
            outputSize
        );


        userImage =
            photoCanvas;


        puzzleImage =
            userImage;


        showImage =
            true;


        closeCamera();

        scramble();
    }
);


// ==================================================
// CLOSE CAMERA
// ==================================================

function closeCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(
                track =>
                    track.stop()
            );

        cameraStream = null;
    }


    cameraVideo.srcObject =
        null;


    cameraView.style.display =
        "none";
}


closeCameraButton.addEventListener(
    "click",
    closeCamera
);


// ==================================================
// CAMERA BUTTON IS NOW INSIDE IMPORT
// ==================================================


// ==================================================
// SECRET IMAGE
// ==================================================

function showSecret() {

    if (!secretImage) {
        return;
    }


    puzzleImage =
        secretImage;


    showImage =
        true;


    draw();
}


secretButton.addEventListener(
    "click",
    showSecret
);


// ==================================================
// PUZZLE INPUT
// ==================================================

canvas.addEventListener(
    "pointerdown",
    event => {

        const rect =
            canvas.getBoundingClientRect();


        const x =
            event.clientX -
            rect.left;


        const y =
            event.clientY -
            rect.top;


        const col =
            Math.floor(
                x / tileSize
            );


        const row =
            Math.floor(
                y / tileSize
            );


        const index =
            row * SIZE + col;


        moveTile(index);
    }
);


// ==================================================
// SCRAMBLE BUTTON
// ==================================================

scrambleButton.addEventListener(
    "click",
    scramble
);


// ==================================================
// RESIZE
// ==================================================

window.addEventListener(
    "resize",
    resizeCanvas
);


// ==================================================
// LOAD IMAGE FROM FILE
// ==================================================

function loadImageFile(
    filename,
    callback
) {

    const image =
        new Image();


    image.onload = () => {

        const size =
            Math.min(
                image.naturalWidth,
                image.naturalHeight
            );


        const sourceX =
            (
                image.naturalWidth -
                size
            ) / 2;


        const sourceY =
            (
                image.naturalHeight -
                size
            ) / 2;


        const outputSize =
            Math.min(
                size,
                MAX_IMAGE_SIZE
            );


        const result =
            document.createElement(
                "canvas"
            );


        const resultCtx =
            result.getContext(
                "2d"
            );


        result.width =
            outputSize;


        result.height =
            outputSize;


        resultCtx.drawImage(
            image,

            sourceX,
            sourceY,

            size,
            size,

            0,
            0,

            outputSize,
            outputSize
        );


        callback(result);
    };


    image.onerror = () => {

        callback(null);
    };


    image.src =
        filename;
}


// ==================================================
// LOAD DEFAULT IMAGE
// ==================================================

function loadDefaultImage() {

    loadImageFile(
        DEFAULT_IMAGE,

        image => {

            defaultImage =
                image;


            /*
             * Default image becomes the
             * current image, but we remain
             * in NUMBER mode at startup.
             */

            puzzleImage =
                defaultImage;


            showImage =
                false;


            draw();
        }
    );
}


// ==================================================
// LOAD SECRET IMAGE
// ==================================================

function loadSecretImage() {

    loadImageFile(
        SECRET_IMAGE,

        image => {

            secretImage =
                image;
        }
    );
}


// ==================================================
// START
// ==================================================

createSolvedBoard();

resizeCanvas();

scramble();

loadDefaultImage();

loadSecretImage();