def match_jobs(cv_skills, jobs):
    matches = []

    cv_skills = set(cv_skills)

    for job in jobs:
        job_skills = set(job["skills"])
        matched = cv_skills.intersection(job_skills)

        percentage = round((len(matched) / len(job_skills)) * 100, 2)

        matches.append({
            "job_id": job["id"],
            "job_title": job["title"],
            "match_percentage": percentage,
            "matched_skills": list(matched),
            "missing_skills": list(job_skills - matched)
        })

    return sorted(matches, key=lambda x: x["match_percentage"], reverse=True)
