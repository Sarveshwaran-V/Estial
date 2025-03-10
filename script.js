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

        const geminiApiKey = "AIzaSyC-yGk4HzEqSMiMGIxLA-7SK1Ei1-3P2yE";

        async function analyzeImageWithGemini(imageBlob) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${geminiApiKey}`;
            const data = {
                contents: [{
                    parts: [{
                        inlineData: {
                            mimeType: "image/jpeg",
                            data: imageBlob.split(',')[1]
                        }
                    }, {
                        text: "Describe the outfit in the image."
                    }]
                }]
            };

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log(result);
            return result.candidates[0].content.parts[0].text;
        }
