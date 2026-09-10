from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class PersonCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=160)
    date_of_birth: date
    sex: str = Field(min_length=1, max_length=40)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=40)
    address: str | None = Field(default=None, max_length=240)
    city: str | None = Field(default=None, max_length=100)
    country: str | None = Field(default=None, max_length=100)
    occupation: str | None = Field(default=None, max_length=120)
    emergency_contact: str | None = Field(default=None, max_length=200)
    blood_type: str | None = Field(default=None, max_length=5)
    height_cm: float | None = Field(default=None, gt=30, lt=300)
    weight_kg: float | None = Field(default=None, gt=2, lt=500)
    notes: str | None = Field(default=None, max_length=3000)


class PersonResponse(PersonCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
