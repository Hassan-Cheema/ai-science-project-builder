"""
Example client script to demonstrate API usage
Run with: python example_client.py
"""

import requests
import base64
from PIL import Image
import io
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health check endpoint"""
    print("=" * 60)
    print("Testing Health Check")
    print("=" * 60)
    
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")

def test_generate_idea(topic=None, save_to_db=False):
    """Test idea generation endpoint"""
    print("=" * 60)
    print("Testing Idea Generation")
    print("=" * 60)
    
    params = {}
    if topic:
        params['topic'] = topic
    params['save_to_db'] = save_to_db
    
    response = requests.get(f"{BASE_URL}/api/idea", params=params)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success!")
        print(f"\nTitle: {data['title']}")
        print(f"\nIdea: {data['idea'][:200]}...")
        print(f"\nHypothesis: {data['hypothesis']}")
        if data.get('project_id'):
            print(f"\nProject ID: {data['project_id']}")
        return data
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        return None

def test_generate_graph(save_image=False):
    """Test graph generation endpoint"""
    print("\n" + "=" * 60)
    print("Testing Graph Generation")
    print("=" * 60)
    
    params = {
        'title': 'Sample Experiment Results',
        'chart_type': 'bar',
        'categories': 'Control,Group A,Group B,Group C,Group D',
        'values': '45,62,58,71,65'
    }
    
    response = requests.get(f"{BASE_URL}/api/graph", params=params)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success!")
        print(f"\nDescription: {data['description']}")
        
        if save_image:
            # Decode and save the image
            img_data = base64.b64decode(data['graph_base64'])
            img = Image.open(io.BytesIO(img_data))
            filename = 'sample_graph.png'
            img.save(filename)
            print(f"\n📊 Graph saved as '{filename}'")
            
        return data
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        return None

def test_generate_report(project_id=None):
    """Test report generation endpoint"""
    print("\n" + "=" * 60)
    print("Testing Report Generation")
    print("=" * 60)
    
    if project_id:
        params = {
            'project_id': project_id,
            'graph_description': 'Sample experimental data showing control vs treatment groups',
            'save_to_db': True
        }
    else:
        params = {
            'idea': 'Testing the effect of different fertilizers on plant growth',
            'hypothesis': 'Organic fertilizer will produce taller plants than chemical fertilizer',
            'graph_description': 'Bar chart comparing plant heights across 5 treatment groups'
        }
    
    response = requests.post(f"{BASE_URL}/api/report", params=params)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success!")
        print(f"\nReport (first 500 chars):")
        print(data['report'][:500] + "...")
        
        # Save report to file
        filename = 'sample_report.md'
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(data['report'])
        print(f"\n📄 Full report saved as '{filename}'")
        
        return data
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        return None

def test_list_projects():
    """Test listing projects"""
    print("\n" + "=" * 60)
    print("Testing List Projects")
    print("=" * 60)
    
    response = requests.get(f"{BASE_URL}/api/projects", params={'limit': 5})
    
    if response.status_code == 200:
        projects = response.json()
        print(f"✅ Success! Found {len(projects)} projects")
        
        for i, project in enumerate(projects, 1):
            print(f"\n{i}. {project.get('title', 'Untitled')}")
            print(f"   ID: {project.get('id')}")
            print(f"   Created: {project.get('created_at')}")
        
        return projects
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        return None

def full_workflow_test():
    """Test complete workflow: idea -> graph -> report"""
    print("\n" + "🚀" * 30)
    print("FULL WORKFLOW TEST")
    print("🚀" * 30 + "\n")
    
    # Step 1: Generate idea
    print("Step 1: Generate project idea...")
    idea_data = test_generate_idea(topic="renewable energy", save_to_db=True)
    
    if not idea_data:
        print("❌ Failed to generate idea. Exiting workflow.")
        return
    
    # Step 2: Generate graph
    print("\nStep 2: Generate data visualization...")
    graph_data = test_generate_graph(save_image=True)
    
    if not graph_data:
        print("❌ Failed to generate graph. Exiting workflow.")
        return
    
    # Step 3: Generate report
    print("\nStep 3: Generate comprehensive report...")
    if idea_data.get('project_id'):
        report_data = test_generate_report(project_id=idea_data['project_id'])
    else:
        report_data = test_generate_report()
    
    if not report_data:
        print("❌ Failed to generate report. Exiting workflow.")
        return
    
    print("\n" + "✅" * 30)
    print("WORKFLOW COMPLETED SUCCESSFULLY!")
    print("✅" * 30)
    print(f"\nGenerated files:")
    print("  - sample_graph.png (data visualization)")
    print("  - sample_report.md (comprehensive report)")
    if idea_data.get('project_id'):
        print(f"\nProject saved to database with ID: {idea_data['project_id']}")

def main():
    """Main function to run all tests"""
    print("\n🧪 AI Science Builder API - Example Client\n")
    
    try:
        # Test health first
        test_health()
        
        # Run full workflow
        full_workflow_test()
        
        # List all projects
        print("\nStep 4: List all saved projects...")
        test_list_projects()
        
        print("\n" + "=" * 60)
        print("All tests completed! Check the generated files.")
        print("=" * 60 + "\n")
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to API server.")
        print("Make sure the server is running at http://localhost:8000")
        print("Start it with: python main.py")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    main()

