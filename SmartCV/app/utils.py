def score_cv(found_skills, skills_data):
    total = sum(skill["weight"] for skill in skills_data.values())
    obtained = sum(skills_data[s]["weight"] for s in found_skills)
    return round((obtained / total) * 100, 2)

def recommendations(missing):
    return [
        f"Agrega proyectos o experiencia demostrable en {skill}."
        for skill in missing[:5]
    ]
