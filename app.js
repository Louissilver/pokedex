const getPokemonUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}/`;
const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';
const ul = document.querySelector('[data-js="pokedex"]');

const generatePokemonPromises = () => Array(150).fill().map((_, index) => 
    fetch(getPokemonUrl(index+1))
    .then(response => response.json())
);

    //Função que gera o HTML onde estarão os pokemón
const generateHTML = pokemons => pokemons.reduce((accumulator, { name, id, types }) => {
    const elementTypes = types.map(typeInfo => typeInfo.type.name);

    //URL da imagem em alta resolução
    //https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png
    //URL da imagem original em pixels
    //https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png

    accumulator += `
        <li class="card ${elementTypes[0]}" onclick="selectPokemon(${id})">
        <img class="card-image" alt="${name}" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" />
            <h2 class="card-title">${id}. ${name}</h2>
            <p class="card-subtitle">${elementTypes.join(' | ')}</p>
        </li>
        `;
    return accumulator;
}, '');

//Função que insere os pokemón na página
const insertPokemonIntoPage = pokemons => {
ul.innerHTML = pokemons;
}

const pokemonPromises = generatePokemonPromises();

Promise.all(pokemonPromises)
    .then(generateHTML)
    .then(insertPokemonIntoPage);

const selectPokemon = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    const res = await fetch(url);
    const poke = await res.json();
    displayPopup(poke);
}

const displayPopup = (poke) => {
    console.log(poke);
    const type = poke.types.map( type => type.type.name).join('/');
    const move = poke.moves.map( move => '[' + move.move.name + ']').join(' --- ');
    const htmlString = `
    <div class="popup">
        <button id="closeBtn" onclick="closePopup()">Fechar</button>
        <div class="card">
            <img class="card-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png"/>
            <h2 class="card-title">${poke.id}. ${poke.name}</h2>
            <p>
            <small>Height: </small>${(poke.height/7).toFixed(2)} m |
            <small>Weight: </small>${poke.weight/10} kg |
            <small>Type: </small>${type}
            <br><br>
            <small>Skills: </small>${move}
            </p>
        </div>
    </div>
    `
    ul.innerHTML = htmlString + ul.innerHTML;
    console.log(htmlString);
}

const closePopup = () => {
    const popup = document.querySelector('.popup');
    popup.parentElement.removeChild(popup);
}
