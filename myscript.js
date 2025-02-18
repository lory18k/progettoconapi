let requestURL = "https://www.themealdb.com/api/json/v1/1/categories.php";
fetch(requestURL)
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    let cat = json;
    if (!cat.categories) {
      console.error('Nessuna categoria trovata!');
      return;
    }
 
    let cont = document.querySelector(".container");
    if (!cont) {
      console.error('Elemento container non trovato!');
      return;
    }

    for (let i = 0; i < cat.categories.length; i++) {
      let catName = cat.categories[i].strCategory;
 
      let newDiv = document.createElement("div");
      let p = document.createElement("p");
      p.textContent = catName; 
      newDiv.appendChild(p);
 
      let img = document.createElement("img");
      img.src = cat.categories[i].strCategoryThumb;
      newDiv.appendChild(img);
      newDiv.addEventListener("click", function() {
        filtraCategoria(catName);
      });
      cont.appendChild(newDiv);
    }
  })
  .catch(function(err) {
    console.error('Errore nel recupero delle categorie:', err);
  });

function filtraCategoria(nomeCategoria) {
  let requestURL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${nomeCategoria}`;

  fetch(requestURL)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      let resultContainer = document.querySelector(".result-container");
      resultContainer.innerHTML = "";
      let categories = document.querySelectorAll(".container div");
      categories.forEach(function(cat) {
        cat.style.display = "none";
      });
  
      if (data.meals) {
        data.meals.forEach(function(meal) {
          let newDiv = document.createElement("div");

          let p = document.createElement("p");
          p.textContent = meal.strMeal;
          newDiv.appendChild(p);

          let img = document.createElement("img");
          img.src = meal.strMealThumb;
          newDiv.appendChild(img);

          newDiv.addEventListener("click", function() {
            mostraDettagliPasto(meal.idMeal);
          });

          resultContainer.appendChild(newDiv);
        });
      } else {
        resultContainer.innerHTML = "<p>Nessun pasto trovato in questa categoria.</p>";
      }
    })
    .catch(function(error) {
      console.error("Errore nel recupero dei pasti per categoria:", error);
    });
}

function mostraDettagliPasto(idPasto) {
  let requestURL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idPasto}`;

  fetch(requestURL)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.meals) {
        let meal = data.meals[0];
        document.getElementById("modalTitle").textContent = meal.strMeal;
        document.getElementById("modalInstructions").textContent = meal.strInstructions;
        document.getElementById("myModal").style.display = "block";
      }
    })
    .catch(function(error) {
      console.error("Errore nel recupero dei dettagli del pasto:", error);
    });
}

async function ricerca() {
  let nomePasto = document.getElementById("ricerca").value;
  let requestURL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${nomePasto}`;
 
  try {
    let response = await fetch(requestURL);
    let data = await response.json();
 
    let resultContainer = document.querySelector(".result-container");

    let categories = document.querySelectorAll(".container div");
    categories.forEach(function(cat) {
      cat.style.display = "none";
    });

    resultContainer.innerHTML = "";

    if (data.meals) {
      let meal = data.meals[0];
      let resultDiv = document.createElement("div");

      let img = document.createElement("img");
      img.src = meal.strMealThumb;
      img.alt = meal.strMeal;
      img.style.maxWidth = '200px';
      resultDiv.appendChild(img);

      let p = document.createElement("p");
      p.textContent = meal.strMeal;
      resultDiv.appendChild(p);

      resultContainer.appendChild(resultDiv);
      resultDiv.addEventListener('click', function() {
        document.getElementById("modalTitle").textContent = meal.strMeal;
        document.getElementById("modalInstructions").textContent = meal.strInstructions;
        document.getElementById("myModal").style.display = "block";
        newDiv.display = "none";
        document.getElementById("ricerca").value = "";
      });
    } else {
      resultContainer.innerHTML = "<p>Pasto non trovato</p>";
    }
  } catch (error) {
    console.error("Errore nella richiesta:", error);
  }
}

function chiudiModal() {
  document.getElementById("myModal").style.display = "none";
}

async function filtraPerIngrediente() {
  let ingrediente = document.getElementById("ricerca").value;
  let requestURL = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediente}`;

  try {
    let response = await fetch(requestURL);
    let data = await response.json();

    if (data.meals) {
      let cont = document.querySelector(".container");
      cont.innerHTML = "";

      data.meals.forEach(meal => {
        let newDiv = document.createElement("div");

        let p = document.createElement("p");
        p.textContent = meal.strMeal;
        newDiv.appendChild(p);

        let img = document.createElement("img");
        img.src = meal.strMealThumb;
        newDiv.appendChild(img);

        cont.appendChild(newDiv);
      });
    } else {
      alert("Nessun pasto trovato con questo ingrediente.");
    }
  } catch (error) {
    console.error("Errore nel filtraggio per ingrediente:", error);
  }
}

async function pastoCasuale() {
  let requestURL = "https://www.themealdb.com/api/json/v1/1/random.php";

  try {
    let response = await fetch(requestURL);
    let data = await response.json();

    if (data.meals) {
      let meal = data.meals[0];

      let resultContainer = document.querySelector(".result-container");
      resultContainer.innerHTML = "";

      let categories = document.querySelectorAll(".container div");
      categories.forEach((cat) => {
        cat.style.display = "none";
      });

      let newDiv = document.createElement("div");

      let p = document.createElement("p");
      p.textContent = meal.strMeal;
      newDiv.appendChild(p);

      let img = document.createElement("img");
      img.src = meal.strMealThumb;
      img.alt = meal.strMeal;
      img.style.maxWidth = "200px";
      newDiv.appendChild(img);

      newDiv.addEventListener("click", function () {
        document.getElementById("modalTitle").textContent = meal.strMeal;
        document.getElementById("modalInstructions").textContent = meal.strInstructions;
        document.getElementById("myModal").style.display = "block";
      });

      resultContainer.appendChild(newDiv);
    }
  } catch (error) {
    console.error("Errore nel caricamento del pasto casuale:", error);
  }
}

async function filtraPerArea(area) {
  let requestURL = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;

  try {
    let response = await fetch(requestURL);
    let data = await response.json();

    if (data.meals) {
      let cont = document.querySelector(".result-container");
      cont.innerHTML = "";

      data.meals.forEach(meal => {
        let newDiv = document.createElement("div");
        newDiv.classList.add("meal-card");

        let title = document.createElement("h3");
        title.textContent = meal.strMeal;
        newDiv.appendChild(title);

        let img = document.createElement("img");
        img.src = meal.strMealThumb;
        img.alt = meal.strMeal;
        newDiv.appendChild(img);

        cont.appendChild(newDiv);
      });
    } else {
      alert("Nessun pasto trovato per questa area.");
    }
  } catch (error) {
    console.error("Errore nel filtraggio per area:", error);
  }
}

function ricaricaCategorie() {
  let categories = document.querySelectorAll(".container div");
  categories.forEach(function(cat) {
    cat.style.display = "block";
  });
  document.querySelector(".result-container").innerHTML = "";
  document.getElementById("ricerca").value = "";
}
