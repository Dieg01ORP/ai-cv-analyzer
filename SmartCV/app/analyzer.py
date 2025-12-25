from PyPDF2 import PdfReader
import spacy

from app.skills import SKILLS
from app.jobs import JOB_OFFERS
from app.matcher import match_jobs

nlp = spacy.load("es_core_news_sm")


def analyze_cv(file):
    reader = PdfReader(file.file)
    text = ""

    for page in reader.pages:
        text += page.extract_text().lower()

    # NLP
    doc = nlp(text)

    skills_detected = []
    for skill in SKILLS:
        if skill.lower() in text:
            skills_detected.append(skill.lower())

    skills_missing = list(set(SKILLS) - set(skills_detected))

    # Puntaje simple
    score = round((len(skills_detected) / len(SKILLS)) * 100, 2)

    recommendations = [
        f"Agrega proyectos o experiencia demostrable en {skill}."
        for skill in skills_missing[:5]
    ]

    job_matches = match_jobs(skills_detected, JOB_OFFERS)

    return {
        "score": score,
        "skills_detected": skills_detected,
        "skills_missing": skills_missing,
        "recommendations": recommendations,
        "job_matches": job_matches
    }
