const video = document.getElementById('video');
const gestureDiv = document.getElementById('gesture');

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
    });
    video.srcObject = stream;
    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function loadHandPoseModel() {
    const model = await handpose.load();
    console.log('Modelo de Mão Carregado');
    return model;
}

function countFingers(landmarks) {
    let count = 0;
    // Para cada dedo, verifique se está levantado
    const wristY = landmarks[0][0]; // Y do punho

    // Verifique a posição de cada dedo em relação ao punho
    const fingers = [
        landmarks[4][1],  // Polegar
        landmarks[8][1],  // Dedo Indicador
        landmarks[12][1], // Dedo Médio
        landmarks[16][1], // Dedo Anelar
        landmarks[20][1]  // Dedo Mínimo
    ];

    fingers.forEach(fingerY => {
        if (fingerY < wristY) count++; // Se o Y do dedo for menor que o do punho
    });

    return count;
}

async function detectHands(model) {
    const predictions = await model.estimateHands(video);
    if (predictions.length > 0) {
        const landmarks = predictions[0].landmarks;
        const fingerCount = countFingers(landmarks);
        gestureDiv.innerText = `Dedos levantados: ${fingerCount}`;
    } else {
        gestureDiv.innerText = 'Nenhuma Mão Detectada';
    }
    requestAnimationFrame(() => detectHands(model));
}

async function main() {
    await setupCamera();
    const model = await loadHandPoseModel();
    video.play();
    detectHands(model);
}

main();
