"""
Tests for utility functions
"""
import pytest
from utils.validators import (
    validate_topic,
    validate_grade,
    validate_chart_type,
    validate_title,
    validate_list_input
)
from utils.exceptions import ValidationError
from utils.cache import SimpleCache


class TestValidators:
    """Test validation functions"""
    
    def test_validate_topic_valid(self):
        """Test valid topic validation"""
        result = validate_topic("biology")
        assert result == "biology"
        
        result = validate_topic("  chemistry  ")
        assert result == "chemistry"
    
    def test_validate_topic_invalid(self):
        """Test invalid topic validation"""
        with pytest.raises(ValidationError):
            validate_topic("")
        
        with pytest.raises(ValidationError):
            validate_topic("a")  # Too short
        
        with pytest.raises(ValidationError):
            validate_topic("x" * 300)  # Too long
    
    def test_validate_topic_sanitization(self):
        """Test topic sanitization"""
        result = validate_topic("biology<script>")
        assert "<script>" not in result
    
    def test_validate_grade_valid(self):
        """Test valid grade validation"""
        assert validate_grade("6-8") == "6-8"
        assert validate_grade("9-12") == "9-12"
        assert validate_grade("college") == "college"
        
        # Test numeric conversion
        assert validate_grade("7") == "6-8"
        assert validate_grade("10") == "9-12"
    
    def test_validate_grade_invalid(self):
        """Test invalid grade validation"""
        with pytest.raises(ValidationError):
            validate_grade("invalid")
        
        with pytest.raises(ValidationError):
            validate_grade("99")
    
    def test_validate_chart_type_valid(self):
        """Test valid chart type validation"""
        assert validate_chart_type("bar") == "bar"
        assert validate_chart_type("LINE") == "line"
        assert validate_chart_type("scatter") == "scatter"
    
    def test_validate_chart_type_invalid(self):
        """Test invalid chart type validation"""
        with pytest.raises(ValidationError):
            validate_chart_type("invalid")
    
    def test_validate_title_valid(self):
        """Test valid title validation"""
        result = validate_title("My Project")
        assert result == "My Project"
    
    def test_validate_title_invalid(self):
        """Test invalid title validation"""
        with pytest.raises(ValidationError):
            validate_title("")
        
        with pytest.raises(ValidationError):
            validate_title("ab")  # Too short
    
    def test_validate_list_input_valid(self):
        """Test valid list input validation"""
        result = validate_list_input("a,b,c")
        assert result == ["a", "b", "c"]
        
        result = validate_list_input(" a , b , c ")
        assert result == ["a", "b", "c"]
    
    def test_validate_list_input_empty(self):
        """Test empty list input"""
        result = validate_list_input(None, allow_empty=True)
        assert result is None
        
        with pytest.raises(ValidationError):
            validate_list_input(None, allow_empty=False)


class TestCache:
    """Test caching functionality"""
    
    def test_cache_set_get(self):
        """Test basic cache set and get"""
        cache = SimpleCache()
        cache.set("test_key", "test_value")
        result = cache.get("test_key")
        assert result == "test_value"
    
    def test_cache_miss(self):
        """Test cache miss"""
        cache = SimpleCache()
        result = cache.get("nonexistent_key")
        assert result is None
    
    def test_cache_expiration(self):
        """Test cache expiration"""
        cache = SimpleCache(default_ttl=1)
        cache.set("test_key", "test_value")
        
        # Should exist immediately
        assert cache.get("test_key") == "test_value"
        
        # Should expire after TTL
        import time
        time.sleep(2)
        assert cache.get("test_key") is None
    
    def test_cache_clear(self):
        """Test cache clearing"""
        cache = SimpleCache()
        cache.set("key1", "value1")
        cache.set("key2", "value2")
        
        cache.clear()
        
        assert cache.get("key1") is None
        assert cache.get("key2") is None
    
    def test_cache_stats(self):
        """Test cache statistics"""
        cache = SimpleCache()
        
        # Generate some hits and misses
        cache.set("key1", "value1")
        cache.get("key1")  # Hit
        cache.get("key2")  # Miss
        
        stats = cache.stats()
        assert stats["hits"] == 1
        assert stats["misses"] == 1
        assert stats["size"] == 1
    
    def test_cache_max_size(self):
        """Test cache size limit"""
        cache = SimpleCache(max_size=2)
        
        cache.set("key1", "value1")
        cache.set("key2", "value2")
        cache.set("key3", "value3")  # Should evict oldest
        
        # Oldest key should be evicted
        assert cache.get("key1") is None
        assert cache.get("key2") is not None
        assert cache.get("key3") is not None

