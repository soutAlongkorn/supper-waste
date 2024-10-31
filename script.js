document.getElementById('scan-button').addEventListener('click', async () => {
    const qrResult = document.getElementById('qr-result');
    qrResult.classList.remove('hidden');
    
    // เรียกใช้งานกล้องเพื่อสแกน QR Code
    try {
        const video = document.createElement('video');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.setAttribute('playsinline', true); // Required to tell iOS safari we don't want fullscreen
        video.play();
        
        // ใช้ไลบรารีสำหรับการสแกน QR Code (ตัวอย่างใช้ jsQR)
        const qrScanner = setInterval(() => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height);
            if (code) {
                clearInterval(qrScanner);
                stream.getTracks().forEach(track => track.stop());
                qrResult.textContent = `สแกนสำเร็จ: ${code.data}`;
                updatePoints();
            }
        }, 1000);
    } catch (err) {
        qrResult.textContent = 'ไม่สามารถเข้าถึงกล้อง';
    }
});

function updatePoints() {
    const pointsValue = document.getElementById('points-value');
    let currentPoints = parseInt(pointsValue.textContent);
    currentPoints += 10; // เพิ่มคะแนนตามที่กำหนด
    pointsValue.textContent = currentPoints;
    showPrizes(currentPoints);
}

function showPrizes(points) {
    const prizeList = document.getElementById('prize-list');
    prizeList.innerHTML = ''; // ล้างรายการรางวัลก่อนหน้า

    const prizes = generatePrizes(); // สร้างรายการรางวัล
    prizes.forEach(prize => {
        const listItem = document.createElement('li');
        listItem.textContent = `${prize.name}: ${prize.points} แต้ม`;
        if (points >= prize.points) {
            listItem.style.color = '#28a745'; // สีเขียวถ้าสามารถแลกได้
        } else {
            listItem.style.color = '#ccc'; // สีเทาถ้าแลกไม่ได้
        }
        prizeList.appendChild(listItem);
    });

    document.getElementById('prizes').classList.remove('hidden');
}

function generatePrizes() {
    const prizeArray = [];
    for (let i = 1; i <= 100; i++) {
        prizeArray.push({ name: `รางวัลที่ ${i}`, points: i * 10 }); // รางวัล 1 ถึง 100 โดยเพิ่ม 10 แต้ม
    }
    return prizeArray;
}

