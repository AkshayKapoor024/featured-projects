<p align="center">
  <h1>📦 Boxify: Smart Packing for a Sustainable Future 🌍</h1>
  <b>Walmart Sparkathon 2025 Group Project</b>
</p>

---

## 💡 The Problem We're Solving

Walmart's online order fulfillment faces a significant challenge: **inefficient and wasteful packing processes.** 📦❌

Currently, warehouse associates often use oversized boxes and excessive, non-sustainable packing materials for online orders. This leads to:

* **Material Waste:** Unnecessary cardboard, plastic fillers, and other packaging.

* **Environmental Impact:** Increased carbon emissions from manufacturing and transporting excess materials.

* **Operational Inefficiency:** Wasted space in boxes, requiring more shipments and higher logistics costs.

This problem occurs **daily, across all Walmart fulfillment centers**, directly impacting sustainability goals and bottom-line efficiency. It's a silent drain on resources and the planet.

---

## ✨ Our Solution: Boxify

**Boxify** is an innovative, AI-powered packing optimization solution designed to integrate seamlessly into Walmart's warehouse operations. Our goal is to minimize waste, optimize space, and enhance sustainability.

Here's how Boxify revolutionizes the packing process:

* **🧠 AI-Powered Optimal Packing Suggestions:**

    * Our intelligent AI/ML model analyzes order contents (dimensions, weight, fragility) to recommend the **perfect box size** and the **most sustainable packing materials** (e.g., recyclable paper fillers instead of plastic air pillows).

    * It even considers external factors like weather conditions for optimal protection.

* **📐 Intuitive 3D Visual Packing Guidance:**

    * Boxify provides a dynamic **3D visual simulation** that shows associates the most efficient way to arrange items within the chosen box. This eliminates guesswork, maximizes space utilization, and reduces the need for multiple boxes.

    * This visual guide ensures every package is packed optimally, leading to fewer boxes, less void fill, and reduced shipping volume.

By providing real-time, intelligent guidance, Boxify empowers associates to make environmentally conscious and cost-effective packing decisions, one box at a time.

---

## 💻 Tech Stack

Our project leverages a modern and robust tech stack to deliver a seamless and intelligent user experience:

* **Frontend:**

    * **React:** For building a dynamic and responsive user interface.

    * **Tailwind CSS:** For rapid and consistent styling, ensuring a clean and modern look.

* **Backend & APIs:**

    * **Node.js:** A powerful JavaScript runtime for our backend services.

    * **Express.js:** A minimalist web framework for Node.js, used to build our APIs.

    * **Firebase:** For robust backend services including authentication and real-time data storage (if persistence were implemented).

* **AI/Machine Learning:**

    * **Python:** The primary language for our AI/ML models.

    * **Flask:** A lightweight Python web framework used to expose our ML models as APIs.

    * **NumPy:** Essential for numerical operations and array manipulation in data processing.

    * **Pandas:** For efficient data handling and analysis.

    * **TensorFlow:** A leading open-source machine learning framework for building and training our neural networks.

    * **Scikit-learn:** For various machine learning algorithms, data preprocessing, and model evaluation.

    * **OpenCV:** Potentially for image processing tasks, such as analyzing product dimensions from visual data (future enhancement).

* **Database:**

    * **SQLite3:** A lightweight, file-based SQL database for storing product information.

---

## 🧠 What We Learned

Building Boxify was an incredible learning journey, pushing our boundaries in several areas:

* **Deep Dive into NLP & Machine Learning:** Gaining hands-on experience in training and fine-tuning neural networks for intent recognition was challenging but rewarding. Understanding how to prepare and diversify training data (`intents.json`) was crucial.

* **Full-Stack Development Integration:** Connecting a React frontend with a Node.js/Express backend and Python/Flask ML services required careful API design and data flow management.

* **API Integration & Error Handling:** Working with various external APIs (Weather, Country Info, Dictionary, Number Trivia) taught us the importance of robust error handling, different API response formats (JSON vs. plain text), and rate limiting.

* **Debugging Complex Systems:** Troubleshooting issues across different layers of the application (UI, backend, NLP model, database, external APIs) honed our debugging skills.

* **Iterative Development:** The process highlighted the importance of iterative development, where continuous testing and refinement of the NLP model and UI were key to achieving accuracy and usability.

* **Tkinter UI Development:** Building a functional and user-friendly desktop application with Tkinter, managing dynamic content and user interactions.

---

## 🏗️ How We Built It

Our development process was iterative and collaborative:

1.  **Problem Definition & Research:** We started by deeply understanding the packing inefficiencies and their environmental and financial impact at large-scale retail operations like Walmart.

2.  **NLP Model Training:**

    * We designed an `intents.json` schema to capture various user queries related to product info, weather, country facts, numbers, and dictionary lookups.

    * Using `nltk_utils.py` for tokenization and stemming, and `train.py` with PyTorch, we trained a neural network model (`model.pth`) to accurately classify user intents.

3.  **Database Setup:** A SQLite database (`chatbot_data.db`) was designed to store mock product data, simulating a real-world product catalog.

4.  **API Integration:** We identified and integrated various external APIs for weather, country information, number trivia, and dictionary lookups, handling their specific request/response formats.

5.  **Chatbot UI Development (`chatbot_ui.py`):**

    * We built a Tkinter-based graphical user interface.

    * Implemented logic to send user input (both typed and button clicks) to the NLP model.

    * Developed sophisticated entity extraction logic to pull out product names, brands, cities, numbers, and words from user queries.

    * Integrated the extracted entities with the database lookup and external API calls to provide dynamic responses.

    * Focused on responsive message display and interactive menu options.

6.  **Continuous Testing & Refinement:** Throughout the project, we rigorously tested the NLP model's accuracy, refined `intents.json` patterns, and debugged the UI and API integrations to ensure a smooth and reliable user experience.

---

## 🚀 Future Aspects

Boxify has immense potential for growth and further impact:

* **Advanced Packing Algorithms:** Incorporate more complex physics simulations for irregular item shapes and dynamic weight distribution.

* **Integration with WMS/OMS:** Directly integrate with existing Warehouse Management Systems (WMS) and Order Management Systems (OMS) for real-time data exchange and automated packing instructions.

* **Machine Vision Integration:** Use cameras and computer vision (OpenCV) to automatically scan item dimensions and identify optimal packing configurations, reducing manual input.

* **Material Cost Optimization:** Integrate real-time pricing data for packaging materials to recommend the most cost-effective *and* sustainable options.

* **Multi-Language Support:** Expand the NLP model to support multiple languages for diverse workforces.

* **Personalized Learning:** Allow the AI to learn from manual adjustments made by associates, continuously improving its recommendations over time.

* **Sustainability Reporting:** Generate detailed reports on packaging waste reduction, material savings, and carbon footprint reduction achieved through Boxify's implementation.

* **Voice Interface:** Add speech-to-text and text-to-speech capabilities for a hands-free packing experience.

* **Web-Based Interface:** Develop a web-based version using React/Next.js for broader accessibility and easier deployment.

Boxify is more than just a packing tool; it's a step towards smarter, greener, and more efficient logistics operations.