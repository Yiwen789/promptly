const API_URL = 'http://localhost:3001';

export async function askQuestion(question) {
  console.log("hello");
  console.log(question)
  const response = await fetch(`${API_URL}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  }) ;
  if (!response.ok) {
    throw new Error(`Failed to fetch data from server: ${response.status}`);
  }

  const data = await response.json();
  console.log(data);
  return data;


}
