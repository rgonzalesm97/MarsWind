//BOTON BUSCAR  
let roverToSearch = null;
const buscarBtn = document.getElementById("search");
const shadow_images = document.getElementById("shadow_images");

function Buscar(){
    if(roverToSearch){
        document.getElementById("roverimages").innerHTML = `<h1 style="color: white; margin-top: 20%; text-align: center;">Loading...</h1>`;
        GetRoverData(roverToSearch, "RellenarDatos")
        LoadImages(roverToSearch, sliderValue.textContent)
        if(!shadow_images.classList.contains("hideshadow")) shadow_images.classList.add("hideshadow");
    }else{
        alert("Select a rover");
    } 
}


//ROVER BUTTONS
const shadow_slider = document.getElementById("shadow_slider");
const roverBtns = document.getElementsByClassName('roverbtn');

function ChangeColor(btn){
    for(let roverbtn of roverBtns){
        if(roverbtn === btn){
            roverbtn.classList.remove("actuall-btn");
            roverbtn.classList.add("btn-active");
            roverToSearch = btn.textContent.toLowerCase();
            GetRoverData(roverToSearch, "CrearSlider");
            shadow_slider.classList.add("hideshadow");
        }else{
            roverbtn.classList.remove("btn-active");
            roverbtn.classList.add("actuall-btn");
        }
    }
}

//SOL SLIDER
const sliderValue = document.getElementById("sol-number");
const divSlider = document.getElementById("scroll-sol");
const questionMark = document.getElementById("questionmark");
const textoAyuda = document.getElementById("textoayuda");



questionMark.addEventListener("mouseenter", () => textoAyuda.classList.add("show"));
questionMark.addEventListener("mouseleave", () => textoAyuda.classList.remove("show"));

function CreateSlider(roverData){
    const maxSols = roverData.photo_manifest.max_sol;
    divSlider.innerHTML = `
    <input type="range" min="0" max="${maxSols}" value="${maxSols}" id="sol-slider" style="opacity: 0; animation: appear 1s forwards;">
    `;

    sliderValue.textContent = maxSols;

    const inputSlider = divSlider.querySelector("input");

    inputSlider.oninput = (() => {
        let value = inputSlider.value;
        sliderValue.textContent = value;
    });
}


//ROVER DATA
const roverName = document.getElementById("roverName");
const roverLaunch = document.getElementById("roverLaunch");
const roverLand = document.getElementById("roverLand");
const roverStatus = document.getElementById("roverStatus");
const roverTotPics = document.getElementById("roverTotPics");

const roverSol = document.getElementById("roverSol");
const fotosHoy = document.getElementById("fotoshoy");



async function GetRoverData(rover, opcion){
    try{
        const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=zY0UrBMxB7jm3l7lO7t9tAfAI6q2FgwsmTI1J0eF`);
        const data = await response.json();
        
        if(opcion === "RellenarDatos"){
            RellenarDatos(data);
        }else if(opcion === "CrearSlider"){
            CreateSlider(data)
        }
    }catch(e){
        alert("An error occurred while loading the data, please restart the page.")
    }   
}

function RellenarDatos(dataDelRover){
    roverSol.textContent = `Sol: ${sliderValue.textContent}`;
    
    roverName.textContent = `Nombre: ${dataDelRover.photo_manifest.name}`;
    roverLaunch.textContent = `Dia de lanzamiento: ${dataDelRover.photo_manifest.launch_date}`;
    roverLand.textContent = `Dia de aterrizaje en Marte: ${dataDelRover.photo_manifest.landing_date}`;
    roverStatus.textContent = `Status: ${dataDelRover.photo_manifest.status}`;
    roverTotPics.textContent = `Fotos totales: ${dataDelRover.photo_manifest.total_photos}`;   
}


//FOTOS
const divImagenes = document.getElementById("roverimages");
let slideshowInterval;
let deletFirstTimeout;


async function LoadImages(rover, sol){
    try{
        const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=zY0UrBMxB7jm3l7lO7t9tAfAI6q2FgwsmTI1J0eF`);
        const data = await response.json();

        let fotoArray = [];
        for(let prop of data.photos){
            fotoArray.push(prop.img_src);
        }
        fotosHoy.textContent = `Fotos tomadas: ${fotoArray.length}`;
        if(fotoArray.length > 0){
            CreateSlideShow(fotoArray);
        }else{
            document.getElementById("roverimages").innerHTML = `<h1 style="color: white; margin-top: 20%; text-align: center;">No image was taken this Sol (Martian day). Look for another Sol, there are thousands of more photos!</h1>`;       
        }

    }catch(e){
        document.getElementById("roverimages").innerHTML = `<h1 style="color: white; margin-top: 20%; text-align: center;">An error occurred while loading the data, please restart the page.</h1>`;
    }
}


function CreateSlideShow(imageArr){
    
    let fotoIndex = 0;
    let fotoPrevious = imageArr.length - 1;
    let fotoNumber = 1;
    clearInterval(slideshowInterval);
    clearTimeout(deletFirstTimeout);

    if(imageArr.length > 1){
        
        document.getElementById("roverimages").innerHTML = `
        <div class="slide" style="background-image: url('${imageArr[0]}');"></div>
        <div class="slide" style="background-image: url('${imageArr[1]}');"></div>
        `;
        document.getElementById("fotoNumber").textContent = `Foto N° ${fotoNumber}`;
        fotoIndex += 2;
        if(imageArr.length === 2) fotoIndex = 0; 

        slideshowInterval = setInterval(NextImage, (3000));

        document.getElementById("slideshowActivarot").innerHTML = `
        <hr class="separationLines">
        <input type="checkbox" id="slideshowActivator" checked>
        <label for="">Activate Slideshow</label>
        <select id="fpm">
            <option value="20">20 FPM</option>
            <option value="30">30 FPM</option>
            <option value="40">40 FPM</option>
            <option value="50">50 FPM</option>
            <option value="60">60 FPM</option>
        </select>
        `;

        document.getElementById("playpausebtns").innerHTML = `
        <img src="images/next_left.png" style="margin-right: 50px;" alt="" id="leftbtn" class="hide">
        <img src="images/pause.png" alt="" id="pausebtn">
        <img src="images/play.png" alt="" id="playbtn" class="hide">
        <img src="images/next_right.png" style="margin-left: 30px" alt="" id="rigthbtn" class="hide">
        `;

        document.getElementById("slideshowActivator").addEventListener('change', () => {
            let fpm = document.getElementById("fpm").value;
            const checkbox = document.getElementById("slideshowActivator");
            if(checkbox.checked){
                slideshowInterval = setInterval(NextImage, 60/parseInt(fpm)*1000);

                document.getElementById("playbtn").classList.add("hide");
                document.getElementById("pausebtn").classList.remove("hide");
                document.getElementById("leftbtn").classList.add("hide");
                document.getElementById("rigthbtn").classList.add("hide");
            }else{
                clearInterval(slideshowInterval);

                document.getElementById("pausebtn").classList.add("hide");
                document.getElementById("playbtn").classList.remove("hide");
                document.getElementById("leftbtn").classList.remove("hide");
                document.getElementById("rigthbtn").classList.remove("hide");
            }
        });

        document.getElementById("fpm").addEventListener('change', (e) => {
            const checkbox = document.getElementById("slideshowActivator");
            if(checkbox.checked){
                clearInterval(slideshowInterval);
                slideshowInterval = setInterval(NextImage, (60/(parseInt(e.target.value)))*1000);
            }
        });

        document.getElementById("pausebtn").addEventListener('click', () => {
            document.getElementById("slideshowActivator").checked = false;
            fireEvent(document.getElementById("slideshowActivator"), "change");
        });

        document.getElementById("playbtn").addEventListener('click', () => {
            document.getElementById("slideshowActivator").checked = true;
            fireEvent(document.getElementById("slideshowActivator"), "change");
        });

        document.getElementById("leftbtn").addEventListener('click', () => {
            PreviousImage();
        });

        document.getElementById("rigthbtn").addEventListener('click', () => {
            NextImage();
        });

    }else{
        document.getElementById("roverimages").innerHTML = `
        <div class="slide" style="background-image: url('${imageArr[0]}');"></div>
        <div class="slide"></div>
        `;
        document.getElementById("slideshowActivarot").innerHTML = ``;
        document.getElementById("fotoNumber").textContent = `Photo N° 1`;
        document.getElementById("playpausebtns").innerHTML = ``;
    }

    function NextImage(){
        document.getElementById("roverimages").insertAdjacentHTML("beforeend", `<div class="slide" style="background-image: url('${imageArr[fotoIndex]}');"></div>`);
        deletFirstTimeout = setTimeout(() => document.querySelector(".slide").remove(), 1000);
        
        if(fotoIndex + 1 >= imageArr.length){
            fotoIndex = 0;
            if(imageArr.length === 2) fotoNumber = 1;
            else fotoNumber++;
            fotoPrevious++;
        }else{
            fotoIndex++;
            if(fotoNumber + 1 > imageArr.length) fotoNumber = 1;
            else fotoNumber++;
            if(fotoPrevious + 1 >= imageArr.length) fotoPrevious = 0;
            else fotoPrevious++;
        }
        document.getElementById("fotoNumber").textContent = `Foto N° ${fotoNumber}`;       
    }

    function PreviousImage(){
        document.getElementById("roverimages").insertAdjacentHTML("afterbegin", `<div class="slide" style="background-image: url('${imageArr[fotoPrevious]}');"></div>`);
        document.getElementById("roverimages").lastElementChild.remove();

        if(fotoPrevious - 1 < 0 ){
            fotoPrevious = imageArr.length - 1
            if(imageArr === 2) fotoNumber = 1;
            else fotoNumber--;
            fotoIndex--;
        }else{
            fotoPrevious--
            if(fotoNumber - 1 <= 0) fotoNumber = imageArr.length;
            else fotoNumber --;
            if(fotoIndex - 1 < 0) fotoIndex = imageArr.length - 1;
            else fotoIndex--;
        }
        document.getElementById("fotoNumber").textContent = `Photo N° ${fotoNumber}`;
    }
}

//-------------------------------FUNCIONES DE AYUDA-------------------------------

function fireEvent(node, eventName) {
    // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
    var doc;
    if (node.ownerDocument) {
        doc = node.ownerDocument;
    } else if (node.nodeType == 9){
        // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
        doc = node;
    } else {
        throw new Error("Invalid node passed to fireEvent: " + node.id);
    }

     if (node.dispatchEvent) {
        // Gecko-style approach (now the standard) takes more work
        var eventClass = "";

        // Different events have different event classes.
        // If this switch statement can't map an eventName to an eventClass,
        // the event firing is going to fail.
        switch (eventName) {
            case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
            case "mousedown":
            case "mouseup":
                eventClass = "MouseEvents";
                break;

            case "focus":
            case "change":
            case "blur":
            case "select":
                eventClass = "HTMLEvents";
                break;

            default:
                throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
                break;
        }
        var event = doc.createEvent(eventClass);

        var bubbles = eventName == "change" ? false : true;
        event.initEvent(eventName, bubbles, true); // All events created as bubbling and cancelable.

        event.synthetic = true; // allow detection of synthetic events
        node.dispatchEvent(event, true);
    } else  if (node.fireEvent) {
        // IE-old school style
        var event = doc.createEventObject();
        event.synthetic = true; // allow detection of synthetic events
        node.fireEvent("on" + eventName, event);
    }
};


//------------------------------------HEADER RESPONSIVE------------------------------------------
const toggleBtn = document.getElementsByClassName('toggle-button')[0];
const navlinks = document.getElementsByClassName('navlinks')[0];

toggleBtn.addEventListener('click', () => {
    navlinks.classList.toggle('active');
})