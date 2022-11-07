const api = axios.create({
    baseURL: 'https://api.thedogapi.com/v1'
});
api.defaults.headers.common['X-API-KEY'] = 'live_OtXDt3ltSNKkQQnHsfblAaNCTrAu8TlJpBwZR3VzTddA44NBoQMT6tBk8HjrqLKF';

const API_RANDOM = 'https://api.thedogapi.com/v1/images/search?limit=5'
const API_FAVOURITES = 'https://api.thedogapi.com/v1/favourites?'
const API_UPLOAD = 'https://api.thedogapi.com/v1/images/upload'
const API_DELETE = (id) => `https://api.thedogapi.com/v1/images/${id}`
const API_FAVOURITES_DELETE = (id) => `https://api.thedogapi.com/v1/favourites/${id}?`
const apiKey = 'live_OtXDt3ltSNKkQQnHsfblAaNCTrAu8TlJpBwZR3VzTddA44NBoQMT6tBk8HjrqLKF'

const spanError = document.getElementById('error')

// fetch(URL)
//         .then(res => res.json())
//         .then(data => {
//             const img = document.querySelector('img')
//             img.src = data[0].url;
//     })
//     .catch(err => {
//         console.log(err)
//     });

async function loadRandomDogs() {
    const res = await fetch(API_RANDOM)
    const data = await res.json();

    console.log('Random')
    console.log(data)

    if(res.status !== 200){
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    }else {
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const img3 = document.getElementById('img3');
        const img4 = document.getElementById('img4');
        const img5 = document.getElementById('img5');
        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');
        const btn3 = document.getElementById('btn3');
        const btn4 = document.getElementById('btn4');
        const btn5 = document.getElementById('btn5');

        img1.src = data[0].url;
        img2.src = data[1].url;
        img3.src = data[2].url;
        img4.src = data[3].url;
        img5.src = data[4].url;

        btn1.onclick = () => saveFavouriteDog(data[0].id);
        btn2.onclick = () => saveFavouriteDog(data[1].id);
        btn3.onclick = () => saveFavouriteDog(data[2].id);
        btn4.onclick = () => saveFavouriteDog(data[3].id);
        btn5.onclick = () => saveFavouriteDog(data[4].id);
    }
}

async function loadFavouriteDogs() {
    const res = await fetch(API_FAVOURITES, {
        method: 'GET',
        headers: { 'X-API-KEY': apiKey },
    });
    const data = await res.json();

    console.log('Favoritos')
    console.log(data)

    if(res.status !== 200){
        spanError.innerHTML = `Hubo un error: ${res.status} ${data.message}`;
    }else{
        const section = document.getElementById('favoriteDogs');
        section.innerHTML = "";

        const h2 = document.createElement("h2");
        const h2Text = document.createTextNode('Dogs favoritos');
        h2.appendChild(h2Text);
        section.appendChild(h2);

        data.forEach(dog => {
            const article = document.createElement('article');
            const div = document.createElement('div');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Sacar al Dog de favoritos');

            img.src = dog.image.url;
            btn.appendChild(btnText);
            btn.onclick = () => deleteFavouriteDog(dog.id);
            div.appendChild(img);
            div.appendChild(btn)
            article.appendChild(div);
            section.appendChild(article);
        });
    }
}

async function saveFavouriteDog(id) {
    const res = await api.post('/favourites', {
        image_id: id,
    });
    // const res = await fetch(API_FAVOURITES, {
    //     method: 'POST',
    //     headers: { 
    //         'Content-Type': 'application/json', 
    //         'X-API-KEY': apiKey
    // },
    //     body: JSON.stringify({ image_id: id }),
    // });
    // const data = await res.json();
    
    // console.log('Save')
    // console.log(res)

    if(res.status !== 200){
        spanError.innerHTML = `Hubo un error: ${res.status} ${data.message}`;
    }else{
        console.log('Dog guardado de favoritos')
        loadFavouriteDogs()
    }
}

async function deleteFavouriteDog(id){
    const res = await fetch(API_FAVOURITES_DELETE(id), {
        method: 'DELETE',
        headers: { 'X-API-KEY': apiKey },
    });
    const data = await res.json();

    if(res.status !== 200){
        spanError.innerHTML = `Hubo un error: ${res.status} ${data.message}`;
    }else{
        console.log('Dog eliminado de favoritos')
        loadFavouriteDogs()
    }
}

async function uploadDogPhoto(){
    const form = document.getElementById('uploadingForm')
    const formData = new FormData(form)

    console.log(formData.get('file'))

    const res = await fetch(API_UPLOAD, {
        method: 'POST',
        headers: { 
            // 'Content-Type': 'multipart/form-data', 
            'X-API-KEY': apiKey ,
        },
        body: formData
    })
    const data = await res.json();

    if(res.status !== 201){
        spanError.innerHTML = `Hubo un error: ${res.status} ${data.message}`;
        console.log({ data })
    }else{
        console.log('Foto de Dog subida :D')
        console.log({ data });
        console.log(data.url);
        saveFavouriteDog(data.id)
        loadFavouriteDogs()
    }
}


loadRandomDogs();
loadFavouriteDogs();
