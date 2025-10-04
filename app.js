// app.js - interactions, smooth scroll, reveal, back-to-top, lead form
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view")
        io.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.15 },
)

document.querySelectorAll(".reveal").forEach((el) => io.observe(el))

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href")
    if (!id || id === "#") return
    const target = document.querySelector(id)
    if (!target) return
    e.preventDefault()
    target.scrollIntoView({ behavior: "smooth", block: "start" })
  })
})

const backToTop = document.getElementById("backToTop")
const toggleBackToTop = () => {
  if (window.scrollY > 400) backToTop.classList.add("show")
  else backToTop.classList.remove("show")
}
window.addEventListener("scroll", toggleBackToTop)
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }))

const art = document.querySelector(".hero-art")
if (art) {
  const l1 = art.querySelector(".layer-1")
  const l2 = art.querySelector(".layer-2")
  const l3 = art.querySelector(".layer-3")
  art.addEventListener("mousemove", (e) => {
    const rect = art.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    if (l1) l1.style.transform = `translate(${x * 12}px, ${y * 12}px)`
    if (l2) l2.style.transform = `translate(${x * -10}px, ${y * -10}px)`
    if (l3) l3.style.transform = `translate(${x * 8}px, ${y * 8}px)`
  })
}

const form = document.getElementById("lead-form")
const statusEl = document.getElementById("lead-status")
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    statusEl.textContent = "Submitting..."
    const data = Object.fromEntries(new FormData(form))
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name?.toString() || "",
          email: data.email?.toString() || "",
          role: data.role?.toString() || "freelancer",
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || "Submission failed")
      statusEl.textContent =
        json.mode === "mock" ? "Received! (Mock mode — enable MongoDB to persist)" : "Thank you! We'll be in touch."
      form.reset()
    } catch (err) {
      statusEl.textContent = "Something went wrong. Please try again."
    }
  })
}
