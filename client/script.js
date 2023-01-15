//Vi behöver börja bygga upp en scriptfil där vi har eventlistnare till form, och sätt att läsa av om fält är ifyllda.
//Kanske någon flik som gör att man kan välja mellan att se formuläret och varorna som finns.
 

//GÖR DESSA SIST!
//Eventlyssnare för validering av fälten i formulär

//Validering för namn
formLaggaInVaror.formArticleName.addEventListener('input', (e) => validateName(e.target));
formLaggaInVaror.formArticleName.addEventListener('blur', (e) => validateName(e.target));

const varningsParagrafNamn = document.getElementById('varningsParagrafNamn')
const varningsParagrafPris = document.getElementById('varningsParagrafPris')

//Validering för pris
formLaggaInVaror.formPrice.addEventListener('input', (e) => validatePris(e.target));
formLaggaInVaror.formPrice.addEventListener('blur', (e) => validatePris(e.target));

//Validering för producent
formLaggaInVaror.formProducer.addEventListener('input', (e) => validateField(e.target));
formLaggaInVaror.formProducer.addEventListener('blur', (e) => validateField(e.target));

//Validering för bildlänk
formLaggaInVaror.formImageLink.addEventListener('blur', (e) => validateField(e.target));
formLaggaInVaror.formImageLink.addEventListener('blur', (e) => validateField(e.target));

//Eventlyssnare till submitknappen på formuläret
formLaggaInVaror.addEventListener('submit', pressedSubmit);


const elementAfVaruLista = document.getElementById('varuLista');
const inlagdVaraRuta = document.getElementById('inlagdVaraRuta');
const inlagdVaraHeader = document.getElementById('inlagdVaraHeader');

const formContainer = document.getElementById('formContainer');

const div1 = document.getElementById('clickableDiv1');
const div2 = document.getElementById('clickableDiv2');

div1.addEventListener('click', clickedDiv1);
div2.addEventListener('click', clickedDiv2);

function clickedDiv1 (){
    //Visa rätt sektioner
    formContainer.classList.add('visible')
    formContainer.classList.remove('hidden')
    elementAfVaruLista.classList.add('hidden')
    
    //Utseende för flikar
    div1.classList.add("bg-slate-200");
    div1.classList.remove("bg-zinc-400");
    div2.classList.add("bg-zinc-400");
    div2.classList.remove("bg-slate-200");

     //Rätt hovereffekter
    div1.classList.remove("hover:bg-slate-600");
    div2.classList.add("hover:bg-slate-600");
}
function clickedDiv2 (){
    //Visa rätt sektioner
    inlagdVaraRuta.classList.add('hidden');
    formContainer.classList.add('hidden')
    elementAfVaruLista.classList.remove('hidden')
    inlagdVaraRuta.classList.remove('visible');
    inlagdVaraRuta.classList.add('hidden');
    
    //Rätt hovereffekter
    div1.classList.add("hover:bg-slate-600");
    div2.classList.remove("hover:bg-slate-600");

    //Utseende för flikar
    div1.classList.remove("bg-slate-200");
    div1.classList.add("bg-zinc-400");
    div2.classList.remove("bg-zinc-400");
    div2.classList.add("bg-slate-200");

    showGoodsInventory()
}


let formArticleNameValid = true;
let formPriceValid = true;
let formProducerValid = true;
let formImageLinkValid = true;



const api = new Api('http://localhost:5100');

//HÄR SKAPAR VI ALLA VALIDERINGSFUNKTIONER!!

function validateName(field){
    const namn = field;
    if (namn.value.length < 3){        
        varningsParagrafNamn.classList.add('visible')
        varningsParagrafNamn.classList.remove('hidden')
    }
    if (namn.value.length > 2){        
        varningsParagrafNamn.classList.add('hidden')
        varningsParagrafNamn.classList.remove('visible')
    }
    if (namn.value.length > 50){        
        varningsParagrafNamn.classList.add('visible')
        varningsParagrafNamn.classList.remove('hidden')
    }
}
function validatePris(field){
    const pris = field;
    const parsePris = pris.value;
    const maxDecimaler = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2, minimumSignificantDigits: 3 }).format(parsePris);
    console.log(maxDecimaler)
    /*pris.value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
    });*/
    console.log();
    //console.log(parsePris)
    if (maxDecimaler.length < 3){        
        varningsParagrafPris.classList.add('visible')
        varningsParagrafPris.classList.remove('hidden')
        varningsParagrafPris.innerHTML = 'För få siffror eller för många decimaler'
    }
    if (pris.value.length > 2){        
        varningsParagrafPris.classList.add('hidden')
        varningsParagrafPris.classList.remove('visible')
    }
}

/*
varningsParagrafPris
*/

//Funktion för att spara fomuläret
function pressedSubmit(e) {
    //Gör så att sidan inte laddas om när man trycker på submitknappen.
    e.preventDefault();

    //LÄGG IN SAMTLIGA VALIDERINGSFUNKTIONER HÄR!!!!!!

    saveGoods();
    console.log('nu körs saveGoods')
}

function saveGoods() {
    //Denna konverterar input i formuläret till rätt JSONformat för att kunna skickas och
    //packas upp på rätt sätt i backend.
    //preventDefault();
    const goods ={
        namn: formLaggaInVaror.formArticleName.value,
        pris: formLaggaInVaror.formPrice.value,
        Tillverkare: formLaggaInVaror.formProducer.value,
        Bild: formLaggaInVaror.formImageLink.value
    };
    //Denna använder apiets createmetod
    api.create(goods).then((goods) => {
    inlagdVaraRuta.classList.add('visible');
    inlagdVaraRuta.classList.remove('hidden');
    inlagdVaraRuta.innerHTML = '';
    inlagdVaraRuta.insertAdjacentHTML('beforeend', showAddedGoods(goods));
    formLaggaInVaror.formArticleName.value = '';
    formLaggaInVaror.formPrice.value = '';
    formLaggaInVaror.formProducer.value = '';
    formLaggaInVaror.formImageLink.value = '';
    inlagdVaraHeader.classList.remove('hidden');
    inlagdVaraHeader.classList.add('visible');

    });
    
}
//Funktion som visar alla varor.
function showGoodsInventory() {

    api.getAll().then((goods) => {

        elementAfVaruLista.innerHTML = '';
        goods.forEach((goods) => { 

            elementAfVaruLista.insertAdjacentHTML('beforeend', showGoods(goods));
            inlagdVaraHeader.classList.remove('visible');
            inlagdVaraHeader.classList.add('hidden');

        });
    });
}
function showAddedGoods({id, namn, pris, Tillverkare, Bild}){
    let html =`<li id="elementAfVaruLista${id}" class="list-none h-fit">`; 
    html += `<h3>Namn: ${namn} pris: ${pris}kr Tillverkare: ${Tillverkare}</h3>`;
    html += `<p>Bild:  </p>`
    html += `<img src="${Bild}" class="h-2">`  
    
    html += `</li>`;

    return html;
  
}

function showGoods({id, namn, pris, Tillverkare, Bild}){
    let html =`<li id="elementAfVaruLista${id}" class="list-none">`; 
    html += `<h3>Namn: ${namn} pris: ${pris}kr Tillverkare: ${Tillverkare}</h3>`;
    html += `<p>Bild:  </p>`
    html += `<img src="https://upload.wikimedia.org/wikipedia/commons/7/7f/Generic_football.png">`
    html += `<button onclick="deleteVara(${id})" class="inline-block bg-amber-500 text-xs text-amber-900 border border-white px-3 py-1 rounded-md ml-2">Ta bort</button>`    
    
    html += `</li>`;

    return html;
  
}

function deleteVara(id) {
    api.remove(id).then(() => {
        showGoodsInventory()
    });
}
