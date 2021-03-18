const rovers = ['curiosity', 'opportunity', 'spirit'];
let roversData = {};
let imagesInDom = 0;

//logo link



//------------------------------------SLIDER--------------------------------------
let slider = document.getElementById('sliderFotos');

async function StartSlider(){
    
    //assign data to its respective rover
    for(let rover of rovers){
        await AssignData(rover);
        //console.log(roversData[rover]);
    }

    //get first n images
    while(imagesInDom < 10){
        await GetRndmImage();
    }

    //activate slider
    let pos = 0;
    var anim = setInterval(Frame, 10);

    function Frame(){
        if(pos >= slider.firstElementChild.offsetWidth){

            slider.firstElementChild.remove();
            imagesInDom--;

            GetRndmImage();

            slider.style.left = 0 + 'px';
            pos = 0;

        }else{
            slider.style.left = -pos + 'px';
            pos++ 
        }   
    }

}

//function to get an image and put it into the DOM
async function GetRndmImage(){
    
    let doWeGetAPic = false;

    while(!doWeGetAPic){
        try{
            //If we dont get the image url it will cath an error
            const randRover = rovers[Math.floor(Math.random() * 3)];
            const randSol = Math.floor(Math.random() * (roversData[randRover].photo_manifest.max_sol + 1));
            let randImageUrl;

            const solResponse = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${randRover}/photos?sol=${randSol}&api_key=zY0UrBMxB7jm3l7lO7t9tAfAI6q2FgwsmTI1J0eF`);
            const solData = await solResponse.json();
            randImageUrl = solData.photos[Math.floor(Math.random() * (solData.photos.length + 1))].img_src; 
            
            //create an image element and assign it the src
            let image = document.createElement('img');
            image.src = randImageUrl;
            image.classList.add("slideImage");
            slider.appendChild(image);
            imagesInDom++;
            doWeGetAPic = true;

        }catch(err){ }
    }
}

async function AssignData(rover){
    const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=zY0UrBMxB7jm3l7lO7t9tAfAI6q2FgwsmTI1J0eF`);
    const data = await response.json();
    roversData[rover] = data;
}

StartSlider();

//-----------------------------------------------------------------------------------------------

//------------------------------------HEADER RESPONSIVE------------------------------------------
const toggleBtn = document.getElementsByClassName('toggle-button')[0];
const navlinks = document.getElementsByClassName('navlinks')[0];

toggleBtn.addEventListener('click', () => {
    navlinks.classList.toggle('active');
})