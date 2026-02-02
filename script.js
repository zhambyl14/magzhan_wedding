document.addEventListener("DOMContentLoaded", function () {
  var musicControl = document.getElementById("music-control");
  var backgroundMusic = document.getElementById("background-music");
  var musicTooltip = document.getElementById("music-tooltip");

  // Show the music tooltip initially
  musicTooltip.style.display = 'block';

  // Try to autoplay music
  backgroundMusic.play().then(() => {
    musicControl.classList.add("playing"); // музыка ойнап тұрғанда GIF
  }).catch((error) => {
    console.log("Autoplay was prevented:", error);
    document.body.addEventListener('click', function () {
      backgroundMusic.play();
      musicControl.classList.add("playing");
    }, { once: true });
  });

  // Click event for music button
  musicControl.addEventListener("click", function () {
    if (backgroundMusic.paused) {
      backgroundMusic.play();
      musicControl.classList.add("playing"); // музыка ойнап тұр
    } else {
      backgroundMusic.pause();
      musicControl.classList.remove("playing"); // музыка паузада
    }
  });

  // AOS
  AOS.init();

  // Countdown
  const weddingDate = new Date('March 26, 2026 19:00:00').getTime();
  const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('countdown').innerHTML = `${days} Күн ${hours} сағат ${minutes} минут ${seconds} секунд қалды`;

    if (distance < 0) {
      clearInterval(countdownInterval);
      document.getElementById('countdown').innerHTML = 'Той басталып кетті!';
    }
  }, 1000);

  // RSVP функциясы
  function submitRSVP(isAttending) {
    const name = document.getElementById('name').value;
    if (name === '') {
      alert('Сізді асыға күтеміз!');
      return;
    }
    const attendance = isAttending ? 'Я' : 'Жоқ';
    saveRSVPToFirestore(name, attendance);
  }
});
