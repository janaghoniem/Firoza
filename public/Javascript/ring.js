import { Application } from 'https://unpkg.com/@splinetool/runtime/build/runtime.js';

document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('Ring');
    const spline = new Application(canvas);

    const loadingSpinner = document.getElementById('loading-spinner');

    let currentScene = '';

    async function changeDiamondColor(color) {
        await spline.loaded;
        const object = spline.findObjectByName('Diamonds');

        if (object) {
            object.material.color = new spline.THREE.Color(color);
            spline.update();
        } else {
            console.error('Object "Diamonds" not found in the scene');
        }
    }

    async function loadScene(sceneUrl) {
        // Show the loading spinner and hide the canvas
        loadingSpinner.style.display = 'block';
        canvas.style.display = 'none';

        await spline.load(sceneUrl);
        console.log(`Spline scene ${sceneUrl} loaded successfully`);
        currentScene = sceneUrl;

        // Hide the loading spinner and show the canvas
        loadingSpinner.style.display = 'none';
        canvas.style.display = 'block';

        // Set the initial diamond color to white for the new scene
        spline.setVariables({ White: 100, Red: 0, Blue: 0, Green: 0, Yellow: 0 });
    }

    function setupColorButtons() {
        const colorButtons = [
            { id: 'button1', color: { White: 0, Red: 100, Blue: 0, Green: 0, Yellow: 0 } }, // Red
            { id: 'button2', color: { White: 0, Red: 0, Blue: 0, Green: 100, Yellow: 0 } }, // Green
            { id: 'button3', color: { White: 0, Red: 0, Blue: 100, Green: 0, Yellow: 0 } }, // Blue
            { id: 'button4', color: { White: 0, Red: 0, Blue: 0, Green: 0, Yellow: 100 } }, // Yellow
            { id: 'button5', color: { White: 100, Red: 0, Blue: 0, Green: 0, Yellow: 0 } }  // White
        ];

        colorButtons.forEach(button => {
            const btn = document.getElementById(button.id);
            btn.addEventListener('click', () => {
                spline.setVariables(button.color);
            });
        });
    }

    function setupSceneButtons() {
        const sceneButtons = [
            { id: 'Round', url: 'https://prod.spline.design/RaxmIcbUxvVf3Drx/scene.splinecode' },
            { id: 'Radient', url: 'https://prod.spline.design/h7mweeIJpVWR4WRf/scene.splinecode' },
            { id: 'Marquise', url: 'https://prod.spline.design/nwLkQoqJTywMEeT7/scene.splinecode' },
            { id: 'Princess', url: 'https://prod.spline.design/lL-xBygJ31YGnyJb/scene.splinecode' },
            { id: 'Heart', url: 'https://prod.spline.design/pvhUHLNBpbr3VVOu/scene.splinecode' },
            { id: 'Pear', url: 'https://prod.spline.design/s11be4rxx-39bLiO/scene.splinecode' },
            { id: 'Oval', url: 'https://prod.spline.design/zHLFkybCIJXBtULS/scene.splinecode' },
            { id: 'Emerald', url: 'https://prod.spline.design/eLP9bMxlaJtnPp9A/scene.splinecode' },
            { id: 'Cushion', url: 'https://prod.spline.design/j6ZZfmBxBdlxl0TB/scene.splinecode' },
            { id: 'Asscher', url: 'https://prod.spline.design/h7mweeIJpVWR4WRf/scene.splinecode' }
        ];

        sceneButtons.forEach(button => {
            const btn = document.getElementById(button.id);
            btn.addEventListener('click', async () => {
                if (button.url) {
                    await loadScene(button.url);
                } else {
                    console.error(`Scene URL for ${button.id} is not defined`);
                }
            });
        });
    }

    // Load the initial scene (Round and White)
    loadScene('https://prod.spline.design/RaxmIcbUxvVf3Drx/scene.splinecode').then(() => {
        setupColorButtons();
        setupSceneButtons();
    });



    async function fetchCustomizationData(customizeId) {
        try {
            const response = await fetch(`/api/customization/${customizeId}`);
            const data = await response.json();

            if (response.ok) {
                const imgElement = document.getElementById('customImage');
                imgElement.src = `/images/Customization/${data.img2}.png`;
            } else {
                console.error('Failed to fetch customization data:', data.error);
            }
        } catch (error) {
            console.error('Error fetching customization data:', error);
        }
    }

    // Call the function with the desired customize_id
    const customizeId = 'Round_Blue'; // Example customize_id
    fetchCustomizationData(customizeId);
});
