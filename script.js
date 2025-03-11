document.getElementById('userProfileForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const bodyType = document.getElementById('bodyType').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const skinTone = document.getElementById('skinTone').value;
    const hairColor = document.getElementById('hairColor').value;
    const eyeColor = document.getElementById('eyeColor').value;
    const stylePreferences = document.getElementById('stylePreferences').value.split(',');
    const budget = document.getElementById('budget').value;

    const userProfile = {
        bodyType: bodyType,
        height: height,
        weight: weight,
        skinTone: skinTone,
        hairColor: hairColor,
        eyeColor: eyeColor,
        stylePreferences: stylePreferences,
        budget: budget
    };

    console.log('User Profile:', userProfile);
    // In a real application, you would store this data in a database or using Puter.com's file system API
});

document.getElementById('wardrobeImage').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const imagePreview = document.getElementById('wardrobeImagePreview');
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';

        const wardrobeItem = {
            description: 'Uploaded wardrobe item' // Placeholder description
        };

        const userProfile = {
            bodyType: document.getElementById('bodyType').value,
            height: document.getElementById('height').value,
            weight: document.getElementById('weight').value,
            skinTone: document.getElementById('skinTone').value,
            hairColor: document.getElementById('hairColor').value,
            eyeColor: document.getElementById('eyeColor').value,
            stylePreferences: document.getElementById('stylePreferences').value.split(','),
            budget: document.getElementById('budget').value
        };

        getFashionAdvice(userProfile, wardrobeItem)
            .then(response => {
                console.log('Fashion Advice:', response);
                document.getElementById('fashionAdvice').innerText = response;
            });
    }

    reader.readAsDataURL(file);
});

async function getFashionAdvice(userProfile, wardrobeItem) {
    // Use the Puter OpenAI integration
    const prompt = `As a fashion expert, recommend outfit combinations for:
    - Item: ${wardrobeItem.description}
    - User body type: ${userProfile.bodyType}
    - Skin tone: ${userProfile.skinTone}
    - Style preference: ${userProfile.stylePreferences}
    Suggest 3 specific outfits with clear explanations.`;

    const response = await puter.ai.chat(prompt);
    return response;
}

async function analyzeImageWithGemini(imageData) {
    // Save the image data to a temporary file
    const imagePath = "C:/Users/2022PECML156/Desktop/Estial/temp_image.jpg";
    const base64Data = imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(imagePath, buffer);

    // Execute the Python script to analyze the image
    const pythonScriptPath = "C:/Users/2022PECML156/Desktop/Estial/analyze_image.py";
    const command = `python "${pythonScriptPath}"`;

    try {
        const result = await new Promise((resolve, reject) => {
            exec(command, { env: { ...process.env, GEMINI_API_KEY: "AIzaSyC-yGk4HzEqSMiMGIxLA-7SK1Ei1-3P2yE" } }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing command: ${error}`);
                    reject(error);
                    return;
                }
                resolve(stdout);
            });
        });

        // Read the outfit description from the output file
        const descriptionPath = "C:/Users/2022PECML156/Desktop/Estial/outfit_description.txt";
        const outfitDescription = fs.readFileSync(descriptionPath, 'utf-8');
        return outfitDescription;
    } catch (error) {
        console.error(`Error analyzing image: ${error}`);
        return "Error analyzing image.";
    }
}

const fs = require('fs');
const { exec } = require('child_process');

document.getElementById('getFashionAdviceButton').addEventListener('click', function() {
    const userProfile = {
        bodyType: document.getElementById('bodyType').value,
        height: document.getElementById('height').value,
        weight: document.getElementById('weight').value,
        skinTone: document.getElementById('skinTone').value,
        hairColor: document.getElementById('hairColor').value,
        eyeColor: document.getElementById('eyeColor').value,
        stylePreferences: document.getElementById('stylePreferences').value.split(','),
        budget: document.getElementById('budget').value
    };

    const fileInput = document.getElementById('wardrobeImage');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            analyzeImageWithGemini(e.target.result)
                .then(outfitDescription => {
                    const wardrobeItem = {
                        description: outfitDescription
                    };

                    getFashionAdvice(userProfile, wardrobeItem)
                        .then(response => {
                            console.log('Fashion Advice:', response);
                            document.getElementById('fashionAdvice').innerText = response;
                        });
                });
        }

        reader.readAsDataURL(file);
    } else {
        alert('Please upload a wardrobe item image.');
    }
});
