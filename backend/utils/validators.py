"""
Input validation utilities
"""
import re
from typing import Optional
from utils.exceptions import ValidationError


def validate_topic(topic: str, max_length: int = 200) -> str:
    """
    Validate and sanitize topic input
    
    Args:
        topic: Topic string to validate
        max_length: Maximum allowed length
    
    Returns:
        Sanitized topic string
    
    Raises:
        ValidationError: If validation fails
    """
    if not topic:
        raise ValidationError("Topic cannot be empty", field="topic")
    
    topic = topic.strip()
    
    if len(topic) > max_length:
        raise ValidationError(
            f"Topic too long (max {max_length} characters)",
            field="topic",
            value=len(topic)
        )
    
    if len(topic) < 2:
        raise ValidationError(
            "Topic too short (min 2 characters)",
            field="topic",
            value=len(topic)
        )
    
    # Remove any potentially dangerous characters
    sanitized = re.sub(r'[<>{}]', '', topic)
    
    return sanitized


def validate_grade(grade: str) -> str:
    """
    Validate grade input
    
    Args:
        grade: Grade level string
    
    Returns:
        Validated grade string
    
    Raises:
        ValidationError: If validation fails
    """
    valid_grades = ['K-5', '6-8', '9-12', 'college', 'graduate']
    
    if not grade:
        return "9-12"  # Default
    
    grade = grade.strip()
    
    # Check if it's a valid grade range
    if grade not in valid_grades:
        # Try to parse numeric grade
        try:
            numeric_grade = int(grade)
            if 1 <= numeric_grade <= 5:
                return "K-5"
            elif 6 <= numeric_grade <= 8:
                return "6-8"
            elif 9 <= numeric_grade <= 12:
                return "9-12"
            else:
                raise ValidationError(
                    f"Invalid grade: {grade}. Use K-5, 6-8, 9-12, college, or graduate",
                    field="grade",
                    value=grade
                )
        except ValueError:
            raise ValidationError(
                f"Invalid grade: {grade}. Use K-5, 6-8, 9-12, college, or graduate",
                field="grade",
                value=grade
            )
    
    return grade


def validate_chart_type(chart_type: str) -> str:
    """
    Validate chart type input
    
    Args:
        chart_type: Type of chart
    
    Returns:
        Validated chart type
    
    Raises:
        ValidationError: If validation fails
    """
    valid_types = ['bar', 'line', 'scatter', 'pie', 'histogram']
    
    chart_type = chart_type.lower().strip()
    
    if chart_type not in valid_types:
        raise ValidationError(
            f"Invalid chart type: {chart_type}. Must be one of {', '.join(valid_types)}",
            field="chart_type",
            value=chart_type
        )
    
    return chart_type


def validate_title(title: str, max_length: int = 200) -> str:
    """
    Validate and sanitize title input
    
    Args:
        title: Title string to validate
        max_length: Maximum allowed length
    
    Returns:
        Sanitized title string
    
    Raises:
        ValidationError: If validation fails
    """
    if not title:
        raise ValidationError("Title cannot be empty", field="title")
    
    title = title.strip()
    
    if len(title) > max_length:
        raise ValidationError(
            f"Title too long (max {max_length} characters)",
            field="title",
            value=len(title)
        )
    
    if len(title) < 3:
        raise ValidationError(
            "Title too short (min 3 characters)",
            field="title",
            value=len(title)
        )
    
    # Remove potentially dangerous characters
    sanitized = re.sub(r'[<>{}]', '', title)
    
    return sanitized


def validate_list_input(
    input_str: Optional[str],
    field_name: str = "input",
    min_items: int = 1,
    max_items: int = 100,
    allow_empty: bool = True
) -> Optional[list]:
    """
    Validate comma-separated list input
    
    Args:
        input_str: Comma-separated string
        field_name: Name of the field (for error messages)
        min_items: Minimum number of items required
        max_items: Maximum number of items allowed
        allow_empty: Whether to allow empty/None input
    
    Returns:
        List of items or None if empty and allowed
    
    Raises:
        ValidationError: If validation fails
    """
    if not input_str:
        if allow_empty:
            return None
        raise ValidationError(f"{field_name} cannot be empty", field=field_name)
    
    items = [item.strip() for item in input_str.split(',')]
    items = [item for item in items if item]  # Remove empty strings
    
    if len(items) < min_items:
        raise ValidationError(
            f"{field_name} must have at least {min_items} items",
            field=field_name,
            value=len(items)
        )
    
    if len(items) > max_items:
        raise ValidationError(
            f"{field_name} cannot have more than {max_items} items",
            field=field_name,
            value=len(items)
        )
    
    return items

