from supabase import create_client, Client
from config import settings

class SupabaseClient:
    def __init__(self):
        self.client: Client = None
        if settings.SUPABASE_URL and settings.SUPABASE_KEY:
            self.client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    
    def get_client(self) -> Client:
        if not self.client:
            raise Exception("Supabase client not initialized. Check your credentials.")
        return self.client

# Singleton instance
supabase_client = SupabaseClient()

def get_db() -> Client:
    """Dependency to get Supabase client"""
    return supabase_client.get_client()

