document.getElementById("name").value = '';
document.getElementById("email").value = '';
document.getElementById("message").value = '';

//------------------------------------HEADER RESPONSIVE------------------------------------------
const toggleBtn = document.getElementsByClassName('toggle-button')[0];
const navlinks = document.getElementsByClassName('navlinks')[0];

toggleBtn.addEventListener('click', () => {
    navlinks.classList.toggle('active');
})