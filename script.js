// Verificar si hay usuario logueado antes de cargar datos
document.addEventListener("DOMContentLoaded", () => {
    const loggedUser = localStorage.getItem("loggedUser");
    if (!loggedUser) {
        window.location.href = "index.html";
        return; // Detener la ejecución
    }

    loadMovies();
    setupStarRating();
    loadWatchList();
});


function navigateTo(section) {
    document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
    document.getElementById(section).style.display = "block";
    window.location.hash = section;
}


function generateStars(score) {
    let stars = Math.round(parseFloat(score) / 2); // Redondeo adecuado
    return "★".repeat(stars) + "☆".repeat(5 - stars);
}


function loadMovies() {
    const loggedUser = localStorage.getItem("loggedUser");
    alert("Usuario logueado: " + loggedUser);

    if (!loggedUser) {
        alert("No se encontró un usuario logueado.");
        return;
    }

    let movieList = document.getElementById("movieList");
    movieList.innerHTML = "";

    let movies = JSON.parse(localStorage.getItem(`movies_${loggedUser}`)) || [];
    alert("Películas cargadas: " + JSON.stringify(movies));

    movies.forEach((movie, index) => {
        let li = document.createElement("li");
        li.classList.add("movie-card");
        li.dataset.index = index;

        li.innerHTML = `
            <strong class="movie-title">${movie.title.toUpperCase()}</strong>
            <p>🎯 Puntaje: ${movie.score}/10</p>
            <p>⭐ ${generateStars(movie.score)}</p>
            <p>"${movie.comment}"</p>
            <p>📅 Agregada el: ${movie.addedDate}</p>
            <button onclick="editMovie(this)">✏️ Editar</button>
            <button onclick="deleteMovie(this)">🗑️ Eliminar</button>
        `;

        movieList.appendChild(li);
    });
}

// Guardar película en la lista del usuario logueado


function addMovie() {
    alert("Función addMovie llamada");

    const loggedUser = localStorage.getItem("loggedUser");
    const titleInput = document.getElementById("movieTitleVistas");
    const scoreInput = document.getElementById("movieScore");
    const commentInput = document.getElementById("movieComment");

    let title = titleInput.value.trim();
    let score = parseFloat(scoreInput.value);
    let comment = commentInput.value.trim();

    alert("Datos ingresados: " + title + " " + score + " " + comment);

    // Limpiar errores previos
    errorMsg.style.display = "none";
    titleInput.classList.remove("error");
    scoreInput.classList.remove("error");
    commentInput.classList.remove("error");

    if (!title || isNaN(score) || score < 1 || score > 10 || !comment) {
        errorMsg.textContent = "Completa todos los campos correctamente.";
        errorMsg.style.display = "block";

        if (!title) titleInput.classList.add("error");
        if (isNaN(score) || score < 1 || score > 10) scoreInput.classList.add("error");
        if (!comment) commentInput.classList.add("error");

        return;
    }

    score = score.toFixed(1);

    const movie = {
        title: title,
        score: score,
        stars: generateStars(score),
        comment: comment,
        addedDate: new Date().toLocaleDateString()
    };

    let movies = JSON.parse(localStorage.getItem(`movies_${loggedUser}`)) || [];
    movies.push(movie);
    localStorage.setItem(`movies_${loggedUser}`, JSON.stringify(movies));

alert("llamando a load movies");

    loadMovies();

    // Limpiar los campos después de agregar la película
    titleInput.value = "";
    scoreInput.value = "";
    commentInput.value = "";

    alert("Película agregada correctamente");
}


function editMovie(button) {
    const movieCard = button.parentElement;
    const index = movieCard.dataset.index;
    const loggedUser = localStorage.getItem("loggedUser");

    let movies = JSON.parse(localStorage.getItem(`movies_${loggedUser}`)) || [];
    let movie = movies[index];

    // Crear inputs para la edición en línea con espacio para mostrar errores
    movieCard.innerHTML = `
        <input type="text" value="${movie.title}" class="edit-title">
        <input type="number" value="${movie.score}" step="0.1" min="1" max="10" class="edit-score">
        <span class="score-error" style="color: red; display: none;"></span>
        <textarea class="edit-comment">${movie.comment}</textarea>
        
        <button onclick="saveMovie(${index}, this)">Guardar</button>
        <button onclick="loadMovies()">Cancelar</button>
    `;
}

function saveMovie(index, button) {
    const loggedUser = localStorage.getItem("loggedUser");
    let movies = JSON.parse(localStorage.getItem(`movies_${loggedUser}`)) || [];
    const movieCard = button.parentElement;

    // Obtener los valores editados
    let newTitle = movieCard.querySelector(".edit-title").value.trim();
    let newScoreInput = movieCard.querySelector(".edit-score");
    let newScore = parseFloat(newScoreInput.value);
    let newComment = movieCard.querySelector(".edit-comment").value.trim();
    let errorMsg = movieCard.querySelector(".score-error");

    // Limpiar errores previos
    errorMsg.style.display = "none";
    newScoreInput.classList.remove("error");

    // Validar el puntaje
    if (isNaN(newScore) || newScore < 1 || newScore > 10) {
        errorMsg.textContent = "El puntaje debe estar entre 1.0 y 10.0.";
        errorMsg.style.display = "block";
        newScoreInput.classList.add("error");
        return;
    }

    // Redondear a un decimal para mantener consistencia
    newScore = newScore.toFixed(1);

    // Actualizar los datos
    movies[index].title = newTitle;
    movies[index].score = newScore;
    movies[index].stars = generateStars(newScore);
    movies[index].comment = newComment;

    localStorage.setItem(`movies_${loggedUser}`, JSON.stringify(movies));
    loadMovies();
}



function deleteMovie(button) {
    const movieCard = button.parentElement;
    const index = movieCard.dataset.index;
    const loggedUser = localStorage.getItem("loggedUser");

    let movies = JSON.parse(localStorage.getItem(`movies_${loggedUser}`)) || [];
    movies.splice(index, 1);

    localStorage.setItem(`movies_${loggedUser}`, JSON.stringify(movies));
    loadMovies();
}





// Configurar la calificación con estrellas
function setupStarRating() {
    let starsContainer = document.getElementById("starRating");
    if (!starsContainer) return;

    starsContainer.innerHTML = "";

    for (let i = 1; i <= 5; i++) {
        let star = document.createElement("span");
        star.innerHTML = "★";
        star.classList.add("star");
        star.dataset.value = i;

        star.addEventListener("click", () => {
            document.querySelectorAll("#starRating .star").forEach(s => s.classList.remove("active"));
            for (let j = 0; j < i; j++) {
                document.querySelectorAll("#starRating .star")[j].classList.add("active");
            }
        });

        starsContainer.appendChild(star);
    }
}


// Agregar película a la lista de "por ver"
function addToWatchList() {
    const titleInput = document.getElementById('movieTitleAgregar');
    const commentInput = document.getElementById('movieCommentAgregar');
    const title = titleInput.value.trim();
    const comment = commentInput.value.trim();
    const loggedUser = localStorage.getItem("loggedUser");

    if (!title || !comment) {
        alert("Ingrese un nombre y un comentario válido.");
        return;
    }

    let watchList = JSON.parse(localStorage.getItem(`watchList_${loggedUser}`)) || [];
    watchList.push({ title, comment });
    localStorage.setItem(`watchList_${loggedUser}`, JSON.stringify(watchList));

    loadWatchList();

    // Limpiar los campos después de agregar la película
    titleInput.value = '';
    commentInput.value = '';
}

function loadWatchList() {
    const loggedUser = localStorage.getItem("loggedUser");
    let watchList = JSON.parse(localStorage.getItem(`watchList_${loggedUser}`)) || [];
    const list = document.getElementById('watchList');
    list.innerHTML = '';

    watchList.forEach((movie, index) => {
        const item = document.createElement('li');
        item.classList.add('watch-card');
        item.dataset.index = index;

        item.innerHTML = `
            <p><strong>Película:</strong> ${movie.title}</p>
            <p><strong>Comentario:</strong> ${movie.comment}</p>
            <button onclick="editWatchListMovie(${index})">Editar</button>
            <button onclick="removeFromWatchList(${index})">Eliminar</button>
        `;

        list.appendChild(item);
    });
}

function removeFromWatchList(index) {
    const loggedUser = localStorage.getItem("loggedUser");
    let watchList = JSON.parse(localStorage.getItem(`watchList_${loggedUser}`)) || [];

    watchList.splice(index, 1); // Eliminar la película en el índice indicado
    localStorage.setItem(`watchList_${loggedUser}`, JSON.stringify(watchList));

    loadWatchList();
}

function editWatchListMovie(index) {
    const loggedUser = localStorage.getItem("loggedUser");
    let watchList = JSON.parse(localStorage.getItem(`watchList_${loggedUser}`)) || [];

    const newTitle = prompt("Editar título:", watchList[index].title);
    const newComment = prompt("Editar comentario:", watchList[index].comment);

    if (newTitle !== null && newComment !== null) {
        watchList[index].title = newTitle.trim();
        watchList[index].comment = newComment.trim();
        localStorage.setItem(`watchList_${loggedUser}`, JSON.stringify(watchList));
        loadWatchList();
    }
}



function searchMovie() {
    const query = document.getElementById("searchMovie").value.toLowerCase();
    const movies = document.querySelectorAll("#movieList li");

    movies.forEach(movie => {
        const title = movie.querySelector(".movie-title").textContent.toLowerCase();
        movie.style.display = title.includes(query) ? "block" : "none";
    });
}

// Verificar la ruta al cargar la página
window.addEventListener('hashchange', checkRoute);
window.addEventListener('load', () => {
    checkRoute();
    setupStarRating();
    loadWatchList();
    loadMovies();
});