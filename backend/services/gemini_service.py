import google.generativeai as genai
from config import settings
import json

class GeminiService:
    def __init__(self):
        self.available = False
        if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your-gemini-api-key-here":
            print("Warning: GEMINI_API_KEY not configured. Gemini service will not be available.")
            self.model = None
            return
        
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
            self.available = True
            print(f"✅ Gemini service initialized with model: {settings.GEMINI_MODEL}")
        except Exception as e:
            print(f"Warning: Failed to initialize Gemini: {e}")
            self.model = None
    
    async def generate_project_idea(self, topic: str, grade: str = "8") -> dict:
        """Generate a science project idea using Gemini"""
        if not self.available or not self.model:
            raise ValueError("Gemini service is not available. Please configure GEMINI_API_KEY.")
        
        try:
            prompt = f"""
            Create a science project idea for a {grade}th grade student studying {topic}.
            
            Requirements:
            - Age-appropriate for grade {grade}
            - Safe and feasible to do at home or school
            - Includes a clear hypothesis
            - Explains what materials are needed
            - Describes the experimental procedure
            - Suggests how to analyze results
            
            Format your response as JSON with these fields:
            {{
                "title": "Project title",
                "idea": "Detailed project description",
                "hypothesis": "Testable hypothesis statement",
                "materials": ["List", "of", "materials"],
                "procedure": "Step-by-step procedure",
                "analysis": "How to analyze results"
            }}
            """
            
            response = self.model.generate_content(prompt)
            
            # Try to parse as JSON
            try:
                result = json.loads(response.text)
            except json.JSONDecodeError:
                # Fallback if not valid JSON
                result = {
                    "title": f"{topic} Science Project",
                    "idea": response.text,
                    "hypothesis": f"If we study {topic}, then we can learn about scientific principles.",
                    "materials": ["Basic materials for the experiment"],
                    "procedure": "Follow the scientific method",
                    "analysis": "Record observations and draw conclusions"
                }
            
            return result
            
        except Exception as e:
            raise Exception(f"Gemini API error: {str(e)}")
    
    async def generate_hypothesis(self, idea: str) -> str:
        """Generate a testable hypothesis for the given project idea"""
        if not self.available or not self.model:
            raise ValueError("Gemini service is not available. Please configure GEMINI_API_KEY.")
        
        try:
            prompt = f"""
            Based on this science project idea: "{idea}"
            
            Create a clear, testable hypothesis that follows the format:
            "If [independent variable], then [dependent variable] because [reasoning]"
            
            Make it specific, measurable, and appropriate for a middle school student.
            """
            
            response = self.model.generate_content(prompt)
            return response.text.strip()
            
        except Exception as e:
            raise Exception(f"Gemini API error: {str(e)}")
    
    async def generate_report(self, idea: str, hypothesis: str, graph_description: str) -> str:
        """Generate a comprehensive project report"""
        if not self.available or not self.model:
            raise ValueError("Gemini service is not available. Please configure GEMINI_API_KEY.")
        
        try:
            prompt = f"""
            Create a comprehensive science project report with the following information:
            
            Project Idea: {idea}
            Hypothesis: {hypothesis}
            Data Visualization: {graph_description}
            
            Include these sections:
            1. Introduction and Background
            2. Hypothesis and Variables
            3. Materials and Methods
            4. Expected Results and Data Analysis
            5. Conclusion and Future Research
            6. References and Resources
            
            Format as markdown with clear headings and bullet points.
            Make it professional but accessible for students.
            """
            
            response = self.model.generate_content(prompt)
            return response.text.strip()
            
        except Exception as e:
            raise Exception(f"Gemini API error: {str(e)}")

# Create a global instance
gemini_service = GeminiService()
