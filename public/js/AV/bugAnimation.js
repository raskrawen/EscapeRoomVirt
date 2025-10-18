export function animateBug() {
  // Remove any existing bug
  const oldBug = document.getElementById('bug');
  if (oldBug) oldBug.remove();

  // Create the bug image
  const bug = document.createElement('img');
  bug.id = 'bug';
  bug.src = 'images/bug.gif'; //relative to html file.
  bug.style.position = 'fixed';
  bug.style.top = '0px';
  bug.style.left = '0px';
  bug.style.width = '40px';
  bug.style.zIndex = 1000;
  bug.style.pointerEvents = 'none';
  document.body.appendChild(bug);

  let x = 0, y = 0;
  const maxX = window.innerWidth - 40;
  const maxY = window.innerHeight - 40;
  const interval = setInterval(() => {
    // Mostly linear, with a little randomness
    x += 2 + Math.random() * 2 - 1;
    y += 1 + Math.random() * 2 - 1;
    bug.style.left = x + 'px';
    bug.style.top = y + 'px';
    if (x > maxX || y > maxY) {
      clearInterval(interval);
      bug.remove();
    }
  }, 16); // ~60fps
}