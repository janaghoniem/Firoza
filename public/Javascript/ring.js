import { Application } from 'https://unpkg.com/@splinetool/runtime/build/runtime.js';
            
const canvas = document.getElementById('Ring');
const spline = new Application(canvas);

async function changeDiamondColor(color) {
    // Ensure the scene is loaded
    await spline.loaded;
    const object = spline.findObjectByName('Diamonds');
    
    if (object) {
        object.material.color = new spline.THREE.Color(color);
        spline.update();
    } else {
        console.error('Object "Diamonds" not found in the scene');
    }
}

// Load the Spline scene
spline.load('https://prod.spline.design/zHLFkybCIJXBtULS/scene.splinecode').then(() => {
    console.log('Spline scene loaded successfully');
    spline.setVariables({ White: 100, Red: 0, Blue: 0, Green: 0, Yellow: 0 });
   
    // Set up event listeners for buttons
    const button1 = document.getElementById('button1');
    button1.addEventListener('click', () => {
        spline.setVariables({ White: 0, Red: 100, Blue: 0, Green: 0, Yellow: 0 });
    });  //red

     const button2 = document.getElementById('button2');
    button2.addEventListener('click', () => {
        spline.setVariables({ White: 0, Red: 0, Blue: 0, Green: 100, Yellow: 0 });
    }); //green

    const button3 = document.getElementById('button3');
    button3.addEventListener('click', () => {
        spline.setVariables({ White: 0, Red: 0, Blue: 100, Green: 0, Yellow: 0 });
    }); //blue

    const button4 = document.getElementById('button4');
    button4.addEventListener('click', () => {
        spline.setVariables({ White: 0, Red: 0, Blue: 0, Green: 0, Yellow: 100 });
    }); //yellow

    const button5 = document.getElementById('button5');
    button5.addEventListener('click', () => {
        spline.setVariables({ White: 100, Red: 0, Blue: 0, Green: 0, Yellow: 0 });
    });
});




