import { useEffect } from "react";

export default function ThaiLessonsPage() {
  useEffect(() => {
    window.location.replace("/thai-english/");
  }, []);

  return (
    <main aria-labelledby="thai-lessons-title" style={{ padding: "2rem" }}>
      <h1 id="thai-lessons-title">Thai-English lessons</h1>
      <p>Redirecting to the Thai-English lesson page.</p>
      <a href="/thai-english/">Open Thai-English lessons</a>
    </main>
  );
}
