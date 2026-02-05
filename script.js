document.addEventListener("DOMContentLoaded", () => {
    AOS.init();
    const musicControl = document.getElementById("music-control");
    const backgroundMusic = document.getElementById("background-music");
    const weddingDate = new Date('March 26, 2026 18:00:00').getTime();

    // 1. Музыка логикасы
    const toggleMusic = (play = true) => {
        if (play) {
            backgroundMusic.play();
            musicControl.classList.add("playing");
        } else {
            backgroundMusic.pause();
            musicControl.classList.remove("playing");
        }
    };

    document.body.addEventListener('click', () => toggleMusic(true), { once: true });
    musicControl.addEventListener("click", () => toggleMusic(backgroundMusic.paused));

    // 2. Таймер логикасы
    setInterval(() => {
        const distance = weddingDate - new Date().getTime();
        if (distance < 0) return;

        const timeParts = {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
        };

        Object.keys(timeParts).forEach(key => {
            document.getElementById(key).innerText = timeParts[key];
        });
    }, 1000);
});

// 3. RSVP жіберу
async function sendRSVP(answer) {
    const name = document.getElementById('guestName').value.trim();
    const btns = [document.getElementById('btn-yes'), document.getElementById('btn-no')];

    if (!name) return alert('Есіміңізді енгізіңіз');

    // Түймелерді бұғаттау
    btns.forEach(b => b.disabled = true);
    setTimeout(() => btns.forEach(b => b.disabled = false), 7000);

    try {
        await fetch('https://script.google.com/macros/s/AKfycbxmYSFFW6mxtM3A22ssfW7iD1_mUuQKsRli47ZU-H34LAeU80EvSiy-djP7jFZZppfF/exec', {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ name, attendance: answer })
        });

        if (answer === 'Ия') {
            generateInvitation(name);
        } else {
            alert('Сіздің тойға келмейтіндігіңіз үшін өкініш білдіреміз.');
        }
    } catch (e) {
        alert('Қате шықты');
    }
}

// 4. Шақырту генерациясы
function generateInvitation(name) {
    const container = document.createElement('div');
    Object.assign(container.style, {
        width: '600px', height: '900px',
        backgroundImage: 'url("photo/invent.png")',
        backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
        color: '#333', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        padding: '80px', boxSizing: 'border-box', border: '10px double #3d6129',
        fontFamily: "'Times New Roman', serif", position: 'absolute', left: '-9999px'
    });

    container.innerHTML = `
        <h1 style="font-size: 30px; margin: 0; font-weight: bold; color: #213813;">Мағжан & Аяжан</h1>
        <div style="width: 100px; height: 3px; background: #6b8e23; margin: 10px 0 30px;"></div>
        <p style="font-size: 22px; line-height: 1.6; max-width: 330px; margin-bottom: 20px;">
            Құрметті <b>${name}</b>, <br>Сізді Мағжан мен Аяжанның үйлену тойына арналған салтанатты дастарханымыздың қадірлі қонағы болуларыңызға шақырамыз.
        </p>
        <p style="font-size: 22px; font-weight: bold; color: #213813; margin: 0;">Той уақыты: 26 наурыз 2026</p>
        <div style="font-size: 20px; font-weight: bold; color: #213813; margin-top: 5px;">
            БЕТАШАР: 17:00 <span style="margin: 0 10px;">|</span> ТОЙ: 18:00
        </div>
        <div style="font-size: 24px; margin-top: 20px; color: #213813;">
            <p style="margin: 0;"><strong>Той иелері:</strong> Марат & Айнагүл</p>
            <p style="margin: 5px 0;"><strong>Өтетін орны:</strong> Тараз қаласы, <br> Ресторан "Хан сарай"</p>
        </div>`;

    document.body.appendChild(container);

    html2canvas(container, { useCORS: true, scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        document.getElementById('invitation-image').src = imgData;
        document.getElementById('invitation-container').style.display = 'block';
        document.getElementById('download-link').href = imgData;
        document.body.removeChild(container);
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
}