window.addEventListener("load", (event) => {
  const header = setInterval(() => {
    if (!document.querySelector("div[data-testid='wrapper']")) return;
    clearInterval(header);
    document
      .querySelector("a[title='Go to home']")
      .insertAdjacentHTML("beforeend", "<div class='header-title'>SIASAR Hub</div>");
  }, 100);
});
