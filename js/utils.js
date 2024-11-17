export async function fetchQuestions() {
  const res = await fetch("questions.json");
  const data = await res.json();

  return data;
}
