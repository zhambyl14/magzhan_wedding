document.addEventListener("DOMContentLoaded", () => {
    AOS.init();
    const musicControl = document.getElementById("music-control");
    const backgroundMusic = document.getElementById("background-music");
    const weddingDate = new Date('March 26, 2026 18:00:00').getTime();

    // --- 1. АВТОМАТТЫ СКРОЛЛ (STORYTELLING) АЛЫП ТАСТАЛДЫ ---
    // Сайт енді ашылғанда ең басында тұрады.

    // --- 2. МУЗЫКА ЛОГИКАСЫ ---
    const forcePlay = () => {
        backgroundMusic.play().then(() => {
            musicControl.classList.add("playing");
        }).catch(error => {
            console.log("Автоматты ойнатуды браузер күтуде...");
        });
    };

    const playOnInteraction = () => {
        if (backgroundMusic.paused && !musicControl.classList.contains('manual-paused')) {
            forcePlay();
        }
    };

    window.addEventListener('scroll', playOnInteraction, { once: true });
    window.addEventListener('click', playOnInteraction, { once: true });
    window.addEventListener('touchstart', playOnInteraction, { once: true });

    musicControl.addEventListener("click", (e) => {
        e.stopPropagation();
        if (backgroundMusic.paused) {
            musicControl.classList.remove('manual-paused');
            forcePlay();
        } else {
            musicControl.classList.add('manual-paused');
            backgroundMusic.pause();
            musicControl.classList.remove("playing");
        }
    });

    // --- 3. ТАЙМЕР ЛОГИКАСЫ ---
    setInterval(() => {
        const distance = weddingDate - new Date().getTime();
        if (distance < 0) return;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
    }, 1000);
});

// --- 4. RSVP ЖІБЕРУ ---
async function sendRSVP(answer) {
    const nameInput = document.getElementById('guestName');
    const name = nameInput.value.trim();
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');

    if (!name) {
        alert('Есіміңізді енгізіңіз');
        return;
    }

    if(btnYes) btnYes.disabled = true;
    if(btnNo) btnNo.disabled = true;

    try {
        await fetch('https://script.google.com/macros/s/AKfycbxmYSFFW6mxtM3A22ssfW7iD1_mUuQKsRli47ZU-H34LAeU80EvSiy-djP7jFZZppfF/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, attendance: answer })
        });

        if (answer === 'Ия') {
            alert('Рахмет! Қазір сізге 10 секунд ішінде арнайы шақырту қағазы жасалады...');
            generateInvitation(name);
        } else {
            alert('Сіздің тойға келмейтіндігіңіз үшін өкініш білдіреміз.');
        }
    } catch (e) {
        alert('Жіберу кезінде қате шықты.');
    } finally {
        setTimeout(() => {
            if(btnYes) btnYes.disabled = false;
            if(btnNo) btnNo.disabled = false;
        }, 7000);
    }
}

// --- 5. ШАҚЫРТУ ГЕНЕРАЦИЯСЫ ЖӘНЕ СКРОЛЛ ---
function generateInvitation(name) {
    const container = document.createElement('div');
    
    Object.assign(container.style, {
        width: '600px',
        height: '900px',
        backgroundImage: 'url("photo/invent.png")',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        color: '#213813',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '60px',
        boxSizing: 'border-box',
        fontFamily: "'Times New Roman', serif",
        position: 'fixed',
        left: '-9999px',
        top: '0'
    });

    container.innerHTML = `
        <div style="margin-top: 50px;">
            <h1 style="font-size: 36px; font-weight: bold; margin-bottom: 10px;">Мағжан & Аяжан</h1>
            <div style="width: 150px; height: 2px; background: #0b1a0d; margin: 10px auto 30px;"></div>
            <p style="font-size: 24px; line-height: 1.4; padding: 0 40px; margin-bottom: 30px;">
                Құрметті <b>${name}</b>, <br>
                Сізді Мағжан мен Аяжанның үйлену тойына арналған салтанатты дастарханымыздың қадірлі қонағы болуларыңызға шақырамыз.
            </p>
            <div style="font-size: 22px; font-weight: bold; margin-bottom: 10px;">
                26 НАУРЫЗ 2026
            </div>
            <div style="font-size: 22   px; font-weight: bold;">
                БЕТАШАР: 17:00 | ТОЙ: 18:00
            </div>
            <div style="margin-top: 40px; font-size: 22px;">
                <p><strong>Той иелері:</strong> Марат & Айнагүл</p>
                <p><strong>Мекен-жайы:</strong> Тараз қ., <br> "Хан сарай" рестораны</p>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    html2canvas(container, {
        useCORS: true,
        scale: 2,
        backgroundColor: null
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        const invitationImg = document.getElementById('invitation-image');
        const downloadLink = document.getElementById('download-link');
        const invContainer = document.getElementById('invitation-container');

        if (invitationImg) invitationImg.src = imgData;
        if (downloadLink) downloadLink.href = imgData;
        if (invContainer) {
            invContainer.style.display = 'block';
            
            // Тек шақырту дайын болғанда ғана төменге скролл жасайды
            setTimeout(() => {
                invContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 600);
        }

        document.body.removeChild(container);
    }).catch(err => {
        alert("Шақырту суретін жасау кезінде техникалық қате шықты.");
        console.error(err);
    });
}