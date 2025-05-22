async function getNews() {
  const topic = document.getElementById("searchTerm").value.trim();
  const newsResult = document.getElementById("newsResult");
  const apiKey = "67e724422e6d431bb8de2f5c124dc5eb";

  if (!topic) {
    newsResult.innerHTML = `<p class="text-red-600 font-semibold col-span-full">Please enter a search topic.</p>`;
    return;
  }

  newsResult.innerHTML = `<p class="text-gray-500 col-span-full">Loading news articles...</p>`;

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();

    if (!data.articles || data.articles.length === 0) {
      newsResult.innerHTML = `<p class="text-gray-600 col-span-full">No articles found for "<strong>${topic}</strong>".</p>`;
      return;
    }

    const articlesHTML = data.articles.slice(0, 6).map(article => `
      <div class="bg-white rounded-lg border shadow-sm hover:shadow-md transition duration-200 flex flex-col">
        <img src="${article.urlToImage || 'https://via.placeholder.com/400x200'}" alt="Article Image" class="rounded-t-lg h-48 w-full object-cover" />
        <div class="p-4 flex-1 flex flex-col">
          <h2 class="text-lg font-semibold mb-2">${article.title}</h2>
          <p class="text-sm text-gray-600 flex-1">${article.description || "No description available."}</p>
          <a href="${article.url}" target="_blank" class="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium">
            Read more &rarr;
          </a>
        </div>
      </div>
    `).join("");

    newsResult.innerHTML = articlesHTML;

  } catch (error) {
    newsResult.innerHTML = `<p class="text-red-600 font-semibold col-span-full">Failed to fetch news: ${error.message}</p>`;
  }
}
