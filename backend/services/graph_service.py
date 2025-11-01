import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import numpy as np
import io
import base64
from typing import Optional

def generate_sample_bar_chart(
    title: str = "Sample Data Analysis",
    categories: Optional[list] = None,
    values: Optional[list] = None
) -> tuple[str, str]:
    """
    Generate a bar chart and return it as base64 encoded string
    Returns: (base64_image, description)
    """
    # Default sample data if none provided
    if categories is None:
        categories = ['Group A', 'Group B', 'Group C', 'Group D', 'Group E']
    if values is None:
        values = np.random.randint(10, 100, size=len(categories))
    
    # Create the bar chart
    fig, ax = plt.subplots(figsize=(10, 6))
    bars = ax.bar(categories, values, color=['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe'])
    
    # Customize the chart
    ax.set_xlabel('Categories', fontsize=12, fontweight='bold')
    ax.set_ylabel('Values', fontsize=12, fontweight='bold')
    ax.set_title(title, fontsize=14, fontweight='bold', pad=20)
    ax.grid(axis='y', alpha=0.3, linestyle='--')
    
    # Add value labels on top of bars
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{int(height)}',
                ha='center', va='bottom', fontsize=10, fontweight='bold')
    
    # Style improvements
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    plt.tight_layout()
    
    # Convert to base64
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', dpi=150, bbox_inches='tight')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode()
    plt.close(fig)
    
    # Generate description
    description = f"Bar chart showing {len(categories)} categories with values ranging from {min(values)} to {max(values)}. "
    description += f"Average value: {np.mean(values):.1f}. "
    description += f"Highest: {categories[np.argmax(values)]} ({max(values)}). "
    description += f"Lowest: {categories[np.argmin(values)]} ({min(values)})."
    
    return image_base64, description

def generate_custom_chart(
    chart_type: str = "bar",
    title: str = "Data Visualization",
    x_label: str = "X Axis",
    y_label: str = "Y Axis",
    data: Optional[dict] = None
) -> tuple[str, str]:
    """
    Generate various types of charts based on provided data
    Returns: (base64_image, description)
    """
    if data is None:
        # Generate sample data
        categories = ['Sample 1', 'Sample 2', 'Sample 3', 'Sample 4', 'Sample 5']
        values = np.random.randint(20, 100, size=5)
        data = {'categories': categories, 'values': values}
    
    fig, ax = plt.subplots(figsize=(10, 6))
    
    categories = data.get('categories', list(range(len(data.get('values', [])))))
    values = data.get('values', [])
    
    if chart_type == "bar":
        bars = ax.bar(categories, values, color='#0ea5e9', alpha=0.8)
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height,
                    f'{int(height)}',
                    ha='center', va='bottom', fontsize=10)
    
    elif chart_type == "line":
        ax.plot(categories, values, marker='o', linewidth=2, markersize=8, color='#0ea5e9')
        ax.fill_between(range(len(values)), values, alpha=0.3, color='#0ea5e9')
    
    elif chart_type == "scatter":
        ax.scatter(range(len(values)), values, s=100, alpha=0.6, color='#0ea5e9')
    
    ax.set_xlabel(x_label, fontsize=12, fontweight='bold')
    ax.set_ylabel(y_label, fontsize=12, fontweight='bold')
    ax.set_title(title, fontsize=14, fontweight='bold', pad=20)
    ax.grid(alpha=0.3, linestyle='--')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    
    plt.tight_layout()
    
    # Convert to base64
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', dpi=150, bbox_inches='tight')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode()
    plt.close(fig)
    
    # Generate description
    if len(values) > 0:
        description = f"{chart_type.capitalize()} chart with {len(values)} data points. "
        description += f"Range: {min(values):.1f} to {max(values):.1f}. "
        description += f"Mean: {np.mean(values):.1f}, Median: {np.median(values):.1f}."
    else:
        description = "Empty chart - no data provided."
    
    return image_base64, description

