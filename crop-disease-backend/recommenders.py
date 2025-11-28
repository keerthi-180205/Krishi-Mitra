def recommend_crop(data):
    """
    Placeholder function to recommend a crop based on input data.
    This function uses a simple set of rules to demonstrate the functionality.
    In a real-world scenario, this would be replaced with a machine learning model.
    """
    try:
        N = float(data['N'])
        P = float(data['P'])
        K = float(data['K'])
        ph = float(data['ph'])
        rainfall = float(data['rainfall'])
        temperature = float(data['temperature'])
        humidity = float(data['humidity'])

        # Simple rule-based logic for recommendations
        if temperature > 30 and N > 50 and ph > 6 and rainfall > 100:
            return "Rice"
        elif 20 < temperature < 30 and 30 < N < 60 and 5 < ph < 7:
            return "Wheat"
        elif temperature < 20 and humidity > 50 and P > 30:
            return "Potato"
        else:
            return "Maize"
    except (KeyError, ValueError) as e:
        print(f"[ERROR] in recommend_crop: Missing or invalid input data - {e}")
        return None


def recommend_fertilizer(data):
    """
    Recommends a fertilizer based on soil and crop conditions.
    This is a more detailed rule-based placeholder. For a real-world application,
    a trained machine learning model would be more accurate.
    """
    try:
        N = float(data['N'])
        P = float(data['P'])
        K = float(data['K'])
        temperature = float(data['temperature'])
        humidity = float(data['humidity'])
        moisture = float(data['moisture'])
        soil = data['soil_type'].lower()
        crop = data['crop_type'].lower()

        # Base recommendation based on NPK values
        if N > 80 and P > 60 and K > 50:
            base_recommendation = "High-NPK fertilizer (e.g., 19-19-19)"
        elif N < 40 and P < 40 and K < 40:
            base_recommendation = "Balanced, low-dose fertilizer (e.g., 10-10-10)"
        elif N > 70:
            base_recommendation = "High-Nitrogen fertilizer (e.g., Urea, 28-0-0)"
        elif P > 50:
            base_recommendation = "High-Phosphorus fertilizer (e.g., DAP)"
        elif K > 50:
            base_recommendation = "High-Potassium fertilizer (e.g., Muriate of Potash)"
        else:
            base_recommendation = "A balanced fertilizer (e.g., 20-20-20)"

        # Adjust recommendation based on crop type
        if "rice" in crop:
            if N < 60:
                final_recommendation = "Urea is often recommended for rice. Consider supplementing."
            else:
                final_recommendation = "Your nitrogen levels seem adequate for rice. Use a balanced fertilizer."
        elif "maize" in crop:
            if K < 50:
                final_recommendation = f"{base_recommendation}, with extra Potassium for maize."
            else:
                final_recommendation = base_recommendation
        elif "wheat" in crop:
            if N < 50:
                final_recommendation = "Wheat requires good nitrogen. Consider a nitrogen-rich fertilizer."
            else:
                final_recommendation = base_recommendation
        else:
            final_recommendation = base_recommendation

        # Further adjustments based on environmental factors
        if temperature > 30 and humidity > 70:
            final_recommendation += " Be cautious with dosage in high heat and humidity to avoid root burn."
        elif moisture < 20:
            final_recommendation += " Ensure adequate irrigation, as fertilizer is less effective in dry soil."

        return final_recommendation

    except (KeyError, ValueError) as e:
        print(f"[ERROR] in recommend_fertilizer: Missing or invalid input data - {e}")
        return None

