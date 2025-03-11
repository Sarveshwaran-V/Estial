import os
from google import genai
from PIL import Image
import io

def analyze_image(image_path, api_key):
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro-vision')

        with open(image_path, "rb") as img_file:
            image_data = img_file.read()

        contents = [
            image_data,
            "Describe the outfit in this image. Be very detailed."
        ]

        response = model.generate_content(contents)
        print(f"Gemini API response: {response.text}")
        return response.text
    except Exception as e:
        error_message = f"Error: {str(e)}"
        print(error_message)
        return error_message

if __name__ == "__main__":
    image_path = "temp_image.jpg"
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable not set.")
    else:
        description = analyze_image(image_path, api_key)
        with open("outfit_description.txt", "w") as f:
            f.write(description)
        print("Outfit description saved to outfit_description.txt")
