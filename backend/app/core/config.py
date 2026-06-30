from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    DATABASE_URL: str

    SECRET_KEY: str
    ALGORITHM: str

    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:4173,https://splitwise-frontend-60c3.onrender.com"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()