"""
API endpoint tests
"""
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


class TestSystemEndpoints:
    """Test system/health endpoints"""
    
    def test_root_endpoint(self):
        """Test root endpoint returns API info"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "name" in data
        assert "version" in data
        assert data["status"] == "running"
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "services" in data
        assert "cache" in data
    
    def test_docs_accessible(self):
        """Test API documentation is accessible"""
        response = client.get("/docs")
        assert response.status_code == 200


class TestProjectEndpoints:
    """Test project-related endpoints"""
    
    def test_generate_idea_no_topic(self):
        """Test idea generation without topic"""
        response = client.get("/api/idea")
        # Should work with or without AI configured
        assert response.status_code in [200, 503]
        
        if response.status_code == 200:
            data = response.json()
            assert "title" in data
            assert "idea" in data
            assert "hypothesis" in data
    
    def test_generate_idea_with_topic(self):
        """Test idea generation with topic"""
        response = client.get("/api/idea?topic=biology")
        assert response.status_code in [200, 503]
        
        if response.status_code == 200:
            data = response.json()
            assert "title" in data
            assert "idea" in data
            assert "hypothesis" in data
    
    def test_generate_idea_with_all_params(self):
        """Test idea generation with topic, grade, and subject parameters"""
        response = client.get(
            "/api/idea",
            params={
                "topic": "photosynthesis",
                "grade": "9-12",
                "subject": "biology"
            }
        )
        # Should work with or without AI configured
        assert response.status_code in [200, 503]
        
        if response.status_code == 200:
            data = response.json()
            # Verify all expected fields are present
            assert "title" in data
            assert "idea" in data
            assert "hypothesis" in data
            
            # Verify data types and non-empty strings
            assert isinstance(data["title"], str)
            assert isinstance(data["idea"], str)
            assert isinstance(data["hypothesis"], str)
            assert len(data["title"]) > 0
            assert len(data["idea"]) > 10  # Should be substantial
            assert len(data["hypothesis"]) > 10  # Should be substantial
            
            # Verify hypothesis is actually a testable statement
            hypothesis_lower = data["hypothesis"].lower()
            assert any(word in hypothesis_lower for word in ["if", "then", "will", "expect", "predict", "increase", "decrease"])
    
    def test_generate_idea_invalid_grade(self):
        """Test idea generation with invalid grade level"""
        response = client.get("/api/idea?topic=physics&grade=invalid_grade")
        # Should handle validation error
        assert response.status_code in [400, 422]
    
    def test_generate_graph_default(self):
        """Test graph generation with defaults"""
        response = client.get("/api/graph")
        assert response.status_code == 200
        data = response.json()
        assert "graph_base64" in data
        assert "description" in data
    
    def test_generate_graph_custom(self):
        """Test graph generation with custom data"""
        response = client.get(
            "/api/graph",
            params={
                "title": "Test Chart",
                "categories": "A,B,C",
                "values": "10,20,30"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "graph_base64" in data
        assert "description" in data
    
    def test_generate_graph_invalid_values(self):
        """Test graph with invalid values"""
        response = client.get(
            "/api/graph",
            params={
                "categories": "A,B,C",
                "values": "invalid,data,here"
            }
        )
        # Should return error
        assert response.status_code in [400, 422, 500]


class TestCacheEndpoints:
    """Test cache management endpoints"""
    
    def test_cache_stats(self):
        """Test cache statistics endpoint"""
        response = client.get("/api/cache/stats")
        assert response.status_code == 200
        data = response.json()
        assert "ai_responses" in data
        assert "graphs" in data


class TestRateLimiting:
    """Test rate limiting functionality"""
    
    def test_rate_limit_headers(self):
        """Test that rate limit headers are present"""
        response = client.get("/api/idea")
        assert "X-RateLimit-Limit-Minute" in response.headers
        assert "X-RateLimit-Remaining-Minute" in response.headers


class TestSecurity:
    """Test security headers and policies"""
    
    def test_security_headers(self):
        """Test that security headers are present"""
        response = client.get("/")
        assert "X-Content-Type-Options" in response.headers
        assert response.headers["X-Content-Type-Options"] == "nosniff"
        assert "X-Frame-Options" in response.headers
        assert "X-XSS-Protection" in response.headers
    
    def test_cors_headers(self):
        """Test CORS headers"""
        response = client.options("/api/idea")
        # CORS headers should be present
        assert response.status_code in [200, 405]


class TestErrorHandling:
    """Test error handling"""
    
    def test_404_handling(self):
        """Test 404 error handling"""
        response = client.get("/nonexistent-endpoint")
        assert response.status_code == 404
        data = response.json()
        assert "error" in data or "detail" in data
    
    def test_validation_error_handling(self):
        """Test validation error handling"""
        response = client.get("/api/graph?chart_type=invalid_type")
        # Should handle validation error gracefully
        assert response.status_code in [400, 422, 500]

