document.addEventListener('DOMContentLoaded', () => {
    // اطلاعات بازی
    const games = {
        1: {
            name: 'Riding Extreme 3D',
            appToken: 'd28721be-fd2d-4b45-869e-9f253b554e50',
            promoId: '43e35910-c168-4634-ad4f-52fd764a843f',
            timing: 30000, // 30 seconds
            attempts: 25,
        },
        2: {
            name: 'Chain Cube 2048',
            appToken: 'd1690a07-3780-4068-810f-9b5bbf2931b2',
            promoId: 'b4170868-cef0-424f-8eb9-be0622e8e8e3',
            timing: 30000, // 30 seconds
            attempts: 20,
        },
        3: {
            name: 'My Clone Army',
            appToken: '74ee0b5b-775e-4bee-974f-63e7f4d5bacb',
            promoId: 'fe693b26-b342-4159-8808-15e3ff7f8767',
            timing: 180000, // 180 seconds
            attempts: 30,
        },
        4: {
            name: 'Train Miner',
            appToken: '82647f43-3f87-402d-88dd-09a90025313f',
            promoId: 'c4480ac7-e178-4973-8061-9ed5b2e17954',
            timing: 30000, // 30 seconds
            attempts: 15,
        },
        5: {
            name: 'Merge Away',
            appToken: '8d1cc2ad-e097-4b86-90ef-7a27e19fb833',
            promoId: 'dc128d28-c45b-411c-98ff-ac7726fbaea4',
            timing: 30000, // 30 seconds
            attempts: 25,
        },
        6: {
            name: 'Twerk Race 3D',
            appToken: '61308365-9d16-4040-8bb0-2f4a4c69074c',
            promoId: '61308365-9d16-4040-8bb0-2f4a4c69074c',
            timing: 30000, // 30 seconds
            attempts: 20,
        },
        7: {
            name: 'Polysphere',
            appToken: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71',
            promoId: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71',
            timing: 20000, // 20 seconds
            attempts: 20,
        },
        8: {
            name: 'Mow and Trim',
            appToken: 'ef319a80-949a-492e-8ee0-424fb5fc20a6',
            promoId: 'ef319a80-949a-492e-8ee0-424fb5fc20a6',
            timing: 20000, // 20 seconds
            attempts: 20,
        },
        9: {
            name: 'Mud Racing',
            appToken: '8814a785-97fb-4177-9193-ca4180ff9da8',
            promoId: '8814a785-97fb-4177-9193-ca4180ff9da8',
            timing: 20000, // 20 seconds
            attempts: 20,
        },
        10: {
            name: 'Cafe Dash',
            appToken: 'bc0971b8-04df-4e72-8a3e-ec4dc663cd11',
            promoId: 'bc0971b8-04df-4e72-8a3e-ec4dc663cd11',
            timing: 20000, // 20 seconds
            attempts: 20,
        }
    };

    const gameOptions = document.querySelectorAll('.game-option');
    const gameDetails = document.getElementById('gameDetails');
    const selectedGameImage = document.getElementById('selectedGameImage');
    const keyCountGroup = document.getElementById('keyCountGroup');
    const keyRange = document.getElementById('keyRange');
    const keyValue = document.getElementById('keyValue');
    const startBtn = document.getElementById('startBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const progressLog = document.getElementById('progressLog');
    const keyContainer = document.getElementById('keyContainer');
    const keysList = document.getElementById('keysList');
    const copyAllBtn = document.getElementById('copyAllBtn');
    const generatedKeysTitle = document.getElementById('generatedKeysTitle');
    const copyStatus = document.getElementById('copyStatus');
    const generateMoreBtn = document.getElementById('generateMoreBtn');
    const sourceCode = document.getElementById('sourceCode');

    let selectedGameId = null;

    // بروزرسانی مقدار اسلایدر
    keyRange.addEventListener('input', () => {
        keyValue.textContent = keyRange.value;
    });

    // مدیریت کلیک روی گزینه‌های بازی
    gameOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const gameId = e.currentTarget.getAttribute('data-game');
            if (selectedGameId !== gameId) {
                // پنهان کردن تمام گزینه‌های بازی
                gameOptions.forEach(gameOption => gameOption.classList.add('hidden'));

                // نمایش جزئیات بازی انتخاب شده
                const selectedGame = games[gameId];
                selectedGameImage.src = e.currentTarget.querySelector('img').src;
                selectedGameImage.alt = selectedGame.name;

                // نمایش گروه تعداد کلید و دکمه شروع
                gameDetails.classList.remove('hidden');
                keyCountGroup.classList.remove('hidden');
                startBtn.classList.remove('hidden');
                selectedGameId = gameId;
            }
        });
    });

    // کلیک روی دکمه شروع
    startBtn.addEventListener('click', async () => {
        const game = games[selectedGameId];
        const keyCount = parseInt(keyRange.value, 10);

        if (!game) {
            showAlert('لطفاً ابتدا یک بازی را انتخاب کنید.');
            return;
        }

        // مخفی کردن عناصر قبلی و مقداردهی اولیه به پیشرفت
        document.querySelector('.grid-container').style.display = 'none';
        keyCountGroup.style.display = 'none';
        startBtn.style.display = 'none';
        progressBar.style.width = '0%';
        progressText.innerText = '0%';
        progressLog.innerText = 'Starting...';
        progressContainer.classList.remove('hidden');
        keyContainer.classList.add('hidden');
        generatedKeysTitle.classList.add('hidden');
        keysList.innerHTML = '';
        copyAllBtn.classList.add('hidden');

        let progress = 0;
        const updateProgress = (increment, message) => {
            progress += increment;
            progressBar.style.width = `${progress}%`;
            progressText.innerText = `${progress}%`;
            progressLog.innerText = message;
        };

        const generateKeyProcess = async () => {
            const clientId = generateClientId();
            let clientToken;
            try {
                clientToken = await login(clientId, game.appToken);
            } catch {
                // در صورت خطا، بازگشت null
                return null;
            }

            for (let i = 0; i < game.attempts; i++) {
                const hasCode = await emulateProgress(clientToken, game.promoId);
                updateProgress((100 / game.attempts) / keyCount, `در حال شبیه‌سازی پیشرفت ${i + 1}/${game.attempts}...`);
                if (hasCode) {
                    break;
                }
                await sleep(game.timing);  // Sleep after each attempt to wait before the next event registration
            }

            try {
                const key = await generateKey(clientToken, game.promoId);
                updateProgress(100 / keyCount, 'در حال تولید کلید...');
                return key;
            } catch {
                // در صورت خطا، بازگشت null
                return null;
            }
        };

        const keys = await Promise.all(Array.from({ length: keyCount }, generateKeyProcess));

        if (keys.length > 1) {
            keysList.innerHTML = keys.map(key =>
                `<div class="key-item">
                    <input type="text" value="${key}" readonly>
                    <button class="copyKeyBtn" data-key="${key}">کپی کلید</button>
                </div>`
            ).join('');
            copyAllBtn.classList.remove('hidden');
        } else if (keys.length === 1) {
            keysList.innerHTML =
                `<div class="key-item">
                    <input type="text" value="${keys[0]}" readonly>
                    <button class="copyKeyBtn" data-key="${keys[0]}">کپی کلید</button>
                </div>`;
        }

        keyContainer.classList.remove('hidden');
        generatedKeysTitle.classList.remove('hidden');

        document.querySelectorAll('.copyKeyBtn').forEach(button => {
            button.addEventListener('click', (event) => {
                const key = event.target.getAttribute('data-key');
                copyToClipboard(key);
            });
        });

        copyAllBtn.addEventListener('click', () => {
            const keysText = keys.filter(key => key).join('\n');
            copyToClipboard(keysText);
        });

        updateProgress(100, 'تمام شد');
        startBtn.classList.remove('hidden');
        startBtn.disabled = false;
        document.querySelector('.grid-container').style.display = 'grid';
        
        // نمایش پیام با دو دکمه
        showAlertWithButtons();
    });

    const generateClientId = () => {
        const timestamp = Date.now();
        const randomNumbers = Array.from({ length: 19 }, () => Math.floor(Math.random() * 10)).join('');
        return `${timestamp}-${randomNumbers}`;
    };

    const login = async (clientId, appToken) => {
        const response = await fetch('https://api.gamepromo.io/promo/login-client', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                appToken,
                clientId,
                clientOrigin: 'deviceid'
            })
        });

        if (!response.ok) {
            throw new Error('ورود ناموفق');
        }

        const data = await response.json();
        return data.clientToken;
    };

    const emulateProgress = async (clientToken, promoId) => {
        const response = await fetch('https://api.gamepromo.io/promo/register-event', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${clientToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                promoId,
                eventId: generateUUID(),
                eventOrigin: 'undefined'
            })
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        return data.hasCode;
    };

    const generateKey = async (clientToken, promoId) => {
        const response = await fetch('https://api.gamepromo.io/promo/create-code', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${clientToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                promoId
            })
        });

        if (!response.ok) {
            throw new Error('تولید کلید ناموفق');
        }

        const data = await response.json();
        return data.promoCode;
    };

    const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const copyToClipboard = (text) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                copyStatus.classList.remove('hidden');
                setTimeout(() => copyStatus.classList.add('hidden'), 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }
    };

    const showAlert = (message) => {
        alert(message);
    };

    const showAlertWithButtons = () => {
        const alertContainer = document.createElement('div');
        alertContainer.style.position = 'fixed';
        alertContainer.style.top = '50%';
        alertContainer.style.left = '50%';
        alertContainer.style.transform = 'translate(-50%, -50%)';
        alertContainer.style.padding = '30px';
        alertContainer.style.backgroundColor = '#fff';
        alertContainer.style.borderRadius = '10px';
        alertContainer.style.border = '2px solid #007bff';
        alertContainer.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.2)';
        alertContainer.style.zIndex = '1000';
        alertContainer.style.textAlign = 'center';

        const message = document.createElement('p');
        message.innerText = 'برای حمایت از ما، لطفاً به کانال تلگرام ما بپیوندید!';
        message.style.fontSize = '18px';
        message.style.marginBottom = '20px';
        alertContainer.appendChild(message);

        const joinBtn = document.createElement('button');
        joinBtn.innerText = 'عضویت';
        joinBtn.style.padding = '10px 20px';
        joinBtn.style.fontSize = '16px';
        joinBtn.style.marginRight = '10px';
        joinBtn.style.backgroundColor = '#28a745';
        joinBtn.style.color = '#fff';
        joinBtn.style.border = 'none';
        joinBtn.style.borderRadius = '5px';
        joinBtn.style.cursor = 'pointer';
        joinBtn.addEventListener('click', () => {
            window.open('https://t.me/pyhon_dark', '_blank');
            document.body.removeChild(alertContainer);
        });
        joinBtn.addEventListener('mouseover', () => {
            joinBtn.style.backgroundColor = '#218838';
        });
        joinBtn.addEventListener('mouseout', () => {
            joinBtn.style.backgroundColor = '#28a745';
        });
        alertContainer.appendChild(joinBtn);

        const laterBtn = document.createElement('button');
        laterBtn.innerText = 'بعداً';
        laterBtn.style.padding = '10px 20px';
        laterBtn.style.fontSize = '16px';
        laterBtn.style.backgroundColor = '#6c757d';
        laterBtn.style.color = '#fff';
        laterBtn.style.border = 'none';
        laterBtn.style.borderRadius = '5px';
        laterBtn.style.cursor = 'pointer';
        laterBtn.addEventListener('click', () => {
            document.body.removeChild(alertContainer);
        });
        laterBtn.addEventListener('mouseover', () => {
            laterBtn.style.backgroundColor = '#5a6268';
        });
        laterBtn.addEventListener('mouseout', () => {
            laterBtn.style.backgroundColor = '#6c757d';
        });
        alertContainer.appendChild(laterBtn);

        document.body.appendChild(alertContainer);
    };

});
