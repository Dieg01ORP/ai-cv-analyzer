console.log("✅ script.js cargado");

async function analyze() {
  console.log("🟢 Botón Analizar presionado");

  const input = document.getElementById("file");

  if (!input || input.files.length === 0) {
    alert("Selecciona un archivo PDF");
    return;
  }

  const file = input.files[0];

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      throw new Error("Error en la API");
    }

    const data = await res.json();
    console.log("📦 Respuesta API:", data);

    // Mostrar sección resultados
    document.getElementById("result").classList.remove("hidden");

    // SCORE
    document.getElementById("score").innerText = data.score + "%";
    document.getElementById("bar").style.width = data.score + "%";

    // LISTAS
    fillList("detected", data.skills_detected);
    fillList("missing", data.skills_missing);
    fillList("tips", data.recommendations);

    // JOB MATCHES
    renderJobMatches(data.job_matches);

  } catch (err) {
    console.error("❌ Error:", err);
    alert("Error al analizar el CV. Revisa la consola.");
  }
}

function fillList(id, items) {
  const ul = document.getElementById(id);
  if (!ul || !items) return;

  ul.innerHTML = "";

  items.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    ul.appendChild(li);
  });
}

function renderJobMatches(jobs) {
  const container = document.getElementById("jobs");
  if (!container) return;

  container.innerHTML = "";

  if (!jobs || jobs.length === 0) {
    container.innerHTML = "<p>No se encontraron ofertas compatibles.</p>";
    return;
  }

  // Se asume que vienen ordenados por mejor match
  const bestJob = jobs[0];

  jobs.forEach(job => {
    const card = document.createElement("div");
    card.classList.add("job-card");

    if (job.job_id === bestJob.job_id) {
      card.classList.add("best");
    }

    card.innerHTML = `
      <div class="job-title">
        ${job.job_title} ${job.job_id === bestJob.job_id ? "🏆" : ""}
      </div>

      <div class="job-progress">
        <div class="job-bar" style="width:${job.match_percentage}%"></div>
      </div>

      <p><strong>Match:</strong> ${job.match_percentage}%</p>

      <div class="job-skills">
        <strong>✔ Skills coincidentes</strong><br>
        ${job.matched_skills.map(s => `<span>${s}</span>`).join("")}
      </div>

      <div class="job-skills missing">
        <strong>❌ Skills faltantes</strong><br>
        ${job.missing_skills.map(s => `<span>${s}</span>`).join("")}
      </div>
    `;

    container.appendChild(card);
  });
}
