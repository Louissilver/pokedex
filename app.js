const getPokemonUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}/`;

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
        <li class="card ${elementTypes[0]}">
        <img class="card-image" alt="${name}" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" />
            <h2 class="card-title">${id}. ${name}</h2>
            <p class="card-subtitle">${elementTypes.join(' | ')}</p>
        </li>
        `;
    return accumulator;
}, '');

//Função que insere os pokemón na página
const insertPokemonIntoPage = pokemons => {
    const ul = document.querySelector('[data-js="pokedex"]');
    ul.innerHTML = pokemons;
}

const pokemonPromises = generatePokemonPromises();

Promise.all(pokemonPromises)
    .then(generateHTML)
    .then(insertPokemonIntoPage);
